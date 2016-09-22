module feng3d
{

	

	/**
	 * 世界坐标输出函数
	 * @author feng 2014-11-7
	 */
	export function V_WorldPositionOut()
	{
		var _ = FagalRE.instance.space;

		_.mov(_.globalPos_v, _.globalPosition_vt_4);
	}
}
