module feng3d {
	/**
	 * 测试基类
	 * @author feng 2014-4-9
	 */
    export class TestBase extends Sprite {

        //资源根路径
        protected rootPath: string = "http://images.feng3d.me/feng3dDemo/assets/";

		/**
		 * 资源列表
		 */
        protected resourceList;

        /** 资源字典 */
        protected resourceDic;

        constructor() {
            super();
            this.initModules();
        }

        private initModules() {
            Task.init();
            Load.init();
            // this.loadTextures();
            this["init"]();
        }

		/**
		 * 加载纹理资源
		 */
        private loadTextures() {
            this.resourceDic = {};

            //加载资源
            var loadObj: LoadModuleEventData = new LoadModuleEventData();
            loadObj.urls = [];
            for (var i: number = 0; this.resourceList != null && i < this.resourceList.length; i++) {
                if (is(this.resourceList[i], String)) {
                    loadObj.urls.push(this.rootPath + this.resourceList[i]);
                }
                else {
                    this.resourceList[i].url = this.rootPath + this.resourceList[i].url;
                    loadObj.urls.push(this.resourceList[i]);
                }
            }
            loadObj.addEventListener(LoadUrlEvent.LOAD_SINGLE_COMPLETE, this.singleGeometryComplete);
            loadObj.addEventListener(LoadUrlEvent.LOAD_COMPLETE, this.allItemsLoaded);
            GlobalDispatcher.instance.dispatchEvent(new LoadModuleEvent(LoadModuleEvent.LOAD_RESOURCE, loadObj));
        }

        /** 单个资源加载完毕 */
        private singleGeometryComplete(evnet: LoadUrlEvent) {
            var path: string = evnet.loadTaskItem.url;
            path = path.substr(this.rootPath.length);

            this.resourceDic[path] = evnet.loadTaskItem.loadingItem.content;
        }

		/**
		 * 处理全部加载完成事件
		 */
        protected allItemsLoaded(event: LoadUrlEvent) {
            //配置3d缓存编号
            FagalRE.addBufferID(Context3DBufferIDConfig.bufferIdConfigs);

            this["init"]();
        }
    }
}


