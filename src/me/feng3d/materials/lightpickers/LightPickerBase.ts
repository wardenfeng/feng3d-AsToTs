module feng3d
{
	
	/**
	 * 灯光采集器
	 * @author feng 2014-9-11
	 */
	export class LightPickerBase extends Component implements IAsset
	{
		protected _namedAsset:NamedAsset;
		
		protected _numPointLights:number;
		protected _numDirectionalLights:number;

		protected _allPickedLights:LightBase[];
		protected _pointLights:PointLight[];
		protected _directionalLights:DirectionalLight[];

		constructor()
		{
			super();
			this._namedAsset = new NamedAsset(this,AssetType.CONTAINER);
		}

		public get assetType():string
		{
			return AssetType.LIGHT_PICKER;
		}

		/**
		 * 方向光数量
		 */
		public get numDirectionalLights():number
		{
			return this._numDirectionalLights;
		}

		/**
		 * 点光源数量
		 */
		public get numPointLights():number
		{
			return this._numPointLights;
		}

		/**
		 * 点光源列表
		 */
		public get pointLights():PointLight[]
		{
			return this._pointLights;
		}

		/**
		 * 方向光列表
		 */
		public get directionalLights():DirectionalLight[]
		{
			return this._directionalLights;
		}

		/**
		 * A collection of all the collected lights.
		 */
		public get allPickedLights():LightBase[]
		{
			return this._allPickedLights;
		}
		
		public get namedAsset():NamedAsset
		{
			return this._namedAsset;
		}
	}
}
