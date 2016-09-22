module feng3d {

	/**
	 * 混合因素缓存
	 * @author feng 2014-8-28
	 */
    export class BlendFactorsBuffer extends Context3DBuffer {
        /** 用于与源颜色相乘的系数。默认为 Context3DBlendFactor.ONE。 */
        public sourceFactor: string;
        /** 用于与目标颜色相乘的系数。默认为 Context3DBlendFactor.ZERO */
        public destinationFactor: string;

		/**
		 * 创建混合因素缓存
		 * @param dataTypeId	数据缓存编号
		 * @param updateFunc	更新回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }

		/**
		 * 更新混合因素缓存
		 * @param sourceFactor 用于与源颜色相乘的系数。默认为 Context3DBlendFactor.ONE。
		 * @param destinationFactor 用于与目标颜色相乘的系数。默认为 Context3DBlendFactor.ZERO。
		 * @see flash.display3D.Context3D
		 * @see flash.display3D.Context3D.setBlendFactors
		 */
        public update(sourceFactor: string, destinationFactor: string) {
            this.sourceFactor = sourceFactor;
            this.destinationFactor = destinationFactor;
        }

		/**
		 * 执行混合因素缓存
		 * @param context3D		3d环境
		 */
        public doBuffer(context3D: Context3D) {
            this.doUpdateFunc();

            context3D.setBlendFactors(this.sourceFactor, this.destinationFactor);
        }
    }
}
