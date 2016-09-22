module feng3d
{
	/**
	 * 顶点动画集合
	 * @author feng 2014-5-30
	 */
	export class VertexAnimationSet extends AnimationSetBase implements IAnimationSet
	{
		private _numPoses:number;

		/**
		 * 创建一个顶点动画集合
		 * @param numPoses		姿势数量
		 */
		constructor(numPoses:number = 2)
		{
			super();
			this._numPoses = numPoses;
		}

		/**
		 * 姿势数量
		 */
		public get numPoses():number
		{
			return this._numPoses;
		}

		/**
		 * @inheritDoc
		 */
		public activate(shaderParams:ShaderParams, pass:MaterialPassBase)
		{
			var animationShaderParams:AnimationShaderParams = shaderParams.getOrCreateComponentByClass(AnimationShaderParams);
			if (this.getUsesCPU())
				animationShaderParams.animationType = AnimationType.VERTEX_CPU;
			else
				animationShaderParams.animationType = AnimationType.VERTEX_GPU;
		}
	}
}
