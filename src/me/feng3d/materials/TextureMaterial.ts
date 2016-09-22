module feng3d
{
	
	/**
	 * 纹理材质
	 * @author feng 2014-4-15
	 */
	export class TextureMaterial extends SinglePassMaterialBase
	{
		private _alpha:number;

		public _specularMethod:BasicSpecularMethod;

		/**
		 * 创建纹理材质
		 * @param texture		纹理
		 * @param smooth		是否平滑
		 * @param repeat		是否重复
		 * @param mipmap		是否使用mipmap
		 */
		constructor(texture:Texture2DBase = null, smooth:boolean = true, repeat:boolean = false, mipmap:boolean = true)
		{
			super();
			this.texture = texture;
			this.smooth = smooth;
			this.repeat = repeat;
			this.mipmap = mipmap;
		}

		/**
		 * 纹理
		 */
		public get texture():Texture2DBase
		{
			return this._screenPass.diffuseMethod.texture;
		}

		public set texture(value:Texture2DBase)
		{
			this._screenPass.diffuseMethod.texture = value;
		}

		/**
		 * 透明度
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
		 * The texture object to use for the ambient colour.
		 */
		public get ambientTexture():Texture2DBase
		{
			return this._screenPass.ambientMethod.texture;
		}

		public set ambientTexture(value:Texture2DBase)
		{
			this._screenPass.ambientMethod.texture = value;
		}
	}
}
