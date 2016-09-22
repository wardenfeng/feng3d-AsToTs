module feng3d
{
	
	
	
	
	
	
	
	

	

	/**
	 * 阴影映射函数基类
	 * @author feng 2015-5-28
	 */
	export class ShadowMapMethodBase extends ShadingMethodBase implements IAsset
	{
		public static METHOD_TYPE:string = "ShadowMapMethod";

		protected _namedAsset:NamedAsset;
		
		protected _castingLight:LightBase;
		protected _shadowMapper:ShadowMapperBase;

		protected _epsilon:number = .02;
		protected _alpha:number = 1;

		/**
		 * 创建阴影映射函数基类
		 * @param castingLight		投射灯光
		 */
		constructor(castingLight:LightBase)
		{
			super();
			this.methodType = ShadowMapMethodBase.METHOD_TYPE;
			this.typeUnique = true;
			this._namedAsset = new NamedAsset(this,AssetType.SHADOW_MAP_METHOD);
			this._castingLight = castingLight;
			castingLight.castsShadows = true;
			this._shadowMapper = castingLight.shadowMapper;
		}

		/**
		 * 投射灯光
		 */
		public get castingLight():LightBase
		{
			return this._castingLight;
		}

		/**
		 * The "transparency" of the shadows. This allows making shadows less strong.
		 */
		public get alpha():number
		{
			return this._alpha;
		}

		public set alpha(value:number)
		{
			this._alpha = value;
		}

		/**
		 * A small value to counter floating point precision errors when comparing values in the shadow map with the
		 * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
		 */
		public get epsilon():number
		{
			return this._epsilon;
		}

		public set epsilon(value:number)
		{
			this._epsilon = value;
		}

		/**
		 * @inheritDoc
		 */
		public activate(shaderParams:ShaderParams)
		{
			var shadowShaderParams:ShadowShaderParams = shaderParams.getOrCreateComponentByClass(ShadowShaderParams);
			shadowShaderParams.usingShadowMapMethod += 1;
			shadowShaderParams.needsShadowRegister++;
		}
		
		public get namedAsset():NamedAsset
		{
			return this._namedAsset;
		}
	}
}
