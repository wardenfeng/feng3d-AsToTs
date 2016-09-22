module feng3d
{


	/**
	 * 寄存器类型
	 * @author feng 2014-6-9
	 */
	export class RegisterType
	{
		/** 顶点属性寄存器 */
		public static VA:string = "va";

		/** 顶点程序常量寄存器 */
		public static VC:string = "vc";

		/** 顶点临时寄存器 */
		public static VT:string = "vt";

		/** 顶点程序输出寄存器 */
		public static OP:string = "op";

		/**变量寄存器 */
		public static V:string = "v";

		/** 片段程序的纹理寄存器 */
		public static FS:string = "fs";

		/** 片段程序常量寄存器 */
		public static FC:string = "fc";

		/** 片段程序临时寄存器 */
		public static FT:string = "ft";

		/** 片段程序输出寄存器 */
		public static OC:string = "oc";

		/**
		 * 是否常量
		 * @param regType		寄存器类型
		 */
		public static isConst(regType:string):boolean
		{
			return regType == RegisterType.VC || regType == RegisterType.FC;
		}

		/**
		 * 是否临时变量
		 * @param regType		寄存器类型
		 */
		public static isTemp(regType:string):boolean
		{
			return regType == RegisterType.VT || regType == RegisterType.FT;
		}

		/**
		 * 是否只读
		 * @param regType		寄存器类型
		 * @return
		 */
		public static isReadOnly(regType:string):boolean
		{
			switch (regType)
			{
				case RegisterType.VA:
					return true;
				case RegisterType.VC:
					return true;
				case RegisterType.VT:
					return false;
				case RegisterType.OP:
					return false;
				case RegisterType.V:
					return false;
				case RegisterType.FS:
					return true;
				case RegisterType.FC:
					return true;
				case RegisterType.FT:
					return false;
				case RegisterType.OC:
					return false;
			}
			throw new Error("错误寄存器类型");
		}

		/**
		 * 是否可以在顶点寄存器中出现
		 * @param regType		寄存器类型
		 * @return
		 */
		public static inVertex(regType:string):boolean
		{
			switch (regType)
			{
				case RegisterType.VA:
					return true;
				case RegisterType.VC:
					return true;
				case RegisterType.VT:
					return true;
				case RegisterType.OP:
					return true;
				case RegisterType.V:
					return true;
				case RegisterType.FS:
					return false;
				case RegisterType.FC:
					return false;
				case RegisterType.FT:
					return false;
				case RegisterType.OC:
					return false;
			}
			throw new Error("错误寄存器类型");
		}

		/**
		 * 是否可以在片段寄存器中出现
		 * @param regType		寄存器类型
		 * @return
		 */
		public static inFragment(regType:string):boolean
		{
			switch (regType)
			{
				case RegisterType.VA:
					return false;
				case RegisterType.VC:
					return false;
				case RegisterType.VT:
					return false;
				case RegisterType.OP:
					return false;
				case RegisterType.V:
					return true;
				case RegisterType.FS:
					return true;
				case RegisterType.FC:
					return true;
				case RegisterType.FT:
					return true;
				case RegisterType.OC:
					return true;
			}
			throw new Error("错误寄存器类型");
		}

		/**
		 * 是否为输入数据寄存器
		 * @param regType		寄存器类型
		 * @return
		 */
		public static isInputDataRegister(regType:string):boolean
		{
			switch (regType)
			{
				case RegisterType.VA:
					return true;
				case RegisterType.VC:
					return true;
				case RegisterType.VT:
					return false;
				case RegisterType.OP:
					return false;
				case RegisterType.V:
					return false;
				case RegisterType.FS:
					return true;
				case RegisterType.FC:
					return true;
				case RegisterType.FT:
					return false;
				case RegisterType.OC:
					return false;
			}
			throw new Error("错误寄存器类型");
		}
	}
}
