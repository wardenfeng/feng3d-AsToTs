module feng3d
{
	

	/**
	 * 视线顶点渲染函数
	 * @author feng 2014-11-7
	 */
	export function V_ViewDir()
	{
		var _ = FagalRE.instance.space;

		_.comment("计算视线方向");
		_.sub(_.viewDir_v, _.cameraPosition_vc_vector, _.globalPosition_vt_4);
	}
}
