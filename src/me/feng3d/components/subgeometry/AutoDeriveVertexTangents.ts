module feng3d {




	/**
	 * 自动生成切线组件
	 * @author feng 2014-12-19
	 */
    export class AutoDeriveVertexTangents extends SubGeometryComponent {
        /** 面切线脏标记 */
        private _faceTangentsDirty: boolean = true;

        /** 是否使用面权重 */
        private _useFaceWeights: boolean = false;

        private _faceTangents: number[];
        /** 面权重 */
        private _faceWeights: number[];

        private dataTypeId: string;
        private target: number[];
        private needGenerate: boolean;

        constructor() {
            super();
            this.dataTypeId = this._.tangent_va_3;

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

            this.target = this.updateVertexTangents(this.target);
            this.subGeometry.setVAData(this.dataTypeId, this.target);

            this.needGenerate = false;
        }

        protected onChangedVAData(event: GeometryComponentEvent) {
            if (event.data == this._.position_va_3) {
                this.needGenerate = true;

                //标记面切线脏数据
                this._faceTangentsDirty = true;

                this.subGeometry.invalidVAData(this._.tangent_va_3);
            }
        }

        protected onChangedIndexData(event: GeometryComponentEvent) {
            this._faceTangentsDirty = true;

            this.subGeometry.invalidVAData(this._.tangent_va_3);
        }

        /** 面切线 */
        public get faceTangents(): number[] {
            if (this._faceTangentsDirty)
                this.updateFaceTangents();
            return this._faceTangents;
        }

		/**
		 * Indicates whether or not to take the size of faces into account when auto-deriving vertex normals and tangents.
		 */
        public get useFaceWeights(): boolean {
            return this._useFaceWeights;
        }

        public set useFaceWeights(value: boolean) {
            this._useFaceWeights = value;

            this.subGeometry.invalidVAData(this._.tangent_va_3);
        }

        /** 更新面切线数据 */
        private updateFaceTangents() {
            var i: number;
            var index1: number, index2: number, index3: number;
            var _indices: number[] = this.subGeometry.indices;
            var len: number = _indices.length;
            var ui: number, vi: number;
            var v0: number;
            var dv1: number, dv2: number;
            var denom: number;
            var x0: number, y0: number, z0: number;
            var dx1: number, dy1: number, dz1: number;
            var dx2: number, dy2: number, dz2: number;
            var cx: number, cy: number, cz: number;
            var vertices: number[] = this.subGeometry.getVAData(this._.position_va_3);
            var uvs: number[] = this.subGeometry.getVAData(this._.uv_va_2);
            var posStride: number = this.subGeometry.getVALen(this._.position_va_3);
            var posOffset: number = 0;
            var texStride: number = this.subGeometry.getVALen(this._.uv_va_2);
            var texOffset: number = 0;

            if (this._faceTangents == null) {
                this._faceTangents = [];
                this._faceTangents.length = _indices.length;
            }

            while (i < len) {
                index1 = _indices[i];
                index2 = _indices[i + 1];
                index3 = _indices[i + 2];

                ui = texOffset + index1 * texStride + 1;
                v0 = uvs[ui];
                ui = texOffset + index2 * texStride + 1;
                dv1 = uvs[ui] - v0;
                ui = texOffset + index3 * texStride + 1;
                dv2 = uvs[ui] - v0;

                vi = posOffset + index1 * posStride;
                x0 = vertices[vi];
                y0 = vertices[vi + 1];
                z0 = vertices[vi + 2];
                vi = posOffset + index2 * posStride;
                dx1 = vertices[vi] - x0;
                dy1 = vertices[vi + 1] - y0;
                dz1 = vertices[vi + 2] - z0;
                vi = posOffset + index3 * posStride;
                dx2 = vertices[vi] - x0;
                dy2 = vertices[vi + 1] - y0;
                dz2 = vertices[vi + 2] - z0;

                cx = dv2 * dx1 - dv1 * dx2;
                cy = dv2 * dy1 - dv1 * dy2;
                cz = dv2 * dz1 - dv1 * dz2;
                denom = 1 / Math.sqrt(cx * cx + cy * cy + cz * cz);
                this._faceTangents[i++] = denom * cx;
                this._faceTangents[i++] = denom * cy;
                this._faceTangents[i++] = denom * cz;
            }

            this._faceTangentsDirty = false;
        }

		/**
		 * 更新顶点切线数据
		 * @param target 顶点切线数据
		 * @return 顶点切线数据
		 */
        protected updateVertexTangents(target: number[]): number[] {
            if (this._faceTangentsDirty)
                this.updateFaceTangents();

            var i: number;
            var lenV: number = this.subGeometry.numVertices * 3;
            var tangentStride: number = 3;
            var tangentOffset: number = 0;

            if (target == null) {
                target = [];
                target.length = lenV;
            }

            i = tangentOffset;
            while (i < lenV) {
                target[i] = 0.0;
                target[i + 1] = 0.0;
                target[i + 2] = 0.0;
                i += tangentStride;
            }

            var k: number;
            var _indices: number[] = this.subGeometry.indices;
            var lenI: number = _indices.length;
            var index: number;
            var weight: number;
            var f1: number = 0, f2: number = 1, f3: number = 2;

            i = 0;

            while (i < lenI) {
                weight = this._useFaceWeights ? this._faceWeights[k++] : 1;
                index = tangentOffset + _indices[i++] * tangentStride;
                target[index++] += this._faceTangents[f1] * weight;
                target[index++] += this._faceTangents[f2] * weight;
                target[index] += this._faceTangents[f3] * weight;
                index = tangentOffset + _indices[i++] * tangentStride;
                target[index++] += this._faceTangents[f1] * weight;
                target[index++] += this._faceTangents[f2] * weight;
                target[index] += this._faceTangents[f3] * weight;
                index = tangentOffset + _indices[i++] * tangentStride;
                target[index++] += this._faceTangents[f1] * weight;
                target[index++] += this._faceTangents[f2] * weight;
                target[index] += this._faceTangents[f3] * weight;
                f1 += 3;
                f2 += 3;
                f3 += 3;
            }

            i = tangentOffset;
            while (i < lenV) {
                var vx: number = target[i];
                var vy: number = target[i + 1];
                var vz: number = target[i + 2];
                var d: number = 1.0 / Math.sqrt(vx * vx + vy * vy + vz * vz);
                target[i] = vx * d;
                target[i + 1] = vy * d;
                target[i + 2] = vz * d;
                i += tangentStride;
            }

            return target;
        }
    }
}
