module feng3d {

	/**
	 * 实体列表元素池
	 * @author feng 2015-3-6
	 */
    export class EntityListItemPool {
        private _index: number;

		/**
		 * 创建一个实体列表元素池
		 */
        constructor() {
        }

		/**
		 * 释放所有
		 */
        public freeAll() {
            this._index = 0;
        }
    }
}
