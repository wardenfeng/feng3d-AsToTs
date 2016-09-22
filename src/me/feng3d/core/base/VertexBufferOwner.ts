module feng3d {


	/**
	 * 顶点数据拥有者
	 * @author feng 2015-1-14
	 */
    export class VertexBufferOwner extends Component {
        public context3DBufferOwner: Context3DBufferOwner;

        protected _numVertices: number;

        private _vaIdList: string[] = [];
        /** 顶点属性数据缓存字典 */
        private vaBufferDic = {};
        /** 顶点数据长度字典 */
        private data32PerVertexDic = {};
        /** 顶点数据字典 */
        protected vertexDataDic = {};

        /** 数据有效(与脏相反)标记字典 */
        private dataValidDic = {};

		/**
		 * 创建顶点数据拥有者
		 */
        constructor() {
            super();
            this.context3DBufferOwner = new Context3DBufferOwner();
        }

		/**
		 * 顶点个数
		 */
        public get numVertices(): number {
            return this._numVertices;
        }

        public set numVertices(value: number) {
            if (this._numVertices != value) {
                for (var key in this.vaBufferDic) {
                    if (this.vaBufferDic.hasOwnProperty(key)) {
                        var vaBuffer: VABuffer = this.vaBufferDic[key];
                        vaBuffer.invalid();
                    }
                }
            }
            this._numVertices = value;
        }

		/**
		 * 注册顶点数据
		 * @param dataTypeId
		 * @param data32PerVertex
		 */
        public mapVABuffer(dataTypeId: string, data32PerVertex: number) {
            this.data32PerVertexDic[dataTypeId] = data32PerVertex;
            this.vertexDataDic[dataTypeId] = [];
            this._vaIdList.push(dataTypeId);
            this.vaBufferDic[dataTypeId] = this.context3DBufferOwner.mapContext3DBuffer(dataTypeId, this.updateVABuffer);
        }

		/**
		 * 更新顶点数据缓冲
		 * @param vaBuffer
		 */
        private updateVABuffer(vaBuffer: VABuffer) {
            var data32PerVertex: number = this.getVALen(vaBuffer.dataTypeId);
            var data: number[] = this.getVAData(vaBuffer.dataTypeId);
            vaBuffer.update(data, this.numVertices, data32PerVertex);
        }

		/**
		 * 使顶点数据失效
		 * @param dataTypeId
		 */
        public invalidVAData(dataTypeId: string) {
            this.dataValidDic[dataTypeId] = false;
            this.context3DBufferOwner.markBufferDirty(dataTypeId);
        }

		/**
		 * 获取顶点属性长度(1-4)
		 * @param dataTypeId 数据类型编号
		 * @return 顶点属性长度
		 */
        public getVALen(dataTypeId: string): number {
            return this.data32PerVertexDic[dataTypeId];
        }

		/**
		 * 设置顶点属性数据
		 * @param dataTypeId 数据类型编号
		 * @param data 顶点属性数据
		 */
        public setVAData(dataTypeId: string, data: number[]) {
            var vaLen: number = this.getVALen(dataTypeId);
            assert(data.length == this.numVertices * vaLen, "数据长度不对，更新数据之前需要给SubGeometry.numVertices赋值");
            this.vertexDataDic[dataTypeId] = data;
            this.context3DBufferOwner.markBufferDirty(dataTypeId);

            this.dataValidDic[dataTypeId] = true;

            this.notifyVADataChanged(dataTypeId);
        }

		/**
		 * 获取顶点属性数据
		 * @param dataTypeId 数据类型编号
		 * @param needUpdate 是否需要更新数据
		 * @return 顶点属性数据
		 */
        public getVAData(dataTypeId: string): number[] {
            if (!this.dataValidDic[dataTypeId])
                this.updateVAdata(dataTypeId);
            this.dataValidDic[dataTypeId] = true;

            return this.vertexDataDic[dataTypeId];
        }

		/**
		 * 通知数据发生变化<br/>
		 * 通常会在setVAData后被调用<br/>
		 * 处理某数据改变后对其他数据造成的影响<br/>
		 * 比如顶点数据发生变化后法线、切线等数据就变得无效了
		 * @param dataTypeId 数据类型编号
		 */
        protected notifyVADataChanged(dataTypeId: string) {

        }

		/**
		 * 更新顶点数据
		 * @param dataTypeId 数据类型编号
		 */
        protected updateVAdata(dataTypeId: string) {

        }

        /** 顶点属性编号列表 */
        public get vaIdList(): string[] {
            return this._vaIdList;
        }

		/**
		 * Fagal编号中心
		 */
        public get _(): any {
            return FagalIdCenter.instance;
        }
    }
}
