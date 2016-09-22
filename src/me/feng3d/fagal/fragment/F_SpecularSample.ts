module feng3d
{
	/**
	 * 光泽图取样函数
	 * @author feng 2014-10-23
	 */
	export function F_SpecularSample()
	{
		var _ = FagalRE.instance.space;

		//获取纹理数据
		_.tex(_.specularTexData_ft_4, _.uv_v, _.specularTexture_fs);
	}
}
