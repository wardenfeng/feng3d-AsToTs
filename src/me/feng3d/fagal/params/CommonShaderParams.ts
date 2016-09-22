module feng3d
{
	

	/**
	 * 通用渲染参数
	 * @author feng 2015-12-1
	 */
	export class CommonShaderParams extends Component
	{
		//-----------------------------------------
		//		通用渲染参数
		//-----------------------------------------
		/** 是否有漫反射贴图 */
		public hasDiffuseTexture:number;

		/** 是否使用漫反射函数 */
		public usingDiffuseMethod:number;

		public useAmbientTexture:number;

		public alphaThreshold:number = 0;

		/** 是否需要uv坐标 */
		public needsUV:number;

		/**
		 * 通用渲染参数
		 */
		constructor()
		{
			super();
		}

		/**
		 * 初始化
		 */
		public init()
		{
			this.hasDiffuseTexture = 0;
			this.needsUV = 0;
		}
	}
}
