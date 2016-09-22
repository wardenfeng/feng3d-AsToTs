module feng3d
{
	

	/**
	 * 基础动画顶点渲染函数(无动画)
	 * @author feng 2014-11-3
	 */
	export function V_BaseAnimation()
	{
		var _ = FagalRE.instance.space;

		_.mov(_.animatedPosition_vt_4, _.position_va_3);
	}
}
