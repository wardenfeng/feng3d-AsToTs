module feng3d
{
	
	
	

	/**
	 * 粒子速度节点顶点渲染程序
	 * @param particleVelocity			粒子速度数据
	 * @param positionTemp				偏移坐标临时寄存器
	 * @param inCycleTimeTemp			粒子周期内时间临时寄存器
	 * @author feng 2014-12-26
	 */
	export function V_ParticleVelocityGlobal(particleVelocity, positionTemp, inCycleTimeTemp)
	{
		var _ = FagalRE.instance.space;

		var vt3:Register = _.getFreeTemp();

		//计算速度
		_.mul(vt3, inCycleTimeTemp.x, particleVelocity); //时间*速度
		_.add(positionTemp.xyz, vt3, positionTemp.xyz); //计算偏移量
	}
}
