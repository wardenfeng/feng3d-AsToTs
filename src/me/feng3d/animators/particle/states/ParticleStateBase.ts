module feng3d {

	/**
	 * 粒子状态基类
	 * @author feng 2014-5-20
	 */
    export class ParticleStateBase extends AnimationStateBase {
        private _particleNode: ParticleNodeBase;

        protected _dynamicProperties: Vector3D[] = [];
        protected _dynamicPropertiesDirty = {};

        protected _needUpdateTime: boolean;

		/**
		 * 创建粒子状态基类
		 * @param animator				粒子动画
		 * @param particleNode			粒子节点
		 * @param needUpdateTime		是否需要更新时间
		 */
        constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase, needUpdateTime: boolean = false) {
            super(animator, particleNode);

            this._particleNode = particleNode;
            this._needUpdateTime = needUpdateTime;
        }

		/**
		 * 是否需要更新时间
		 */
        public get needUpdateTime(): boolean {
            return this._needUpdateTime;
        }
    }

}
