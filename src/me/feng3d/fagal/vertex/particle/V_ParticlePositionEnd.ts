module feng3d
{
	
	

	/**
	 * 粒子结算偏移坐标渲染程序
	 * @param animatedPosition			动画后的顶点坐标数据
	 * @param positionTemp				偏移坐标临时寄存器
	 * @author feng 2014-12-26
	 */
	export function V_ParticlePositionEnd(animatedPosition, positionTemp)
	{
		var _ = FagalRE.instance.space;

		//得到最终坐标
		_.add(animatedPosition.xyz, animatedPosition.xyz, positionTemp.xyz);
	}
}
