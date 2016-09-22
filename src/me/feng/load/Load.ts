module feng3d {

	/**
	 * 加载模块类
	 * @author feng 2014-7-25
	 */
    export class Load {
        private static loadManager: LoadManager;

		/**
		 * 初始化加载模块
		 */
        public static init() {
            Load.loadManager || (Load.loadManager = new LoadManager());

            assert(Task.isInit, "加载模块依赖任务模块，请先初始化任务模块");
        }

		/**
		 * 加载器
		 */
        public static get loader(): BulkLoader {
            return Load.loadManager.loader;
        }

		/**
		 * 根据类名获取类定义
		 * @param className			类名
		 * @return					类定义
		 */
        public static getDefinitionByName(className: string) {
            this.loader.items.forEach(loadingItem => {
                var imageItem: ImageItem = loadingItem;
                if (imageItem && imageItem.content) {
                    if (imageItem.getDefinitionByName(className))
                        return imageItem.getDefinitionByName(className);
                }
            });
        }

		/**
		 * 根据类名获取实例
		 * @param className		类名
		 * @return 				实例
		 */
        public static getInstance(className: string) {
            var cls = getDefinitionByName(className);
            if (cls)
                return new cls();
            return null;
        }
    }
}
