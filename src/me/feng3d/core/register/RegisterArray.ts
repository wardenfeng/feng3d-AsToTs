module feng3d {

	/**
	 * 寄存器数组
	 * @author feng 2014-11-4
	 */
    export class RegisterArray extends Register {
        private _regs: Register[];

		/**
		 * 创建一个寄存器数组
		 * @param regId		寄存器id
		 */
        constructor(regId: string) {
            super(regId);
            this._regs = [];
            this._regs.length = 1;
        }

		/**
		 * 第一个寄存器
		 */
        public get first(): Register {
            return this.getReg(0);
        }

		/**
		 * 最后一个寄存器
		 */
        public get last(): Register {
            return this.getReg(this._regs.length - 1);
        }

		/**
		 * 获取寄存器链表中的元素
		 * @param $index 链表中的位置
		 * @return 寄存器
		 */
        public getReg($index: number): Register {
            if (this._regs.length < $index + 1) {
                this._regs.length = $index + 1
            }

            if (!this._regs[$index]) {
                var reg: RegisterArrayItem = new RegisterArrayItem(this, $index);
                this._regs[$index] = reg;
            }
            return this._regs[$index];
        }

		/**
		 * 获取寄存器数组中的寄存器
		 * @param args 索引信息
		 * @return
		 */
        public getReg1(...args): Register {
            var index: number = 0;

            var complexArgs = [];

            for (var i: number = 0; i < args.length; i++) {
                if (is(args[i], Number)) {
                    index += args[i];
                }
                else {
                    complexArgs.push(args[i]);
                }
            }
            if (complexArgs.length == 0)
                return this.getReg(index);

            return new RegisterArrayComplexItem(this, complexArgs, index);
        }

		/**
		 * @inheritDoc
		 */
        public get regLen(): number {
            return this._regs.length;
        }

        public set regLen(value: number) {
            this._regs.length = value;
        }

		/**
		 * @inheritDoc
		 */
        public clear() {
            this.regLen = 1;

            super.clear();
        }
    }
}
