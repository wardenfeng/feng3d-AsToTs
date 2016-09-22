module feng3d {


	/**
	 * 该类提供md5anim类型数据的解析，提供一个MD5类型的动画序列
	 */
    export class MD5AnimParser extends ParserBase {
        /** 文本数据 */
        private _textData: string;
        /** 是否正在解析中 */
        private _startedParsing: boolean;

        //md5anim文件关键字
        private static VERSION_TOKEN: string = "MD5Version";
        private static COMMAND_LINE_TOKEN: string = "commandline";
        private static NUM_FRAMES_TOKEN: string = "numFrames";
        private static NUM_JOINTS_TOKEN: string = "numJoints";
        private static FRAME_RATE_TOKEN: string = "frameRate";
        private static NUM_ANIMATED_COMPONENTS_TOKEN: string = "numAnimatedComponents";

        private static HIERARCHY_TOKEN: string = "hierarchy";
        private static BOUNDS_TOKEN: string = "bounds";
        private static BASE_FRAME_TOKEN: string = "baseframe";
        private static FRAME_TOKEN: string = "frame";

        private static COMMENT_TOKEN: string = "//";

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
        /** 帧率 */
        private _frameRate: number;
        /** 总帧数 */
        private _numFrames: number;
        /** 关节个数 */
        private _numJoints: number;
        private _numAnimatedComponents: number;

        /** 层级关系 */
        private _hierarchy: HierarchyData[];
        /** 包围盒数据 */
        private _bounds: BoundsData[]; //貌似解析完毕后就没有使用过该数据
        /** 帧数据 */
        private _frameData: FrameData[];
        /** 基础帧数据 */
        private _baseFrameData: BaseFrameData[];

        /** 旋转四元素 */
        private _rotationQuat: Quaternion;
        private _clip: SkeletonClipNode;

		/**
		 * 创建一个MD5动画解析类
		 * @param additionalRotationAxis 附加旋转轴
		 * @param additionalRotationRadians 附加旋转角度
		 */
        constructor(additionalRotationAxis: Vector3D = null, additionalRotationRadians: number = 0) {
            super(ParserDataFormat.PLAIN_TEXT);

            //初始化旋转四元素
            this._rotationQuat = new Quaternion();
            var t1: Quaternion = new Quaternion();
            var t2: Quaternion = new Quaternion();

            t1.fromAxisAngle(Vector3D.X_AXIS, -Math.PI * .5);
            t2.fromAxisAngle(Vector3D.Y_AXIS, -Math.PI * .5);

            this._rotationQuat.multiply(t2, t1);

            if (additionalRotationAxis) {
                this._rotationQuat.multiply(t2, t1);
                t1.fromAxisAngle(additionalRotationAxis, additionalRotationRadians);
                this._rotationQuat.multiply(t1, this._rotationQuat);
            }
        }

		/**
		 * 判断是否支持解析
		 * @param extension 文件类型
		 * @return
		 */
        public static supportsType(extension: string): boolean {
            extension = extension.toLowerCase();
            return extension == "md5anim";
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

            if (!this._startedParsing) {
                this._textData = this.getTextData();
                this._startedParsing = true;
            }

            while (this.hasTime()) {
                token = this.getNextToken();
                switch (token) {
                    case MD5AnimParser.COMMENT_TOKEN:
                        this.ignoreLine();
                        break;
                    case "":
                        // can occur at the end of a file
                        break;
                    case MD5AnimParser.VERSION_TOKEN:
                        this._version = this.getNextInt();
                        if (this._version != 10)
                            throw new Error("Unknown version number encountered!");
                        break;
                    case MD5AnimParser.COMMAND_LINE_TOKEN:
                        this.parseCMD();
                        break;
                    case MD5AnimParser.NUM_FRAMES_TOKEN:
                        this._numFrames = this.getNextInt();
                        this._bounds = [];
                        this._frameData = [];
                        break;
                    case MD5AnimParser.NUM_JOINTS_TOKEN:
                        this._numJoints = this.getNextInt();
                        this._hierarchy = [];
                        this._hierarchy.length = this._numJoints;
                        this._baseFrameData = [];
                        this._baseFrameData.length = this._numJoints;
                        break;
                    case MD5AnimParser.FRAME_RATE_TOKEN:
                        this._frameRate = this.getNextInt();
                        break;
                    case MD5AnimParser.NUM_ANIMATED_COMPONENTS_TOKEN:
                        this._numAnimatedComponents = this.getNextInt();
                        break;
                    case MD5AnimParser.HIERARCHY_TOKEN:
                        this.parseHierarchy();
                        break;
                    case MD5AnimParser.BOUNDS_TOKEN:
                        this.parseBounds();
                        break;
                    case MD5AnimParser.BASE_FRAME_TOKEN:
                        this.parseBaseFrame();
                        break;
                    case MD5AnimParser.FRAME_TOKEN:
                        this.parseFrame();
                        break;
                    default:
                        if (!this._reachedEOF)
                            this.sendUnknownKeywordError();
                }

                //解析出 骨骼动画数据
                if (this._reachedEOF) {
                    this._clip = new SkeletonClipNode();
                    this.translateClip();
                    this.finalizeAsset(this._clip);
                    return ParserBase.PARSING_DONE;
                }
            }
            return ParserBase.MORE_TO_PARSE;
        }

		/**
		 * 收集所有的关键帧数据
		 */
        private translateClip() {
            for (var i: number = 0; i < this._numFrames; ++i)
                this._clip.addFrame(this.translatePose(this._frameData[i]), 1000 / this._frameRate);
        }

		/**
		 * 将一个关键帧数据转换为SkeletonPose
		 * @param frameData 帧数据
		 * @return 包含帧数据的SkeletonPose对象
		 */
        private translatePose(frameData: FrameData): SkeletonPose {
            var hierarchy: HierarchyData;
            var pose: JointPose;
            var base: BaseFrameData;
            var flags: number;
            var j: number;
            //偏移量
            var translate: Vector3D = new Vector3D();
            //旋转四元素
            var orientation: Quaternion = new Quaternion();
            var components: number[] = frameData.components;
            //骨骼pose数据
            var skelPose: SkeletonPose = new SkeletonPose();
            //骨骼pose列表
            var jointPoses: JointPose[] = skelPose.jointPoses;

            for (var i: number = 0; i < this._numJoints; ++i) {
                //通过原始帧数据与层级数据计算出当前骨骼pose数据
                j = 0;
                //层级数据
                hierarchy = this._hierarchy[i];
                //基础帧数据
                base = this._baseFrameData[i];
                //层级标记
                flags = hierarchy.flags;
                translate.x = base.position.x;
                translate.y = base.position.y;
                translate.z = base.position.z;
                orientation.x = base.orientation.x;
                orientation.y = base.orientation.y;
                orientation.z = base.orientation.z;

                //调整位移与角度数据
                if (flags & 1)
                    translate.x = components[hierarchy.startIndex + (j++)];
                if (flags & 2)
                    translate.y = components[hierarchy.startIndex + (j++)];
                if (flags & 4)
                    translate.z = components[hierarchy.startIndex + (j++)];
                if (flags & 8)
                    orientation.x = components[hierarchy.startIndex + (j++)];
                if (flags & 16)
                    orientation.y = components[hierarchy.startIndex + (j++)];
                if (flags & 32)
                    orientation.z = components[hierarchy.startIndex + (j++)];

                //计算四元素w值
                var w: number = 1 - orientation.x * orientation.x - orientation.y * orientation.y - orientation.z * orientation.z;
                orientation.w = w < 0 ? 0 : -Math.sqrt(w);

                //创建关节pose数据
                pose = new JointPose();
                if (hierarchy.parentIndex < 0) {
                    pose.orientation.multiply(this._rotationQuat, orientation);
                    pose.translation = this._rotationQuat.rotatePoint(translate);
                }
                else {
                    pose.orientation.copyFrom(orientation);
                    pose.translation.x = translate.x;
                    pose.translation.y = translate.y;
                    pose.translation.z = translate.z;
                }
                pose.orientation.y = -pose.orientation.y;
                pose.orientation.z = -pose.orientation.z;
                pose.translation.x = -pose.translation.x;

                jointPoses[i] = pose;
            }

            return skelPose;
        }

		/**
		 * 解析骨骼的层级数据
		 */
        private parseHierarchy() {
            var ch: string;
            var data: HierarchyData;
            var token: string = this.getNextToken();
            var i: number = 0;

            if (token != "{")
                this.sendUnknownKeywordError();

            do {
                if (this._reachedEOF)
                    this.sendEOFError();
                data = new HierarchyData();
                data.name = this.parseLiteralString();
                data.parentIndex = this.getNextInt();
                data.flags = this.getNextInt();
                data.startIndex = this.getNextInt();
                this._hierarchy[i++] = data;

                ch = this.getNextChar();

                if (ch == "/") {
                    this.putBack();
                    ch = this.getNextToken();
                    if (ch == MD5AnimParser.COMMENT_TOKEN)
                        this.ignoreLine();
                    ch = this.getNextChar();
                }

                if (ch != "}")
                    this.putBack();

            } while (ch != "}");
        }

		/**
		 * 解析帧边界
		 */
        private parseBounds() {
            var ch: string;
            var data: BoundsData;
            var token: string = this.getNextToken();
            var i: number = 0;

            if (token != "{")
                this.sendUnknownKeywordError();

            do {
                if (this._reachedEOF)
                    this.sendEOFError();
                data = new BoundsData();
                data.min = this.parseVector3D();
                data.max = this.parseVector3D();
                this._bounds[i++] = data;

                ch = this.getNextChar();

                if (ch == "/") {
                    this.putBack();
                    ch = this.getNextToken();
                    if (ch == MD5AnimParser.COMMENT_TOKEN)
                        this.ignoreLine();
                    ch = this.getNextChar();
                }

                if (ch != "}")
                    this.putBack();

            } while (ch != "}");
        }

		/**
		 * 解析基础帧
		 */
        private parseBaseFrame() {
            var ch: string;
            var data: BaseFrameData;
            var token: string = this.getNextToken();
            var i: number = 0;

            if (token != "{")
                this.sendUnknownKeywordError();

            do {
                if (this._reachedEOF)
                    this.sendEOFError();
                data = new BaseFrameData();
                data.position = this.parseVector3D();
                data.orientation = this.parseQuaternion();
                this._baseFrameData[i++] = data;

                ch = this.getNextChar();

                if (ch == "/") {
                    this.putBack();
                    ch = this.getNextToken();
                    if (ch == MD5AnimParser.COMMENT_TOKEN)
                        this.ignoreLine();
                    ch = this.getNextChar();
                }

                if (ch != "}")
                    this.putBack();

            } while (ch != "}");
        }

		/**
		 * 解析帧
		 */
        private parseFrame() {
            var ch: string;
            var data: FrameData;
            var token: string;
            var frameIndex: number;

            frameIndex = this.getNextInt();

            token = this.getNextToken();
            if (token != "{")
                this.sendUnknownKeywordError();

            do {
                if (this._reachedEOF)
                    this.sendEOFError();
                data = new FrameData();
                data.components = [];
                data.components.length = this._numAnimatedComponents;

                for (var i: number = 0; i < this._numAnimatedComponents; ++i)
                    data.components[i] = this.getNextNumber();

                this._frameData[frameIndex] = data;

                ch = this.getNextChar();

                if (ch == "/") {
                    this.putBack();
                    ch = this.getNextToken();
                    if (ch == MD5AnimParser.COMMENT_TOKEN)
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
		 * 获取下个关键字
		 */
        private getNextToken(): string {
            var ch: string;
            var token: string = "";

            while (!this._reachedEOF) {
                ch = this.getNextChar();
                if (ch == " " || ch == "\r" || ch == "\n" || ch == "\t") {
                    if (token != MD5AnimParser.COMMENT_TOKEN)
                        this.skipWhiteSpace();
                    if (token != "")
                        return token;
                }
                else
                    token += ch;

                if (token == MD5AnimParser.COMMENT_TOKEN)
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

            if (this._parseIndex == this._textData.length)
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
            vec.x = this.getNextNumber();
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
            quat.y = this.getNextNumber();
            quat.z = this.getNextNumber();

            // quat supposed to be unit length
            var t: number = 1 - (quat.x * quat.x) - (quat.y * quat.y) - (quat.z * quat.z);
            quat.w = t < 0 ? 0 : -Math.sqrt(t);

            if (this.getNextToken() != ")")
                this.sendParseError(")");

            return quat;
        }

		/**
		 * 解析命令行数据
		 */
        private parseCMD() {
            // just ignore the command line property
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
		public resolveDependency(resourceDependency:ResourceDependency)
        {
            
        }

		/**
		 * 解决依赖失败
		 * @param resourceDependency 依赖资源
		 */
		public resolveDependencyFailure(resourceDependency:ResourceDependency){
            
        }
    }





    /**
     * 层级数据
     */
    class HierarchyData {
        /** Joint 名字 */
        public name: string;
        /** 父节点序号 */
        public parentIndex: number;
        /** flag */
        public flags: number;
        /** 影响的帧数据起始索引 */
        public startIndex: number;

        public HierarchyData() {
        }
    }

    /**
     * 包围盒信息
     */
    class BoundsData {
        /** 最小坐标 */
        public min: Vector3D;
        /** 最大坐标 */
        public max: Vector3D;

        public BoundsData() {
        }
    }

    /**
     * 基础帧数据
     */
    class BaseFrameData {
        /** 位置 */
        public position: Vector3D;
        /** 旋转四元素 */
        public orientation: Quaternion;

        public BaseFrameData() {
        }
    }

    /**
     * 帧数据
     */
    class FrameData {
        public index: number;
        public components: number[];

        public FrameData() {
        }
    }

}
