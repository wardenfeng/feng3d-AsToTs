module feng3d
{
	
	

	/**
	 * 粒子广告牌节点顶点渲染程序
	 * @param particleBillboardMtx			广告牌旋转矩阵(3个长度向量形式)
	 * @param animatedPosition				动画后的顶点坐标数据
	 * @author feng 2014-12-26
	 */
	export function V_ParticleBillboard(particleBillboardMtx:Register, animatedPosition)
	{
		var _ = FagalRE.instance.space;

		//使用广告牌 朝向摄像机
		_.m33(animatedPosition.xyz, animatedPosition.xyz, particleBillboardMtx); //计算旋转
	}
}
