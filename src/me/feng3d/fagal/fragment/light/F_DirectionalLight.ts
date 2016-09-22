module feng3d
{
	
	
	
	
	

	/**
	 * 方向光渲染函数
	 * @author feng 2014-11-7
	 */
	export function F_DirectionalLight()
	{
		var _ = FagalRE.instance.space;

		var shaderParams:ShaderParams = FagalRE.instance.context3DCache.shaderParams;
		var commonShaderParams:CommonShaderParams = shaderParams.getOrCreateComponentByClass(CommonShaderParams);
		var lightShaderParams:LightShaderParams = shaderParams.getOrCreateComponentByClass(LightShaderParams);

		var numDirectionalLights:number = lightShaderParams.numDirectionalLights;

		//遍历处理每个方向光
		for (var i:number = 0; i < numDirectionalLights; ++i)
		{
			//灯光方向寄存器
			var lightDirReg:Register = _.dirLightSceneDir_fc_vector.getReg(i);
			//漫反射颜色寄存器
			var diffuseColorReg:Register = _.dirLightDiffuse_fc_vector.getReg(i);
			//镜面反射颜色寄存器
			var specularColorReg:Register = _.dirLightSpecular_fc_vector.getReg(i);

			//处理每个光的漫反射
			if (commonShaderParams.usingDiffuseMethod > 0)
			{
				getDiffCodePerLight(lightDirReg, diffuseColorReg);
			}
			//处理每个光的镜面反射
			if (lightShaderParams.usingSpecularMethod > 0)
			{
				getSpecCodePerLight(lightDirReg, specularColorReg);
			}
		}
	}
}
