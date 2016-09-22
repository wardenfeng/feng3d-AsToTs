module feng3d
{
	

	
	

	/**
	 *
	 * @author feng 2015-12-30
	 */
	export class SegmentUtils
	{
		private LIMIT:number = 3 * 0xFFFF;

		/**
		 * 数据缓存
		 */
		protected _segmentSubGeometry:SegmentSubGeometry;

		private _indices:number[];
		private _pointData0:number[];
		private _pointData1:number[];
		private _thicknessData:number[];
		private _colorData:number[];

		constructor()
		{
		}

		public static getSegmentSubGeometrys(_segments:Segment[]):SegmentSubGeometry
		{
			var segmentUtils:SegmentUtils = new SegmentUtils();
			var _segmentSubGeometry:SegmentSubGeometry = segmentUtils.getSegmentSubGeometry(_segments);
			return _segmentSubGeometry;
		}

		public getSegmentSubGeometry(_segments:Segment[]):SegmentSubGeometry
		{
			this._segmentSubGeometry = new SegmentSubGeometry();

			this._indices = [];
			this._pointData0 = [];
			this._pointData1 = [];
			this._thicknessData = [];
			this._colorData = [];

			for (var i:number = 0; i < _segments.length; i++)
			{
				this.computeSegment(_segments[i], i);
			}

			//一条线段由4个顶点组成
			this._segmentSubGeometry.numVertices = _segments.length * 4;

			this._segmentSubGeometry.updateIndexData(this._indices);
			this._segmentSubGeometry.updatePointData0(this._pointData0);
			this._segmentSubGeometry.updatePointData1(this._pointData1);
			this._segmentSubGeometry.updateThicknessData(this._thicknessData);
			this._segmentSubGeometry.updateColorData(this._colorData);

			return this._segmentSubGeometry;
		}

		/**
		 * 计算线段数据
		 * @param segment 			线段数据
		 * @param segmentIndex 		线段编号
		 */
		private computeSegment(segment:Segment, segmentIndex:number)
		{
			//to do: add support for curve segment
			var start:Vector3D = segment.start;
			var end:Vector3D = segment.end;
			var startX:number = start.x, startY:number = start.y, startZ:number = start.z;
			var endX:number = end.x, endY:number = end.y, endZ:number = end.z;
			var startR:number = segment.startR, startG:number = segment.startG, startB:number = segment.startB;
			var endR:number = segment.endR, endG:number = segment.endG, endB:number = segment.endB;

			var point0Index:number = segmentIndex * 4 * this._segmentSubGeometry.pointData0Stride;
			var point1Index:number = segmentIndex * 4 * this._segmentSubGeometry.pointData1Stride;
			var thicknessIndex:number = segmentIndex * 4 * this._segmentSubGeometry.thicknessDataStride;
			var colorIndex:number = segmentIndex * 4 * this._segmentSubGeometry.colorDataStride;

			var t:number = segment.thickness;

			//生成线段顶点数据
			this._pointData0[point0Index++] = startX;
			this._pointData0[point0Index++] = startY;
			this._pointData0[point0Index++] = startZ;
			this._pointData1[point1Index++] = endX;
			this._pointData1[point1Index++] = endY;
			this._pointData1[point1Index++] = endZ;
			this._thicknessData[thicknessIndex++] = t;
			this._colorData[colorIndex++] = startR;
			this._colorData[colorIndex++] = startG;
			this._colorData[colorIndex++] = startB;
			this._colorData[colorIndex++] = 1;

			this._pointData0[point0Index++] = endX;
			this._pointData0[point0Index++] = endY;
			this._pointData0[point0Index++] = endZ;
			this._pointData1[point1Index++] = startX;
			this._pointData1[point1Index++] = startY;
			this._pointData1[point1Index++] = startZ;
			this._thicknessData[thicknessIndex++] = -t;
			this._colorData[colorIndex++] = endR;
			this._colorData[colorIndex++] = endG;
			this._colorData[colorIndex++] = endB;
			this._colorData[colorIndex++] = 1;

			this._pointData0[point0Index++] = startX;
			this._pointData0[point0Index++] = startY;
			this._pointData0[point0Index++] = startZ;
			this._pointData1[point1Index++] = endX;
			this._pointData1[point1Index++] = endY;
			this._pointData1[point1Index++] = endZ;
			this._thicknessData[thicknessIndex++] = -t;
			this._colorData[colorIndex++] = startR;
			this._colorData[colorIndex++] = startG;
			this._colorData[colorIndex++] = startB;
			this._colorData[colorIndex++] = 1;

			this._pointData0[point0Index++] = endX;
			this._pointData0[point0Index++] = endY;
			this._pointData0[point0Index++] = endZ;
			this._pointData1[point1Index++] = startX;
			this._pointData1[point1Index++] = startY;
			this._pointData1[point1Index++] = startZ;
			this._thicknessData[thicknessIndex++] = t;
			this._colorData[colorIndex++] = endR;
			this._colorData[colorIndex++] = endG;
			this._colorData[colorIndex++] = endB;
			this._colorData[colorIndex++] = 1;

			//生成顶点索引数据
			var indexIndex:number = segmentIndex * 4;
			this._indices.push(indexIndex, indexIndex + 1, indexIndex + 2, indexIndex + 3, indexIndex + 2, indexIndex + 1);
		}
	}
}
