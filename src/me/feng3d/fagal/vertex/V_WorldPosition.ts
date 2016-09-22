module feng3d
{
	

	/**
	 * 顶点世界坐标渲染函数
	 * @author feng 2014-11-7
	 */
	export function V_WorldPosition()
	{
		var _ = FagalRE.instance.space;

		_.comment("场景坐标转换");
		_.m44(_.globalPosition_vt_4, _.animatedPosition_vt_4, _.sceneTransform_vc_matrix);
	}
}
