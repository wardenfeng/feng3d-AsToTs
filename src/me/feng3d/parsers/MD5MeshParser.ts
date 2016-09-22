module feng3d {

	/**
	 * MD5Mesh文件解析类
	 */
    export class MD5MeshParser extends ParserBase {
        private _textData: string;
        private _startedParsing: boolean;
        private static VERSION_TOKEN: string = "MD5Version";
        private static COMMAND_LINE_TOKEN: string = "commandline";
        private static NUM_JOINTS_TOKEN: string = "numJoints";
        private static NUM_MESHES_TOKEN: string = "numMeshes";
        private static COMMENT_TOKEN: string = "//";
        private static JOINTS_TOKEN: string = "joints";
        private static MESH_TOKEN: string = "mesh";

        private static MESH_SHADER_TOKEN: string = "shader";
        private static MESH_NUM_VERTS_TOKEN: string = "numverts";
        private static MESH_VERT_TOKEN: string = "vert";
        private static MESH_NUM_TRIS_TOKEN: string = "numtris";
        private static MESH_TRI_TOKEN: string = "tri";
        private static MESH_NUM_WEIGHTS_TOKEN: string = "numweights";
        private static MESH_WEIGHT_TOKEN: string = "weight";

        /** 当前解析位置 */
        private _parseIndex: number;
        /** 是否文件尾 */
        private _reachedEOF: boolean;
        /** 当前解析行号 */
        private _line: number;
        /** 当前行的字符位置 */
        private _charLineIndex: number;
        /** 版本号 */
        private _version: number;
        /** 关节数量 */
        private _numJoints: number;
        /** 网格数量 */
        private _numMeshes: number;
        /** 渲染材质信息 */
        private _shaders: string[];
        /** 顶点最大关节关联数 */
        private _maxJointCount: number;
        /** 网格原始数据 */
        private _meshData: MeshData[];
        /** bindpose姿态下的变换矩阵 */
        private _bindPoses: Matrix3D[];
        /** 骨骼数据 */
        private _skeleton: Skeleton;

        private _animationSet: SkeletonAnimationSet;

        /** 旋转四元素 */
        private _rotationQuat: Quaternion;

		/**
		 * 创建一个MD5Mesh解析对象
		 */
        constructor(additionalRotationAxis: Vector3D = null, additionalRotationRadians: number = 0) {
            super(ParserDataFormat.PLAIN_TEXT);

            //初始化 旋转四元素
            this._rotationQuat = new Quaternion();
            this._rotationQuat.fromAxisAngle(Vector3D.X_AXIS, -Math.PI * .5);

            if (additionalRotationAxis) {
                var quat: Quaternion = new Quaternion();
                quat.fromAxisAngle(additionalRotationAxis, additionalRotationRadians);
                this._rotationQuat.multiply(this._rotationQuat, quat);
            }
        }

		/**
		 * 判断是否支持解析
		 * @param extension 文件类型
		 * @return
		 */
        public static supportsType(extension: string): boolean {
            extension = extension.toLowerCase();
            return extension == "md5mesh";
        }

		/**
		 * 判断是否支持该数据的解析
		 * @param data 需要解析的数据
		 * @return
		 */
        public static supportsData(data): boolean {
            data = data;
            return false;
        }

        protected proceedParsing(): boolean {
            var token: string;

            //标记开始解析
            if (!this._startedParsing) {
                this._textData = this.getTextData();
                this._startedParsing = true;
            }

            while (this.hasTime()) {
                //获取关键字
                token = this.getNextToken();
                switch (token) {
                    case MD5MeshParser.COMMENT_TOKEN:
                        this.ignoreLine();
                        break;
                    case MD5MeshParser.VERSION_TOKEN:
                        this._version = this.getNextInt();
                        if (this._version != 10)
                            throw new Error("Unknown version number encountered!");
                        break;
                    case MD5MeshParser.COMMAND_LINE_TOKEN:
                        this.parseCMD();
                        break;
                    case MD5MeshParser.NUM_JOINTS_TOKEN:
                        this._numJoints = this.getNextInt();
                        this._bindPoses = [];
                        this._bindPoses.length = this._numJoints;
                        break;
                    case MD5MeshParser.NUM_MESHES_TOKEN:
                        this._numMeshes = this.getNextInt();
                        break;
                    case MD5MeshParser.JOINTS_TOKEN:
                        this.parseJoints();
                        break;
                    case MD5MeshParser.MESH_TOKEN:
                        this.parseMesh();
                        break;
                    default:
                        if (!this._reachedEOF)
                            this.sendUnknownKeywordError();
                }

                //解析结束后 生成引擎相关对象
                if (this._reachedEOF) {
                    this.calculateMaxJointCount();
                    this._animationSet = new SkeletonAnimationSet(this._maxJointCount);

                    //生成引擎所需网格对象
                    var _mesh: Mesh = new Mesh(new Geometry(), null);
                    var _geometry: Geometry = _mesh.geometry;

                    for (var i: number = 0; i < this._meshData.length; ++i)
                        _geometry.addSubGeometry(this.translateGeom(this._meshData[i].vertexData, this._meshData[i].weightData, this._meshData[i].indices));

                    this.finalizeAsset(_geometry);
                    this.finalizeAsset(_mesh);
                    this.finalizeAsset(this._skeleton);
                    this.finalizeAsset(this._animationSet);
                    return ParserBase.PARSING_DONE;
                }
            }
            return ParserBase.MORE_TO_PARSE;
        }

		/**
		 * 计算最大关节数量
		 */
        private calculateMaxJointCount() {
            this._maxJointCount = 0;

            //遍历所有的网格数据
            var numMeshData: number = this._meshData.length;
            for (var i: number = 0; i < numMeshData; ++i) {
                var meshData: MeshData = this._meshData[i];
                var vertexData: VertexData[] = meshData.vertexData;
                var numVerts: number = vertexData.length;

                //遍历每个顶点 寻找关节关联最大数量
                for (var j: number = 0; j < numVerts; ++j) {
                    var zeroWeights: number = this.countZeroWeightJoints(vertexData[j], meshData.weightData);
                    var totalJoints: number = vertexData[j].countWeight - zeroWeights;
                    if (totalJoints > this._maxJointCount)
                        this._maxJointCount = totalJoints;
                }
            }
        }

		/**
		 * 计算0权重关节数量
		 * @param vertex 顶点数据
		 * @param weights 关节权重数组
		 * @return
		 */
        private countZeroWeightJoints(vertex: VertexData, weights: WeightData[]): number {
            var start: number = vertex.startWeight;
            var end: number = vertex.startWeight + vertex.countWeight;
            var count: number = 0;
            var weight: number;

            for (var i: number = start; i < end; ++i) {
                weight = weights[i].bias;
                if (weight == 0)
                    ++count;
            }

            return count;
        }

		/**
		 * 解析关节
		 */
        private parseJoints() {
            var ch: string;
            var joint: SkeletonJoint;
            var pos: Vector3D;
            var quat: Quaternion;
            var i: number = 0;
            var token: string = this.getNextToken();

            if (token != "{")
                this.sendUnknownKeywordError();

            //解析骨骼数据
            this._skeleton = new Skeleton();

            do {
                if (this._reachedEOF)
                    this.sendEOFError();
                //解析骨骼关节数据
                joint = new SkeletonJoint();
                joint.name = this.parseLiteralString();
                joint.parentIndex = this.getNextInt();
                //关节坐标
                pos = this.parseVector3D();
                pos = this._rotationQuat.rotatePoint(pos);
                quat = this.parseQuaternion();

                // 计算bindpose下该节点(关节)的真正变换矩阵
                this._bindPoses[i] = quat.toMatrix3D();
                this._bindPoses[i].appendTranslation(pos.x, pos.y, pos.z);
                var inv: Matrix3D = this._bindPoses[i].clone();
                inv.invert();
                joint.inverseBindPose = inv.rawData;

                //收集关节数据
                this._skeleton.joints[i++] = joint;

                ch = this.getNextChar();

                if (ch == "/") {
                    this.putBack();
                    ch = this.getNextToken();
                    if (ch == MD5MeshParser.COMMENT_TOKEN)
                        this.ignoreLine();
                    ch = this.getNextChar();

                }

                if (ch != "}")
                    this.putBack();
            } while (ch != "}");
        }

		/**
		 * 返回到上个字符位置
		 */
        private putBack() {
            this._parseIndex--;
            this._charLineIndex--;
            this._reachedEOF = this._parseIndex >= this._textData.length;
        }

		/**
		 * 解析网格几何体
		 */
        private parseMesh() {
            var token: string = this.getNextToken();
            var ch: string;
            var vertexData: VertexData[];
            var weights: WeightData[];
            var indices: number[];

            if (token != "{")
                this.sendUnknownKeywordError();

            this._shaders = this._shaders || [];

            while (ch != "}") {
                ch = this.getNextToken();
                switch (ch) {
                    case MD5MeshParser.COMMENT_TOKEN:
                        this.ignoreLine();
                        break;
                    case MD5MeshParser.MESH_SHADER_TOKEN:
                        //材质数据
                        this._shaders.push(this.parseLiteralString());
                        break;
                    case MD5MeshParser.MESH_NUM_VERTS_TOKEN:
                        //顶点数据
                        vertexData = [];
                        vertexData.length = this.getNextInt();
                        break;
                    case MD5MeshParser.MESH_NUM_TRIS_TOKEN:
                        //根据三角形个数 创建顶点数组
                        indices = [];
                        indices.length = this.getNextInt() * 3;
                        break;
                    case MD5MeshParser.MESH_NUM_WEIGHTS_TOKEN:
                        //创建关节数据
                        weights = [];
                        weights.length = this.getNextInt();
                        break;
                    case MD5MeshParser.MESH_VERT_TOKEN:
                        //解析一个顶点数据
                        this.parseVertex(vertexData);
                        break;
                    case MD5MeshParser.MESH_TRI_TOKEN:
                        this.parseTri(indices);
                        break;
                    case MD5MeshParser.MESH_WEIGHT_TOKEN:
                        this.parseJoint(weights);
                        break;
                }
            }

            //保存网格数据
            this._meshData = this._meshData || [];
            var i: number = this._meshData.length;
            this._meshData[i] = new MeshData();
            this._meshData[i].vertexData = vertexData;
            this._meshData[i].weightData = weights;
            this._meshData[i].indices = indices;
        }

		/**
		 * 转换网格数据为SkinnedSubGeometry实例
		 * @param vertexData 网格顶点数据
		 * @param weights 每个顶点的关节权重数据
		 * @param indices 顶点索引数据
		 * @return 包含所有几何体数据的SkinnedSubGeometry实例
		 */
        private translateGeom(vertexData: VertexData[], weights: WeightData[], indices: number[]): SubGeometry {
            var len: number = vertexData.length;
            var v1: number, v2: number, v3: number;
            var vertex: VertexData;
            var weight: WeightData;
            var bindPose: Matrix3D;
            var pos: Vector3D;
            var subGeom: SubGeometry = new SubGeometry();
            var skinnedsubGeom: SkinnedSubGeometry = new SkinnedSubGeometry(this._maxJointCount);
            subGeom.addComponent(skinnedsubGeom);
            //uv数据
            var uvs: number[] = [];
            uvs.length = len * 2;
            //顶点位置数据
            var vertices: number[] = [];
            vertices.length = len * 3;
            //关节索引数据
            var jointIndices: number[] = [];
            jointIndices.length = len * this._maxJointCount;
            //关节权重数据
            var jointWeights: number[] = [];
            jointWeights.length = len * this._maxJointCount;
            var l: number;
            //0权重个数
            var nonZeroWeights: number;

            for (var i: number = 0; i < len; ++i) {
                vertex = vertexData[i];
                v1 = vertex.index * 3;
                v2 = v1 + 1;
                v3 = v1 + 2;
                vertices[v1] = vertices[v2] = vertices[v3] = 0;

				/**
				 * 参考 http://blog.csdn.net/summerhust/article/details/17421213
				 * VertexPos = (MJ-0 * weight[index0].pos * weight[index0].bias) + ... + (MJ-N * weight[indexN].pos * weight[indexN].bias)
				 * 变量对应  MJ-N -> bindPose; 第J个关节的变换矩阵
				 * weight[indexN].pos -> weight.pos;
				 * weight[indexN].bias -> weight.bias;
				 */

                nonZeroWeights = 0;
                for (var j: number = 0; j < vertex.countWeight; ++j) {
                    weight = weights[vertex.startWeight + j];
                    if (weight.bias > 0) {
                        bindPose = this._bindPoses[weight.joint];
                        pos = bindPose.transformVector(weight.pos);
                        vertices[v1] += pos.x * weight.bias;
                        vertices[v2] += pos.y * weight.bias;
                        vertices[v3] += pos.z * weight.bias;

                        // indices need to be multiplied by 3 (amount of matrix registers)
                        jointIndices[l] = weight.joint * 3;
                        jointWeights[l++] = weight.bias;
                        ++nonZeroWeights;
                    }
                }

                for (j = nonZeroWeights; j < this._maxJointCount; ++j) {
                    jointIndices[l] = 0;
                    jointWeights[l++] = 0;
                }

                v1 = vertex.index << 1;
                uvs[v1++] = vertex.u;
                uvs[v1] = vertex.v;
            }

            //更新索引数据
            subGeom.updateIndexData(indices);
            subGeom.numVertices = vertices.length / 3;
            //更新顶点坐标与uv数据
            subGeom.fromVectors(vertices, uvs);
            // cause explicit updates
            subGeom.addComponent(new AutoDeriveVertexNormals());
            subGeom.addComponent(new AutoDeriveVertexTangents());
            subGeom.vertexNormalData;
            subGeom.vertexTangentData;
            //更新关节索引与权重索引
            skinnedsubGeom.updateJointIndexData(jointIndices);
            skinnedsubGeom.updateJointWeightsData(jointWeights);


            return subGeom;
        }

		/**
		 * 解析三角形数据
		 * @param indices 索引数据
		 */
        private parseTri(indices: number[]) {
            var index: number = this.getNextInt() * 3;
            indices[index] = this.getNextInt();
            indices[index + 1] = this.getNextInt();
            indices[index + 2] = this.getNextInt();
        }

		/**
		 * 解析关节数据
		 * @param weights 权重数据列表
		 */
        private parseJoint(weights: WeightData[]) {
            var weight: WeightData = new WeightData();
            weight.index = this.getNextInt();
            weight.joint = this.getNextInt();
            weight.bias = this.getNextNumber();
            weight.pos = this.parseVector3D();
            weights[weight.index] = weight;
        }

		/**
		 * 解析一个顶点
		 * @param vertexData 顶点数据列表
		 */
        private parseVertex(vertexData: VertexData[]) {
            var vertex: VertexData = new VertexData();
            vertex.index = this.getNextInt();
            this.parseUV(vertex);
            vertex.startWeight = this.getNextInt();
            vertex.countWeight = this.getNextInt();
            vertexData[vertex.index] = vertex;
        }

		/**
		 * 解析uv坐标
		 * @param vertexData 包含uv坐标的顶点数据
		 */
        private parseUV(vertexData: VertexData) {
            var ch: string = this.getNextToken();
            if (ch != "(")
                this.sendParseError("(");
            vertexData.u = this.getNextNumber();
            vertexData.v = this.getNextNumber();

            if (this.getNextToken() != ")")
                this.sendParseError(")");
        }

		/**
		 * 获取下个关键字
		 */
        private getNextToken(): string {
            var ch: string;
            var token: string = "";

            while (!this._reachedEOF) {
                ch = this.getNextChar();
                if (ch == " " || ch == "\r" || ch == "\n" || ch == "\t") {
                    if (token != MD5MeshParser.COMMENT_TOKEN)
                        this.skipWhiteSpace();
                    if (token != "")
                        return token;
                }
                else
                    token += ch;

                if (token == MD5MeshParser.COMMENT_TOKEN)
                    return token;
            }

            return token;
        }

		/**
		 * 跳过空白
		 */
        private skipWhiteSpace() {
            var ch: string;

            do
                ch = this.getNextChar();
            while (ch == "\n" || ch == " " || ch == "\r" || ch == "\t");

            this.putBack();
        }

		/**
		 * 忽略该行
		 */
        private ignoreLine() {
            var ch: string;
            while (!this._reachedEOF && ch != "\n")
                ch = this.getNextChar();
        }

		/**
		 * 读取下个字符
		 */
        private getNextChar(): string {
            var ch: string = this._textData.charAt(this._parseIndex++);

            if (ch == "\n") {
                ++this._line;
                this._charLineIndex = 0;
            }
            else if (ch != "\r")
                ++this._charLineIndex;

            if (this._parseIndex >= this._textData.length)
                this._reachedEOF = true;

            return ch;
        }

		/**
		 * 读取下个number
		 */
        private getNextInt(): number {
            var i: number = parseInt(this.getNextToken());
            if (isNaN(i))
                this.sendParseError("number type");
            return i;
        }

		/**
		 * 读取下个number
		 */
        private getNextNumber(): number {
            var f: number = parseFloat(this.getNextToken());
            if (isNaN(f))
                this.sendParseError("float type");
            return f;
        }

		/**
		 * 解析3d向量
		 */
        private parseVector3D(): Vector3D {
            var vec: Vector3D = new Vector3D();
            var ch: string = this.getNextToken();

            if (ch != "(")
                this.sendParseError("(");
            vec.x = -this.getNextNumber();
            vec.y = this.getNextNumber();
            vec.z = this.getNextNumber();

            if (this.getNextToken() != ")")
                this.sendParseError(")");

            return vec;
        }

		/**
		 * 解析四元素
		 */
        private parseQuaternion(): Quaternion {
            var quat: Quaternion = new Quaternion();
            var ch: string = this.getNextToken();

            if (ch != "(")
                this.sendParseError("(");
            quat.x = this.getNextNumber();
            quat.y = -this.getNextNumber();
            quat.z = -this.getNextNumber();

            // quat supposed to be unit length
            var t: number = 1 - quat.x * quat.x - quat.y * quat.y - quat.z * quat.z;
            quat.w = t < 0 ? 0 : -Math.sqrt(t);

            if (this.getNextToken() != ")")
                this.sendParseError(")");

            var rotQuat: Quaternion = new Quaternion();
            rotQuat.multiply(this._rotationQuat, quat);
            return rotQuat;
        }

		/**
		 * 解析命令行数据
		 */
        private parseCMD() {
            //忽略命令行数据
            this.parseLiteralString();
        }

		/**
		 * 解析带双引号的字符串
		 */
        private parseLiteralString(): string {
            this.skipWhiteSpace();

            var ch: string = this.getNextChar();
            var str: string = "";

            if (ch != "\"")
                this.sendParseError("\"");

            do {
                if (this._reachedEOF)
                    this.sendEOFError();
                ch = this.getNextChar();
                if (ch != "\"")
                    str += ch;
            } while (ch != "\"");

            return str;
        }

		/**
		 * 抛出一个文件尾过早结束文件时遇到错误
		 */
        private sendEOFError() {
            throw new Error("Unexpected end of file");
        }

		/**
		 * 遇到了一个意想不到的令牌时将抛出一个错误。
		 * @param expected 发生错误的标记
		 */
        private sendParseError(expected: string) {
            throw new Error("Unexpected token at line " + (this._line + 1) + ", character " + this._charLineIndex + ". " + expected + " expected, but " + this._textData.charAt(this._parseIndex - 1) + " encountered");
        }

		/**
		 * 发生未知关键字错误
		 */
        private sendUnknownKeywordError() {
            throw new Error("Unknown keyword at line " + (this._line + 1) + ", character " + this._charLineIndex + ". ");
        }
        
        		/**
		 * 解决依赖
		 * @param resourceDependency 依赖资源
		 */
		public resolveDependency(resourceDependency:ResourceDependency){
            
        }

		/**
		 * 解决依赖失败
		 * @param resourceDependency 依赖资源
		 */
		public resolveDependencyFailure(resourceDependency:ResourceDependency){
            
        }
    }

    /**
     * 顶点数据
     */
    class VertexData {
        /** 顶点索引 */
        public index: number;
        /** 纹理坐标u */
        public u: number;
        /** 纹理坐标v */
        public v: number;
        /** weight的起始序号 */
        public startWeight: number;
        /** weight总数 */
        public countWeight: number;

        public VertexData() {
        }
    }

    /**
     * 关节权重数据
     */
    class WeightData {
        /** weight 序号 */
        public index: number;
        /** 对应的Joint的序号 */
        public joint: number;
        /** 作用比例 */
        public bias: number;
        /** 位置值 */
        public pos: Vector3D;

        public WeightData() {
        }
    }

    /**
     * 网格数据
     */
    class MeshData {
        /** 顶点数据 */
        public vertexData: VertexData[];
        /** 权重数据 */
        public weightData: WeightData[];
        /** 顶点索引 */
        public indices: number[];

        public MeshData() {
        }
    }
}


