module feng3d {

	/**
	 * 加载管理器
	 * @author feng 2014-7-25
	 */
    export class LoadManager extends FModuleManager {
        /** 加载器 */
        public loader: BulkLoader;

        /** 完成一个资源后执行的函数字典 */
        private urlFuncsDic = {};

        /** 完成一组资源后执行的函数字典 */
        private urlsFuncsDic = {};

		/**
		 * 创建一个加载管理器
		 */
        constructor() {
            super();
            this.init();
        }

		/**
		 * 初始化加载模块
		 */
        protected init() {
            // creates a BulkLoader instance with a name of "main-site", that can be used to retrieve items without having a reference to this instance
            this.loader = new BulkLoader("main-site");
            // set level to verbose, for debugging only
            this.loader.logLevel = BulkLoader.LOG_ERRORS;

            this.addListeners();
        }

		/**
		 * 添加事件监听器
		 */
        private addListeners() {
            this.loader.addEventListener(BulkLoader.COMPLETE, this.onAllItemsLoaded);

            this.loader.addEventListener(BulkLoader.PROGRESS, this.onAllItemsProgress);

            this.addEventListener(LoadModuleEvent.LOAD_RESOURCE, this.onLoadResource);
        }

		/**
		 * 处理加载资源事件
		 * @param event
		 */
        private onLoadResource(event: LoadModuleEvent) {
            var taskModuleEventData: TaskModuleEventDispatchTaskData = event.loadEventData.taskModuleEventData;
            taskModuleEventData.params = this.loader;

            this.dispatchEvent(new TaskModuleEvent(TaskModuleEvent.DISPATCH_TASK, taskModuleEventData));

            if (!this.loader.isRunning)
                this.loader.start();
        }

		/**
		 * 加载完成所有资源事件
		 * @param evt
		 */
        private onAllItemsLoaded(evt: Event) {
            //			logger("every thing is loaded!");
        }

		/**
		 * 加载进度事件
		 */
        private onAllItemsProgress(evt: BulkProgressEvent) {
            //			logger(evt.loadingStatus());
        }

    }
}
