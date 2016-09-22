module feng3d
{
	

	
	
	
	
	
	
	

	

	/**
	 * Fagal渲染结果
	 * @author feng 2015-8-8
	 */
	export class FagalShaderResult
	{
		public vertexCallLog:FagalItem[];
		public fragmentCallLog:FagalItem[];

		private _math:FagalMath;

		private agalCode:string = "";

		private regDic;


		public vertexFCode:string;
		public vertexCode:string;

		public fragmentFCode:string;
		public fragmentCode:string;

		/**
		 * 创建一个Fagal渲染结果
		 */
		constructor()
		{
		}

		/**
		 * 打印输出结果
		 */
		public print()
		{
			this.vertexFCode = this.doCallLog(this.vertexCallLog, Register.NAME);
			this.fragmentFCode = this.doCallLog(this.fragmentCallLog, Register.NAME);

			this.requestRegisterValue();

			this.vertexCode = this.doCallLog(this.vertexCallLog, Register.VALUE);
			this.fragmentCode = this.doCallLog(this.fragmentCallLog, Register.VALUE);

			logger("------------Compiling Register info------------------");

            this.regDic.forEach(register => {
				logger(register.desc);
            });

			logger("Compiling FAGAL Code:");
			logger("--------------------");
			logger(this.vertexFCode);
			logger("--------------------");
			logger(this.fragmentFCode);

			logger("Compiling AGAL Code:");
			logger("--------------------");
			logger(this.vertexCode);
			logger("--------------------");
			logger(this.fragmentCode);

			logger("------------Compiling info end------------------");
		}

		/**
		 * 根据寄存器引用计数进行申请与释放寄存器
		 * 处理寄存器值(va0,vc0....)
		 */
		public requestRegisterValue()
		{
			//使用寄存器计数字典
			var useRegDic = {};

			var callLog:FagalItem[] = this.vertexCallLog.concat(this.fragmentCallLog);

			var i:number;
			var regCountDic;
			var regId:string;
			var fagalItem:FagalItem;
			for (i = 0; i < callLog.length; i++)
			{
				fagalItem = callLog[i];

				regCountDic = fagalItem.getRegCountDic();
				for (regId in regCountDic)
				{
					//记录寄存器使用次数
					useRegDic[regId] = useRegDic[regId] + regCountDic[regId];
				}
			}

			for (i = 0; i < callLog.length; i++)
			{
				regCountDic = callLog[i].getRegCountDic();
				//申请寄存器
				for (regId in regCountDic)
				{
					//申请寄存器 此处并不会重复申请，内部有判断过滤
					this.regCache.requestRegister(regId);
				}

				//注：申请寄存器与释放临时寄存器需要分开处理，如此可避免同一个agal函数中有两个不同的数据使用相同的寄存器

				//计算使用计数，释放计数为0的临时寄存器
				for (regId in regCountDic)
				{
					//记录寄存器使用次数
					useRegDic[regId] = useRegDic[regId] - regCountDic[regId];

					//移除临时寄存器
					if (useRegDic[regId] == 0)
					{
						this.regCache.removeTempUsage(regId);
					}
				}

			}

			this.regDic = {};
			var register:Register;
			Register.TO_STRING = Register.NAME;
			for (regId in useRegDic)
			{
				assert(useRegDic[regId] == 0, "不应该存在寄存器使用次数为负数的情况");
				register = FagalRegisterCenter.dataRegisterDic[regId];
				this.regDic[register.regId] = register;
			}
		}

		private fagalCodeList;

		/**
		 * 执行Fagal函数记录
		 */
		public doCallLog(callLog:FagalItem[], type:string):string
		{
			Register.TO_STRING = type;

			this.fagalCodeList = [];

			this.math.addEventListener(FagalMathEvent.FAGALMATHEVENT_APPEND, this.onFagalCodeAppend);

			var funcName:string;
			var parameters;
			for (var i:number = 0; i < callLog.length; i++)
			{
				funcName = callLog[i].funcName;
				parameters = callLog[i].parameters;

				var func:Function = this.math[funcName];
				func.apply(null, parameters)
			}

			this.math.removeEventListener(FagalMathEvent.FAGALMATHEVENT_APPEND, this.onFagalCodeAppend);

			var fagalCode:string = this.fagalCodeList.join(FagalToken.BREAK);
			return fagalCode;
		}

		/**
		 * 寄存器缓存
		 */
		private get regCache():ShaderRegisterCache
		{
			return ShaderRegisterCache.instance;
		}

		/**
		 * Fagal数学运算
		 */
		private get math():FagalMath
		{
			if (this._math == null)
			{
				this._math = new FagalMath();
			}
			return this._math;
		}

		/**
		 * 处理Fagal数学函数事件
		 */
		private onFagalCodeAppend(event:FagalMathEvent)
		{
			this.fagalCodeList.push(event.code);
		}
	}
}
