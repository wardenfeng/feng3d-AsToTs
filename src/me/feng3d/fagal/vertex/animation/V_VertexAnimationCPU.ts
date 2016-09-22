module feng3d
{
	

	/**
	 * 顶点动画渲染程序(CPU)
	 * @author feng 2014-11-3
	 */
	export function V_VertexAnimationCPU()
	{
		var _ = FagalRE.instance.space;

		_.mov(_.animatedPosition_vt_4, _.position_va_3);
	}
}
