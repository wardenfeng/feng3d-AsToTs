module feng3d {

	/**
	 * 寄存器池
	 * @author feng 2014-6-9
	 */
    export class RegisterPool {
        private _regType: string;
        private _regCount: number;

        /** 使用中的寄存器数组 */
        private usedRegisters: any[];

		/**
		 * 创建寄存器池
		 * @param regType 寄存器类型
		 * @param regCount 寄存器总数
		 */
        constructor(regType: string, regCount: number) {
            this._regType = regType;
            this._regCount = regCount;

            this.init();
        }

		/**
		 * 寄存器总数
		 */
        public get regCount(): number {
            return this._regCount;
        }

		/**
		 * 寄存器类型
		 */
        public get regType(): string {
            return this._regType;
        }

		/**
		 * 初始化
		 */
        private init() {
            this.usedRegisters = [];
        }

		/**
		 * 获取寄存器
		 * @param num 寄存器个数
		 */
        public requestFreeRegisters(num: number): RegisterValue {
            var index: number = this.find(num);
            if (index == -1)
                throw new Error(this._regType + "寄存器不够用!");
            var reg: RegisterValue = new RegisterValue();
            reg.regType = this._regType;
            reg.index = index;
            reg.length = num;

            for (var i: number = 0; i < num; i++) {
                this.usedRegisters[index + i] = true;
            }
            return reg;
        }

		/**
		 * 移除使用寄存器
		 * @param register 寄存器
		 */
        public removeUsage(register: Register) {
            //只允许临时寄存器移除寄存器
            if (RegisterType.isTemp(register.regType)) {
                for (var i: number = 0; i < register.regLen; i++) {
                    this.usedRegisters[register.index + i] = false;
                }
            }
        }

		/**
		 * 销毁
		 */
        public dispose() {
            this.usedRegisters = null;
        }

		/**
		 * 重置
		 */
        public reset() {
            this.usedRegisters = [];
        }

		/**
		 * 寻找连续可用寄存器编号
		 * @param num 个数
		 * @return 如果找到返回非负值，未找到返回-1
		 */
        private find(num: number = 1): number {
            var cNum: number = 0;
            for (var i: number = 0; i < this._regCount; i++) {
                if (!this.usedRegisters[i])
                    cNum++;
                else
                    cNum = 0;
                if (cNum == num)
                    return i - cNum + 1;
            }
            return -1;
        }
    }
}


