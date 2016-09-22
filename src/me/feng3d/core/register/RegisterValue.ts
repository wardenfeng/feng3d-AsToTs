module feng3d
{

	/**
	 * 寄存器值
	 * @author feng 2015-7-30
	 */
	export class RegisterValue
	{
		/**
		 * 数据类型编号
		 */
		public dataTypeId:string;

		/**
		 * 寄存器类型
		 */
		public regType:string;

		/**
		 * 寄存器索引
		 */
		public index:number;

		/**
		 * 寄存器长度
		 */
		public length:number = 1;

		/**
		 * 输出为字符串
		 */
		public toString():string
		{
			if (this.regType == RegisterType.OP || this.regType == RegisterType.OC)
				return this.regType;
			return this.regType + this.index;
		}
	}
}
