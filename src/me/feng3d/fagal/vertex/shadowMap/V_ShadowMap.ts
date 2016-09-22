module feng3d
{
	
	
	

	/**
	 * 编译阴影映射顶点程序
	 * @author feng 2015-6-23
	 */
	export function V_ShadowMap()
	{
		var shaderParams:ShaderParams = FagalRE.instance.context3DCache.shaderParams;
		var shadowShaderParams:ShadowShaderParams = shaderParams.getOrCreateComponentByClass(ShadowShaderParams);

		shadowShaderParams.usePoint > 0 ? V_ShadowMapPoint() : V_ShadowMapPlanar();
	}
}
