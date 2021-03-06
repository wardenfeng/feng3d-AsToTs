module feng3d
{
	
	

	/**
	 * 粒子初始化顶点渲染程序
	 * @param positionTemp			偏移坐标临时寄存器
	 * @param animatedPosition		动画后的顶点坐标数据
	 * @param positionReg			顶点坐标数据
	 * @param particleCommon		粒子常数数据[0,1,2,0]
	 * @author feng 2014-12-26
	 */
	export function V_ParticlesInit(positionTemp, animatedPosition:Register, positionReg:Register, particleCommon)
	{
		var _ = FagalRE.instance.space;

		_.comment("初始化粒子");
		_.mov(animatedPosition, positionReg); //坐标赋值
		_.mov(positionTemp.xyz, particleCommon.x); //初始化偏移位置0
	}
}
