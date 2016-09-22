module feng3d
{
	
	

	

	/**
	 * 圆环几何体
	 */
	export class TorusGeometry extends PrimitiveBase
	{
		protected _radius:number;
		protected _tubeRadius:number;
		protected _segmentsR:number;
		protected _segmentsT:number;
		protected _yUp:boolean;
		protected vertexPositionData:number[];
		protected vertexNormalData:number[];
		protected vertexTangentData:number[];
		private _rawIndices:number[];
		private _vertexIndex:number;
		private _currentTriangleIndex:number;
		private _numVertices:number;
		private vertexPositionStride:number;
		private vertexNormalStride:number;
		private vertexTangentStride:number;

		/**
		 * 添加顶点数据
		 */
		private addVertex(vertexIndex:number, px:number, py:number, pz:number, nx:number, ny:number, nz:number, tx:number, ty:number, tz:number)
		{
			this.vertexPositionData[vertexIndex * this.vertexPositionStride] = px;
			this.vertexPositionData[vertexIndex * this.vertexPositionStride + 1] = py;
			this.vertexPositionData[vertexIndex * this.vertexPositionStride + 2] = pz;
			this.vertexNormalData[vertexIndex * this.vertexNormalStride] = nx;
			this.vertexNormalData[vertexIndex * this.vertexNormalStride + 1] = ny;
			this.vertexNormalData[vertexIndex * this.vertexNormalStride + 2] = nz;
			this.vertexTangentData[vertexIndex * this.vertexTangentStride] = tx;
			this.vertexTangentData[vertexIndex * this.vertexTangentStride + 1] = ty;
			this.vertexTangentData[vertexIndex * this.vertexTangentStride + 2] = tz;
		}

		/**
		 * 添加三角形索引数据
		 * @param currentTriangleIndex		当前三角形索引
		 * @param cwVertexIndex0			索引0
		 * @param cwVertexIndex1			索引1
		 * @param cwVertexIndex2			索引2
		 */
		private addTriangleClockWise(currentTriangleIndex:number, cwVertexIndex0:number, cwVertexIndex1:number, cwVertexIndex2:number)
		{
			this._rawIndices[currentTriangleIndex * 3] = cwVertexIndex0;
			this._rawIndices[currentTriangleIndex * 3 + 1] = cwVertexIndex1;
			this._rawIndices[currentTriangleIndex * 3 + 2] = cwVertexIndex2;
		}

		/**
		 * @inheritDoc
		 */
		protected buildGeometry(target:SubGeometry)
		{
			var i:number, j:number;
			var x:number, y:number, z:number, nx:number, ny:number, nz:number, revolutionAngleR:number, revolutionAngleT:number;
			var numTriangles:number;
			// reset utility variables
			this._numVertices = 0;
			this._vertexIndex = 0;
			this._currentTriangleIndex = 0;
			this.vertexPositionStride = target.vertexPositionStride;
			this.vertexNormalStride = target.vertexNormalStride;
			this.vertexTangentStride = target.vertexTangentStride;

			// evaluate target number of vertices, triangles and indices
			this._numVertices = (this._segmentsT + 1) * (this._segmentsR + 1); // this.segmentsT + 1 because of closure, this.segmentsR + 1 because of closure
			numTriangles = this._segmentsT * this._segmentsR * 2; // each level has segmentR quads, each of 2 triangles

			// need to initialize raw arrays or can be reused?
			if (this._numVertices == target.numVertices)
			{
				this.vertexPositionData = target.vertexPositionData;
				this.vertexNormalData = target.vertexNormalData;
				this.vertexTangentData = target.vertexTangentData;
				this._rawIndices = target.indexData || [];
                this._rawIndices.length = numTriangles * 3;
			}
			else
			{
				this.vertexPositionData = [];
                this.vertexPositionData.length = this._numVertices * this.vertexPositionStride;
				this.vertexNormalData = [];
                this.vertexNormalData.length = this._numVertices * this.vertexNormalStride;
				this.vertexTangentData = [];
                this.vertexTangentData.length = this._numVertices * this.vertexTangentStride;
				this._rawIndices = [];
                this._rawIndices.length = numTriangles * 3;
				this.invalidateUVs();
			}

			// evaluate revolution steps
			var revolutionAngleDeltaR:number = 2 * Math.PI / this._segmentsR;
			var revolutionAngleDeltaT:number = 2 * Math.PI / this._segmentsT;

			var comp1:number, comp2:number;
			var t1:number, t2:number, n1:number, n2:number;

			var startPositionIndex:number;

			// surface
			var a:number, b:number, c:number, d:number, length:number;

			for (j = 0; j <= this._segmentsT; ++j)
			{
				startPositionIndex = j * (this._segmentsR + 1) * this.vertexPositionStride;

				for (i = 0; i <= this._segmentsR; ++i)
				{
					this._vertexIndex = j * (this._segmentsR + 1) + i;

					// revolution vertex
					revolutionAngleR = i * revolutionAngleDeltaR;
					revolutionAngleT = j * revolutionAngleDeltaT;

					length = Math.cos(revolutionAngleT);
					nx = length * Math.cos(revolutionAngleR);
					ny = length * Math.sin(revolutionAngleR);
					nz = Math.sin(revolutionAngleT);

					x = this._radius * Math.cos(revolutionAngleR) + this._tubeRadius * nx;
					y = this._radius * Math.sin(revolutionAngleR) + this._tubeRadius * ny;
					z = (j == this._segmentsT) ? 0 : this._tubeRadius * nz;

					if (this._yUp)
					{
						n1 = -nz;
						n2 = ny;
						t1 = 0;
						t2 = (length ? nx / length : x / this._radius);
						comp1 = -z;
						comp2 = y;

					}
					else
					{
						n1 = ny;
						n2 = nz;
						t1 = (length ? nx / length : x / this._radius);
						t2 = 0;
						comp1 = y;
						comp2 = z;
					}

					if (i == this._segmentsR)
					{
						this.addVertex(this._vertexIndex, x, this.vertexPositionData[startPositionIndex + 1], this.vertexPositionData[startPositionIndex + 2], nx, n1, n2, -(length ? ny / length : y / this._radius), t1, t2);
					}
					else
					{
						this.addVertex(this._vertexIndex, x, comp1, comp2, nx, n1, n2, -(length ? ny / length : y / this._radius), t1, t2);
					}

					// close triangle
					if (i > 0 && j > 0)
					{
						a = this._vertexIndex; // current
						b = this._vertexIndex - 1; // previous
						c = b - this._segmentsR - 1; // previous of last level
						d = a - this._segmentsR - 1; // current of last level
						this.addTriangleClockWise(this._currentTriangleIndex++, a, b, c);
						this.addTriangleClockWise(this._currentTriangleIndex++, a, c, d);
					}
				}
			}

			target.numVertices = this._numVertices;
			target.updateVertexPositionData(this.vertexPositionData);
			target.updateVertexNormalData(this.vertexNormalData);
			target.updateVertexTangentData(this.vertexTangentData);
			target.updateIndexData(this._rawIndices);
		}

		/**
		 * @inheritDoc
		 */
		protected buildUVs(target:SubGeometry)
		{
			var i:number, j:number;
			var data:number[];
			var stride:number = target.UVStride;

			// evaluate num uvs
			var numUvs:number = this._numVertices * stride;

			// need to initialize raw array or can be reused?
			data = target.UVData;
			if (data == null || numUvs != data.length)
			{
				data = [];
                data.length = numUvs;
			}

			// current uv component index
			var currentUvCompIndex:number = 0;

			var index:number = 0;
			// surface
			for (j = 0; j <= this._segmentsT; ++j)
			{
				for (i = 0; i <= this._segmentsR; ++i)
				{
					index = j * (this._segmentsR + 1) + i;
					// revolution vertex
					data[index * stride] = i / this._segmentsR;
					data[index * stride + 1] = j / this._segmentsT;
				}
			}

			// build real data from raw data
			target.updateUVData(data);
		}

		/**
		 * 圆环半径
		 */
		public get radius():number
		{
			return this._radius;
		}

		public set radius(value:number)
		{
			this._radius = value;
			this.invalidateGeometry();
		}

		/**
		 * 管子半径
		 */
		public get tubeRadius():number
		{
			return this._tubeRadius;
		}

		public set tubeRadius(value:number)
		{
			this._tubeRadius = value;
			this.invalidateGeometry();
		}

		/**
		 * 横向段数
		 */
		public get segmentsR():number
		{
			return this._segmentsR;
		}

		public set segmentsR(value:number)
		{
			this._segmentsR = value;
			this.invalidateGeometry();
			this.invalidateUVs();
		}

		/**
		 * 纵向段数
		 */
		public get segmentsT():number
		{
			return this._segmentsT;
		}

		public set segmentsT(value:number)
		{
			this._segmentsT = value;
			this.invalidateGeometry();
			this.invalidateUVs();
		}

		/**
		 * Y轴是否朝上
		 */
		public get yUp():boolean
		{
			return this._yUp;
		}

		public set yUp(value:boolean)
		{
			this._yUp = value;
			this.invalidateGeometry();
		}

		/**
		 * 创建<code>Torus</code>实例
		 * @param radius						圆环半径
		 * @param tuebRadius					管道半径
		 * @param segmentsR						横向段数
		 * @param segmentsT						纵向段数
		 * @param yUp							Y轴是否朝上
		 */
		constructor(radius:number = 50, tubeRadius:number = 50, segmentsR:number = 16, segmentsT:number = 8, yUp:boolean = true)
		{
			super();

			this._radius = radius;
			this._tubeRadius = tubeRadius;
			this._segmentsR = segmentsR;
			this._segmentsT = segmentsT;
			this._yUp = yUp;
		}
	}
}
