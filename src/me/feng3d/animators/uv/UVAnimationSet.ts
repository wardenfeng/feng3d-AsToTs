module feng3d {

	/**
	 * UV动画集合
	 * @author feng 2014-5-20
	 */
    export class UVAnimationSet extends AnimationSetBase implements IAnimationSet {
		/**
		 * 创建UV动画集合实例
		 */
        constructor() {
            super();
        }

		/**
		 * @inheritDoc
		 */
        public activate(shaderParams: ShaderParams, pass: MaterialPassBase) {
            var animationShaderParams: AnimationShaderParams = shaderParams.getOrCreateComponentByClass(AnimationShaderParams);
            animationShaderParams.useUVAnimation++;
        }
    }
}
