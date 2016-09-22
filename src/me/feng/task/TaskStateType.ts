module feng3d {

	/**
	 * 任务状态
	 * @author feng 2015-6-16
	 */
    export class TaskStateType {
        /** 初始状态 */
        public static STATE_INIT: number = 0;

        /** 任务正在执行 */
        public static STATE_EXECUTING: number = 1;

        /** 任务已完成 */
        public static STATE_COMPLETED: number = 2;
    }
}
