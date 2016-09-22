module feng3d
{
	

	
	
	

	/**
	 * 3d鼠标事件
	 * @author feng 2014-4-29
	 * @see flash.events.MouseEvent
	 */
	export class MouseEvent3D extends Event
	{
		/**
		 * 单击
		 */
		public static CLICK:string = "click3d";

		/**
		 * 鼠标移人对象
		 */
		public static MOUSE_OVER:string = "mouseOver3d";

		/**
		 * 鼠标移出对象
		 */
		public static MOUSE_OUT:string = "mouseOut3d";

		/**
		 * 鼠标在对象上移动
		 */
		public static MOUSE_MOVE:string = "mouseMove3d";

		/**
		 * 鼠标在对象上双击
		 */
		public static DOUBLE_CLICK:string = "doubleClick3d";

		/**
		 * 鼠标在对象上按下
		 */
		public static MOUSE_DOWN:string = "mouseDown3d";

		/**
		 * 鼠标在对象上弹起
		 */
		public static MOUSE_UP:string = "mouseUp3d";

		/**
		 * 鼠标在对象上滚轮滚动
		 */
		public static MOUSE_WHEEL:string = "mouseWheel3d";

		/**
		 * 鼠标事件对象
		 */
		public object:Container3D;

		/**
		 * 相交数据
		 */
		public collider:PickingCollisionVO;

		/**
		 * 创建一个3D鼠标事件
		 * @param data					事件携带的数据
		 * @param type 					事件的类型，可以作为 Event.type 访问。
		 * @param bubbles 				确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
		 * @param cancelable 			确定是否可以取消 Event 对象。默认值为 false。
		 */
		constructor(type:string, data = null, bubbles:boolean = true, cancelable:boolean = false)
		{
			super(type, data, bubbles, cancelable);
		}

	}
}
