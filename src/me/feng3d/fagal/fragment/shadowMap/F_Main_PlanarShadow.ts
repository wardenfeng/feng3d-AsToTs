module feng3d
{
	

	
	

	/**
	 * 深度图片段主程序
	 * @author feng 2015-5-30
	 */
	export class F_Main_PlanarShadow extends FagalMethod
	{
		/**
		 * 创建深度图片段主程序
		 */
		constructor()
		{
            super();
			this._shaderType = Context3DProgramType.FRAGMENT;
		}

		/**
		 * @inheritDoc
		 */
		public runFunc()
		{
			var _ = FagalRE.instance.space;

			_.mov(_._oc, _.shadowColorCommonsData_fc_vector);
		}
	}
}
