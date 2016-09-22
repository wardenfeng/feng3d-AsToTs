module feng3d {

	/**
	 * 寄存器项
	 * @author feng 2014-10-22
	 */
    export interface IField {
		/**
		 * 寄存器类型
		 */
        regType: string;

		/**
		 * 寄存器id
		 */
        regId: string;

		/**
		 * 寄存器描述
		 */
        desc: string;

		/**
		 * 转换为字符串
		 */
        toString(): string;
    }
}
