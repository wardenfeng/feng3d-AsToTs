module feng3d
{
	

	/**
	 * 雾渲染参数
	 * @author feng 2015-12-1
	 */
	export class FogShaderParams extends Component
	{
		/**
		 * 是否渲染雾
		 */
		public useFog:number;

		/**
		 * 雾渲染参数
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
			this.useFog = 0;
		}
	}
}
