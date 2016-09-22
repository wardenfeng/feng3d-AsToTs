module feng3d
{
	

	/**
	 * 编译切线顶点程序(无法线图)
	 * @author feng 2014-11-7
	 */
	export function V_TangentNormalNoMap()
	{
		var _ = FagalRE.instance.space;

		_.comment("转换法线到全局");
		_.m33(_.normal_v.xyz, _.normal_va_3, _.normalSceneTransform_vc_matrix);
		//保存w不变
		_.mov(_.normal_v.w, _.normal_va_3.w);
	}

}
