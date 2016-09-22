module feng3d
{
	/**
	 * 灯光基类
	 * @author feng 2014-9-11
	 */
	export abstract class LightBase extends Entity
	{
		private _color:number = 0xffffff;
		private _colorR:number = 1;
		private _colorG:number = 1;
		private _colorB:number = 1;

		private _ambientColor:number = 0xffffff;
		private _ambient:number = 0;
		public _ambientR:number = 0;
		public _ambientG:number = 0;
		public _ambientB:number = 0;

		private _specular:number = 1;
		public _specularR:number = 1;
		public _specularG:number = 1;
		public _specularB:number = 1;

		private _diffuse:number = 1;
		public _diffuseR:number = 1;
		public _diffuseG:number = 1;
		public _diffuseB:number = 1;

		private _castsShadows:boolean;
		private _shadowMapper:ShadowMapperBase;

		/**
		 * 创建一个灯光
		 */
		constructor()
		{
			super();
			
			this._namedAsset._assetType = AssetType.LIGHT;
		}

		public get castsShadows():boolean
		{
			return this._castsShadows;
		}

		public set castsShadows(value:boolean)
		{
			if (this._castsShadows == value)
				return;

			this._castsShadows = value;

			if (value)
			{
				this._shadowMapper =this._shadowMapper || this.createShadowMapper();
				this._shadowMapper.light = this;
			}
			else
			{
				this._shadowMapper.dispose();
				this._shadowMapper = null;
			}

			this.dispatchEvent(new LightEvent(LightEvent.CASTS_SHADOW_CHANGE));
		}

		protected abstract createShadowMapper():ShadowMapperBase;

		/**
		 * 灯光颜色。默认为<code>0xffffff</code>。
		 */
		public get color():number
		{
			return this._color;
		}

		public set color(value:number)
		{
			this._color = value;
			this._colorR = ((this._color >> 16) & 0xff) / 0xff;
			this._colorG = ((this._color >> 8) & 0xff) / 0xff;
			this._colorB = (this._color & 0xff) / 0xff;
			this.updateDiffuse();
			this.updateSpecular();
		}

		/**
		 * 环境光强。默认为<code>0</code>。
		 */
		public get ambient():number
		{
			return this._ambient;
		}

		public set ambient(value:number)
		{
			if (value < 0)
				value = 0;
			else if (value > 1)
				value = 1;
			this._ambient = value;
			this.updateAmbient();
		}

		/**
		 * 环境光颜色。默认为<code>0xffffff</code>。
		 */
		public get ambientColor():number
		{
			return this._ambientColor;
		}

		public set ambientColor(value:number)
		{
			this._ambientColor = value;
			this.updateAmbient();
		}

		/**
		 * 漫反射光强。默认为<code>1</code>。
		 */
		public get diffuse():number
		{
			return this._diffuse;
		}

		public set diffuse(value:number)
		{
			if (value < 0)
				value = 0;
			this._diffuse = value;
			this.updateDiffuse();
		}

		/**
		 * 镜面反射光强。默认为<code>1</code>。
		 */
		public get specular():number
		{
			return this._specular;
		}

		public set specular(value:number)
		{
			if (value < 0)
				value = 0;
			this._specular = value;
			this.updateSpecular();
		}

		/**
		 * 更新镜面反射光成分
		 */
		private updateSpecular()
		{
			this._specularR = this._colorR * this._specular;
			this._specularG = this._colorG * this._specular;
			this._specularB = this._colorB * this._specular;
		}

		/**
		 * 更新漫反射光成分
		 */
		private updateDiffuse()
		{
			this._diffuseR = this._colorR * this._diffuse;
			this._diffuseG = this._colorG * this._diffuse;
			this._diffuseB = this._colorB * this._diffuse;
		}

		/**
		 * 更新环境光成分
		 */
		private updateAmbient()
		{
			this._ambientR = ((this._ambientColor >> 16) & 0xff) / 0xff * this._ambient;
			this._ambientG = ((this._ambientColor >> 8) & 0xff) / 0xff * this._ambient;
			this._ambientB = (this._ambientColor & 0xff) / 0xff * this._ambient;
		}

		public get shadowMapper():ShadowMapperBase
		{
			return this._shadowMapper;
		}

		public set shadowMapper(value:ShadowMapperBase)
		{
			this._shadowMapper = value;
			this._shadowMapper.light = this;
		}

		/**
		 * Gets the optimal projection matrix to render a light-based depth map for a single object.
		 *
		 * @param renderable The IRenderable object to render to a depth map.
		 * @param target An optional target Matrix3D object. If not provided, an instance will be created.
		 * @return A Matrix3D object containing the projection transformation.
		 */
		public abstract getObjectProjectionMatrix(renderable:IRenderable, target:Matrix3D):Matrix3D;
	}
}
