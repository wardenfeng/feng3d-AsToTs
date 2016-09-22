module feng3d {

	/**
	 * 顶点VA数据缓冲
	 * @author feng 2014-8-28
	 */
    export class VADataBuffer {
        /** 要在缓存区中存储的顶点数量。单个缓存区中的最大顶点数为 65535。 */
        public numVertices: number;
        /** 与每个顶点关联的 32 位（4 字节）数据值的数量。每个顶点的 32 位数据元素数量最多为 64 个（或 256 个字节）。请注意，顶点着色器程序在任何给定时间只能访问 8 个属性寄存器。使用 SetVertextBufferAt() 在顶点缓存区内选择属性。  */
        public data32PerVertex: number;
        /** 顶点数据 */
        public data: number[];

        /** 缓存字典 可在多个寄存器共享数据缓存时使用同一个 */
        private bufferItemDic = new Map<Context3D,VertexBufferItem>();
        /** 是否无效 */
        private invalid: boolean = true;
        /** 缓存是否无效 */
        private bufferInvalid: boolean = true;

		/**
		 * 创建顶点VA数据缓冲
		 */
        constructor() {
        }

		/**
		 * 获取顶点缓冲项
		 * @param context3D		3d环境
		 * @return 				顶点缓冲项
		 */
        public getBufferItem(context3D: Context3D): VertexBufferItem {
            var vertexBufferItem: VertexBufferItem;
            //处理 缓存无效标记
            if (this.bufferInvalid) {
                this.bufferInvalid = false;
                this.invalid = false;
            }
            //处理 数据无效标记
            if (this.invalid) {
                for (var key in this.bufferItemDic) {
                    if (this.bufferItemDic.hasOwnProperty(key)) {
                        vertexBufferItem = this.bufferItemDic[key];
                        vertexBufferItem.invalid = true;
                    }
                }
                this.invalid = false;
            }

            vertexBufferItem = this.bufferItemDic.get(context3D);
            if (vertexBufferItem == null) {
                vertexBufferItem = new VertexBufferItem(context3D, this.numVertices, this.data32PerVertex);
                this.bufferItemDic.push(context3D,vertexBufferItem);
            }

            if (vertexBufferItem.invalid) {
                vertexBufferItem.uploadFromVector(this.data, 0, this.numVertices);
            }

            return vertexBufferItem;
        }

		/**
		 * 更新数据
		 * @param data 				顶点数据
		 * @param numVertices 		要在缓存区中存储的顶点数量。单个缓存区中的最大顶点数为 65535。
		 * @param data32PerVertex 	与每个顶点关联的 32 位（4 字节）数据值的数量。每个顶点的 32 位数据元素数量最多为 64 个（或 256 个字节）。请注意，顶点着色器程序在任何给定时间只能访问 8 个属性寄存器。使用 SetVertextBufferAt() 在顶点缓存区内选择属性。
		 */
        public update(data: number[], numVertices: number, data32PerVertex: number) {
            if (!data || numVertices == 0)
                throw new Error("顶点缓存不接收空数组");
            this.invalid = true;
            if (!this.data || this.data.length != data.length) {
                this.bufferInvalid = true;
            }

            this.data = data;
            this.numVertices = numVertices;
            this.data32PerVertex = data32PerVertex;
        }
    }
}
