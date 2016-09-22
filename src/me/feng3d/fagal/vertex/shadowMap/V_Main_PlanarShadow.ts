module feng3d
{
	/**
	 * 平面阴影顶点主程序
	 * @author feng 2015-5-30
	 */
	export class V_Main_PlanarShadow extends FagalMethod
	{
		/**
		 * 构建 深度图顶点主程序
		 */
		constructor()
		{
            super();
			this._shaderType = Context3DProgramType.VERTEX;
		}

		/**
		 * @inheritDoc
		 */
		public runFunc()
		{
			var _ = FagalRE.instance.space;

			this.buildAnimationAGAL();

			var outPosition:Register = _.getFreeTemp("投影后的坐标");
			//计算投影
			_.m44(outPosition, _.animatedPosition_vt_4, _.projection_vc_matrix);
			//输出顶点坐标数据			
			_.mov(_._op, outPosition);
			//把顶点投影坐标输出到片段着色器
			_.mov(_.positionProjected_v, outPosition);
		}

		/**
		 * 生成动画代码
		 */
		protected buildAnimationAGAL()
		{
			var animationShaderParams:AnimationShaderParams = this.shaderParams.getOrCreateComponentByClass(AnimationShaderParams);

			switch (animationShaderParams.animationType)
			{
				case AnimationType.NONE:
					V_BaseAnimation();
					break;
				case AnimationType.VERTEX_CPU:
					V_VertexAnimationCPU();
					break;
				case AnimationType.VERTEX_GPU:
					V_VertexAnimationGPU();
					break;
				case AnimationType.SKELETON_CPU:
					V_SkeletonAnimationCPU();
					break;
				case AnimationType.SKELETON_GPU:
					V_SkeletonAnimationGPU();
					break;
				case AnimationType.PARTICLE:
					V_Particles();
					break;
				default:
					throw new Error(AnimationType.PARTICLE + "类型动画缺少FAGAL代码");
			}
		}
	}
}
