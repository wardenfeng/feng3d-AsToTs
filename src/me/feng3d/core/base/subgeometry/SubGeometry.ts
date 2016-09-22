module feng3d {
	/**
	 * 获取几何体顶点数据时触发
	 */
    //[Event(name = "getVAData", type = "me.feng3d.events.GeometryComponentEvent")]

	/**
	 * 改变几何体顶点数据后触发
	 */
    //[Event(name = "changedVAData", type = "me.feng3d.events.GeometryComponentEvent")]

	/**
	 * 改变顶点索引数据后触发
	 */
    //[Event(name = "changedIndexData", type = "me.feng3d.events.GeometryComponentEvent")]

	/**
	 * 子几何体
	 */
    export class SubGeometry extends VertexBufferOwner {
        private _parent: Geometry;

        protected _indices: number[];

        protected _numIndices: number;
        protected _numTriangles: number;

		/**
		 * 创建一个新几何体
		 */
        constructor() {
            super();

            this.initBuffers();
        }

        protected initBuffers() {
            this.context3DBufferOwner.mapContext3DBuffer(this._.index, this.updateIndexBuffer);

            this.mapVABuffer(this._.position_va_3, 3);
            this.mapVABuffer(this._.uv_va_2, 2);
            this.mapVABuffer(this._.normal_va_3, 3);
            this.mapVABuffer(this._.tangent_va_3, 3);
        }

		/**
		 * 更新索引数据
		 * @param indexBuffer 索引缓存
		 */
        protected updateIndexBuffer(indexBuffer: IndexBuffer) {
            indexBuffer.update(this.indices, this.numIndices, this.numIndices);
        }

		/**
		 * 可绘制三角形的个数
		 */
        public get numTriangles(): number {
            return this._numTriangles;
        }

		/**
		 * 销毁
		 */
        public dispose() {
            this._indices = null;
        }

		/**
		 * 顶点索引数据
		 */
        public get indexData(): number[] {
            if (this._indices == null)
                this._indices = [];
            return this._indices;
        }

		/**
		 * 索引数量
		 */
        public get numIndices(): number {
            return this._numIndices;
        }

		/**
		 * 索引数据
		 */
        public get indices(): number[] {
            return this._indices;
        }

		/**
		 * 更新顶点索引数据
		 */
        public updateIndexData(indices: number[]) {
            this._indices = indices;
            this._numIndices = indices.length;

            var numTriangles: number = this._numIndices / 3;
            this._numTriangles = numTriangles;

            this.context3DBufferOwner.markBufferDirty(this._.index);

            this.dispatchEvent(new GeometryComponentEvent(GeometryComponentEvent.CHANGED_INDEX_DATA));
        }

        public fromVectors(vertices: number[], uvs: number[]) {
            this.updateVertexPositionData(vertices);

            this.updateUVData(uvs);
        }

		/**
		 * 应用变换矩阵
		 * @param transform 变换矩阵
		 */
        public applyTransformation(transform: Matrix3D) {
            var vertices: number[] = this.vertexPositionData;
            var normals: number[] = this.vertexNormalData;
            var tangents: number[] = this.vertexTangentData;

            var posStride: number = this.vertexPositionStride;
            var normalStride: number = this.vertexNormalStride;
            var tangentStride: number = this.vertexTangentStride;

            var len: number = vertices.length / posStride;
            var i: number, i1: number, i2: number;
            var vector: Vector3D = new Vector3D();

            var bakeNormals: boolean = normals != null;
            var bakeTangents: boolean = tangents != null;
            var invTranspose: Matrix3D;

            if (bakeNormals || bakeTangents) {
                invTranspose = transform.clone();
                invTranspose.invert();
                invTranspose.transpose();
            }

            var vi0: number = 0;
            var ni0: number = 0;
            var ti0: number = 0;

            for (i = 0; i < len; ++i) {
                i1 = vi0 + 1;
                i2 = vi0 + 2;

                // bake position
                vector.x = vertices[vi0];
                vector.y = vertices[i1];
                vector.z = vertices[i2];
                vector = transform.transformVector(vector);
                vertices[vi0] = vector.x;
                vertices[i1] = vector.y;
                vertices[i2] = vector.z;
                vi0 += posStride;

                // bake normal
                if (bakeNormals) {
                    i1 = ni0 + 1;
                    i2 = ni0 + 2;
                    vector.x = normals[ni0];
                    vector.y = normals[i1];
                    vector.z = normals[i2];
                    vector = invTranspose.deltaTransformVector(vector);
                    vector.normalize();
                    normals[ni0] = vector.x;
                    normals[i1] = vector.y;
                    normals[i2] = vector.z;
                    ni0 += normalStride;
                }

                // bake tangent
                if (bakeTangents) {
                    i1 = ti0 + 1;
                    i2 = ti0 + 2;
                    vector.x = tangents[ti0];
                    vector.y = tangents[i1];
                    vector.z = tangents[i2];
                    vector = invTranspose.deltaTransformVector(vector);
                    vector.normalize();
                    tangents[ti0] = vector.x;
                    tangents[i1] = vector.y;
                    tangents[i2] = vector.z;
                    ti0 += tangentStride;
                }
            }

            this.context3DBufferOwner.markBufferDirty(this._.position_va_3);
            this.context3DBufferOwner.markBufferDirty(this._.normal_va_3);
            this.context3DBufferOwner.markBufferDirty(this._.tangent_va_3);
        }

		/**
		 * 更新uv数据
		 * @param data	uv数据
		 */
        public updateUVData(data: number[]) {
            this.setVAData(this._.uv_va_2, data);
        }

		/**
		 * 更新顶点数据
		 */
        public updateVertexPositionData(data: number[]) {
            this.setVAData(this._.position_va_3, data);

            this.dispatchEvent(new GeometryEvent(GeometryEvent.SHAPE_CHANGE, this, true));
        }

		/**
		 * 更新顶点法线数据
		 * @param vertexNormals 顶点法线数据
		 */
        public updateVertexNormalData(vertexNormals: number[]) {
            this.setVAData(this._.normal_va_3, vertexNormals);
        }

		/**
		 * 更新顶点切线数据
		 * @param vertexTangents 顶点切线数据
		 */
        public updateVertexTangentData(vertexTangents: number[]) {
            this.setVAData(this._.tangent_va_3, vertexTangents);
        }

		/**
		 * 顶点数据
		 */
        public get vertexPositionData(): number[] {
            return this.getVAData(this._.position_va_3);
        }

		/**
		 * 顶点法线数据
		 */
        public get vertexNormalData(): number[] {
            return this.getVAData(this._.normal_va_3);
        }

		/**
		 * 顶点切线数据
		 */
        public get vertexTangentData(): number[] {
            return this.getVAData(this._.tangent_va_3);
        }

		/**
		 * uv数据
		 */
        public get UVData(): number[] {
            return this.getVAData(this._.uv_va_2);
        }

		/**
		 * 顶点坐标数据步长
		 */
        public get vertexPositionStride(): number {
            return this.getVALen(this._.position_va_3);
        }

		/**
		 * 顶点切线步长
		 */
        public get vertexTangentStride(): number {
            return this.getVALen(this._.tangent_va_3);
        }

		/**
		 * 顶点法线步长
		 */
        public get vertexNormalStride(): number {
            return this.getVALen(this._.normal_va_3);
        }

		/**
		 * UV步长
		 */
        public get UVStride(): number {
            return this.getVALen(this._.uv_va_2);
        }

        protected notifyVADataChanged(dataTypeId: string) {
            super.notifyVADataChanged(dataTypeId);

            this.dispatchEvent(new GeometryComponentEvent(GeometryComponentEvent.CHANGED_VA_DATA, dataTypeId));
        }

        public getVAData(dataTypeId: string): number[] {
            this.dispatchEvent(new GeometryComponentEvent(GeometryComponentEvent.GET_VA_DATA, dataTypeId));

            return super.getVAData(dataTypeId);
        }

        public clone(): SubGeometry {
            var cls = getDefinitionByName(getQualifiedClassName(this));
            var _clone: SubGeometry = new cls();

            //顶点属性编号列表
            var vaId: string;

            /** 顶点数据字典 */
            var sourceVertexDataDic = {};

            this.vaIdList.forEach(vaId => {
                sourceVertexDataDic[vaId] = this.getVAData(vaId);
                assert(sourceVertexDataDic[vaId].length == this.getVALen(vaId) * this.numVertices);
            });


            //添加索引数据
            _clone.updateIndexData(this.indices.concat());

            //更改顶点数量
            _clone.numVertices = this.numVertices;

            //添加顶点数据
            this.vaIdList.forEach(vaId => {
                _clone.setVAData(vaId, sourceVertexDataDic[vaId].concat());
            });

            return _clone;
        }

		/**
		 * 父网格
		 */
        public get parent(): Geometry {
            return this._parent;
        }

        public set parent(value: Geometry) {
            this._parent = value;
        }
    }
}
