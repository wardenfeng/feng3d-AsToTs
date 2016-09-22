module feng3d {

	/**
	 * 全局事件适配器
	 * @author feng
	 */
    export class GlobalDispatcher extends EventDispatcher {
        private static _instance: GlobalDispatcher;

		/**
		 * 创建一个全局事件适配器
		 * <p>此类为单例，只能构造一次，使用时请使用GlobalDispatcher.instance获取实例</p>
		 */
        constructor() {
            super();
            if (GlobalDispatcher._instance)
                throw new Error("此类不允许外部创建，请用instance属性！");
            GlobalDispatcher._instance = this;
        }

		/**
		 * 适配器实例
		 */
        public static get instance(): GlobalDispatcher {
            return GlobalDispatcher._instance || new GlobalDispatcher();
        }
    }
}
