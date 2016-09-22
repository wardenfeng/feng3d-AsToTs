module feng3d {

	/**
	 * Context3D关联寄存器的数据缓存
	 * @author feng 2014-8-14
	 */
    export abstract class RegisterBuffer extends Context3DBuffer {
        /** 需要寄存器的个数 */
        public numRegisters: number = 1;

        /** 要设置的首个寄存器的索引 */
        public firstRegister: number;

		/**
		 * 创建寄存器数据缓存
		 * @param dataTypeId 		数据编号
		 * @param updateFunc 		数据更新回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }
    }
}
