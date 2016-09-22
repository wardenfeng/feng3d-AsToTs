module feng3d {

	/**
	 * Context3D 顶点向量常量数据缓存
	 * @author feng 2014-8-20
	 */
    export class VCVectorBuffer extends ConstantsBuffer {
        /** 静态向量数据 */
        public data: number[];

		/**
		 * 创建一个顶点向量常量数据缓存
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
            context3D.setProgramConstantsFromVector(Context3DProgramType.VERTEX, this.firstRegister, this.data, this.numRegisters);
        }

		/**
		 * 更新顶点常量数据
		 * @param data				静态向量数据
		 * @param numRegisters		需要寄存器的个数
		 */
        public update(data: number[], numRegisters: number = -1) {
            assert(data.length % 4 == 0, "常量数据个数必须为4的倍数！");

            this.data = data;
            this.numRegisters = numRegisters;
        }
    }
}
