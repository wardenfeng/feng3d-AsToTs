module feng3d
{
	


	/**
	 *
	 * @author feng 2015-1-21
	 */
	export function F_ParticleColorCombination()
	{
		var _ = FagalRE.instance.space;

//			if (hasColorMulNode)
		_.mul(_.finalColor_ft_4, _.finalColor_ft_4, _.particleColorMultiplier_v);
//			if (hasColorAddNode)
		_.add(_.finalColor_ft_4, _.finalColor_ft_4, _.particleColorOffset_v);
	}
}
