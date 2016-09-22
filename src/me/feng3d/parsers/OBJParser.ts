module feng3d {

	/**
	 * Obj模型解析者
	 */
    export class OBJParser extends ParserBase {
        /** 字符串数据 */
        private _textData: string;
        /** 是否开始了解析 */
        private _startedParsing: boolean;
        /** 当前读取到的位置 */
        private _charIndex: number;
        /** 刚才读取到的位置 */
        private _oldIndex: number;
        /** 字符串数据长度 */
        private _stringLength: number;
        /** 当前解析的对象 */
        private _currentObject: ObjectGroup;
        /** 当前组 */
        private _currentGroup: Group;
        /** 当前材质组 */
        private _currentMaterialGroup: MaterialGroup;
        /** 对象组列表 */
        private _objects: ObjectGroup[];
        /** 材质编号列表 */
        private _materialIDs: string[];
        /** 加载了的材质列表 */
        private _materialLoaded: LoadedMaterial[];

        private _materialSpecularData: SpecularData[];
        /** 网格列表 */
        private _meshes: Mesh[];
        /** 最后的材质编号 */
        private _lastMtlID: string;
        /** object索引 */
        private _objectIndex: number;
        /** 真实索引列表 */
        private _realIndices;
        /** 顶点索引 */
        private _vertexIndex: number;
        /** 顶点坐标数据 */
        private _vertices: Vertex[];
        /** 顶点法线数据 */
        private _vertexNormals: Vertex[];
        /** uv数据 */
        private _uvs: UV[];
        /** 缩放尺度 */
        private _scale: number;
        /**  */
        private _mtlLib: boolean;
        /** 材质库是否已加载 */
        private _mtlLibLoaded: boolean = true;
        /** 活动材质编号 */
        private _activeMaterialID: string = "";

		/**
		 * 创建Obj模型解析对象
		 * @param scale 缩放比例
		 */
        constructor(scale: number = 1) {
            super(ParserDataFormat.PLAIN_TEXT);
            this._scale = scale;
        }

		/**
		 * 判断是否支持解析
		 * @param extension 文件类型
		 * @return
		 */
        public static supportsType(extension: string): boolean {
            extension = extension.toLowerCase();
            return extension == "obj";
        }

		/**
		 * 判断是否支持该数据的解析
		 * @param data 需要解析的数据
		 * @return
		 */
        public static supportsData(data): boolean {
            var content: string = ParserUtil.toString(data);
            var hasV: boolean;
            var hasF: boolean;

            if (content) {
                hasV = content.indexOf("\nv ") != -1;
                hasF = content.indexOf("\nf ") != -1;
            }

            return hasV && hasF;
        }

        public resolveDependency(resourceDependency: ResourceDependency) {
            if (resourceDependency.id == 'mtl') {
                var str: string = ParserUtil.toString(resourceDependency.data);
                this.parseMtl(str);
            }
            else {

                var asset: IAsset;

                if (resourceDependency.assets.length != 1)
                    return;

                asset = resourceDependency.assets[0];

                if (asset.namedAsset.assetType == AssetType.TEXTURE) {
                    var lm: LoadedMaterial = new LoadedMaterial();
                    lm.materialID = resourceDependency.id;
                    lm.texture = as(asset, Texture2DBase);

                    this._materialLoaded.push(lm);

                    if (this._meshes.length > 0)
                        this.applyMaterial(lm);
                }
            }
        }

        public resolveDependencyFailure(resourceDependency: ResourceDependency) {
            if (resourceDependency.id == "mtl") {
                this._mtlLib = false;
                this._mtlLibLoaded = false;
            }
            else {
                var lm: LoadedMaterial = new LoadedMaterial();
                lm.materialID = resourceDependency.id;
                this._materialLoaded.push(lm);
            }

            if (this._meshes.length > 0)
                this.applyMaterial(lm);
        }

        protected proceedParsing(): boolean {
            //单行数据
            var line: string;
            //换行符
            var creturn: string = String.fromCharCode(10);
            var trunk;

            if (!this._startedParsing) {
                this._textData = this.getTextData();
                // Merge linebreaks that are immediately preceeded by
                // the "escape" backward slash into single lines.
                this._textData = this._textData.replace(/\\[\r\n]+\s*/gm, ' ');
            }

            if (this._textData.indexOf(creturn) == -1)
                creturn = String.fromCharCode(13);

            //初始化数据
            if (!this._startedParsing) {
                this._startedParsing = true;
                this._vertices = [];
                this._vertexNormals = [];
                this._materialIDs = [];
                this._materialLoaded = [];
                this._meshes = [];
                this._uvs = [];
                this._stringLength = this._textData.length;
                this._charIndex = this._textData.indexOf(creturn, 0);
                this._oldIndex = 0;
                this._objects = [];
                this._objectIndex = 0;
            }

            //判断是否解析完毕与是否还有时间
            while (this._charIndex < this._stringLength && this.hasTime()) {
                this._charIndex = this._textData.indexOf(creturn, this._oldIndex);

                if (this._charIndex == -1)
                    this._charIndex = this._stringLength;

                //获取单行数据 整理数据格式
                line = this._textData.substring(this._oldIndex, this._charIndex);
                line = line.split('\r').join("");
                line = line.replace("  ", " ");
                trunk = line.split(" ");
                this._oldIndex = this._charIndex + 1;

                //解析该行数据
                this.parseLine(trunk);

                //处理暂停
                if (this.parsingPaused)
                    return ParserBase.MORE_TO_PARSE;
            }

            //数据解析到文件未
            if (this._charIndex >= this._stringLength) {
                //判断是否还需要等待材质解析
                if (this._mtlLib && !this._mtlLibLoaded)
                    return ParserBase.MORE_TO_PARSE;

                this.translate();
                this.applyMaterials();

                return ParserBase.PARSING_DONE;
            }

            return ParserBase.MORE_TO_PARSE;
        }

		/**
		 * 解析行
		 */
        private parseLine(trunk) {
            switch (trunk[0]) {
                case "mtllib":
                    this._mtlLib = true;
                    this._mtlLibLoaded = false;
                    this.loadMtl(trunk[1]);
                    break;
                case "g":
                    this.createGroup(trunk);
                    break;
                case "o":
                    this.createObject(trunk);
                    break;
                case "usemtl":
                    if (this._mtlLib) {
                        if (!trunk[1])
                            trunk[1] = "def000";
                        this._materialIDs.push(trunk[1]);
                        this._activeMaterialID = trunk[1];
                        if (this._currentGroup)
                            this._currentGroup.materialID = this._activeMaterialID;
                    }
                    break;
                case "v":
                    this.parseVertex(trunk);
                    break;
                case "vt":
                    this.parseUV(trunk);
                    break;
                case "vn":
                    this.parseVertexNormal(trunk);
                    break;
                case "f":
                    this.parseFace(trunk);
            }
        }

		/**
		 * 把解析出来的数据转换成引擎使用的数据结构
		 */
        private translate() {
            for (var objIndex: number = 0; objIndex < this._objects.length; ++objIndex) {
                var groups: Group[] = this._objects[objIndex].groups;
                var numGroups: number = groups.length;
                var materialGroups: MaterialGroup[];
                var numMaterialGroups: number;
                var geometry: Geometry;
                var mesh: Mesh;

                var m: number;
                var sm: number;
                var bmMaterial: MaterialBase;

                for (var g: number = 0; g < numGroups; ++g) {
                    geometry = new Geometry();
                    materialGroups = groups[g].materialGroups;
                    numMaterialGroups = materialGroups.length;

                    //添加子网格
                    for (m = 0; m < numMaterialGroups; ++m)
                        this.translateMaterialGroup(materialGroups[m], geometry);

                    if (geometry.subGeometries.length == 0)
                        continue;

                    //完成几何体资源解析
                    this.finalizeAsset(geometry, "");
                    if (this.materialMode < 2)
                        bmMaterial = new TextureMaterial(DefaultMaterialManager.getDefaultTexture());
                    else
                        bmMaterial = new TextureMultiPassMaterial(DefaultMaterialManager.getDefaultTexture());
                    //创建网格
                    mesh = new Mesh(geometry, bmMaterial);

                    //网格命名
                    if (this._objects[objIndex].name) {
                        //使用'o'标签给网格命名
                        mesh.name = this._objects[objIndex].name;
                    }
                    else if (groups[g].name) {
                        //使用'g'标签给网格命名
                        mesh.name = groups[g].name;
                    }
                    else {
                        mesh.name = "";
                    }

                    this._meshes.push(mesh);

                    //给材质命名
                    if (groups[g].materialID != "")
                        bmMaterial.name = groups[g].materialID + "~" + mesh.name;
                    else
                        bmMaterial.name = this._lastMtlID + "~" + mesh.name;

                    //子网使用材质
                    if (mesh.subMeshes.length > 1) {
                        for (sm = 1; sm < mesh.subMeshes.length; ++sm)
                            mesh.subMeshes[sm].material = bmMaterial;
                    }

                    this.finalizeAsset(mesh);
                }
            }
        }

		/**
		 * 转换材质组为子网格
		 * @param materialGroup 材质组网格数据
		 * @param geometry 解析出子网格的父网格
		 */
        private translateMaterialGroup(materialGroup: MaterialGroup, geometry: Geometry) {
            var faces: FaceData[] = materialGroup.faces;
            var face: FaceData;
            var numFaces: number = faces.length;
            var numVerts: number;
            var subs: SubGeometry[];

            var vertices: number[] = [];
            var uvs: number[] = [];
            var normals: number[] = [];
            var indices: number[] = [];

            this._realIndices = [];
            this._vertexIndex = 0;

            //解析面数据
            var j: number;
            for (var i: number = 0; i < numFaces; ++i) {
                face = faces[i];
                numVerts = face.indexIds.length - 1;
                //兼容多边形(拆分成N-1个三角形)
                for (j = 1; j < numVerts; ++j) {
                    this.translateVertexData(face, j, vertices, uvs, indices, normals);
                    this.translateVertexData(face, 0, vertices, uvs, indices, normals);
                    this.translateVertexData(face, j + 1, vertices, uvs, indices, normals);
                }
            }
            //创建 子网格
            if (vertices.length > 0) {
                subs = GeomUtil.fromVectors(vertices, indices, uvs, null, null);
                for (i = 0; i < subs.length; i++)
                    geometry.addSubGeometry(subs[i]);
            }
        }

		/**
		 * 把面数据转换为顶点等数据
		 * @param face
		 * @param vertexIndex
		 * @param vertices
		 * @param uvs
		 * @param indices
		 * @param normals
		 */
        private translateVertexData(face: FaceData, vertexIndex: number, vertices: number[], uvs: number[], indices: number[], normals: number[]) {
            var index: number;
            var vertex: Vertex;
            var vertexNormal: Vertex;
            var uv: UV;

            if (!this._realIndices[face.indexIds[vertexIndex]]) {
                index = this._vertexIndex;
                this._realIndices[face.indexIds[vertexIndex]] = ++this._vertexIndex;
                vertex = this._vertices[face.vertexIndices[vertexIndex] - 1];
                vertices.push(vertex.x * this._scale, vertex.y * this._scale, vertex.z * this._scale);

                if (face.normalIndices.length > 0) {
                    vertexNormal = this._vertexNormals[face.normalIndices[vertexIndex] - 1];
                    normals.push(vertexNormal.x, vertexNormal.y, vertexNormal.z);
                }

                if (face.uvIndices.length > 0) {

                    try {
                        uv = this._uvs[face.uvIndices[vertexIndex] - 1];
                        uvs.push(uv.u, uv.v);

                    }
                    catch (e) {

                        switch (vertexIndex) {
                            case 0:
                                uvs.push(0, 1);
                                break;
                            case 1:
                                uvs.push(.5, 0);
                                break;
                            case 2:
                                uvs.push(1, 1);
                        }
                    }

                }

            }
            else
                index = this._realIndices[face.indexIds[vertexIndex]] - 1;

            indices.push(index);
        }

		/**
		 * 创建对象组
		 * @param trunk 包含材料标记的数据块和它的参数
		 */
        private createObject(trunk) {
            this._currentGroup = null;
            this._currentMaterialGroup = null;
            this._objects.push(this._currentObject = new ObjectGroup());

            if (trunk)
                this._currentObject.name = trunk[1];
        }

		/**
		 * 创建一个组
		 * @param trunk 包含材料标记的数据块和它的参数
		 */
        private createGroup(trunk) {
            if (!this._currentObject)
                this.createObject(null);
            this._currentGroup = new Group();

            this._currentGroup.materialID = this._activeMaterialID;

            if (trunk)
                this._currentGroup.name = trunk[1];
            this._currentObject.groups.push(this._currentGroup);

            this.createMaterialGroup(null);
        }

		/**
		 * 创建材质组
		 * @param trunk 包含材料标记的数据块和它的参数
		 */
        private createMaterialGroup(trunk) {
            this._currentMaterialGroup = new MaterialGroup();
            if (trunk)
                this._currentMaterialGroup.url = trunk[1];
            this._currentGroup.materialGroups.push(this._currentMaterialGroup);
        }

		/**
		 * 解析顶点坐标数据
		 * @param trunk 坐标数据
		 */
        private parseVertex(trunk) {
            if (trunk.length > 4) {
                var nTrunk = [];
                var val: number;
                for (var i: number = 1; i < trunk.length; ++i) {
                    val = parseFloat(trunk[i]);
                    if (!isNaN(val))
                        nTrunk.push(val);
                }
                this._vertices.push(new Vertex(nTrunk[0], nTrunk[1], -nTrunk[2]));
            }
            else
                this._vertices.push(new Vertex(parseFloat(trunk[1]), parseFloat(trunk[2]), -parseFloat(trunk[3])));

        }

		/**
		 * 解析uv
		 * @param trunk uv数据
		 */
        private parseUV(trunk) {
            if (trunk.length > 3) {
                var nTrunk = [];
                var val: number;
                //获取有效数字
                for (var i: number = 1; i < trunk.length; ++i) {
                    val = parseFloat(trunk[i]);
                    if (!isNaN(val))
                        nTrunk.push(val);
                }
                this._uvs.push(new UV(nTrunk[0], 1 - nTrunk[1]));

            }
            else
                this._uvs.push(new UV(parseFloat(trunk[1]), 1 - parseFloat(trunk[2])));

        }

		/**
		 * 解析顶点法线
		 * @param trunk 法线数据
		 */
        private parseVertexNormal(trunk) {
            if (trunk.length > 4) {
                var nTrunk = [];
                var val: number;
                //获取有效数字
                for (var i: number = 1; i < trunk.length; ++i) {
                    val = parseFloat(trunk[i]);
                    if (!isNaN(val))
                        nTrunk.push(val);
                }
                this._vertexNormals.push(new Vertex(nTrunk[0], nTrunk[1], -nTrunk[2]));

            }
            else
                this._vertexNormals.push(new Vertex(parseFloat(trunk[1]), parseFloat(trunk[2]), -parseFloat(trunk[3])));
        }

		/**
		 * 解析面
		 * @param trunk 面数据
		 */
        private parseFace(trunk) {
            var len: number = trunk.length;
            var face: FaceData = new FaceData();

            if (!this._currentGroup)
                this.createGroup(null);

            var indices;
            for (var i: number = 1; i < len; ++i) {
                if (trunk[i] == "")
                    continue;
                //解析单个面数据，分离出顶点坐标左右、uv索引、法线索引
                indices = trunk[i].split("/");
                face.vertexIndices.push(this.parseIndex(parseInt(indices[0]), this._vertices.length));
                if (indices[1] && String(indices[1]).length > 0)
                    face.uvIndices.push(this.parseIndex(parseInt(indices[1]), this._uvs.length));
                if (indices[2] && String(indices[2]).length > 0)
                    face.normalIndices.push(this.parseIndex(parseInt(indices[2]), this._vertexNormals.length));
                face.indexIds.push(trunk[i]);
            }

            this._currentMaterialGroup.faces.push(face);
        }

		/**
		 * This is a hack around negative face coords
		 */
        private parseIndex(index: number, length: number): number {
            if (index < 0)
                return index + length + 1;
            else
                return index;
        }

		/**
		 * 解析材质数据
		 * @param data 材质数据
		 */
        private parseMtl(data: string) {
            var materialDefinitions = data.split('newmtl');
            var lines;
            var trunk;
            var j: number;

            var basicSpecularMethod: BasicSpecularMethod;
            var useSpecular: boolean;
            var useColor: boolean;
            var diffuseColor: number;
            var ambientColor: number;
            var specularColor: number;
            var specular: number;
            var alpha: number;
            var mapkd: string;

            for (var i: number = 0; i < materialDefinitions.length; ++i) {

                lines = materialDefinitions[i].split('\r').join("").split('\n');

                if (lines.length == 1)
                    lines = materialDefinitions[i].split(String.fromCharCode(13));

                diffuseColor = ambientColor = specularColor = 0xFFFFFF;
                specular = 0;
                useSpecular = false;
                useColor = false;
                alpha = 1;
                mapkd = "";

                for (j = 0; j < lines.length; ++j) {
                    lines[j] = lines[j].replace(/\s+$/, "");

                    if (lines[j].substring(0, 1) != "#" && (j == 0 || lines[j] != "")) {
                        trunk = lines[j].split(" ");

                        if (String(trunk[0]).charCodeAt(0) == 9 || String(trunk[0]).charCodeAt(0) == 32)
                            trunk[0] = trunk[0].substring(1, trunk[0].length);

                        if (j == 0) {
                            this._lastMtlID = trunk.join("");
                            this._lastMtlID = (this._lastMtlID == "") ? "def000" : this._lastMtlID;

                        }
                        else {

                            switch (trunk[0]) {

                                case "Ka":
                                    if (trunk[1] && !isNaN(Number(trunk[1])) && trunk[2] && !isNaN(Number(trunk[2])) && trunk[3] && !isNaN(Number(trunk[3])))
                                        ambientColor = trunk[1] * 255 << 16 | trunk[2] * 255 << 8 | trunk[3] * 255;
                                    break;

                                case "Ks":
                                    if (trunk[1] && !isNaN(Number(trunk[1])) && trunk[2] && !isNaN(Number(trunk[2])) && trunk[3] && !isNaN(Number(trunk[3]))) {
                                        specularColor = trunk[1] * 255 << 16 | trunk[2] * 255 << 8 | trunk[3] * 255;
                                        useSpecular = true;
                                    }
                                    break;

                                case "Ns":
                                    if (trunk[1] && !isNaN(Number(trunk[1])))
                                        specular = Number(trunk[1]) * 0.001;
                                    if (specular == 0)
                                        useSpecular = false;
                                    break;

                                case "Kd":
                                    if (trunk[1] && !isNaN(Number(trunk[1])) && trunk[2] && !isNaN(Number(trunk[2])) && trunk[3] && !isNaN(Number(trunk[3]))) {
                                        diffuseColor = trunk[1] * 255 << 16 | trunk[2] * 255 << 8 | trunk[3] * 255;
                                        useColor = true;
                                    }
                                    break;

                                case "tr":
                                case "d":
                                    if (trunk[1] && !isNaN(Number(trunk[1])))
                                        alpha = Number(trunk[1]);
                                    break;

                                case "map_Kd":
                                    mapkd = this.parseMapKdString(trunk);
                                    mapkd = mapkd.replace(/\\/g, "/");
                            }
                        }
                    }
                }

                if (mapkd != "") {

                    if (useSpecular) {

                        basicSpecularMethod = new BasicSpecularMethod();
                        basicSpecularMethod.specularColor = specularColor;
                        basicSpecularMethod.specular = specular;

                        var specularData: SpecularData = new SpecularData();
                        specularData.alpha = alpha;
                        specularData.basicSpecularMethod = basicSpecularMethod;
                        specularData.materialID = this._lastMtlID;

                        if (!this._materialSpecularData)
                            this._materialSpecularData = [];

                        this._materialSpecularData.push(specularData);
                    }

                    //添加材质依赖性
                    this.addDependency(this._lastMtlID, new URLRequest(mapkd));

                }
                else if (useColor && !isNaN(diffuseColor)) {

                    var lm: LoadedMaterial = new LoadedMaterial();
                    lm.materialID = this._lastMtlID;

                    if (alpha == 0)
                        console.log("Warning: an alpha value of 0 was found in mtl color tag (Tr or d) ref:" + this._lastMtlID + ", mesh(es) using it will be invisible!");

                    if (this.materialMode < 2) {
                        var cm: ColorMaterial = new ColorMaterial(diffuseColor);
                        cm.alpha = alpha;
                        cm.ambientColor = ambientColor;
                        cm.repeat = true;
                        if (useSpecular) {
                            cm.specularColor = specularColor;
                            cm.specular = specular;
                        }
                    }
                    else {
                        var cmm: ColorMultiPassMaterial = new ColorMultiPassMaterial(diffuseColor);
                        cmm.ambientColor = ambientColor;
                        cmm.repeat = true;
                        if (useSpecular) {
                            cmm.specularColor = specularColor;
                            cmm.specular = specular;
                        }
                    }

                    lm.cm = cm;
                    this._materialLoaded.push(lm);

                    if (this._meshes.length > 0)
                        this.applyMaterial(lm);

                }
            }

            this._mtlLibLoaded = true;
        }

        private parseMapKdString(trunk): string {
            var url: string = "";
            var i: number;
            var breakflag: boolean;

            for (i = 1; i < trunk.length;) {
                switch (trunk[i]) {
                    case "-blendu":
                    case "-blendv":
                    case "-cc":
                    case "-clamp":
                    case "-texres":
                        i += 2; //Skip ahead 1 attribute
                        break;
                    case "-mm":
                        i += 3; //Skip ahead 2 attributes
                        break;
                    case "-o":
                    case "-s":
                    case "-t":
                        i += 4; //Skip ahead 3 attributes
                        continue;
                    default:
                        breakflag = true;
                        break;
                }

                if (breakflag)
                    break;
            }

            //Reconstruct URL/filename
            for (i; i < trunk.length; i++) {
                url += trunk[i];
                url += " ";
            }

            //Remove the extraneous space and/or newline from the right side
            url = url.replace(/\s+$/, "");

            return url;
        }

		/**
		 * 加载材质
		 * @param mtlurl 材质地址
		 */
        private loadMtl(mtlurl: string) {
            //添加 材质 资源依赖，暂停解析
            this.addDependency('mtl', new URLRequest(mtlurl), true);
            this.pauseAndRetrieveDependencies();
        }

		/**
		 * 应用材质
		 * @param lm 加载到的材质
		 */
        private applyMaterial(lm: LoadedMaterial) {
            var decomposeID;
            var mesh: Mesh;
            var mat: MaterialBase;
            var j: number;
            var specularData: SpecularData;

            for (var i: number = 0; i < this._meshes.length; ++i) {
                mesh = this._meshes[i];
                decomposeID = mesh.material.name.split("~");

                if (decomposeID[0] == lm.materialID) {

                    if (lm.cm) {
                        if (mesh.material)
                            mesh.material = null;
                        mesh.material = lm.cm;

                    }
                    else if (lm.texture) {
                        if (this.materialMode < 2) { // if this.materialMode is 0 or 1, we create a SinglePass				
                            var textMat: TextureMaterial = as(mesh.material, TextureMaterial);
                            textMat.texture = lm.texture;
                            textMat.ambientColor = lm.ambientColor;
                            textMat.alpha = lm.alpha;
                            textMat.repeat = true;

                            if (lm.specularMethod) {
                                // By setting the this.specularMethod property to null before assigning
                                // the actual method instance, we avoid having the properties of
                                // the new method being overridden with the settings from the old
                                // one, which is default behavior of the setter.
                                textMat.specularMethod = null;
                                textMat.specularMethod = lm.specularMethod;
                            }
                            else if (this._materialSpecularData) {
                                for (j = 0; j < this._materialSpecularData.length; ++j) {
                                    specularData = this._materialSpecularData[j];
                                    if (specularData.materialID == lm.materialID) {
                                        textMat.specularMethod = null; // Prevent property overwrite (see above)
                                        textMat.specularMethod = specularData.basicSpecularMethod;
                                        textMat.ambientColor = specularData.ambientColor;
                                        textMat.alpha = specularData.alpha;
                                        break;
                                    }
                                }
                            }
                        }
                        else { //if this.materialMode==2 this is a MultiPassTexture					
                            var multMat: TextureMultiPassMaterial = as(mesh.material, TextureMultiPassMaterial);
                            multMat.texture = lm.texture;
                            multMat.ambientColor = lm.ambientColor;
                            multMat.repeat = true;

                            if (lm.specularMethod) {
                                // By setting the this.specularMethod property to null before assigning
                                // the actual method instance, we avoid having the properties of
                                // the new method being overridden with the settings from the old
                                // one, which is default behavior of the setter.
                                multMat.specularMethod = null;
                                multMat.specularMethod = lm.specularMethod;
                            }
                            else if (this._materialSpecularData) {
                                for (j = 0; j < this._materialSpecularData.length; ++j) {
                                    specularData = this._materialSpecularData[j];
                                    if (specularData.materialID == lm.materialID) {
                                        multMat.specularMethod = null; // Prevent property overwrite (see above)
                                        multMat.specularMethod = specularData.basicSpecularMethod;
                                        multMat.ambientColor = specularData.ambientColor;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    mesh.material.name = decomposeID[1] ? decomposeID[1] : decomposeID[0];
                    this._meshes.splice(i, 1);
                    --i;
                }
            }

            if (lm.cm || mat)
                this.finalizeAsset(lm.cm || mat);
        }

		/**
		 * 应用材质
		 */
        private applyMaterials() {
            if (this._materialLoaded.length == 0)
                return;

            for (var i: number = 0; i < this._materialLoaded.length; ++i)
                this.applyMaterial(this._materialLoaded[i]);
        }
    }

    class ObjectGroup {
        /** 对象名 */
        public name: string;
        /** 组列表（子网格列表） */
        public groups: Group[] = [];

        public ObjectGroup() {
        }
    }

    class Group {
        public name: string;
        public materialID: string;
        public materialGroups: MaterialGroup[] = [];

        public Group() {
        }
    }

    /**
     * 材质组
     */
    class MaterialGroup {
        public url: string;
        public faces: FaceData[] = [];

        public MaterialGroup() {
        }
    }

    class SpecularData {
        public materialID: string;
        public basicSpecularMethod: BasicSpecularMethod;
        public ambientColor: number = 0xFFFFFF;
        public alpha: number = 1;

        public SpecularData() {
        }
    }

    /**
     * 加载的材质
     */
    class LoadedMaterial {
        public materialID: string;
        public texture: Texture2DBase;
        public cm: MaterialBase;
        public specularMethod: BasicSpecularMethod;
        public ambientColor: number = 0xFFFFFF;
        public alpha: number = 1;

        public LoadedMaterial() {
        }
    }

    /**
     * 面数据
     */
    class FaceData {
        /** 顶点坐标索引数组 */
        public vertexIndices: number[] = [];
        /** 顶点uv索引数组 */
        public uvIndices: number[] = [];
        /** 顶点法线索引数组 */
        public normalIndices: number[] = [];
        /** 顶点Id(原本该值存放了顶点索引、uv索引、发现索引，已经被解析为上面3个数组，剩下的就当做ID使用) */
        public indexIds: string[] = []; // 

        public FaceData() {
        }
    }
}




