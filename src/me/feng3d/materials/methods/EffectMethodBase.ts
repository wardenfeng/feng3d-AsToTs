module feng3d
{
	
	
	

	/**
	 * 特效函数基类
	 * @author feng 2015-8-27
	 */
	export class EffectMethodBase extends ShadingMethodBase implements IAsset
	{
		protected _namedAsset:NamedAsset;
		/**
		 * 创建特效函数基类实例
		 */
		constructor()
		{
			super();
			this._namedAsset = new NamedAsset(this,AssetType.EFFECTS_METHOD);
		}
		
		public get namedAsset():NamedAsset
		{
			return this._namedAsset;
		}
		
	}
}
