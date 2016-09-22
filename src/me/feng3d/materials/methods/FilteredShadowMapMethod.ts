module feng3d
{
	
	

	

	/**
	 * 过滤的阴影映射函数
	 * @author feng 2015-5-28
	 */
	export class FilteredShadowMapMethod extends SimpleShadowMapMethodBase
	{
		/**
		 * 过滤的阴影映射函数
		 * @param castingLight		投射灯光
		 */
		constructor(castingLight:DirectionalLight)
		{
			super(castingLight);
		}
	}
}
