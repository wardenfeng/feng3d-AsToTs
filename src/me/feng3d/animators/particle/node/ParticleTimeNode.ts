module feng3d {
	/**
	 * 粒子时间节点
	 * @author feng 2014-11-17
	 */
    export class ParticleTimeNode extends ParticleNodeBase {
		/**
		 * @inheritDoc
		 */
        public getVaId(): string {
            return this._.particleTime_va_4;
        }

		/**
		 * @inheritDoc
		 */
        public getVaLen(): number {
            return 4;
        }

		/**
		 * 创建一个粒子时间节点
		 * @param usesDuration	是否持续
		 * @param usesLooping	是否延时
		 * @param usesDelay		是否循环
		 */
        constructor() {
            super("ParticleTime", ParticlePropertiesMode.LOCAL_STATIC, 4, 0);
        }

		/**
		 * @inheritDoc
		 */
        public generatePropertyOfOneParticle(param: ParticleProperties) {
            this._oneData[0] = param.startTime;
            this._oneData[1] = param.duration;
            this._oneData[2] = param.delay + param.duration;
            this._oneData[3] = 1 / param.duration;
        }

		/**
		 * @inheritDoc
		 */
        public processAnimationSetting(shaderParams: ShaderParams) {
            var particleShaderParams: ParticleShaderParams = shaderParams.getOrCreateComponentByClass(ParticleShaderParams);

            particleShaderParams[this.name] = true;
        }
    }
}
