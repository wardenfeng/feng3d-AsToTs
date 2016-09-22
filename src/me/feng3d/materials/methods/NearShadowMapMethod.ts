module feng3d {











	/**
	 * 近阴影映射函数
	 * @author feng 2015-5-28
	 */
    export class NearShadowMapMethod extends SimpleShadowMapMethodBase {
        private secondaryFragmentConstants: number[] = [0, 0, 0, 0];

        private _baseMethod: SimpleShadowMapMethodBase;
		/**
		 * 阴影消退比例值
		 */
        private _fadeRatio: number;
        private _nearShadowMapper: NearDirectionalShadowMapper;

		/**
		 * 创建近阴影映射函数
		 * @param baseMethod		基础映射函数
		 * @param fadeRatio			消退比率
		 */
        constructor(baseMethod: SimpleShadowMapMethodBase, fadeRatio: number = .1) {
            super(baseMethod.castingLight);
            this._baseMethod = baseMethod;
            this._fadeRatio = fadeRatio;
            this._nearShadowMapper = this._castingLight.shadowMapper as NearDirectionalShadowMapper;
            if (!this._nearShadowMapper)
                throw new Error("NearShadowMapMethod requires a light that has a NearDirectionalShadowMapper instance assigned to shadowMapper.");
            this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated);
        }

		/**
		 * The base shadow map method on which this method's shading is based.
		 */
        public get baseMethod(): SimpleShadowMapMethodBase {
            return this._baseMethod;
        }

        public set baseMethod(value: SimpleShadowMapMethodBase) {
            if (this._baseMethod == value)
                return;
            this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated);
            this._baseMethod = value;
            this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, 0, true);
            this.invalidateShaderProgram();
        }

		/**
		 * @inheritDoc
		 */
        protected initBuffers() {
            super.initBuffers();
            this.context3DBufferOwner.mapContext3DBuffer(this._.secondary_fc_vector, this.updateSecondaryCommonData0Buffer);
        }

		/**
		 * @inheritDoc
		 */
        public initConstants() {
            super.initConstants();

            this._baseMethod.initConstants();

            this.secondaryFragmentConstants[0] = 0;
            this.secondaryFragmentConstants[1] = 0;
            this.secondaryFragmentConstants[2] = 0;
            this.secondaryFragmentConstants[3] = 1;
        }

        private updateSecondaryCommonData0Buffer(fcVectorBuffer: FCVectorBuffer) {
            fcVectorBuffer.update(this.secondaryFragmentConstants);
        }

		/**
		 * @inheritDoc
		 */
        public setRenderState(renderable: IRenderable, camera: Camera3D) {
            var near: number = camera.lens.near;
            var d: number = camera.lens.far - near;
            var maxDistance: number = this._nearShadowMapper.coverageRatio;
            var minDistance: number = maxDistance * (1 - this._fadeRatio);

            maxDistance = near + maxDistance * d;
            minDistance = near + minDistance * d;

            this.secondaryFragmentConstants[0] = minDistance;
            this.secondaryFragmentConstants[1] = 1 / (maxDistance - minDistance);

            super.setRenderState(renderable, camera);
            this._baseMethod.setRenderState(renderable, camera);
        }

		/**
		 * @inheritDoc
		 */
        public activate(shaderParams: ShaderParams) {
            super.activate(shaderParams);

            var shadowShaderParams: ShadowShaderParams = shaderParams.getOrCreateComponentByClass(ShadowShaderParams);
            shadowShaderParams.needsProjection++;
            shadowShaderParams.useNearShadowMap++;
        }

		/**
		 * 处理渲染程序失效事件
		 */
        private onShaderInvalidated(event: ShadingMethodEvent) {
            this.invalidateShaderProgram();
        }
    }
}
