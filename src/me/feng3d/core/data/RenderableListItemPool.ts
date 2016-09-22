module feng3d {

	/**
	 * 可渲染列表元素池
	 * @author feng 2015-3-6
	 */
    export class RenderableListItemPool {
        private _pool: RenderableListItem[];
        private _index: number;
        private _poolSize: number;

		/**
		 * 创建可渲染列表元素池
		 */
        constructor() {
            this._pool = [];
        }

		/**
		 * 获取 可渲染列表元
		 */
        public getItem(): RenderableListItem {
            if (this._index == this._poolSize) {
                var item: RenderableListItem = new RenderableListItem();
                this._pool[this._index++] = item;
                ++this._poolSize;
                return item;
            }
            else
                return this._pool[this._index++];
        }

		/**
		 * 释放所有
		 */
        public freeAll() {
            this._index = 0;
        }
    }
}
