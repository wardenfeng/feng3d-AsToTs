module feng3d {




	/**
	 * 任务队列（按先后顺序依次完成子任务，只有完成当前任务才会开始下个任务）
	 * @includeExample TaskQueueTest.as
	 * @includeExample KeyDownTask.as
	 * @author feng 2015-6-17
	 */
    export class TaskQueue extends TaskCollection {
		/**
		 * 执行参数
		 */
        private executeParams;

		/**
		 * 创建任务队列
		 */
        constructor() {
            super();
        }

		/**
		 * @inheritDoc
		 */
        public execute(params = null) {
            super.execute(params);

            this.executeParams = params;

            this.executeNextTask();
        }

		/**
		 * 执行下个任务
		 */
        protected executeNextTask() {
            if (this.waitingItemList.length > 0) {
                var taskItem: TaskItem = this.waitingItemList.shift();
                this.executeItem(taskItem, this.executeParams);
            }
        }

		/**
		 * @inheritDoc
		 */
        protected onCompletedItem(event: TaskEvent) {
            super.onCompletedItem(event);

            this.executeNextTask();
        }
    }
}
