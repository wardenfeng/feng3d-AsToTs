module feng3d
{
	
	
	

	/**
	 * 粒子片段渲染程序
	 * @author feng 2015-1-21
	 */
	export function F_Particles()
	{
		var shaderParams:ShaderParams = FagalRE.instance.context3DCache.shaderParams;
		var particleShaderParams:ParticleShaderParams = shaderParams.getOrCreateComponentByClass(ParticleShaderParams);

		/** 粒子渲染参数 */
		if (particleShaderParams.ParticleColorGlobal)
		{
			F_ParticleColorCombination();
		}

	}
}


