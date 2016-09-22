module feng3d
{
	


	/**
	 * 阴影渲染参数
	 * @author feng 2015-12-1
	 */
	export class ShadowShaderParams extends Component
	{
		//-----------------------------------------
		//		阴影渲染参数
		//-----------------------------------------

		/**
		 * 是否使用阴影映射函数
		 */
		public usingShadowMapMethod:number;

		/**
		 * 是否使用点光源
		 */
		public usePoint:number;

		/**
		 * 是否需要投影顶点坐标数据
		 */
		public needsProjection:number;

		/**
		 * 使用近阴影渲染
		 */
		public useNearShadowMap:number;

		/**
		 * 是否需要阴影寄存器
		 */
		public needsShadowRegister:number;

		/**
		 * 阴影渲染参数
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
			this.usingShadowMapMethod = 0;
			this.usePoint = 0;
			this.needsProjection = 0;
			this.useNearShadowMap = 0;
			this.needsShadowRegister = 0;
		}
	}
}
