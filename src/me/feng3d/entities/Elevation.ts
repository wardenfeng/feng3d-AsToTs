module feng3d {

	/**
	 * 高度地形
	 * @author feng 2014-7-16
	 */
    export class Elevation extends Mesh {
        private _segmentsW: number;
        private _segmentsH: number;
        private _width: number;
        private _height: number;
        private _depth: number;
        private _heightMap: BitmapData;
        private _minElevation: number;
        private _maxElevation: number;
        protected _geomDirty: boolean = true;
        protected _uvDirty: boolean = true;
        private _subGeometry: SubGeometry;

		/**
		 * 创建高度地形 拥有segmentsW*segmentsH个顶点
		 * @param    material	地形纹理
		 * @param    heightMap	高度图
		 * @param    width	地形宽度
		 * @param    height	地形高度
		 * @param    depth	地形深度
		 * @param    segmentsW	x轴上网格段数
		 * @param    segmentsH	y轴上网格段数
		 * @param    maxElevation	最大地形高度
		 * @param    minElevation	最小地形高度
		 * @param    smoothMap	是否平滑
		 */
        constructor(material: MaterialBase, heightMap: BitmapData, width: number = 1000, height: number = 100, depth: number = 1000, segmentsW: number = 30, segmentsH: number = 30, maxElevation: number = 255, minElevation: number = 0) {
            super(new Geometry(), material);
            this._subGeometry = new SubGeometry();
            this.geometry.addSubGeometry(this._subGeometry);

            this._heightMap = heightMap;
            this._segmentsW = segmentsW;
            this._segmentsH = segmentsH;
            this._width = width;
            this._height = height;
            this._depth = depth;
            this._maxElevation = maxElevation;
            this._minElevation = minElevation;

            this._subGeometry.numVertices = (this._segmentsH + 1) * (this._segmentsW + 1);

            this.buildUVs();
            this.buildGeometry();
        }


		/**
		 * 创建顶点坐标
		 */
        private buildGeometry() {
            var vertices: number[];
            var indices: number[];
            var x: number, z: number;
            var numInds: number;
            var base: number;
            //一排顶点数据
            var tw: number = this._segmentsW + 1;
            //总顶点数量
            var numVerts: number = (this._segmentsH + 1) * tw;
            //一个格子所占高度图X轴像素数
            var uDiv: number = (this._heightMap.width - 1) / this._segmentsW;
            //一个格子所占高度图Y轴像素数
            var vDiv: number = (this._heightMap.height - 1) / this._segmentsH;
            var u: number, v: number;
            var y: number;

            vertices = this._subGeometry.vertexPositionData;
            if (vertices == null) {
                vertices = [];
                vertices.length = numVerts * 3;
            }
            indices = this._subGeometry.indexData;
            if (indices == null) {
                indices = [];
                indices.length = this._segmentsH * this._segmentsW * 6;
            }

            numVerts = 0;
            var col: number;

            for (var zi: number = 0; zi <= this._segmentsH; ++zi) {
                for (var xi: number = 0; xi <= this._segmentsW; ++xi) {
                    //顶点坐标
                    x = (xi / this._segmentsW - .5) * this._width;
                    z = (zi / this._segmentsH - .5) * this._depth;
                    //格子对应高度图uv坐标
                    u = xi * uDiv;
                    v = (this._segmentsH - zi) * vDiv;

                    //获取颜色值
                    col = this._heightMap.getPixel(u, v) & 0xff;
                    //计算高度值
                    y = (col > this._maxElevation) ? (this._maxElevation / 0xff) * this._height : ((col < this._minElevation) ? (this._minElevation / 0xff) * this._height : (col / 0xff) * this._height);

                    //保存顶点坐标
                    vertices[numVerts++] = x;
                    vertices[numVerts++] = y;
                    vertices[numVerts++] = z;

                    if (xi != this._segmentsW && zi != this._segmentsH) {
                        //增加 一个顶点同时 生成一个格子或两个三角形
                        base = xi + zi * tw;
                        indices[numInds++] = base;
                        indices[numInds++] = base + tw;
                        indices[numInds++] = base + tw + 1;
                        indices[numInds++] = base;
                        indices[numInds++] = base + tw + 1;
                        indices[numInds++] = base + 1;
                    }
                }
            }

            this._subGeometry.updateVertexPositionData(vertices);
            this._subGeometry.updateIndexData(indices);
        }

		/**
		 * 创建uv坐标
		 */
        private buildUVs() {
            var uvs: number[] = [];
            var numUvs: number = (this._segmentsH + 1) * (this._segmentsW + 1) * 2;

            uvs = this._subGeometry.UVData;
            if (uvs == null || numUvs != uvs.length) {
                uvs = [];
                uvs.length = numUvs;
            }

            numUvs = 0;
            //计算每个顶点的uv坐标
            for (var yi: number = 0; yi <= this._segmentsH; ++yi) {
                for (var xi: number = 0; xi <= this._segmentsW; ++xi) {
                    uvs[numUvs++] = xi / this._segmentsW;
                    uvs[numUvs++] = 1 - yi / this._segmentsH;
                }
            }

            this._subGeometry.updateUVData(uvs);
        }

		/**
		 * 获取位置在（x，z）处的高度y值
		 * @param x x坐标
		 * @param z z坐标
		 * @return 高度
		 */
        public getHeightAt(x: number, z: number): number {
            //得到高度图中的值
            var u: number = (x / this._width + .5) * (this._heightMap.width - 1);
            var v: number = (-z / this._depth + .5) * (this._heightMap.height - 1);

            var col: number = this._heightMap.getPixel(u, v) & 0xff;

            var h: number;
            if (col > this._maxElevation) {
                h = (this._maxElevation / 0xff) * this._height;
            }
            else if (col < this._minElevation) {
                h = (this._minElevation / 0xff) * this._height;
            }
            else {
                h = (col / 0xff) * this._height;
            }

            return h;
        }
    }
}
