module feng3d {

	/**
	 * 任务模块事件数据
	 * @author feng 2015-10-29
	 */
    export class TaskModuleEventDispatchTaskData extends EventDispatcher {
		/**
		 * 任务集合类型
		 */
        public taskCollectionType: string;

		/**
		 * 任务列表
		 */
        public taskList: TaskItem[];

		/**
		 * 任务执行参数
		 */
        public params;

        constructor(taskList: TaskItem[] = null, taskCollectionType: string = TaskCollectionType.LIST, params = null) {
            super();
            this.taskList = taskList;
            this.taskCollectionType = taskCollectionType;
            this.params = params;
        }
    }
}
