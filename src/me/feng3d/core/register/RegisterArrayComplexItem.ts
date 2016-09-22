module feng3d {


	/**
	 * 寄存器数组复杂元素
	 * @author feng 2014-11-3
	 */
    export class RegisterArrayComplexItem extends RegisterArrayItem {
        private _complexArgs: any[];

		/**
		 * 创建一个寄存器数组复杂元素
		 * @param registerArray			所属寄存器数组
		 * @param complexArgs			复杂参数（用来计算所在寄存器数组中的索引值）
		 * @param arrayIndex			起始索引值
		 */
        constructor(registerArray: RegisterArray, complexArgs: any[], startIndex: number) {
            super(registerArray, startIndex);
            this._complexArgs = complexArgs;

        }

		/**
		 * 复杂参数（用来计算所在寄存器数组中的索引值）
		 */
        public get complexArgs(): any[] {
            return this._complexArgs;
        }

		/**
		 * @inheritDoc
		 */
        public toString(): string {
            var _numStr: string = this._complexArgs.join("+");

            if (Register.TO_STRING == Register.NAME)
                return this.regId + "[" + _numStr + "+" + this._arrayIndex + "]";

            if (this._regType != RegisterType.OP && this._regType != RegisterType.OC)
                return this.regType + "[" + _numStr + "+" + (this._arrayIndex + this._registerArray.index) + "]";
            return this._regType;
        }
    }
}
