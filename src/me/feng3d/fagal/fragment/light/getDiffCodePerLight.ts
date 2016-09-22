module feng3d
{
	
	/**
	 * 处理
	 * @author feng 2015-4-24
	 */
	export function getDiffCodePerLight(lightDirReg, diffuseColorReg:Register)
	{
		var _ = FagalRE.instance.space;

		var shaderParams:ShaderParams = FagalRE.instance.context3DCache.shaderParams;
		var lightShaderParams:LightShaderParams = shaderParams.getOrCreateComponentByClass(LightShaderParams);

		var diffuseColorFtReg;
		if (lightShaderParams.isFirstDiffLight)
		{
			diffuseColorFtReg = _.totalDiffuseLightColor_ft_4;
		}
		else
		{
			diffuseColorFtReg = _.getFreeTemp("单个漫反射光寄存器")
		}

		//计算灯光方向与法线夹角
		_.dp3(diffuseColorFtReg.x, lightDirReg, _.normal_ft_4);
		//过滤负数
		_.max(diffuseColorFtReg.w, diffuseColorFtReg.x, _.commonsData_fc_vector.y);

		//灯光衰减
		if (lightShaderParams.useLightFallOff)
			_.mul(diffuseColorFtReg.w, diffuseColorFtReg.w, lightDirReg.w);

		if (shaderParams.diffuseModulateMethod != null)
		{
			shaderParams.diffuseModulateMethod(diffuseColorFtReg);
		}

		_.comment("漫反射光颜色 = 灯光漫反射颜色 mul 漫反射光强度");
		_.mul(diffuseColorFtReg, diffuseColorFtReg.w, diffuseColorReg);

		//叠加灯光
		if (!lightShaderParams.isFirstDiffLight)
		{
			_.add(_.totalDiffuseLightColor_ft_4.xyz, _.totalDiffuseLightColor_ft_4, diffuseColorFtReg);
		}
		lightShaderParams.isFirstDiffLight = false;
	}
}
