module feng3d
{
	

	/**
	 * 寄存器单元
	 * @author feng 2014-10-22
	 */
	export class RegisterComponent implements IRegisterComponent
	{
		private _register:Register;
		private _prop:string;
		private _regType:string;

		private _regId:string;

		protected _registerString:string;
		protected _nameString:string;

		/** 寄存器id */
		public get regId():string
		{
			return this._regId;
		}

		/**
		 * @private
		 */
		public set regId(value:string)
		{
			this._regId = value;
		}

		/**
		 * 创建一个寄存器单元
		 * @param register 寄存器类型
		 * @param prop 单元名称
		 */
		constructor(register:Register, prop:string)
		{
			this._prop = prop;
			this._register = register;
			this._regType = register.regType;
			this._regId = register.regId;

			if (!RegisterComponent.valid(prop))
				throw new Error("无效寄存器分量: " + this._register);
		}

		/**
		 * @inheritDoc
		 */
		public get regType():string
		{
			return this._regType;
		}

		public toString():string
		{
			return this._register + "." + this._prop;
		}

		/**
		 * 判断是否有效
		 * @param prop
		 * @return			true：有效，false：无效
		 */
		public static valid(prop:string):boolean
		{
			switch (prop)
			{
				case "x":
				case "y":
				case "z":
				case "w":
				case "r":
				case "g":
				case "b":
				case "a":
					return true;
			}
			return false;
		}

		/**
		 * @inheritDoc
		 */
		public get desc():string
		{
			return this.toString();
		}
	}
}
