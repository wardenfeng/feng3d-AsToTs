module feng3d
{
	
	
	
	
	
	
	
	

	

	/**
	 * 镜面反射函数
	 * @author feng 2014-5-19
	 */
	export class BasicSpecularMethod extends LightingMethodBase
	{
		public static METHOD_TYPE:string = "SpecularMethod";

		private _gloss:number = 50;
		private _specular:number = 1;
		private _specularColor:number = 0xffffff;

		/** 镜面反射数据 */
		protected _specularData:number[] = [1, 1, 1, 50];

		private _texture:Texture2DBase;

		/**
		 * 创建镜面反射函数
		 */
		constructor()
		{
			super();
			this.methodType = BasicSpecularMethod.METHOD_TYPE;
			this.typeUnique = true;
		}

		/**
		 * 镜面反射颜色
		 */
		public get specularColor():number
		{
			return this._specularColor;
		}

		public set specularColor(value:number)
		{
			if (this._specularColor == value)
				return;

			if (this._specularColor == 0 || value == 0)
				this.invalidateShaderProgram();

			this._specularColor = value;
			this.updateSpecular();
		}

		/**
		 * 镜面反射光泽图
		 */
		public get texture():Texture2DBase
		{
			return this._texture;
		}

		public set texture(value:Texture2DBase)
		{
			if ((value!=null) != (this._texture!=null) || (value && this._texture && (value.hasMipMaps != this._texture.hasMipMaps || value.format != this._texture.format)))
			{
				this.invalidateShaderProgram();
			}
			this._texture = value;
			this.context3DBufferOwner.markBufferDirty(this._.specularTexture_fs);
		}

		/**
		 * The sharpness of the specular highlight.
		 */
		public get gloss():number
		{
			return this._gloss;
		}

		public set gloss(value:number)
		{
			this._gloss = value;
			this.updateSpecular();
		}

		/**
		 * 镜面反射光反射强度
		 */
		public get specular():number
		{
			return this._specular;
		}

		public set specular(value:number)
		{
			if (value == this._specular)
				return;

			this._specular = value;
			this.updateSpecular();
		}

		/**
		 * @inheritDoc
		 */
		protected initBuffers()
		{
			super.initBuffers();
			this.context3DBufferOwner.mapContext3DBuffer(this._.specularData_fc_vector, this.updateSpecularDataBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.specularTexture_fs, this.updateSpecularTextureBuffer);
		}

		private updateSpecularDataBuffer(_specularDataBuffer:FCVectorBuffer)
		{
			_specularDataBuffer.update(this._specularData);
		}

		private updateSpecularTextureBuffer(_specularTextureBuffer:FSBuffer)
		{
			_specularTextureBuffer.update(this.texture);
		}

		/**
		 * @inheritDoc
		 */
		public activate(shaderParams:ShaderParams)
		{
			var lightShaderParams:LightShaderParams = shaderParams.getOrCreateComponentByClass(LightShaderParams);

			lightShaderParams.needsNormals += lightShaderParams.numLights > 0 ? 1 : 0;
			lightShaderParams.needsViewDir += lightShaderParams.numLights > 0 ? 1 : 0;
			lightShaderParams.usingSpecularMethod += 1;

			if (this.texture != null)
			{
				lightShaderParams.hasSpecularTexture++;

				var commonShaderParams:CommonShaderParams = shaderParams.getOrCreateComponentByClass(CommonShaderParams);
				commonShaderParams.needsUV++
				shaderParams.addSampleFlags(this._.specularTexture_fs, this.texture);
			}

			shaderParams.modulateMethod = this._modulateMethod;
			shaderParams.specularModelType = SpecularModelType.BLINN_PHONG;
		}

		private updateSpecular()
		{
			this._specularData[0] = ((this._specularColor >> 16) & 0xff) / 0xff * this._specular;
			this._specularData[1] = ((this._specularColor >> 8) & 0xff) / 0xff * this._specular;
			this._specularData[2] = (this._specularColor & 0xff) / 0xff * this._specular;
			this._specularData[3] = this._gloss;
		}
	}
}
