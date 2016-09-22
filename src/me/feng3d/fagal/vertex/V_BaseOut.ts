module feng3d
{
	/**
	 * 基本顶点投影渲染
	 * @author feng 2014-10-30
	 */
	export function V_BaseOut()
	{
		var _ = FagalRE.instance.space;
		var shaderParams:ShaderParams = FagalRE.instance.context3DCache.shaderParams;
		var shadowShaderParams:ShadowShaderParams = shaderParams.getOrCreateComponentByClass(ShadowShaderParams);

		//阴影渲染需要 投影后的顶点坐标
		if (shadowShaderParams.needsProjection > 0)
		{
			var vt5:Register = _.getFreeTemp("投影后顶点坐标");
			_.m44(vt5, _.animatedPosition_vt_4, _.projection_vc_matrix);
			//保存投影坐标数据
			_.mov(_.positionProjected_v, vt5);
			_.mov(_._op, vt5);
		}
		else
		{
			_.m44(_._op, _.animatedPosition_vt_4, _.projection_vc_matrix);
		}
	}
}
