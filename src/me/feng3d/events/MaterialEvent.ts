module feng3d
{
	

	/**
	 * 材质事件
	 * @author feng 2014-9-9
	 */
	export class MaterialEvent extends Event
	{
		/** 添加pass */
		public static PASS_ADDED:string = "passAdded";
		/** 移除pass */
		public static PASS_REMOVED:string = "passRemoved";

		constructor(type:string, data = null, bubbles:boolean = false)
		{
			super(type, data, bubbles);
		}
	}
}
