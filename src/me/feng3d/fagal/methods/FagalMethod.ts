module feng3d {

	/**
	 * Fagal函数
	 * @author feng 2014-10-23
	 */
    export abstract class FagalMethod {
        protected _shaderType: string;

		/**
		 * 构建一个Fagal函数
		 */
        constructor() {
        }

		/**
		 * 渲染参数
		 */
        public get shaderParams(): ShaderParams {
            return FagalRE.instance.context3DCache.shaderParams;
        }

		/**
		 * 着色器类型
		 */
        public get shaderType(): string {
            return this._shaderType;
        }

		/**
		 * 运行函数，产生agal代码，最核心部分
		 */
        public abstract runFunc();
    }
}


