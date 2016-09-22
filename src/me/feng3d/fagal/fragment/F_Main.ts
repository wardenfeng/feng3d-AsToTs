module feng3d {


	/**
	 * 片段渲染程序主入口
	 * @author feng 2014-10-30
	 */
    export class F_Main extends FagalMethod {
		/**
		 * 创建片段渲染程序主入口
		 */
        constructor() {
            super();
            this._shaderType = Context3DProgramType.FRAGMENT;
        }

		/**
		 * @inheritDoc
		 */
        public runFunc() {
            this.shaderParams.preRunParams();
            var commonShaderParams: CommonShaderParams = this.shaderParams.getOrCreateComponentByClass(CommonShaderParams);
            var lightShaderParams: LightShaderParams = this.shaderParams.getOrCreateComponentByClass(LightShaderParams);
            var shadowShaderParams: ShadowShaderParams = this.shaderParams.getOrCreateComponentByClass(ShadowShaderParams);
            var fogShaderParams: FogShaderParams = this.shaderParams.getOrCreateComponentByClass(FogShaderParams);
            var envShaderParams: EnvShaderParams = this.shaderParams.getOrCreateComponentByClass(EnvShaderParams);

            //计算法线
            if (lightShaderParams.needsNormals > 0) {
                if (lightShaderParams.hasNormalTexture) {
                    F_TangentNormalMap();
                }
                else {
                    F_TangentNormalNoMap();
                }
            }

            //光泽图采样
            if (lightShaderParams.hasSpecularTexture > 0) {
                F_SpecularSample();
            }

            //计算视线
            if (lightShaderParams.needsViewDir > 0) {
                F_ViewDir();
            }

            //处理方向灯光
            if (lightShaderParams.numDirectionalLights > 0) {
                F_DirectionalLight();
            }

            //处理点灯光
            if (lightShaderParams.numPointLights > 0) {
                F_PointLight();
            }

            //计算环境光
            if (lightShaderParams.numLights > 0) {
                F_Ambient();
            }

            //渲染阴影
            if (shadowShaderParams.usingShadowMapMethod > 0) {
                F_ShadowMap();
            }

            //计算漫反射
            if (commonShaderParams.usingDiffuseMethod) {
                lightShaderParams.diffuseMethod();
            }

            if (this.shaderParams.alphaPremultiplied) {
                F_AlphaPremultiplied();
            }

            if (lightShaderParams.numLights > 0 && lightShaderParams.usingSpecularMethod > 0) {
                F_SpecularPostLighting();
            }

            //调用粒子相关片段渲染程序
            F_Particles();

            if (envShaderParams.useEnvMapMethod > 0) {
                F_EnvMapMethod()
            }

            if (fogShaderParams.useFog > 0) {
                F_Fog();
            }

            F_FinalOut();
        }
    }
}


