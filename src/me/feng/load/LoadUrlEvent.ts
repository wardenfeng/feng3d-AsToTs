module feng3d {



	/**
	 * 加载url事件
	 * @author feng 2015-10-22
	 */
    export class LoadUrlEvent extends Event {
        /** 单项资源加载完成 */
        public static LOAD_SINGLE_COMPLETE: string = "loadSingleComplete";

        /** 资源加载完成 */
        public static LOAD_COMPLETE: string = "loadComplete";

		/**
		 * 创建一个加载事件。
		 * @param data					加载事件数据
		 * @param type 					事件的类型，可以作为 Event.type 访问。
		 * @param bubbles 				确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
		 * @param cancelable 			确定是否可以取消 Event 对象。默认值为 false。
		 */
        constructor(type: string, data: LoadTaskItem = null, bubbles: boolean = false, cancelable: boolean = false) {
            super(type, data, bubbles, cancelable);
        }

		/**
		 * 加载事件数据
		 */
        public get loadTaskItem(): LoadTaskItem {
            return this.data;
        }
    }
}
