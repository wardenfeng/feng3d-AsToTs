module feng3d
{
	


	/**
	 * 地形渲染参数
	 * @author feng 2015-12-1
	 */
	export class TerrainShaderParams extends Component
	{
		//-----------------------------------------
		//		地形渲染参数
		//-----------------------------------------
		/** 土壤纹理个数 */
		public splatNum:number;

		/**
		 * 地形渲染参数
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
			//
			this.splatNum = 0;
		}
	}
}
