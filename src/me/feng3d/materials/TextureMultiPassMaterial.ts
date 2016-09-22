module feng3d
{
	
	
	
	
	
	/**
	 * 
	 * @author feng 2014-5-19
	 */
	export class TextureMultiPassMaterial extends MultiPassMaterialBase
	{
		private _ambientColor:number = 0xffffff;
		private _specularMethod:BasicSpecularMethod = new BasicSpecularMethod();
		private _normalMethod:BasicNormalMethod = new BasicNormalMethod();
		
		constructor(texture:Texture2DBase = null, smooth:boolean = true, repeat:boolean = false, mipmap:boolean = true)
		{
			super();
			this.texture = texture;
		}

		public get ambientColor():number
		{
			return this._ambientColor;
		}

		public set ambientColor(value:number)
		{
			this._ambientColor = value;
		}

		public get specularMethod():BasicSpecularMethod
		{
			return this._specularMethod;
		}

		public set specularMethod(value:BasicSpecularMethod)
		{
			this._specularMethod = value;
		}

		/**
		 * The normal map to modulate the direction of the surface for each texel. The default normal method expects
		 * tangent-space normal maps, but others could expect object-space maps.
		 */
		public get normalMap():Texture2DBase
		{
			return this._normalMethod.normalMap;
		}
		
		public set normalMap(value:Texture2DBase)
		{
			this._normalMethod.normalMap = value;
		}
		
		/**
		 * 高光贴图
		 * 
		 * A specular map that defines the strength of specular reflections for each texel in the red channel,
		 * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
		 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
		 */
		public get specularMap():Texture2DBase
		{
			return this._specularMethod.texture;
		}
		
		public set specularMap(value:Texture2DBase)
		{
			this._specularMethod.texture = value;
		}
		
		/**
		 * The overall strength of the specular reflection.
		 */
		public get specular():number
		{
			return this._specularMethod? this._specularMethod.specular : 0;
		}
		
		public set specular(value:number)
		{
			if (this._specularMethod)
				this._specularMethod.specular = value;
		}
		
	}
}