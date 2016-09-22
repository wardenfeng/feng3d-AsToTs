module feng3d
{
	

	/**
	 * 几何体组件事件
	 * @author feng 2015-12-8
	 */
	export class GeometryComponentEvent extends Event
	{
		/**
		 * 获取几何体顶点数据
		 */
		public static GET_VA_DATA:string = "getVAData";

		/**
		 * 改变几何体顶点数据事件
		 */
		public static CHANGED_VA_DATA:string = "changedVAData";

		/**
		 * 改变顶点索引数据事件
		 */
		public static CHANGED_INDEX_DATA:string = "changedIndexData";

		constructor(type:string, data = null, bubbles:boolean = false, cancelable:boolean = false)
		{
			super(type, data, bubbles, cancelable);
		}
	}
}
