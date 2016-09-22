module feng3d {

	/**
	 * 3D环境缓冲收集器
	 * @author feng 2015-7-18
	 */
    export class Context3DBufferCollector {
        /** 根3D环境缓冲拥有者 */
        private _rootBufferOwner: Context3DBufferOwner;

        /** 所有数据缓存 */
        private bufferDic = {};

		/**
		 * 创建3D环境缓冲收集器
		 * @bufferOwner		缓冲拥有者
		 */
        constructor() {
        }

		/**
		 * 根3D环境缓冲拥有者
		 */
        private get rootBufferOwner(): Context3DBufferOwner {
            if (this._rootBufferOwner == null) {
                this._rootBufferOwner = new Context3DBufferOwner();
                //添加事件
                this._rootBufferOwner.addEventListener(Context3DBufferOwnerEvent.ADD_CONTEXT3DBUFFER, this.onAddContext3DBuffer);
                this._rootBufferOwner.addEventListener(Context3DBufferOwnerEvent.REMOVE_CONTEXT3DBUFFER, this.onRemoveContext3DBuffer);
                this._rootBufferOwner.addEventListener(Context3DBufferOwnerEvent.ADDCHILD_CONTEXT3DBUFFEROWNER, this.onAddChildContext3DBufferOwner);
                this._rootBufferOwner.addEventListener(Context3DBufferOwnerEvent.REMOVECHILD_CONTEXT3DBUFFEROWNER, this.onRemoveChildContext3DBufferOwner);
            }
            return this._rootBufferOwner;
        }

		/**
		 * 添加子项缓存拥有者
		 * @param childBufferOwner
		 */
        public addChildBufferOwner(childBufferOwner: Context3DBufferOwner) {
            this.rootBufferOwner.addChildBufferOwner(childBufferOwner);
        }

		/**
		 * 移除子项缓存拥有者
		 * @param childBufferOwner
		 */
        public removeChildBufferOwner(childBufferOwner: Context3DBufferOwner) {
            this.rootBufferOwner.removeChildBufferOwner(childBufferOwner);
        }

		/**
		 * 添加数据缓存
		 * @param context3DDataBuffer 数据缓存
		 */
        public addDataBuffer(context3DDataBuffer: Context3DBuffer) {
            var dataTypeId: string = context3DDataBuffer.dataTypeId;
            if (this.bufferDic[dataTypeId])
                console.log("重复提交数据" + context3DDataBuffer);
            this.bufferDic[dataTypeId] = context3DDataBuffer;
        }

		/**
		 * 移除数据缓存
		 * @param dataTypeId 数据缓存类型编号
		 */
        public removeDataBuffer(context3DDataBuffer: Context3DBuffer) {
            var dataTypeId: string = context3DDataBuffer.dataTypeId;
            if (this.bufferDic[dataTypeId] != context3DDataBuffer)
                throw new Error("移除数据缓存错误");
            delete this.bufferDic[dataTypeId];
        }

		/**
		 * 处理添加缓冲拥有者事件
		 */
        private onAddChildContext3DBufferOwner(event: Context3DBufferOwnerEvent) {
            this.addContext3DBufferOwer(event.data);
        }

		/**
		 * 处理移除缓冲拥有者事件
		 */
        private onRemoveChildContext3DBufferOwner(event: Context3DBufferOwnerEvent) {
            this.removeContext3DBufferOwer(event.data);
        }

		/**
		 * 处理添加缓冲事件
		 */
        private onAddContext3DBuffer(event: Context3DBufferOwnerEvent) {
            this.addDataBuffer(event.data);
        }


		/**
		 * 处理移除缓冲事件
		 */
        private onRemoveContext3DBuffer(event: Context3DBufferOwnerEvent) {
            this.removeDataBuffer(event.data);
        }

		/**
		 * 添加缓冲拥有者
		 * @param bufferOwer		缓冲拥有者
		 */
        private addContext3DBufferOwer(bufferOwer: Context3DBufferOwner) {
            var allBufferList: Context3DBuffer[] = bufferOwer.getAllBufferList();
            for (var i: number = 0; i < allBufferList.length; i++) {
                this.addDataBuffer(allBufferList[i]);
            }
        }

		/**
		 * 移除缓冲拥有者
		 * @param bufferOwer		缓冲拥有者
		 */
        private removeContext3DBufferOwer(bufferOwer: Context3DBufferOwner) {
            var allBufferList: Context3DBuffer[] = bufferOwer.getAllBufferList();
            for (var i: number = 0; i < allBufferList.length; i++) {
                this.removeDataBuffer(allBufferList[i]);
            }
        }

		/**
		 * 销毁
		 */
        public dispose() {
            //移除事件
            if (this._rootBufferOwner != null) {
                this._rootBufferOwner.removeEventListener(Context3DBufferOwnerEvent.ADD_CONTEXT3DBUFFER, this.onAddContext3DBuffer);
                this._rootBufferOwner.removeEventListener(Context3DBufferOwnerEvent.REMOVE_CONTEXT3DBUFFER, this.onRemoveContext3DBuffer);
                this._rootBufferOwner.removeEventListener(Context3DBufferOwnerEvent.ADDCHILD_CONTEXT3DBUFFEROWNER, this.onAddChildContext3DBufferOwner);
                this._rootBufferOwner.removeEventListener(Context3DBufferOwnerEvent.REMOVECHILD_CONTEXT3DBUFFEROWNER, this.onRemoveChildContext3DBufferOwner);
            }
            this._rootBufferOwner = null;
        }
    }
}
