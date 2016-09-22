module feng3d {

	/**
	 * A Cube primitive mesh.
	 */
    export class CubeGeometry extends PrimitiveBase {
        private _width: number;
        private _height: number;
        private _depth: number;
        private _tile6: boolean;

        private _segmentsW: number;
        private _segmentsH: number;
        private _segmentsD: number;

		/**
		 * Creates a new Cube object.
		 * @param width The size of the cube along its X-axis.
		 * @param height The size of the cube along its Y-axis.
		 * @param depth The size of the cube along its Z-axis.
		 * @param segmentsW The number of segments that make up the cube along the X-axis.
		 * @param segmentsH The number of segments that make up the cube along the Y-axis.
		 * @param segmentsD The number of segments that make up the cube along the Z-axis.
		 * @param tile6 The type of uv mapping to use. When true, a texture will be subdivided in a 2x3 grid, each used for a single face. When false, the entire image is mapped on each face.
		 */
        constructor(width: number = 100, height: number = 100, depth: number = 100, segmentsW: number = 1, segmentsH: number = 1, segmentsD: number = 1, tile6: boolean = true) {
            super();

            this._width = width;
            this._height = height;
            this._depth = depth;
            this._segmentsW = segmentsW;
            this._segmentsH = segmentsH;
            this._segmentsD = segmentsD;
            this._tile6 = tile6;
        }

		/**
		 * The size of the cube along its X-axis.
		 */
        public get width(): number {
            return this._width;
        }

        public set width(value: number) {
            this._width = value;
            this.invalidateGeometry();
        }

		/**
		 * The size of the cube along its Y-axis.
		 */
        public get height(): number {
            return this._height;
        }

        public set height(value: number) {
            this._height = value;
            this.invalidateGeometry();
        }

		/**
		 * The size of the cube along its Z-axis.
		 */
        public get depth(): number {
            return this._depth;
        }

        public set depth(value: number) {
            this._depth = value;
            this.invalidateGeometry();
        }

		/**
		 * The type of uv mapping to use. When false, the entire image is mapped on each face.
		 * When true, a texture will be subdivided in a 3x2 grid, each used for a single face.
		 * Reading the tiles from left to right, top to bottom they represent the faces of the
		 * cube in the following order: bottom, top, back, left, front, right. This creates
		 * several shared edges (between the top, front, left and right faces) which simplifies
		 * texture painting.
		 */
        public get tile6(): boolean {
            return this._tile6;
        }

        public set tile6(value: boolean) {
            this._tile6 = value;
            this.invalidateUVs();
        }

		/**
		 * The number of segments that make up the cube along the X-axis. Defaults to 1.
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
		 * The number of segments that make up the cube along the Y-axis. Defaults to 1.
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
		 * The number of segments that make up the cube along the Z-axis. Defaults to 1.
		 */
        public get segmentsD(): number {
            return this._segmentsD;
        }

        public set segmentsD(value: number) {
            this._segmentsD = value;
            this.invalidateGeometry();
            this.invalidateUVs();
        }

		/**
		 * @inheritDoc
		 */
        protected buildGeometry(target: SubGeometry) {
            var vertexPositionData: number[];
            var vertexNormalData: number[];
            var vertexTangentData: number[];
            var indices: number[];

            var tl: number, tr: number, bl: number, br: number;
            var i: number, j: number, inc: number = 0;


            var hw: number, hh: number, hd: number; // halves
            var dw: number, dh: number, dd: number; // deltas

            var outer_pos: number;

            var numVerts: number = ((this._segmentsW + 1) * (this._segmentsH + 1) + (this._segmentsW + 1) * (this._segmentsD + 1) + (this._segmentsH + 1) * (this._segmentsD + 1)) * 2;
            var vertexPositionStride: number = target.vertexPositionStride;
            var vertexNormalStride: number = target.vertexNormalStride;
            var vertexTangentStride: number = target.vertexTangentStride;

            if (numVerts == target.numVertices) {
                vertexPositionData = target.vertexPositionData;
                vertexNormalData = target.vertexNormalData;
                vertexTangentData = target.vertexTangentData;
                indices = target.indexData || [];
                indices.length = (this._segmentsW * this._segmentsH + this._segmentsW * this._segmentsD + this._segmentsH * this._segmentsD) * 12;
            }
            else {
                vertexPositionData = [];
                vertexPositionData.length = numVerts * vertexPositionStride;
                vertexNormalData = [];
                vertexNormalData.length = numVerts * vertexNormalStride;
                vertexTangentData = [];
                vertexTangentData.length = numVerts * vertexTangentStride;
                indices = [];
                indices.length = (this._segmentsW * this._segmentsH + this._segmentsW * this._segmentsD + this._segmentsH * this._segmentsD) * 12;
                this.invalidateUVs();
            }

            // Indices
            var positionIndex: number = 0;
            var normalIndex: number = 0;
            var tangentIndex: number = 0;

            var fidx: number = 0;

            // half cube dimensions
            hw = this._width / 2;
            hh = this._height / 2;
            hd = this._depth / 2;

            // Segment dimensions
            dw = this._width / this._segmentsW;
            dh = this._height / this._segmentsH;
            dd = this._depth / this._segmentsD;

            for (i = 0; i <= this._segmentsW; i++) {
                outer_pos = -hw + i * dw;

                for (j = 0; j <= this._segmentsH; j++) {
                    // front
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexPositionData[positionIndex++] = -hh + j * dh;
                    vertexPositionData[positionIndex++] = -hd;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = -1;
                    vertexTangentData[tangentIndex++] = 1;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;

                    // back
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexPositionData[positionIndex++] = -hh + j * dh;
                    vertexPositionData[positionIndex++] = hd;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 1;
                    vertexTangentData[tangentIndex++] = -1;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;

                    if (i && j) {
                        tl = 2 * ((i - 1) * (this._segmentsH + 1) + (j - 1));
                        tr = 2 * (i * (this._segmentsH + 1) + (j - 1));
                        bl = tl + 2;
                        br = tr + 2;

                        indices[fidx++] = tl;
                        indices[fidx++] = bl;
                        indices[fidx++] = br;
                        indices[fidx++] = tl;
                        indices[fidx++] = br;
                        indices[fidx++] = tr;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = br + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tl + 1;
                    }
                }
            }

            inc += 2 * (this._segmentsW + 1) * (this._segmentsH + 1);

            for (i = 0; i <= this._segmentsW; i++) {
                outer_pos = -hw + i * dw;

                for (j = 0; j <= this._segmentsD; j++) {
                    // top
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexPositionData[positionIndex++] = hh;
                    vertexPositionData[positionIndex++] = -hd + j * dd;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 1;
                    vertexNormalData[normalIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 1;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;

                    // bottom
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexPositionData[positionIndex++] = -hh;
                    vertexPositionData[positionIndex++] = -hd + j * dd;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = -1;
                    vertexNormalData[normalIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 1;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;

                    if (i && j) {
                        tl = inc + 2 * ((i - 1) * (this._segmentsD + 1) + (j - 1));
                        tr = inc + 2 * (i * (this._segmentsD + 1) + (j - 1));
                        bl = tl + 2;
                        br = tr + 2;

                        indices[fidx++] = tl;
                        indices[fidx++] = bl;
                        indices[fidx++] = br;
                        indices[fidx++] = tl;
                        indices[fidx++] = br;
                        indices[fidx++] = tr;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = br + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tl + 1;
                    }
                }
            }

            inc += 2 * (this._segmentsW + 1) * (this._segmentsD + 1);

            for (i = 0; i <= this._segmentsD; i++) {
                outer_pos = hd - i * dd;

                for (j = 0; j <= this._segmentsH; j++) {
                    // left
                    vertexPositionData[positionIndex++] = -hw;
                    vertexPositionData[positionIndex++] = -hh + j * dh;
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexNormalData[normalIndex++] = -1;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = -1;

                    // right
                    vertexPositionData[positionIndex++] = hw;
                    vertexPositionData[positionIndex++] = -hh + j * dh;
                    vertexPositionData[positionIndex++] = outer_pos;
                    vertexNormalData[normalIndex++] = 1;
                    vertexNormalData[normalIndex++] = 0;
                    vertexNormalData[normalIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 0;
                    vertexTangentData[tangentIndex++] = 1;

                    if (i && j) {
                        tl = inc + 2 * ((i - 1) * (this._segmentsH + 1) + (j - 1));
                        tr = inc + 2 * (i * (this._segmentsH + 1) + (j - 1));
                        bl = tl + 2;
                        br = tr + 2;

                        indices[fidx++] = tl;
                        indices[fidx++] = bl;
                        indices[fidx++] = br;
                        indices[fidx++] = tl;
                        indices[fidx++] = br;
                        indices[fidx++] = tr;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = br + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tl + 1;
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
            var i: number, j: number, uidx: number;
            var data: number[];

            var u_tile_dim: number, v_tile_dim: number;
            var u_tile_step: number, v_tile_step: number;
            var tl0u: number, tl0v: number;
            var tl1u: number, tl1v: number;
            var du: number, dv: number;
            var stride: number = target.UVStride;
            var numUvs: number = ((this._segmentsW + 1) * (this._segmentsH + 1) + (this._segmentsW + 1) * (this._segmentsD + 1) + (this._segmentsH + 1) * (this._segmentsD + 1)) * 2 * stride;
            var skip: number = stride - 2;

            data = target.UVData;
            if (data == null || numUvs != data.length) {
                data = [];
                data.length = numUvs;
                this.invalidateGeometry();
            }

            if (this._tile6) {
                u_tile_dim = u_tile_step = 1 / 3;
                v_tile_dim = v_tile_step = 1 / 2;
            }
            else {
                u_tile_dim = v_tile_dim = 1;
                u_tile_step = v_tile_step = 0;
            }

            // Create planes two and two, the same way that they were
            // constructed in the this.buildGeometry() function. First calculate
            // the top-left UV coordinate for both planes, and then loop
            // over the points, calculating the UVs from these numbers.

            // When this.tile6 is true, the layout is as follows:
            //       .-----.-----.-----. (1,1)
            //       | Bot |  T  | Bak |
            //       |-----+-----+-----|
            //       |  L  |  F  |  R  |
            // (0,0)'-----'-----'-----'

            uidx = 0;

            // FRONT / BACK
            tl0u = 1 * u_tile_step;
            tl0v = 1 * v_tile_step;
            tl1u = 2 * u_tile_step;
            tl1v = 0 * v_tile_step;
            du = u_tile_dim / this._segmentsW;
            dv = v_tile_dim / this._segmentsH;
            for (i = 0; i <= this._segmentsW; i++) {
                for (j = 0; j <= this._segmentsH; j++) {
                    data[uidx++] = tl0u + i * du;
                    data[uidx++] = tl0v + (v_tile_dim - j * dv);
                    uidx += skip;
                    data[uidx++] = tl1u + (u_tile_dim - i * du);
                    data[uidx++] = tl1v + (v_tile_dim - j * dv);
                    uidx += skip;
                }
            }

            // TOP / BOTTOM
            tl0u = 1 * u_tile_step;
            tl0v = 0 * v_tile_step;
            tl1u = 0 * u_tile_step;
            tl1v = 0 * v_tile_step;
            du = u_tile_dim / this._segmentsW;
            dv = v_tile_dim / this._segmentsD;
            for (i = 0; i <= this._segmentsW; i++) {
                for (j = 0; j <= this._segmentsD; j++) {
                    data[uidx++] = tl0u + i * du;
                    data[uidx++] = tl0v + (v_tile_dim - j * dv);
                    uidx += skip;
                    data[uidx++] = tl1u + i * du;
                    data[uidx++] = tl1v + j * dv;
                    uidx += skip;
                }
            }

            // LEFT / RIGHT
            tl0u = 0 * u_tile_step;
            tl0v = 1 * v_tile_step;
            tl1u = 2 * u_tile_step;
            tl1v = 1 * v_tile_step;
            du = u_tile_dim / this._segmentsD;
            dv = v_tile_dim / this._segmentsH;
            for (i = 0; i <= this._segmentsD; i++) {
                for (j = 0; j <= this._segmentsH; j++) {
                    data[uidx++] = tl0u + i * du;
                    data[uidx++] = tl0v + (v_tile_dim - j * dv);
                    uidx += skip;
                    data[uidx++] = tl1u + (u_tile_dim - i * du);
                    data[uidx++] = tl1v + (v_tile_dim - j * dv);
                    uidx += skip;
                }
            }

            target.updateUVData(data);
        }
    }
}
