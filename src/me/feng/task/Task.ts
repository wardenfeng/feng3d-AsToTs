module feng3d {

	/**
	 * 任务模块类
	 * @includeExample TaskModuleTest.as
	 *
	 * @author feng 2015-5-27
	 */
    export class Task {
        private static _isInit: boolean = false;

        private static taskManager: TaskManager;

		/**
		 * 模块是否初始化
		 */
        public static get isInit(): boolean {
            return Task._isInit;
        }

		/**
		 * 初始化模块
		 */
        public static init() {
            Task.taskManager || (Task.taskManager = new TaskManager());
            Task._isInit = true;
        }
    }
}
