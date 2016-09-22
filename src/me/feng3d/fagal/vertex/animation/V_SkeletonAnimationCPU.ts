module feng3d
{
	


	/**
	 * 骨骼动画渲染程序(CPU)
	 * @author feng 2014-11-3
	 */
	export function V_SkeletonAnimationCPU()
	{
		var _ = FagalRE.instance.space;

		_.mov(_.animatedPosition_vt_4, _.animated_va_3);
	}
}
