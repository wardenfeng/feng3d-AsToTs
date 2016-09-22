module feng3d
{
	


	/**
	 * 粒子渲染参数
	 * @author feng 2015-12-1
	 */
	export class ParticleShaderParams extends Component
	{
		//-----------------------------------------
		//		粒子渲染参数
		//-----------------------------------------
		/** 是否持续 */
		public usesDuration:boolean;
		/** 是否延时 */
		public usesDelay:boolean;
		/** 是否循环 */
		public usesLooping:boolean;

		/** 时间静态 */
		public ParticleTimeLocalStatic:boolean;
		public ParticleVelocityGlobal:boolean;
		public ParticleVelocityLocalStatic:boolean;
		public ParticleBillboardGlobal:boolean;
		public ParticleScaleGlobal:boolean;

		public ParticleColorGlobal:boolean;

		/** 是否改变坐标计数 */
		public changePosition:number;

		/** 是否改变颜色信息 */
		public changeColor:number;

		/**
		 * 粒子渲染参数
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
			this.changePosition = 0;
			this.changeColor = 0;
		}
	}
}
