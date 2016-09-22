module feng3d
{

	
	
	
	
	

	

	/**
	 * 线段集合
	 * @author feng 2014-4-9
	 */
	export class SegmentSet extends Mesh implements IRenderable
	{
		private _numIndices:number;

		protected segmentGeometry:SegmentGeometry;

		/**
		 * 创建一个线段集合
		 */
		constructor()
		{
			super();
			this.geometry = this.segmentGeometry = new SegmentGeometry();
			this.material = new SegmentMaterial();
		}

		/**
		 * 添加线段
		 * @param segment		线段数据
		 */
		public addSegment(segment:Segment, needUpdateGeometry:boolean = true)
		{
			this.segmentGeometry.addSegment(segment, needUpdateGeometry);
		}

		/**
		 * @inheritDoc
		 */
		public get context3dCache():Context3DCache
		{
			return null;
		}

		/**
		 * @inheritDoc
		 */
		public get numTriangles():number
		{
			return this._numIndices / 3;
		}

		/**
		 * 线段不会投射阴影，始终为false
		 */
		public get castsShadows():boolean
		{
			return false;
		}
	}
}
