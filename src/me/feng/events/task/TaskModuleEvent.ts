module feng3d {


	/**
	 * 任务模块事件
	 * @author feng 2015-10-29
	 */
    export class TaskModuleEvent extends Event {
        /** 派发任务 */
        public static DISPATCH_TASK: string = "dispatchTask";

        /** 注册任务集合类型 */
        public static REGISTER_TASKCOLLECTIONTYPE: string = "registerTaskCollectionType";

		/**
		 * 创建任务模块事件
		 * @param type 					事件的类型
		 * @param data					事件携带的数据
		 * @param bubbles 				确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
		 * @param cancelable 			确定是否可以取消 Event 对象。默认值为 false。
		 */
        constructor(type: string, data = null, bubbles: boolean = false, cancelable: boolean = false) {
            super(type, data, bubbles, cancelable);
        }
    }
}
