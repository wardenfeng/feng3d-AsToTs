module feng3d {

	/**
	 * 任务集合，任务列表与任务队列等的基类
	 * @author feng 2015-6-16
	 */
    export abstract class TaskCollection extends TaskItem {
		/**
		 * 所有子任务
		 */
        protected allItemList: TaskItem[];

		/**
		 * 排队中的任务
		 * <p>等待执行中的任务</p>
		 */
        protected waitingItemList: TaskItem[];

		/**
		 * 进行中的任务
		 */
        protected executingItemList: TaskItem[];

		/**
		 * 已完成任务列表
		 */
        protected completedItemList: TaskItem[];
        
        public data: TaskModuleEventDispatchTaskData;

		/**
		 * 是否已经结束任务
		 */
        public get isComplete(): boolean {
            return this.completedItemList.length == this.allItemList.length;
        }

		/**
		 * 创建一个任务集合
		 * <p>该类为抽象类，无法直接被实例化，请使用其子类</p>
		 */
        constructor() {
            super();
            this.allItemList = [];
            this.executingItemList = [];
            this.completedItemList = [];
        }

		/**
		 * @inheritDoc
		 */
        public execute(params = null) {
            this._state = TaskStateType.STATE_EXECUTING;
            this.waitingItemList = this.allItemList.concat();
            this.executingItemList.length = 0;
            this.completedItemList.length = 0;

            //判断是否已经完成任务
            if (this.isComplete) {
                this.doComplete();
                return;
            }
        }

		/**
		 * 执行子任务
		 * @param taskItem	子任务
		 * @param params	执行参数
		 */
        protected executeItem(taskItem: TaskItem, params) {
            this.executingItemList.push(taskItem);
            taskItem.execute(params);
        }

		/**
		 * 添加子任务
		 */
        public addItem(item: TaskItem) {
            if (this.allItemList.indexOf(item) == -1) {
                this.allItemList.push(item);
                item.addEventListener(TaskEvent.COMPLETED, this.onCompletedItem);

                if (this.state == TaskStateType.STATE_EXECUTING) {
                    if (item.state == TaskStateType.STATE_INIT || item.state == TaskStateType.STATE_EXECUTING) {
                        this.executingItemList.push(item);
                    }
                    else if (item.state == TaskStateType.STATE_COMPLETED) {
                        this.completedItemList.push(item);
                    }
                }
            }
        }

		/**
		 * 添加任务列表
		 * @param taskList		任务列表
		 */
        public addItems(taskList: TaskItem[]) {
            for (var i: number = 0; i < taskList.length; i++) {
                this.addItem(taskList[i]);
            }
        }

		/**
		 * 移除子任务
		 */
        public removeItem(item: TaskItem) {
            var index: number;
            index = this.allItemList.indexOf(item);
            if (index != -1) {
                this.allItemList.splice(index, 1);
                item.removeEventListener(TaskEvent.COMPLETED, this.onCompletedItem);
            }
            index = this.executingItemList.indexOf(item);
            if (index != -1) {
                this.executingItemList.splice(index, 1);
            }
            index = this.completedItemList.indexOf(item);
            if (index != -1) {
                this.completedItemList.splice(index, 1);
            }
        }

		/**
		 * 移除所有子任务
		 */
        public removeAllItem() {
            var item: TaskItem;
            while (this.allItemList.length > 0) {
                item = this.allItemList.pop();
                item.removeEventListener(TaskEvent.COMPLETED, this.onCompletedItem);
                item.destroy();
            }
            this.waitingItemList.length = 0;
            this.executingItemList.length = 0;
            this.completedItemList.length = 0;
        }

		/**
		 * 处理子任务完成事件
		 */
        protected onCompletedItem(event: TaskEvent) {
            var taskItem: TaskItem = event.currentTarget as TaskItem;
            var index: number = this.executingItemList.indexOf(taskItem);
            if (index != -1) {
                this.executingItemList.splice(index, 1);
            }
            else
                throw new Error("怎么会找不到" + taskItem + "呢？");

            this.completedItemList.push(taskItem);

            this.dispatchEvent(new TaskEvent(TaskEvent.COMPLETEDITEM, taskItem));

            this.checkComplete();
        }

		/**
		 * 检查是否完成任务
		 */
        protected checkComplete() {
            if (this.isComplete) {
                this.doComplete();
            }
        }

		/**
		 * @inheritDoc
		 */
        public destroy() {
            super.destroy();
            this.removeAllItem();
            this.allItemList = null;
            this.waitingItemList = null;
            this.executingItemList = null;
            this.completedItemList = null;
        }

    }
}
