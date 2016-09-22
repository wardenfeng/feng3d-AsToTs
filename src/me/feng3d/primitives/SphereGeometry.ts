module feng3d {

	/**
	 * 球体网格
	 */
    export class SphereGeometry extends PrimitiveBase {
        private _radius: number;
        private _segmentsW: number;
        private _segmentsH: number;
        private _yUp: boolean;

		/**
		 * 创建一个球体
		 * @param radius 半径
		 * @param segmentsW 横向分割数，默认值16
		 * @param segmentsH 纵向分割数，默认值12
		 * @param yUp 球体朝向 true:Y+ false:Z+
		 */
        constructor(radius: number = 50, segmentsW: number = 16, segmentsH: number = 12, yUp: boolean = true) {
            super();

            this._radius = radius;
            this._segmentsW = segmentsW;
            this._segmentsH = segmentsH;
            this._yUp = yUp;
        }

		/**
		 * @inheritDoc
		 */
        protected buildGeometry(target: SubGeometry) {
            var vertexPositionData: number[];
            var vertexNormalData: number[];
            var vertexTangentData: number[];
            var indices: number[];
            var i: number, j: number, triIndex: number;
            var numVerts: number = (this._segmentsH + 1) * (this._segmentsW + 1);

            var vertexPositionStride: number = target.vertexPositionStride;
            var vertexNormalStride: number = target.vertexNormalStride;
            var vertexTangentStride: number = target.vertexTangentStride;

            if (numVerts == target.numVertices) {
                vertexPositionData = target.vertexPositionData;
                vertexNormalData = target.vertexNormalData;
                vertexTangentData = target.vertexTangentData;
                indices = target.indexData || [];
                indices.length = (this._segmentsH - 1) * this._segmentsW * 6;
            }
            else {
                vertexPositionData = [];
                vertexPositionData.length = numVerts * vertexPositionStride;
                vertexNormalData = [];
                vertexNormalData.length = numVerts * vertexNormalStride;
                vertexTangentData = [];
                vertexTangentData.length = numVerts * vertexTangentStride;
                indices = [];
                indices.length = (this._segmentsH - 1) * this._segmentsW * 6;
                this.invalidateGeometry();
            }

            var startPositionIndex: number;
            var startNormalIndex: number;
            var positionIndex: number = 0;
            var normalIndex: number = 0;
            var tangentIndex: number = 0;
            var comp1: number, comp2: number, t1: number, t2: number;

            for (j = 0; j <= this._segmentsH; ++j) {
                startPositionIndex = positionIndex;
                startNormalIndex = normalIndex;

                var horangle: number = Math.PI * j / this._segmentsH;
                var z: number = -this._radius * Math.cos(horangle);
                var ringradius: number = this._radius * Math.sin(horangle);

                for (i = 0; i <= this._segmentsW; ++i) {
                    var verangle: number = 2 * Math.PI * i / this._segmentsW;
                    var x: number = ringradius * Math.cos(verangle);
                    var y: number = ringradius * Math.sin(verangle);
                    var normLen: number = 1 / Math.sqrt(x * x + y * y + z * z);
                    var tanLen: number = Math.sqrt(y * y + x * x);

                    if (this._yUp) {
                        t1 = 0;
                        t2 = tanLen > .007 ? x / tanLen : 0;
                        comp1 = -z;
                        comp2 = y;

                    }
                    else {
                        t1 = tanLen > .007 ? x / tanLen : 0;
                        t2 = 0;
                        comp1 = y;
                        comp2 = z;
                    }

                    if (i == this._segmentsW) {
                        vertexPositionData[positionIndex++] = vertexPositionData[startPositionIndex];
                        vertexPositionData[positionIndex++] = vertexPositionData[startPositionIndex + 1];
                        vertexPositionData[positionIndex++] = vertexPositionData[startPositionIndex + 2];
                        vertexNormalData[normalIndex++] = vertexNormalData[startNormalIndex] + (x * normLen) * .5;
                        vertexNormalData[normalIndex++] = vertexNormalData[startNormalIndex + 1] + (comp1 * normLen) * .5;
                        vertexNormalData[normalIndex++] = vertexNormalData[startNormalIndex + 2] + (comp2 * normLen) * .5;
                        vertexTangentData[tangentIndex++] = tanLen > .007 ? -y / tanLen : 1;
                        vertexTangentData[tangentIndex++] = t1;
                        vertexTangentData[tangentIndex++] = t2;
                    }
                    else {
                        vertexPositionData[positionIndex++] = x;
                        vertexPositionData[positionIndex++] = comp1;
                        vertexPositionData[positionIndex++] = comp2;
                        vertexNormalData[normalIndex++] = x * normLen;
                        vertexNormalData[normalIndex++] = comp1 * normLen;
                        vertexNormalData[normalIndex++] = comp2 * normLen;
                        vertexTangentData[tangentIndex++] = tanLen > .007 ? -y / tanLen : 1;
                        vertexTangentData[tangentIndex++] = t1;
                        vertexTangentData[tangentIndex++] = t2;
                    }

                    if (i > 0 && j > 0) {
                        var a: number = (this._segmentsW + 1) * j + i;
                        var b: number = (this._segmentsW + 1) * j + i - 1;
                        var c: number = (this._segmentsW + 1) * (j - 1) + i - 1;
                        var d: number = (this._segmentsW + 1) * (j - 1) + i;

                        if (j == this._segmentsH) {
                            indices[triIndex++] = a;
                            indices[triIndex++] = c;
                            indices[triIndex++] = d;

                        }
                        else if (j == 1) {
                            indices[triIndex++] = a;
                            indices[triIndex++] = b;
                            indices[triIndex++] = c;

                        }
                        else {
                            indices[triIndex++] = a;
                            indices[triIndex++] = b;
                            indices[triIndex++] = c;
                            indices[triIndex++] = a;
                            indices[triIndex++] = c;
                            indices[triIndex++] = d;
                        }
                    }
                }
            }

            target.numVertices = numVerts;
            target.updateVertexPositionData(vertexPositionData);
            target.updateVertexNormalData(vertexNormalData);
            target.updateVertexTangentData(vertexTangentData);
            target.updateIndexData(indices);
        }

		/**
		 * @inheritDoc
		 */
        protected buildUVs(target: SubGeometry) {
            var i: number, j: number;
            var stride: number = target.UVStride;
            var numUvs: number = (this._segmentsH + 1) * (this._segmentsW + 1) * stride;
            var data: number[];
            var skip: number = stride - 2;

            data = target.UVData;
            if (data == null || numUvs != data.length) {
                data = [];
                data.length = numUvs;
                this.invalidateGeometry();
            }

            var index: number = 0;
            for (j = 0; j <= this._segmentsH; ++j) {
                for (i = 0; i <= this._segmentsW; ++i) {
                    data[index++] = i / this._segmentsW;
                    data[index++] = j / this._segmentsH;
                    index += skip;
                }
            }

            target.updateUVData(data);
        }

		/**
		 * 半径
		 */
        public get radius(): number {
            return this._radius;
        }

        public set radius(value: number) {
            this._radius = value;
            this.invalidateGeometry();
        }

		/**
		 * 横向分割数，默认值16
		 */
        public get segmentsW(): number {
            return this._segmentsW;
        }

        public set segmentsW(value: number) {
            this._segmentsW = value;
            this.invalidateGeometry();
            this.invalidateUVs();
        }

		/**
		 * 纵向分割数，默认值12
		 */
        public get segmentsH(): number {
            return this._segmentsH;
        }

        public set segmentsH(value: number) {
            this._segmentsH = value;
            this.invalidateGeometry();
            this.invalidateUVs();
        }

		/**
		 * 球体朝向 true:Y+ false:Z+
		 */
        public get yUp(): boolean {
            return this._yUp;
        }

        public set yUp(value: boolean) {
            this._yUp = value;
            this.invalidateGeometry();
        }
    }
}
