module feng3d {

	/**
	 * 顶点数据缓冲
	 * @author feng 2014-8-14
	 */
    export class VABuffer extends RegisterBuffer {
		/**
		 * 顶点数据缓冲格式数组
		 */
        private static bufferFormats: string[] = [null, Context3DVertexBufferFormat.FLOAT_1, Context3DVertexBufferFormat.FLOAT_2, Context3DVertexBufferFormat.FLOAT_3, Context3DVertexBufferFormat.FLOAT_4];

        /** 顶点数据缓存(真正的数据缓存) */
        public dataBuffer: VADataBuffer = new VADataBuffer();

        private _format: string;

		/**
		 * 来自 Context3DVertexBufferFormat 类的值，指定此属性的数据类型。
		 */
        public get format(): string {
            return this._format;
        }

		/**
		 * 创建顶点数据缓存
		 * @param dataTypeId 数据编号
		 * @param updateFunc 数据更新回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }

		/**
		 * @inheritDoc
		 */
        public doBuffer(context3D: Context3D) {
            this.doUpdateFunc();

            var vertexBufferItem: VertexBufferItem = this.dataBuffer.getBufferItem(context3D);
            vertexBufferItem.setVertexBufferAt(this.firstRegister, 0, this.format);
        }

		/**
		 * 更新数据
		 * @param data 				顶点数据
		 * @param numVertices 		要在缓存区中存储的顶点数量。单个缓存区中的最大顶点数为 65535。
		 * @param data32PerVertex 	与每个顶点关联的 32 位（4 字节）数据值的数量。每个顶点的 32 位数据元素数量最多为 64 个（或 256 个字节）。请注意，顶点着色器程序在任何给定时间只能访问 8 个属性寄存器。使用 SetVertextBufferAt() 在顶点缓存区内选择属性。
		 */
        public update(data: number[], numVertices: number, data32PerVertex: number) {
            assert(1 <= data32PerVertex && data32PerVertex <= 4);

            this._format = VABuffer.bufferFormats[data32PerVertex];
            this.dataBuffer.update(data, numVertices, data32PerVertex);
        }
    }
}
