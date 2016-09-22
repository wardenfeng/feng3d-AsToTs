module feng3d
{
	

	/**
	 * 寄存器单元组合
	 * @author feng 2014-10-22
	 */
	export class RegisterComponentSelection implements IField
	{
		private _register:Register;
		private _prop:string;
		private _regType:string;

		private _regId:string;

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
		 * 创建一个寄存器单元组合
		 * @param register 		寄存器类型
		 * @param prop 			组合名称
		 */
		constructor(register:Register, prop:string)
		{
			this._register = register;
			this._prop = prop;
			this._regType = register.regType;

			this._regId = register.regId;

			// Validate components
			if (prop.length > 4)
				throw new Error("无效寄存器分量: " + this._register);
			for (var i:number = 0; i < prop.length; i++)
			{
				if (!RegisterComponent.valid(prop.substr(i, 1)))
					throw new Error("无效寄存器分量: " + this._register);
			}
		}

		/**
		 * @inheritDoc
		 */
		public get regType():string
		{
			return this._regType;
		}

		/**
		 * @inheritDoc
		 */
		public toString():string
		{
			return this._register + ((this._prop.length > 0) ? ("." + this._prop) : "");
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
