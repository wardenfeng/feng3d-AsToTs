module feng3d
{
	


	/**
	 * 网格事件
	 * @author feng 2015-3-20
	 */
	export class MeshEvent extends Event
	{
		/**
		 * 材质发生变化
		 */
		public static MATERIAL_CHANGE:string = "materialChange";

		/**
		 * 创建一个网格事件。
		 * @param data					事件携带的数据
		 * @param type 					事件的类型，可以作为 Event.type 访问。
		 * @param bubbles 				确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
		 * @param cancelable 			确定是否可以取消 Event 对象。默认值为 false。
		 */
		constructor(type:string, data = null, bubbles:boolean = false, cancelable:boolean = false)
		{
			super(type, data, bubbles, cancelable);
		}
	}
}
