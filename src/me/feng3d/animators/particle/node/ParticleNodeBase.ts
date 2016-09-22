module feng3d {
	/**
	 * 粒子节点
	 * @author feng 2014-11-13
	 */
    export abstract class ParticleNodeBase extends AnimationNodeBase {
        /** 模式列表 */
        private static MODES: Object = { //
            0: ParticleNodeBase.GLOBAL, //
            1: ParticleNodeBase.LOCAL_STATIC, //
            2: ParticleNodeBase.LOCAL_DYNAMIC //
        };

        //模式名称
        private static GLOBAL: string = 'Global';
        private static LOCAL_STATIC: string = 'LocalStatic';
        private static LOCAL_DYNAMIC: string = 'LocalDynamic';

        protected _mode: number;
        private _priority: number;

        protected _dataLength: number = 3;
        protected _oneData: number[];

		/**
		 * 顶点数据编号
		 */
        public abstract getVaId(): string;

		/**
		 * 顶点数据长度
		 */
        public abstract getVaLen(): number;

		/**
		 * 创建一个粒子节点
		 * @param animationName		节点名称
		 * @param mode				模式
		 * @param dataLength		数据长度
		 * @param priority			优先级
		 */
        constructor(animationName: string, mode: number, dataLength: number, priority: number = 1) {
            super();
            this.name = animationName + ParticleNodeBase.MODES[mode];

            this._mode = mode;
            this._priority = priority;
            this._dataLength = dataLength;

            this._oneData = [];

        }

		/**
		 * 优先级
		 */
        public get priority(): number {
            return this._priority;
        }

		/**
		 * 数据长度
		 */
        public get dataLength(): number {
            return this._dataLength;
        }

		/**
		 * 单个粒子数据
		 */
        public get oneData(): number[] {
            return this._oneData;
        }

		/**
		 * 粒子属性模式
		 */
        public get mode(): number {
            return this._mode;
        }

		/**
		 * 创建单个粒子属性
		 */
        public generatePropertyOfOneParticle(param: ParticleProperties) {

        }

		/**
		 * 设置粒子渲染参数
		 * @param particleShaderParam 粒子渲染参数
		 */
        public abstract processAnimationSetting(shaderParam: ShaderParams);

		/**
		 * 设置渲染状态
		 * @param stage3DProxy			显卡代理
		 * @param renderable			渲染实体
		 * @param camera				摄像机
		 */
        public setRenderState(renderable: IRenderable, camera: Camera3D) {

        }

    }
}
