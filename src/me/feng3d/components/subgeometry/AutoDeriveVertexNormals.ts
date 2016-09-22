module feng3d {




	/**
	 * 自动生成顶点法线数据
	 * @author feng 2015-12-8
	 */
    export class AutoDeriveVertexNormals extends SubGeometryComponent {
        /** 面法线脏标记 */
        private _faceNormalsDirty: boolean = true;

        private _faceNormals: number[];

        /** 是否使用面权重 */
        private _useFaceWeights: boolean = false;

        /** 面权重 */
        private _faceWeights: number[];

        private dataTypeId: string;
        private target: number[];
        private needGenerate: boolean;

        constructor() {
            super();

            this.dataTypeId = this._.normal_va_3;
        }

        protected set subGeometry(value: SubGeometry) {
            if (this._subGeometry != null) {
                this._subGeometry.removeEventListener(GeometryComponentEvent.GET_VA_DATA, this.onGetVAData);
                this._subGeometry.removeEventListener(GeometryComponentEvent.CHANGED_VA_DATA, this.onChangedVAData);
                this._subGeometry.removeEventListener(GeometryComponentEvent.CHANGED_INDEX_DATA, this.onChangedIndexData);
            }
            this._subGeometry = value;
            if (this._subGeometry != null) {
                this._subGeometry.addEventListener(GeometryComponentEvent.GET_VA_DATA, this.onGetVAData);
                this._subGeometry.addEventListener(GeometryComponentEvent.CHANGED_VA_DATA, this.onChangedVAData);
                this._subGeometry.addEventListener(GeometryComponentEvent.CHANGED_INDEX_DATA, this.onChangedIndexData);
            }
        }

		/**
		 * 处理被添加事件
		 * @param event
		 */
        protected onBeAddedComponet(event: ComponentEvent) {
            super.onBeAddedComponet(event);

            this.needGenerate = true;
            this.subGeometry.invalidVAData(this.dataTypeId);
        }

        protected onGetVAData(event: GeometryComponentEvent) {
            if (event.data != this.dataTypeId)
                return;
            if (!this.needGenerate)
                return;

            this.target = this.updateVertexNormals(this.target);
            this.subGeometry.setVAData(this.dataTypeId, this.target);

            this.needGenerate = false;
        }

        protected onChangedVAData(event: GeometryComponentEvent) {
            if (event.data == this._.position_va_3) {
                this.needGenerate = true;

                //标记面法线脏数据
                this._faceNormalsDirty = true;

                this.subGeometry.invalidVAData(this.dataTypeId);
            }
        }

        protected onChangedIndexData(event: GeometryComponentEvent) {
            this._faceNormalsDirty = true;

            this.subGeometry.invalidVAData(this.dataTypeId);
        }

        /** 面法线 */
        public get faceNormals(): number[] {
            if (this._faceNormalsDirty)
                this.updateFaceNormals();
            return this._faceNormals;
        }

		/**
		 * Indicates whether or not to take the size of faces into account when auto-deriving vertex normals and tangents.
		 */
        public get useFaceWeights(): boolean {
            return this._useFaceWeights;
        }

        public set useFaceWeights(value: boolean) {
            this._useFaceWeights = value;

            this.subGeometry.invalidVAData(this.dataTypeId);

            this._faceNormalsDirty = true;
        }

        /** 更新面法线数据 */
        private updateFaceNormals() {
            var i: number, j: number, k: number;
            var index: number;
            var _indices: number[] = this.subGeometry.indices;
            var len: number = _indices.length;
            var x1: number, x2: number, x3: number;
            var y1: number, y2: number, y3: number;
            var z1: number, z2: number, z3: number;
            var dx1: number, dy1: number, dz1: number;
            var dx2: number, dy2: number, dz2: number;
            var cx: number, cy: number, cz: number;
            var d: number;
            var vertices: number[] = this.subGeometry.getVAData(this._.position_va_3);
            var posStride: number = 3;
            var posOffset: number = 0;

            if (this._faceNormals == null) {
                this._faceNormals = [];
                this._faceNormals.length = len;
            }
            if (this._useFaceWeights) {
                if (this._faceWeights == null) {
                    this._faceWeights = [];
                    this._faceWeights.length = len / 3;
                }
            }

            while (i < len) {
                index = posOffset + _indices[i++] * posStride;
                x1 = vertices[index];
                y1 = vertices[index + 1];
                z1 = vertices[index + 2];
                index = posOffset + _indices[i++] * posStride;
                x2 = vertices[index];
                y2 = vertices[index + 1];
                z2 = vertices[index + 2];
                index = posOffset + _indices[i++] * posStride;
                x3 = vertices[index];
                y3 = vertices[index + 1];
                z3 = vertices[index + 2];
                dx1 = x3 - x1;
                dy1 = y3 - y1;
                dz1 = z3 - z1;
                dx2 = x2 - x1;
                dy2 = y2 - y1;
                dz2 = z2 - z1;
                cx = dz1 * dy2 - dy1 * dz2;
                cy = dx1 * dz2 - dz1 * dx2;
                cz = dy1 * dx2 - dx1 * dy2;
                d = Math.sqrt(cx * cx + cy * cy + cz * cz);
                // length of cross product = 2*triangle area
                if (this._useFaceWeights) {
                    var w: number = d * 10000;
                    if (w < 1)
                        w = 1;
                    this._faceWeights[k++] = w;
                }
                d = 1 / d;
                this._faceNormals[j++] = cx * d;
                this._faceNormals[j++] = cy * d;
                this._faceNormals[j++] = cz * d;
            }

            this._faceNormalsDirty = false;
        }

		/**
		 * 更新顶点法线数据
		 * @param target 顶点法线数据
		 * @return 顶点法线数据
		 */
        private updateVertexNormals(target: number[]): number[] {
            if (this._faceNormalsDirty)
                this.updateFaceNormals();

            var v1: number;
            var f1: number = 0, f2: number = 1, f3: number = 2;
            var lenV: number = this.subGeometry.numVertices * 3;
            var normalStride: number = 3;
            var normalOffset: number = 0;

            if (target == null) {
                target = [];
                target.length = lenV;
            }
            v1 = normalOffset;
            while (v1 < lenV) {
                target[v1] = 0.0;
                target[v1 + 1] = 0.0;
                target[v1 + 2] = 0.0;
                v1 += normalStride;
            }

            var i: number, k: number;
            var _indices: number[] = this.subGeometry.indices;
            var lenI: number = _indices.length;
            var index: number;
            var weight: number;

            while (i < lenI) {
                weight = this._useFaceWeights ? this._faceWeights[k++] : 1;
                index = normalOffset + _indices[i++] * normalStride;
                target[index++] += this._faceNormals[f1] * weight;
                target[index++] += this._faceNormals[f2] * weight;
                target[index] += this._faceNormals[f3] * weight;
                index = normalOffset + _indices[i++] * normalStride;
                target[index++] += this._faceNormals[f1] * weight;
                target[index++] += this._faceNormals[f2] * weight;
                target[index] += this._faceNormals[f3] * weight;
                index = normalOffset + _indices[i++] * normalStride;
                target[index++] += this._faceNormals[f1] * weight;
                target[index++] += this._faceNormals[f2] * weight;
                target[index] += this._faceNormals[f3] * weight;
                f1 += 3;
                f2 += 3;
                f3 += 3;
            }

            v1 = normalOffset;
            while (v1 < lenV) {
                var vx: number = target[v1];
                var vy: number = target[v1 + 1];
                var vz: number = target[v1 + 2];
                var d: number = 1.0 / Math.sqrt(vx * vx + vy * vy + vz * vz);
                target[v1] = vx * d;
                target[v1 + 1] = vy * d;
                target[v1 + 2] = vz * d;
                v1 += normalStride;
            }

            return target;
        }
    }
}
