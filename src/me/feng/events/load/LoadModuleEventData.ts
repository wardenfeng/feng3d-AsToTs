module feng3d {

	/**
	 * 加载事件数据
	 * @author feng 2015-5-27
	 */
    export class LoadModuleEventData extends EventDispatcher {
        private _urls: any[];

		/**
		 * 自定义数据，可用于保存数据在加载资源后处理
		 */
        public data: any;

        private _taskModuleEventData: TaskModuleEventDispatchTaskData;

		/**
		 * 加载事件数据
		 * @param urls		加载路径列表
		 * @param data		自定义数据，可用于保存数据在加载资源后处理
		 */
        constructor(urls: any[] = null, data = null) {
            super();
            this.urls = urls;
            this.data = data;
        }

		/**
		 * 加载路径列表
		 */
        public get urls(): any[] {
            return this._urls;
        }

		/**
		 * @private
		 */
        public set urls(value: any[]) {
            this._urls = value;
        }

		/**
		 * 加载任务列表
		 * <p>该函数提供给加载模块内部使用，使用者并不需要知道</p>
		 */
        private get loadTaskItems(): TaskItem[] {
            var _loadTaskItems: TaskItem[] = [];

            _loadTaskItems.length = 0;

            this.urls.forEach(url => {
                _loadTaskItems.push(new LoadTaskItem(url));
            });

            return _loadTaskItems;
        }

		/**
		 * 加载任务数据
		 */
        public get taskModuleEventData(): TaskModuleEventDispatchTaskData {
            if (this._taskModuleEventData == null) {
                this._taskModuleEventData = new TaskModuleEventDispatchTaskData();
                this._taskModuleEventData.addEventListener(TaskEvent.COMPLETEDITEM, this.onCompletedItem);
                this._taskModuleEventData.addEventListener(TaskEvent.COMPLETED, this.onCompleted);
            }
            this._taskModuleEventData.taskList = this.loadTaskItems;
            this._taskModuleEventData.taskCollectionType = TaskCollectionType.QUEUE;

            return this._taskModuleEventData;
        }

		/**
		 * 处理完成加载单项事件
		 */
        protected onCompletedItem(event: TaskEvent) {
            var loadItemData: LoadTaskItem = event.data;
            this.dispatchEvent(new LoadUrlEvent(LoadUrlEvent.LOAD_SINGLE_COMPLETE, loadItemData));
        }

		/**
		 * 处理完成所有加载项事件
		 */
        private onCompleted(event: TaskEvent) {
            this.dispatchEvent(new LoadUrlEvent(LoadUrlEvent.LOAD_COMPLETE));
        }
    }
}
