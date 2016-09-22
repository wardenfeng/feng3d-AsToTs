module feng3d {

	/**
	 * Context3D 顶点字节数组常量数据缓存
	 * @author feng 2014-8-20
	 */
    export class VCByteArrayBuffer extends ConstantsBuffer {
        private data: ByteArray;

		/**
		 * 创建一个顶点字节数组常量数据缓存
		 * @param dataTypeId		数据编号
		 * @param updateFunc		数据更新回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }

		/**
		 * @inheritDoc
		 */
        public doBuffer(context3D: Context3D) {
            this.doUpdateFunc();

            context3D.setProgramConstantsFromByteArray(Context3DProgramType.VERTEX, this.firstRegister, 1, this.data, this.data.position);
        }
    }
}
