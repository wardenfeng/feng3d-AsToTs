module feng3d
{
	/**
	 * 基础法线函数
	 * @author feng 2014-7-16
	 */
	export class BasicNormalMethod extends ShadingMethodBase
	{
		public static METHOD_TYPE:string = "NormalMethod";

		private _texture:Texture2DBase;

		/**
		 * 创建一个基础法线函数
		 */
		constructor()
		{
            super();
			this.methodType = BasicNormalMethod.METHOD_TYPE;
			this.typeUnique = true;
		}

		/**
		 * @inheritDoc
		 */
		protected initBuffers()
		{
			super.initBuffers();
			this.context3DBufferOwner.mapContext3DBuffer(this._.normalTexture_fs, this.updateNormalTextureBuffer);
		}

		private updateNormalTextureBuffer(normalTextureBuffer:FSBuffer)
		{
			normalTextureBuffer.update(this._texture);
		}

		/**
		 * The texture containing the normals per pixel.
		 */
		public get normalMap():Texture2DBase
		{
			return this._texture;
		}

		public set normalMap(value:Texture2DBase)
		{
			if ((value!=null) != (this._texture!=null) || //
				(value && this._texture && (value.hasMipMaps != this._texture.hasMipMaps || value.format != this._texture.format))) //
			{
				this.invalidateShaderProgram();
			}

			this._texture = value;

			this.context3DBufferOwner.markBufferDirty(this._.normalTexture_fs);
		}

		/**
		 * Indicates if the normal method output is not based on a texture (if not, it will usually always return true)
		 * Override if subclasses are different.
		 */
		public get hasOutput():boolean
		{
			return (this._texture!=null);
		}

		/**
		 * @inheritDoc
		 */
		public copyFrom(method:ShadingMethodBase)
		{
			this.normalMap = as(method,BasicNormalMethod).normalMap;
		}

		public activate(shaderParams:ShaderParams)
		{
			var lightShaderParams:LightShaderParams = shaderParams.getOrCreateComponentByClass(LightShaderParams);

			lightShaderParams.hasNormalTexture = this._texture != null;
			shaderParams.addSampleFlags(this._.normalTexture_fs, this._texture);
		}
	}
}
