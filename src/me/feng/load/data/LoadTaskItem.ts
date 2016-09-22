module feng3d {

	/**
	 * 加载单元数据
	 * @author feng 2015-5-27
	 */
    export class LoadTaskItem extends TaskItem {
        private _url: string;
        private _type: string;
        private _loadingItem: LoadingItem;

		/**
		 * 创建一个加载单元数据
		 * @param url		加载路径信息
		 */
        constructor(url) {
            super();
            this._url = null;
            this._type = null;
            if (typeof url == "string") {
                this._url = url;
            }
            else {
                this._type = url.type;
                this._url = url.url;
            }
        }

		/**
		 * 单项资源加载器
		 */
        public get loadingItem(): LoadingItem {
            return this._loadingItem;
        }

		/**
		 * 资源类型
		 */
        public get type(): string {
            return this._type;
        }

		/**
		 * 资源路径
		 */
        public get url(): string {
            return this._url;
        }

		/**
		 * @inheritDoc
		 */
        public execute(param = null) {
            var loader: BulkLoader = param;
            //加载资源
            if (!loader.hasItem(this._url)) {
                if (this._type) {
                    loader.add(this._url, { type: this._type });
                }
                else {
                    loader.add(this._url);
                }
            }

            this._loadingItem = loader.get(this._url);
            if (this._loadingItem.isLoaded) {
                this.doComplete();
            }
            else {
                this._loadingItem.addEventListener(BulkLoader.COMPLETE, this.onLoadComplete);
            }
        }

		/**
		 * 完成任务事件
		 */
        private onLoadComplete(event: Event = null) {
            this._loadingItem.removeEventListener(BulkLoader.COMPLETE, this.onLoadComplete);

            this.doComplete();
        }

    }
}
