module feng3d {

	/**
	 * 索引缓存
	 * @author feng 2014-8-21
	 */
    export class IndexBuffer extends Context3DBuffer {
        private _bufferItemDic = new Map<Context3D,IndexBufferItem>();

        /** data 中索引的数量。 */
        public count: number;

        /** 此 IndexBuffer3D 对象中的索引，要加载的第一个索引。不等于零的 startOffset 值可用于加载索引数据的子区域。 */
        public _startOffset: number;

        /** 顶点索引的矢量。仅使用每个索引值的低 16 位。矢量的长度必须大于或等于 count。 */
        public data: number[];

        /** 要在缓存区中存储的顶点数量。单个缓存区中的最大索引数为 524287。 */
        public numIndices: number;

        public firstIndex: number = 0;
        public numTriangles: number = -1;

        /** 是否无效 */
        private dicInvalid: boolean = true;

        /** 缓存无效 */
        private bufferInvalid: boolean = true;

		/**
		 * 创建一个索引缓存
		 * @param dataTypeId 		数据缓存编号
		 * @param updateFunc 		更新回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }

		/**
		 * @inheritDoc
		 */
        public doBuffer(context3D: Context3D) {
            this.doUpdateFunc();

            var indexBufferItem: IndexBufferItem;
            //处理 缓存无效标记
            if (this.bufferInvalid) {
                this.bufferInvalid = false;
                this.dicInvalid = false;
            }
            //处理 数据无效标记
            if (this.dicInvalid) {
                for (var key in this._bufferItemDic) {
                    if (this._bufferItemDic.hasOwnProperty(key)) {
                        indexBufferItem = this._bufferItemDic[key];
                        indexBufferItem.invalid = true;
                    }
                }
                this.dicInvalid = false;
            }

            indexBufferItem = this._bufferItemDic.get(context3D);
            if (indexBufferItem == null) {
                indexBufferItem = new IndexBufferItem(context3D, this.numIndices);
                this._bufferItemDic.push(context3D,indexBufferItem); 
            }

            if (indexBufferItem.invalid) {
                indexBufferItem.uploadFromVector(this.data, this._startOffset, this.count);
            }

            indexBufferItem.drawTriangles(this.firstIndex, this.numTriangles);
        }

		/**
		 * 销毁数据
		 */
        public dispose() {
            this.data = null;
            this._bufferItemDic = null;
        }

		/**
		 * 更新数据
		 * @param data 顶点索引的矢量。仅使用每个索引值的低 16 位。矢量的长度必须大于或等于 count。
		 * @param numIndices 要在缓存区中存储的顶点数量。单个缓存区中的最大索引数为 524287。
		 * @param count data 中索引的数量。
		 */
        public update(data: number[], numIndices: number, count: number, firstIndex: number = 0, numTriangles: number = -1) {
            if (!data)
                throw new Error("顶点索引不接收空数组");

            this.dicInvalid = true;
            if (!this.data || this.data.length != data.length) {
                this.bufferInvalid = true;
            }

            this.data = data;
            this.numIndices = numIndices;
            this.count = count;
            this.firstIndex = firstIndex;
            this.numTriangles = numTriangles;
        }
    }
}
