module feng3d {

	/**
	 * Context3D 片段向量常量数据缓存
	 * @author feng 2014-8-20
	 */
    export class FCVectorBuffer extends ConstantsBuffer {
        /** 常量向量数据 */
        public data: number[];

		/**
		 * 创建片段向量常量数据缓存
		 * @param dataTypeId 		数据编号
		 * @param updateFunc 		数据更新回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }

		/**
		 * @inheritDoc
		 */
        public doBuffer(context3D: Context3D) {
            this.doUpdateFunc();

            context3D.setProgramConstantsFromVector(Context3DProgramType.FRAGMENT, this.firstRegister, this.data, this.numRegisters);
        }

		/**
		 * 更新数据
		 * @param data
		 * @param numRegisters
		 *
		 */
        public update(data: number[], numRegisters: number = -1) {
            assert(data.length % 4 == 0, "常量数据个数必须为4的倍数！");

            this.data = data;
            this.numRegisters = numRegisters;
        }
    }
}
