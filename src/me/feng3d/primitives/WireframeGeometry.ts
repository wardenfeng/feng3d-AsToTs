module feng3d
{
	
	

	
	

	/**
	* 线框几何体
	 * @author feng 2014-5-8
	 */
	export class WireframeGeometry extends WireframePrimitiveBase
	{
		private _drawGeometry:Geometry = new Geometry();

		/**
		 * 创建几何体线框
		 * @param geometry 几何体
		 * @param color 线条颜色
		 * @param thickness 线条粗细
		 */
		constructor(color:number = 0xffffff, thickness:number = 1)
		{
			super(color, thickness);
		}

		public get drawGeometry():Geometry
		{
			return this._drawGeometry;
		}

		/**
		 * 绘制几何体线框
		 */
		public setDrawGeometry(value:Geometry)
		{
			this._drawGeometry = value;

			this.buildGeometry();
		}

		protected buildGeometry()
		{
			this.segmentGeometry.removeAllSegments();

			if (this.drawGeometry == null)
				return;
			//避免重复绘制同一条线段
			var segmentDic = {};

			var subGeometries:SubGeometry[] = this.drawGeometry.subGeometries;
			var subGeometry:SubGeometry;
			for (var j:number = 0; j < subGeometries.length; j++)
			{
				subGeometry = subGeometries[j];

				//顶点索引
				var _vertexIndices:number[] = subGeometry.indexData;
				//顶点位置
				var _vertices:number[] = subGeometry.vertexPositionData;

				var numTriangle:number = _vertexIndices.length / 3;
				var indexA:number;
				var indexB:number;
				var indexC:number;

				var posA:Vector3D;
				var posB:Vector3D;
				var posC:Vector3D;
				var segmentIndex:number = 0;
				for (var i:number = 0; i < numTriangle; i++)
				{
					indexA = _vertexIndices[i * 3];
					indexB = _vertexIndices[i * 3 + 1];
					indexC = _vertexIndices[i * 3 + 2];

					posA = new Vector3D(_vertices[indexA * 3], _vertices[indexA * 3 + 1], _vertices[indexA * 3 + 2]);
					posB = new Vector3D(_vertices[indexB * 3], _vertices[indexB * 3 + 1], _vertices[indexB * 3 + 2]);
					posC = new Vector3D(_vertices[indexC * 3], _vertices[indexC * 3 + 1], _vertices[indexC * 3 + 2]);
					//线段AB
					if (!segmentDic[posA.toString() + "-" + posB.toString()])
					{
						this.updateOrAddSegment(++segmentIndex, posA, posB);
						segmentDic[posA.toString() + "-" + posB.toString()] = segmentDic[posB.toString() + "-" + posA.toString()] = true;
					}
					//线段BC
					if (!segmentDic[posB.toString() + "-" + posC.toString()])
					{
						this.updateOrAddSegment(++segmentIndex, posB, posC);
						segmentDic[posB.toString() + "-" + posC.toString()] = segmentDic[posC.toString() + "-" + posB.toString()] = true;
					}
					//线段CA
					if (!segmentDic[posC.toString() + "-" + posA.toString()])
					{
						this.updateOrAddSegment(++segmentIndex, posC, posA);
						segmentDic[posC.toString() + "-" + posA.toString()] = segmentDic[posA.toString() + "-" + posC.toString()] = true;
					}
				}
			}

		}
	}
}
