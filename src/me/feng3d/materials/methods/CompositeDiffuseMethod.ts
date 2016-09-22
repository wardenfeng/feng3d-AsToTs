module feng3d
{
	
	
	
	

	

	/**
	 * CompositeDiffuseMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
	 * calculated diffuse reflection strength.
	 */
	export class CompositeDiffuseMethod extends BasicDiffuseMethod
	{
		protected _baseMethod:BasicDiffuseMethod;

		/**
		 * Creates a new WrapDiffuseMethod object.
		 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t : ShaderRegisterElement, regCache : ShaderRegisterCache) : string, in which t.w will contain the diffuse strength.
		 * @param baseDiffuseMethod The base diffuse method on which this method's shading is based.
		 */
		constructor(modulateMethod:Function = null, baseDiffuseMethod:BasicDiffuseMethod = null)
		{
            super();
			this._baseMethod = baseDiffuseMethod || new BasicDiffuseMethod();
			this._baseMethod._modulateMethod = modulateMethod;
			this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated);
		}

		/**
		 * The base diffuse method on which this method's shading is based.
		 */
		public get baseMethod():BasicDiffuseMethod
		{
			return this._baseMethod;
		}

		public set baseMethod(value:BasicDiffuseMethod)
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
		public dispose()
		{
			this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated);
			this._baseMethod.dispose();
		}

		/**
		 * @inheritDoc
		 */
		public get alphaThreshold():number
		{
			return this._baseMethod.alphaThreshold;
		}

		public set alphaThreshold(value:number)
		{
			this._baseMethod.alphaThreshold = value;
		}

		/**
		 * @inheritDoc
		 */
		public get texture():Texture2DBase
		{
			return this._baseMethod.texture;
		}

		/**
		 * @inheritDoc
		 */
		public set texture(value:Texture2DBase)
		{
			this._baseMethod.texture = value;
		}

		/**
		 * @inheritDoc
		 */
		public get diffuseAlpha():number
		{
			return this._baseMethod.diffuseAlpha;
		}

		/**
		 * @inheritDoc
		 */
		public get diffuseColor():number
		{
			return this._baseMethod.diffuseColor;
		}

		/**
		 * @inheritDoc
		 */
		public set diffuseColor(diffuseColor:number)
		{
			this._baseMethod.diffuseColor = diffuseColor;
		}

		/**
		 * @inheritDoc
		 */
		public set diffuseAlpha(value:number)
		{
			this._baseMethod.diffuseAlpha = value;
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
