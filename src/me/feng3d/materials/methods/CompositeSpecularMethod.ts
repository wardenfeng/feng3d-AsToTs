module feng3d
{

	
	
	



	/**
	 * CompositeSpecularMethod provides a base class for specular methods that wrap a specular method to alter the
	 * calculated specular reflection strength.
	 */
	export class CompositeSpecularMethod extends BasicSpecularMethod
	{
		private _baseMethod:BasicSpecularMethod;

		/**
		 * Creates a new WrapSpecularMethod object.
		 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t : ShaderRegisterElement, regCache : ShaderRegisterCache) : string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
		 * @param baseSpecularMethod The base specular method on which this method's shading is based.
		 */
		constructor(modulateMethod:Function, baseSpecularMethod:BasicSpecularMethod = null)
		{
			super();
			this._baseMethod = baseSpecularMethod || new BasicSpecularMethod();
			this._baseMethod._modulateMethod = modulateMethod;
			this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated);
		}

		/**
		 * The base specular method on which this method's shading is based.
		 */
		public get baseMethod():BasicSpecularMethod
		{
			return this._baseMethod;
		}

		public set baseMethod(value:BasicSpecularMethod)
		{
			if (this._baseMethod == value)
				return;
			this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated);
			this._baseMethod = value;
			this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated,  0, true);
			this.invalidateShaderProgram();
		}

		/**
		 * @inheritDoc
		 */
		public get gloss():number
		{
			return this._baseMethod.gloss;
		}

		public set gloss(value:number)
		{
			this._baseMethod.gloss = value;
		}

		/**
		 * @inheritDoc
		 */
		public get specular():number
		{
			return this._baseMethod.specular;
		}

		public set specular(value:number)
		{
			this._baseMethod.specular = value;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated);
			this._baseMethod.dispose();
		}

		/**
		 * @inheritDoc
		 */
		public get texture():Texture2DBase
		{
			return this._baseMethod.texture;
		}

		public set texture(value:Texture2DBase)
		{
			this._baseMethod.texture = value;
		}

		/**
		 * @inheritDoc
		 */
		public activate(shaderParams:ShaderParams)
		{
			this._baseMethod.activate(shaderParams);
		}

		/**
		 * @inheritDoc
		 */
		public cleanCompilationData()
		{
			super.cleanCompilationData();
			this._baseMethod.cleanCompilationData();
		}

		/**
		 * Called when the base method's shader code is invalidated.
		 */
		private onShaderInvalidated(event:ShadingMethodEvent)
		{
			this.invalidateShaderProgram();
		}
	}
}
