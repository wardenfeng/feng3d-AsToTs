module feng3d
{
	

	/**
	 * 纹理基类
	 * @author feng 2014-4-15
	 */
	export class Texture2DBase extends TextureProxyBase
	{
		constructor()
		{
			super();
			this.type = TextureType.TYPE_2D;
		}
	}
}
