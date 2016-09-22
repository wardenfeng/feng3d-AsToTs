module feng3d {


	/**
	 * 组件事件
	 * @author feng 2015-12-2
	 */
    export class ComponentEvent extends Event {
		/**
		 * 添加子组件事件
		 */
        public static ADDED_COMPONET: string = "addedComponet";

		/**
		 * 被组件容器添加事件
		 */
        public static BE_ADDED_COMPONET: string = "beAddedComponet";

		/**
		 * 移除子组件事件
		 */
        public static REMOVED_COMPONET: string = "removedComponet";

		/**
		 * 被容器删除事件
		 */
        public static BE_REMOVED_COMPONET: string = "beRemovedComponet";

        constructor(type: string, data = null, bubbles: boolean = false, cancelable: boolean = false) {
            super(type, data, bubbles, cancelable);
        }
    }
}
