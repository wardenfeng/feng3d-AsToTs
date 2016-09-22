module feng3d
{
	
	

	/**
	 * 几何体事件
	 * @author feng 2014-5-15
	 */
	export class GeometryEvent extends Event
	{
		/** 添加子几何体 */
		public static SUB_GEOMETRY_ADDED:string = "SubGeometryAdded";

		/** 溢出子几何体 */
		public static SUB_GEOMETRY_REMOVED:string = "SubGeometryRemoved";

		/** 几何体外形发生改变 */
		public static SHAPE_CHANGE:string = "shapeChange";

		private _subGeometry:SubGeometry;

		constructor(type:string, subGeometry:SubGeometry = null, bubbles:boolean = false, cancelable:boolean = false)
		{
			super(type, subGeometry, bubbles, cancelable);
			this._subGeometry = subGeometry;
		}

		public get subGeometry():SubGeometry
		{
			return this._subGeometry;
		}
	}
}
