module feng3d {

	/**
	 * 任务集合类型
	 * @author feng 2015-10-29
	 */
    export class TaskCollectionType {
		/**
		 * 列表
		 * <p>所有任务全部执行</p>
		 */
        public static LIST: string = "list";

		/**
		 * 队列
		 * <p>按照队列中的顺序一个一个依次执行</p>
		 */
        public static QUEUE: string = "queue";
    }
}
