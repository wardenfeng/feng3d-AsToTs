module feng3d {
	/**
	 * sprite动画集合
	 * @author feng 2015-9-18
	 */
    export class SpriteSheetAnimationSet extends AnimationSetBase implements IAnimationSet {
		/**
		 * 创建sprite动画集合
		 */
        constructor() {
            super();
        }

		/**
		 * @inheritDoc
		 */
        public activate(shaderParams: ShaderParams, pass: MaterialPassBase) {
            var animationShaderParams: AnimationShaderParams = shaderParams.getOrCreateComponentByClass(AnimationShaderParams);
            animationShaderParams.useSpriteSheetAnimation++;
        }
    }
}