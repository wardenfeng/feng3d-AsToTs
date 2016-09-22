module feng3d {

	/**
	 * 寄存器(链表)
	 * @author feng 2014-6-9
	 */
    export class Register implements IRegister {
		/**
		 * 输出寄存器名称
		 */
        public static NAME: string = "name";

		/**
		 * 输出寄存器值
		 */
        public static VALUE: string = "value";

		/**
		 * 寄存器输出方式
		 */
        public static TO_STRING: string = Register.NAME;

		/**
		 * 寄存器中元素数组
		 */
        private static COMPONENTS = ["x", "y", "z", "w"];

        protected _regType: string;
        protected _index: number = -1;

        private _regId: string;

        /** 描述 */
        public description: string;

        public get valueString(): string {
            if (this._regType != RegisterType.OP && this._regType != RegisterType.OC)
                return this._regType + this._index;
            return this._regType;
        }

        public get nameString(): string {
            return this.regId;
        }

		/**
		 * 寄存器编号
		 */
        public get index(): number {
            return this._index;
        }

        public set index(value: number) {
            this._index = value;
        }

        /** 寄存器id */
        public get regId(): string {
            return this._regId;
        }

        public get regType(): string {
            return this._regType;
        }

		/**
		 * 创建一个寄存器
		 * @param regId			寄存器id
		 */
        constructor(regId: string) {
            this._regId = regId;

            this.init();
        }

		/**
		 * 初始化
		 */
        private init() {
            var bufferType: Context3DBufferType = Context3DBufferTypeManager.getBufferType(this._regId);
            this._regType = bufferType.registerType;
            this._index = -1;
        }

		/**
		 * @inheritDoc
		 */
        public toString(): string {
            if (Register.TO_STRING == Register.NAME)
                return this.nameString;

            return this.valueString;
        }

		/**
		 * 寄存器分量
		 * @param component 分量编号
		 * @return 寄存器分量
		 */
        public c(component: number): RegisterComponent {
            return new RegisterComponent(this, Register.COMPONENTS[component]);
        }

		/**
		 * 获取寄存器分量
		 * @param name 分量名称
		 * @return
		 */
        public getProperty(name): RegisterComponent | RegisterComponentSelection {
            var components: string = name;

            if (components.length == 0)
                throw new Error("无效寄存器分量: " + this + "." + components);

            if (components.length > 4)
                throw new Error("无效寄存器分量: " + this + "." + components);
            for (var i: number = 0; i < components.length; i++) {
                if (!RegisterComponent.valid(components.substr(i, 1)))
                    throw new Error("无效寄存器分量: " + this + "." + components);
            }

            if (components.length == 1) {
                return new RegisterComponent(this, components.toLowerCase());
            }
            return new RegisterComponentSelection(this, components.toLowerCase());
        }

        /**
         * @inheritDoc
         */
        public callProperty(name, ...parameters) {
            return null;
        }

		/**
		 * @inheritDoc
		 */
        public get desc(): string {
            var str: string = this.regId + ":";
            if (this.index != -1) {
                str += this.valueString;
            }

            if (this.description && this.description.length > 0)
                return str += "[" + this.description + "]";
            return str;
        }

		/**
		 * @inheritDoc
		 */
        public get regLen(): number {
            return 1;
        }

		/**
		 * 清理寄存器值
		 */
        public clear() {
            this.index = -1;
        }
    }
}
