module feng3d
{

	

	

	/**
	 * 纹理代理基类
	 * <p>处理纹理与stage3d的关系</p>
	 * @author feng 2014-4-15
	 */
	export class TextureProxyBase extends Component
	{
		/** 纹理类型 */
		public type:string;

		/**
		 * 纹理格式
		 */
		protected _format:string = Context3DTextureFormat.BGRA;

		/**
		 * 是否有miplevel
		 */
		protected _hasMipmaps:boolean = true;

		/**
		 * 纹理宽度
		 */
		protected _width:number;

		/**
		 * 纹理高度
		 */
		protected _height:number;

		/**
		 * 创建一个纹理代理基类
		 */
		constructor()
		{
            super();
//			_namedAsset = new NamedAsset(this, AssetType.TEXTURE);
		}

		/**
		 * 是否有miplevel
		 */
		public get hasMipMaps():boolean
		{
			return this._hasMipmaps;
		}

		/**
		 * 纹理格式
		 * @see flash.display3D.Context3DTextureFormat
		 */
		public get format():string
		{
			return this._format;
		}

		/**
		 * 纹理宽度
		 */
		public get width():number
		{
			return this._width;
		}

		/**
		 * 纹理高度
		 */
		public get height():number
		{
			return this._height;
		}

		/**
		 * 设置纹理尺寸
		 * @param width		纹理宽度
		 * @param height	纹理高度
		 */
		protected setSize(width:number, height:number)
		{
			if (this._width != width || this._height != height)
				this.invalidateSize();

			this._width = width;
			this._height = height;
		}

		/**
		 * 尺寸失效
		 */
		protected invalidateSize()
		{
		}

		/**
		 * 纹理失效
		 */
		public invalidateContent()
		{

		}
	}
}
