module feng3d {

	/**
	 * 任务模块事件注册任务类型数据
	 * @author feng 2015-10-30
	 */
    export class TaskModuleEventRegisterData {
		/**
		 * 任务集合类型名称
		 * @see me.feng.task.type.TaskCollectionType
		 */
        public taskCollectionType: string;

		/**
		 * 任务集合类型定义
		 */
        public taskCollectionTypeClass;

		/**
		 *
		 * @param taskCollectionType			任务集合类型名称
		 * @param taskCollectionTypeClass		任务集合类型定义
		 */
        constructor(taskCollectionType: string, taskCollectionTypeClass) {
            this.taskCollectionType = taskCollectionType;
            this.taskCollectionTypeClass = taskCollectionTypeClass;
        }
    }
}
