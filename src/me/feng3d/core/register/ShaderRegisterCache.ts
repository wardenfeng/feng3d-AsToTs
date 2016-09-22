module feng3d {







	/**
	 * 渲染寄存器缓存
	 * @author feng 2014-6-5
	 */
    export class ShaderRegisterCache {
        /* 实例 */
        private static _instance: ShaderRegisterCache;
        /** 脏标记 */
        private static _dirty: boolean = true;

        /** 数据寄存器缓存 */
        private _dataRegisterDic;

        /** 使用到的寄存器个数 */
        private usedDataRegisterNum: number;

        /** 寄存器池字典 */
        private registerPoolDic;

        //		/** 寄存器配置 */
        //		private registerConfig:Array = //
        //			[[RegisterType.VA, 8], //
        //			[RegisterType.VC, 128], //
        //			[RegisterType.VT, 8], //
        //			[RegisterType.V, 8], //
        //			[RegisterType.FS, 8], //
        //			[RegisterType.FC, 28], //
        //			[RegisterType.FT, 8], //
        //			[RegisterType.OP, 1], //
        //			[RegisterType.OC, 1], //
        //			];

		/**
		 * AGAL2寄存器配置
		 */
        private static registerConfig = //
        [[RegisterType.VA, 8], //
            [RegisterType.VC, 250], //
            [RegisterType.VT, 26], //
            [RegisterType.V, 10], //
            [RegisterType.FS, 8], //
            [RegisterType.FC, 64], //
            [RegisterType.FT, 16], //
            [RegisterType.OP, 1], //
            [RegisterType.OC, 1], //
        ];

		/**
		 * 创建渲染寄存器缓存
		 */
        constructor() {
            if (ShaderRegisterCache._instance)
                throw new Error("ShaderRegisterCache 单例");
            ShaderRegisterCache._instance = this;

            this.init();
        }

		/**
		 * 初始化
		 */
        private init() {
            this._dataRegisterDic = {};
            this.registerPoolDic = {};
            this.usedDataRegisterNum = 0;

            for (var i: number = 0; i < ShaderRegisterCache.registerConfig.length; i++) {
                this.registerPoolDic[ShaderRegisterCache.registerConfig[i][0]] = new RegisterPool(as(ShaderRegisterCache.registerConfig[i][0], String), as(ShaderRegisterCache.registerConfig[i][1], Number));
            }
            ShaderRegisterCache._dirty = false;
        }

		/**
		 * 重置
		 */
        private reset() {
            this._dataRegisterDic = {};
            this.usedDataRegisterNum = 0;

            this.registerPoolDic.forEach(registerPool => {
                registerPool.reset();
            });
            ShaderRegisterCache._dirty = false;
        }

		/**
		 * 回收不需要再使用的临时寄存器
		 * @param register 不需要再使用的临时寄存器
		 */
        public removeTempUsage(dataTypeId: string) {
            var register: Register = FagalRegisterCenter.dataRegisterDic[dataTypeId];

            if (!register)
                return;

            var _fragmentTempCache: RegisterPool = this.registerPoolDic[register.regType];
            _fragmentTempCache.removeUsage(register);
        }

		/**
		 * 申请数据寄存器
		 * @param dataType 数据类型
		 * @param numRegister 寄存器的个数(默认1个)
		 * @return 数据寄存器
		 */
        public requestRegister(dataTypeId: string) {
            if (this._dataRegisterDic[dataTypeId])
                return;

            var register: Register = FagalRegisterCenter.dataRegisterDic[dataTypeId];

            var registerPool: RegisterPool = this.registerPoolDic[register.regType];
            var registerValue: RegisterValue = registerPool.requestFreeRegisters(register.regLen);

            registerValue.dataTypeId = register.regId;

            register.index = registerValue.index;

            this._dataRegisterDic[dataTypeId] = registerValue;
            this.usedDataRegisterNum++;
        }

		/**
		 * 是否存在 dataType 类型寄存器
		 * @param dataType 数据类型
		 * @return
		 */
        public hasReg(dataType: string): boolean {
            return this._dataRegisterDic[dataType] != null;
        }

		/**
		 * 注销
		 */
        public dispose() {

            this.registerPoolDic.forEach(registerPool => {
                registerPool.dispose();
            });

            this._dataRegisterDic = null;
            this.registerPoolDic = null;
        }

		/**
		 * 实例
		 */
        public static get instance(): ShaderRegisterCache {
            ShaderRegisterCache._instance = ShaderRegisterCache._instance || new ShaderRegisterCache();
            if (ShaderRegisterCache._dirty)
                ShaderRegisterCache._instance.reset();
            return ShaderRegisterCache._instance;
        }

		/**
		 * 使缓存失效
		 */
        public static invalid() {
            ShaderRegisterCache._dirty = true;
        }

		/**
		 * 数据寄存器缓存
		 */
        public get dataRegisterDic() {
            return this._dataRegisterDic;
        }

    }
}


