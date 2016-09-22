module feng3d {


	/**
	 * 任务事件
	 * @author feng 2014-7-24
	 */
    export class TaskEvent extends Event {
        /** 完成任务 */
        public static COMPLETED: string = "completed";

        /** 完成一个任务单元 */
        public static COMPLETEDITEM: string = "completedItem";

		/**
		 * 创建任务事件
		 * @param data					事件携带的数据
		 * @param type 					事件的类型
		 * @param bubbles 				确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
		 * @param cancelable 			确定是否可以取消 Event 对象。默认值为 false。
		 */
        constructor(type: string, data = null, bubbles: boolean = false, cancelable: boolean = false) {
            super(type, data, bubbles, cancelable);
        }
    }
}
