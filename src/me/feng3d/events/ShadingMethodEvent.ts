module feng3d
{
	

	/**
	 * 渲染函数事件
	 * @author feng 2014-7-1
	 */
	export class ShadingMethodEvent extends Event
	{
		/** 渲染函数失效 */
		public static SHADER_INVALIDATED:string = "ShaderInvalidated";

		/**
		 * 构建一个渲染函数失效事件
		 * @param type 			事件的类型，可以作为 Event.type 访问。
		 * @param data			数据
		 * @param bubbles 		确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
		 * @param cancelable 	确定是否可以取消 Event 对象。默认值为 false。
		 */
		constructor(type:string, data = null, bubbles:boolean = false, cancelable:boolean = false)
		{
			super(type, data, bubbles, cancelable);
		}
	}
}
