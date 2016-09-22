module feng3d
{
	

	/**
	 * Fagal函数运行环境(FagalMethodRuntimeEnvironment)
	 * @author feng 2014-10-24
	 */
	export class FagalRE
	{
		private static _instance:FagalRE;

		private _context3DCache:Context3DCache;

		private _shaderType:string;

		private _space:FagalRESpace;

		public runState:string;

		/**
		 * 数据id字典
		 */
		static idDic = {};

		/**
		 * 添加3d缓冲编号配置
		 * @param configs
		 */
		public static addBufferID(configs)
		{
			for (var i:number = 0; i < configs.length; i++)
			{
				FagalRE.idDic[configs[i][0]] = configs[i];
			}
		}

		/**
		 * 创建一个Fagal函数运行环境
		 */
		constructor()
		{
			if (FagalRE._instance)
				throw new Error("该类为单例");
			FagalRE._instance = this;
		}

		/**
		 * Fagal运行环境空间
		 */
		public get space():any
		{
			return this._space =this._space || new FagalRESpace();
		}

		/**
		 * 3D环境缓存类(方便调试与管理渲染操作)
		 */
		public get context3DCache():Context3DCache
		{
			return this._context3DCache;
		}

		public set context3DCache(value:Context3DCache)
		{
			this._context3DCache = value;
		}

		/**
		 * 运行Fagal函数
		 * @param agalMethod Fagal函数
		 */
		public static runShader(vertexShader, fragmentShader):FagalShaderResult
		{
			return FagalRE.instance.runShader(vertexShader, fragmentShader);
		}

		/**
		 * Fagal寄存器中心
		 */
		private get registerCenter():FagalRegisterCenter
		{
			return FagalRegisterCenter.instance;
		}

		/**
		 * 运行Fagal函数
		 * @param agalMethod Fagal函数
		 */
		public runShader(vertexShader, fragmentShader):FagalShaderResult
		{
			//清理缓存
			FagalRegisterCenter.clear();
			ShaderRegisterCache.invalid();

			var shaderResult:FagalShaderResult = new FagalShaderResult();

			//运行顶点渲染函数
			shaderResult.vertexCallLog = this.run(vertexShader);
			//运行片段渲染函数
			shaderResult.fragmentCallLog = this.run(fragmentShader);

			shaderResult.print();

			return shaderResult;
		}

		/**
		 * 运行Fagal函数
		 * @param agalMethod Fagal函数
		 */
		public run(agalMethod):FagalItem[]
		{
			//Fagal函数类实例
			var agalMethodInstance:FagalMethod = ClassUtils.getInstance(agalMethod);
			//着色器类型
			this._shaderType = agalMethodInstance.shaderType;

			//运行Fagal函数
			var callLog:FagalItem[] = this.space.run(agalMethodInstance.runFunc);

			return callLog;
		}

		/**
		 * 着色器类型
		 */
		public get shaderType():string
		{
			return this._shaderType;
		}

		/**
		 * Fagal函数运行环境实例
		 */
		public static get instance():FagalRE
		{
			return FagalRE._instance || new FagalRE();
		}
	}
}
