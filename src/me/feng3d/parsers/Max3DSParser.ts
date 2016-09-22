module feng3d {

	/**
	 * Max3DSParser provides a parser for the 3ds data type.
	 */
    export class Max3DSParser extends ParserBase {
        private _byteData: ByteArray;

        private _textures: Object;
        private _materials: Object;
        private _unfinalized_objects: Object;

        private _cur_obj_end: number;
        private _cur_obj: ObjectVO;

        private _cur_mat_end: number;
        private _cur_mat: MaterialVO;
        private _useSmoothingGroups: boolean;

		/**
		 * Creates a new <code>Max3DSParser</code> object.
		 *
		 * @param useSmoothingGroups Determines whether the parser looks for smoothing groups in the 3ds file or assumes uniform smoothing. Defaults to true.
		 */
        constructor(useSmoothingGroups: boolean = true) {
            super(ParserDataFormat.BINARY);

            this._useSmoothingGroups = useSmoothingGroups;
        }

		/**
		 * Indicates whether or not a given file extension is supported by the parser.
		 * @param extension The file extension of a potential file to be parsed.
		 * @return Whether or not the given file type is supported.
		 */
        public static supportsType(extension: string): boolean {
            extension = extension.toLowerCase();
            return extension == "3ds";
        }

		/**
		 * Tests whether a data block can be parsed by the parser.
		 * @param data The data block to potentially be parsed.
		 * @return Whether or not the given data is supported.
		 */
        public static supportsData(data): boolean {
            var ba: ByteArray = data;

            if (ba) {
                ba.position = 0;
                if (ba.readShort() == 0x4d4d)
                    return true;
            }

            return false;
        }

		/**
		 * @inheritDoc
		 */
        public resolveDependency(resourceDependency: ResourceDependency) {
            if (resourceDependency.assets.length == 1) {
                var asset: IAsset;

                asset = resourceDependency.assets[0];
                if (asset.namedAsset.assetType == AssetType.TEXTURE) {
                    var tex: TextureVO;

                    tex = this._textures[resourceDependency.id];
                    tex.texture = as(asset, Texture2DBase);
                }
            }
        }

		/**
		 * @inheritDoc
		 */
        public resolveDependencyFailure(resourceDependency: ResourceDependency) {
            // TODO: Implement
        }

		/**
		 * @inheritDoc
		 */
        protected startParsing(frameLimit: number) {
            super.startParsing(frameLimit);

            this._byteData = this._data;
            this._byteData.position = 0;
            this._byteData.endian = Endian.LITTLE_ENDIAN;

            this._textures = {};
            this._materials = {};
            this._unfinalized_objects = {};
        }

		/**
		 * @inheritDoc
		 */
        protected proceedParsing(): boolean {

            // TODO: With this construct, the loop will run no-op for as long
            // as there is time once file has finished reading. Consider this.a nice
            // way to stop loop when byte array is empty, without putting it in
            // the while-conditional, which will prevent finalizations from
            // happening after the last chunk.
            while (this.hasTime()) {

                // If we are currently working on an object, and the most recent chunk was
                // the last one in that object, finalize the current object.
                if (this._cur_mat && this._byteData.position >= this._cur_mat_end)
                    this.finalizeCurrentMaterial();
                else if (this._cur_obj && this._byteData.position >= this._cur_obj_end) {
                    // Can't finalize at this point, because we have to wait until the full
                    // animation section has been parsed for any potential pivot definitions
                    this._unfinalized_objects[this._cur_obj.name] = this._cur_obj;
                    this._cur_obj_end = Number.MAX_VALUE;
                    this._cur_obj = null;
                }

                if (this._byteData.bytesAvailable) {
                    var cid: number;
                    var len: number;
                    var end: number;

                    cid = this._byteData.readUnsignedShort();
                    len = this._byteData.readUnsignedInt();
                    end = this._byteData.position + (len - 6);

                    switch (cid) {
                        case 0x4D4D: // MAIN3DS
                        case 0x3D3D: // EDIT3DS
                        case 0xB000: // KEYF3DS
                            // This types are "container chunks" and contain only
                            // sub-chunks (no data on their own.) This means that
                            // there is nothing more to parse at this point, and 
                            // instead we should progress to the next chunk, which
                            // will be the first sub-chunk of this one.
                            continue;
                        case 0xAFFF: // MATERIAL
                            this._cur_mat_end = end;
                            this._cur_mat = this.parseMaterial();
                            break;

                        case 0x4000: // EDIT_OBJECT
                            this._cur_obj_end = end;
                            this._cur_obj = new ObjectVO();
                            this._cur_obj.name = this.readNulTermString();
                            this._cur_obj.materials = [];
                            this._cur_obj.materialFaces = {};
                            break;

                        case 0x4100: // OBJ_TRIMESH 
                            this._cur_obj.type = AssetType.MESH;
                            break;

                        case 0x4110: // TRI_VERTEXL
                            this.parseVertexList();
                            break;

                        case 0x4120: // TRI_FACELIST
                            this.parseFaceList();
                            break;

                        case 0x4140: // TRI_MAPPINGCOORDS
                            this.parseUVList();
                            break;

                        case 0x4130: // Face this.materials
                            this.parseFaceMaterialList();
                            break;

                        case 0x4160: // Transform
                            this._cur_obj.transform = this.readTransform();
                            break;

                        case 0xB002: // Object animation (including pivot)
                            this.parseObjectAnimation(end);
                            break;

                        case 0x4150: // Smoothing groups
                            this.parseSmoothingGroups();
                            break;

                        default:
                            // Skip this (unknown) chunk
                            this._byteData.position += (len - 6);
                            break;
                    }

                    // Pause parsing if there were any this.dependencies found during this
                    // iteration (i.e. if there are any this.dependencies that need to be
                    // retrieved at this time.)
                    //					if (this.dependencies.length)
                    //					{
                    //						this.pauseAndRetrieveDependencies();
                    //						break;
                    //					}
                }
            }

            // More parsing is required if the entire byte array has not yet
            // been read, or if there is this.a currently non-finalized object in
            // the pipeline.
            if (this._byteData.bytesAvailable || this._cur_obj || this._cur_mat)
                return ParserBase.MORE_TO_PARSE;
            else {
                var name: string;

                // Finalize any remaining objects before ending.
                for (name in this._unfinalized_objects) {
                    var obj: Container3D;
                    obj = this.constructObject(this._unfinalized_objects[name]);
                    if (obj)
                        this.finalizeAsset(obj, name);
                }

                return ParserBase.PARSING_DONE;
            }
        }

        private parseMaterial(): MaterialVO {
            var mat: MaterialVO;

            mat = new MaterialVO();

            while (this._byteData.position < this._cur_mat_end) {
                var cid: number;
                var len: number;
                var end: number;

                cid = this._byteData.readUnsignedShort();
                len = this._byteData.readUnsignedInt();
                end = this._byteData.position + (len - 6);

                switch (cid) {
                    case 0xA000: // Material this.name
                        mat.name = this.readNulTermString();
                        break;

                    case 0xA010: // Ambient color
                        mat.ambientColor = this.readColor();
                        break;

                    case 0xA020: // Diffuse color
                        mat.diffuseColor = this.readColor();
                        break;

                    case 0xA030: // Specular color
                        mat.specularColor = this.readColor();
                        break;

                    case 0xA081: // Two-sided, existence indicates "true"
                        mat.twoSided = true;
                        break;

                    case 0xA200: // Main (color) this.texture 
                        mat.colorMap = this.parseTexture(end);
                        break;

                    case 0xA204: // Specular map
                        mat.specularMap = this.parseTexture(end);
                        break;

                    default:
                        this._byteData.position = end;
                        break;
                }
            }

            return mat;
        }

        private parseTexture(end: number): TextureVO {
            var tex: TextureVO;

            tex = new TextureVO();

            while (this._byteData.position < end) {
                var cid: number;
                var len: number;

                cid = this._byteData.readUnsignedShort();
                len = this._byteData.readUnsignedInt();

                switch (cid) {
                    case 0xA300:
                        tex.url = this.readNulTermString();
                        break;

                    default:
                        // Skip this unknown this.texture sub-chunk
                        this._byteData.position += (len - 6);
                        break;
                }
            }

            this._textures[tex.url] = tex;
            this.addDependency(tex.url, new URLRequest(tex.url));

            return tex;
        }

        private parseVertexList() {
            var i: number;
            var len: number;
            var count: number;

            count = this._byteData.readUnsignedShort();
            this._cur_obj.verts = [];
            this._cur_obj.verts.length = count * 3;

            i = 0;
            len = this._cur_obj.verts.length;
            while (i < len) {
                var x: number, y: number, z: number;

                x = this._byteData.readFloat();
                y = this._byteData.readFloat();
                z = this._byteData.readFloat();

                this._cur_obj.verts[i++] = x;
                this._cur_obj.verts[i++] = z;
                this._cur_obj.verts[i++] = y;
            }
        }

        private parseFaceList() {
            var i: number;
            var len: number;
            var count: number;

            count = this._byteData.readUnsignedShort();
            this._cur_obj.indices = [];
            this._cur_obj.indices.length = count * 3;

            i = 0;
            len = this._cur_obj.indices.length;
            while (i < len) {
                var i0: number, i1: number, i2: number;

                i0 = this._byteData.readUnsignedShort();
                i1 = this._byteData.readUnsignedShort();
                i2 = this._byteData.readUnsignedShort();

                this._cur_obj.indices[i++] = i0;
                this._cur_obj.indices[i++] = i2;
                this._cur_obj.indices[i++] = i1;

                // Skip "face info", irrelevant in Away3D
                this._byteData.position += 2;
            }

            this._cur_obj.smoothingGroups = [];
            this._cur_obj.smoothingGroups.length = count;
        }

        private parseSmoothingGroups() {
            var len: number = this._cur_obj.indices.length / 3;
            var i: number = 0;
            while (i < len) {
                this._cur_obj.smoothingGroups[i] = this._byteData.readUnsignedInt();
                i++;
            }
        }

        private parseUVList() {
            var i: number;
            var len: number;
            var count: number;

            count = this._byteData.readUnsignedShort();
            this._cur_obj.uvs = [];
            this._cur_obj.uvs.length = count * 2;

            i = 0;
            len = this._cur_obj.uvs.length;
            while (i < len) {
                this._cur_obj.uvs[i++] = this._byteData.readFloat();
                this._cur_obj.uvs[i++] = 1.0 - this._byteData.readFloat();
            }
        }

        private parseFaceMaterialList() {
            var mat: string;
            var count: number;
            var i: number;
            var faces: number[];

            mat = this.readNulTermString();
            count = this._byteData.readUnsignedShort();

            faces = [];
            faces.length = count;
            i = 0;
            while (i < faces.length)
                faces[i++] = this._byteData.readUnsignedShort();

            this._cur_obj.materials.push(mat);
            this._cur_obj.materialFaces[mat] = faces;
        }

        private parseObjectAnimation(end: number) {
            var vo: ObjectVO;
            var obj: Container3D;
            var pivot: Vector3D;
            var name: string;
            var hier: number;

            // Pivot defaults to origin
            pivot = new Vector3D;

            while (this._byteData.position < end) {
                var cid: number;
                var len: number;

                cid = this._byteData.readUnsignedShort();
                len = this._byteData.readUnsignedInt();

                switch (cid) {
                    case 0xb010: // Name/hierarchy
                        name = this.readNulTermString();
                        this._byteData.position += 4;
                        hier = this._byteData.readShort();
                        break;

                    case 0xb013: // Pivot
                        pivot.x = this._byteData.readFloat();
                        pivot.z = this._byteData.readFloat();
                        pivot.y = this._byteData.readFloat();
                        break;

                    default:
                        this._byteData.position += (len - 6);
                        break;
                }
            }

            // If name is "$$$DUMMY" this is an empty object (e.g. this.a container)
            // and will be ignored in this version of the parser
            // TODO: Implement containers in 3DS parser.
            if (name != '$$$DUMMY' && this._unfinalized_objects.hasOwnProperty(name)) {
                vo = this._unfinalized_objects[name];
                obj = this.constructObject(vo, pivot);

                if (obj)
                    this.finalizeAsset(obj, vo.name);

                delete this._unfinalized_objects[name];
            }
        }

        private constructObject(obj: ObjectVO, pivot: Vector3D = null): Container3D {
            if (obj.type == AssetType.MESH) {
                var i: number;
                var subs: SubGeometry[];
                var geom: Geometry;
                var mat: MaterialBase;
                var mesh: Mesh;
                var mtx: Matrix3D;
                var vertices: VertexVO[];
                var faces: FaceVO[];

                if (obj.materials.length > 1)
                    console.log('The Away3D 3DS parser does not support multiple this.materials per mesh at this point.');

                // Ignore empty objects
                if (!obj.indices || obj.indices.length == 0)
                    return null;

                vertices = [];
                vertices.length = obj.verts.length / 3;
                faces = [];
                faces.length = obj.indices.length / 3;

                this.prepareData(vertices, faces, obj);

                if (this._useSmoothingGroups)
                    this.applySmoothGroups(vertices, faces);

                obj.verts = [];
                obj.verts.length = vertices.length * 3;
                for (i = 0; i < vertices.length; i++) {
                    obj.verts[i * 3] = vertices[i].x;
                    obj.verts[i * 3 + 1] = vertices[i].y;
                    obj.verts[i * 3 + 2] = vertices[i].z;
                }
                obj.indices = [];
                obj.indices.length = faces.length * 3;
                for (i = 0; i < faces.length; i++) {
                    obj.indices[i * 3] = faces[i].a;
                    obj.indices[i * 3 + 1] = faces[i].b;
                    obj.indices[i * 3 + 2] = faces[i].c;
                }

                if (obj.uvs) {
                    // If the object had UVs to start with, use UVs generated by
                    // smoothing group splitting algorithm. Otherwise those UVs
                    // will be nonsense and should be skipped.
                    obj.uvs = [];
                    obj.uvs.length = vertices.length * 2;
                    for (i = 0; i < vertices.length; i++) {
                        obj.uvs[i * 2] = vertices[i].u;
                        obj.uvs[i * 2 + 1] = vertices[i].v;
                    }
                }

                geom = new Geometry();

                // Construct sub-geometries (potentially splitting buffers)
                // and add them to geometry.
                subs = GeomUtil.fromVectors(obj.verts, obj.indices, obj.uvs, null, null);
                for (i = 0; i < subs.length; i++)
                    geom.subGeometries.push(subs[i]);

                if (obj.materials.length > 0) {
                    var mname: string;
                    mname = obj.materials[0];
                    mat = this._materials[mname].material;
                }

                // Apply pivot translation to geometry if this.a pivot was
                // found while parsing the keyframe chunk earlier.
                if (pivot) {
                    if (obj.transform) {
                        // If this.a this.transform was found while parsing the
                        // object chunk, use it to find the local pivot vector
                        var dat: number[] = obj.transform.concat();
                        dat[12] = 0;
                        dat[13] = 0;
                        dat[14] = 0;
                        mtx = new Matrix3D(dat);
                        pivot = mtx.transformVector(pivot);
                    }

                    pivot.scaleBy(-1);

                    mtx = new Matrix3D();
                    mtx.appendTranslation(pivot.x, pivot.y, pivot.z);
                    geom.applyTransformation(mtx);
                }

                // Apply transformation to geometry if this.a transformation
                // was found while parsing the object chunk earlier.
                if (obj.transform) {
                    mtx = new Matrix3D(obj.transform);
                    mtx.invert();
                    geom.applyTransformation(mtx);
                }

                // Final this.transform applied to geometry. Finalize the geometry,
                // which will no longer be modified after this point.
                this.finalizeAsset(geom, obj.name.concat('_geom'));

                // Build mesh and return it
                mesh = new Mesh(geom, mat);
                mesh.transform3D.transform = new Matrix3D(obj.transform);
                return mesh;
            }

            // If reached, unknown
            return null;
        }

        private prepareData(vertices: VertexVO[], faces: FaceVO[], obj: ObjectVO) {
            // convert raw ObjectVO's data to structured VertexVO and FaceVO
            var i: number;
            var j: number;
            var k: number;
            var len: number = obj.verts.length;
            for (i = 0, j = 0, k = 0; i < len;) {
                var v: VertexVO = new VertexVO;
                v.x = obj.verts[i++];
                v.y = obj.verts[i++];
                v.z = obj.verts[i++];
                if (obj.uvs) {
                    v.u = obj.uvs[j++];
                    v.v = obj.uvs[j++];
                }
                vertices[k++] = v;
            }
            len = obj.indices.length;
            for (i = 0, k = 0; i < len;) {
                var f: FaceVO = new FaceVO();
                f.a = obj.indices[i++];
                f.b = obj.indices[i++];
                f.c = obj.indices[i++];
                f.smoothGroup = obj.smoothingGroups[k];
                faces[k++] = f;
            }
        }

        private applySmoothGroups(vertices: VertexVO[], faces: FaceVO[]) {
            // clone vertices according to following rule:
            // clone if vertex's in faces from groups 1+2 and 3
            // don't clone if vertex's in faces from groups 1+2, 3 and 1+3

            var i: number;
            var j: number;
            var k: number;
            var l: number;
            var len: number;
            var numVerts: number = vertices.length;
            var numFaces: number = faces.length;

            // extract groups data for vertices
            var vGroups = [];
            vGroups.length = numVerts;
            for (i = 0; i < numVerts; i++)
                vGroups[i] = [];
            for (i = 0; i < numFaces; i++) {
                var face: FaceVO = as(faces[i], FaceVO);
                for (j = 0; j < 3; j++) {
                    var groups: number[] = vGroups[(j == 0) ? face.a : ((j == 1) ? face.b : face.c)];
                    var group: number = face.smoothGroup;
                    for (k = groups.length - 1; k >= 0; k--) {
                        if ((group & groups[k]) > 0) {
                            group |= groups[k];
                            groups.splice(k, 1);
                            k = groups.length - 1;
                        }
                    }
                    groups.push(group);
                }
            }
            // clone vertices
            var vClones = [];
            vClones.length = numVerts;
            for (i = 0; i < numVerts; i++) {
                if ((len = vGroups[i].length) < 1)
                    continue;
                var clones: number[] = [];
                clones.length = len;
                vClones[i] = clones;
                clones[0] = i;
                var v0: VertexVO = vertices[i];
                for (j = 1; j < len; j++) {
                    var v1: VertexVO = new VertexVO;
                    v1.x = v0.x;
                    v1.y = v0.y;
                    v1.z = v0.z;
                    v1.u = v0.u;
                    v1.v = v0.v;
                    clones[j] = vertices.length;
                    vertices.push(v1);
                }
            }
            numVerts = vertices.length;

            for (i = 0; i < numFaces; i++) {
                face = as(faces[i], FaceVO);
                group = face.smoothGroup;
                for (j = 0; j < 3; j++) {
                    k = (j == 0) ? face.a : ((j == 1) ? face.b : face.c);
                    groups = vGroups[k];
                    len = groups.length;
                    clones = vClones[k];
                    for (l = 0; l < len; l++) {
                        if (((group == 0) && (groups[l] == 0)) || ((group & groups[l]) > 0)) {
                            var index: number = clones[l];
                            if (group == 0) {
                                // vertex is unique if no this.smoothGroup found
                                groups.splice(l, 1);
                                clones.splice(l, 1);
                            }
                            if (j == 0)
                                face.a = index;
                            else if (j == 1)
                                face.b = index;
                            else
                                face.c = index;
                            l = len;
                        }
                    }
                }
            }
        }

        private finalizeCurrentMaterial() {
            var mat: MaterialBase;
            if (this.materialMode < 2) {
                if (this._cur_mat.colorMap)
                    mat = new TextureMaterial(this._cur_mat.colorMap.texture || DefaultMaterialManager.getDefaultTexture());
                else
                    mat = new ColorMaterial(this._cur_mat.diffuseColor);
                as(mat, SinglePassMaterialBase).ambientColor = this._cur_mat.ambientColor;
                as(mat, SinglePassMaterialBase).specularColor = this._cur_mat.specularColor;
            }
            else {
                if (this._cur_mat.colorMap)
                    mat = new TextureMultiPassMaterial(this._cur_mat.colorMap.texture || DefaultMaterialManager.getDefaultTexture());
                else
                    mat = new ColorMultiPassMaterial(this._cur_mat.diffuseColor);
                //				MultiPassMaterialBase(mat).ambientColor = this._cur_mat.ambientColor;
                //				MultiPassMaterialBase(mat).specularColor = this._cur_mat.specularColor;
            }

            mat.bothSides = this._cur_mat.twoSided;

            this.finalizeAsset(mat, this._cur_mat.name);

            this._materials[this._cur_mat.name] = this._cur_mat;
            this._cur_mat.material = mat;

            this._cur_mat = null;
        }

        private readNulTermString(): string {
            var chr: number;
            var str: string = "";

            while ((chr = this._byteData.readUnsignedByte()) > 0)
                str += String.fromCharCode(chr);

            return str;
        }

        private readTransform(): number[] {
            var data: number[];

            data = [];
            data.length = 16;

            // X axis
            data[0] = this._byteData.readFloat(); // X
            data[2] = this._byteData.readFloat(); // Z
            data[1] = this._byteData.readFloat(); // Y
            data[3] = 0;

            // Z axis
            data[8] = this._byteData.readFloat(); // X
            data[10] = this._byteData.readFloat(); // Z
            data[9] = this._byteData.readFloat(); // Y
            data[11] = 0;

            // Y Axis
            data[4] = this._byteData.readFloat(); // X 
            data[6] = this._byteData.readFloat(); // Z
            data[5] = this._byteData.readFloat(); // Y
            data[7] = 0;

            // Translation
            data[12] = this._byteData.readFloat(); // X
            data[14] = this._byteData.readFloat(); // Z
            data[13] = this._byteData.readFloat(); // Y
            data[15] = 1;

            return data;
        }

        private readColor(): number {
            var cid: number;
            var len: number;
            var r: number, g: number, b: number;

            cid = this._byteData.readUnsignedShort();
            len = this._byteData.readUnsignedInt();

            switch (cid) {
                case 0x0010: // Floats
                    r = this._byteData.readFloat() * 255;
                    g = this._byteData.readFloat() * 255;
                    b = this._byteData.readFloat() * 255;
                    break;
                case 0x0011: // 24-bit color
                    r = this._byteData.readUnsignedByte();
                    g = this._byteData.readUnsignedByte();
                    b = this._byteData.readUnsignedByte();
                    break;
                default:
                    this._byteData.position += (len - 6);
                    break;
            }

            return (r << 16) | (g << 8) | b;
        }
    }


    class TextureVO {
        public url: string;
        public texture: Texture2DBase;

        public TextureVO() {
        }
    }

    class MaterialVO {
        public name: string;
        public ambientColor: number;
        public diffuseColor: number;
        public specularColor: number;
        public twoSided: boolean;
        public colorMap: TextureVO;
        public specularMap: TextureVO;
        public material: MaterialBase;

        public MaterialVO() {
        }
    }

    class ObjectVO {
        public name: string;
        public type: string;
        public pivotX: number;
        public pivotY: number;
        public pivotZ: number;
        public transform: number[];
        public verts: number[];
        public indices: number[];
        public uvs: number[];
        public materialFaces: Object;
        public materials: string[];
        public smoothingGroups: number[];

        public ObjectVO() {
        }
    }

    class VertexVO {
        public x: number;
        public y: number;
        public z: number;
        public u: number;
        public v: number;
        public normal: Vector3D;
        public tangent: Vector3D;

        public VertexVO() {
        }
    }

    class FaceVO {
        public a: number;
        public b: number;
        public c: number;
        public smoothGroup: number;

        public FaceVO() {
        }
    }
}




