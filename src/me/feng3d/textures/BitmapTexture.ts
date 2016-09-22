module feng3d
{
	
	
	

	/**
	 * 位图纹理
	 * @author feng 2014-3-24
	 */
	export class BitmapTexture extends Texture2DBase
	{
		private _bitmapData:BitmapData;
		private _mipMapHolder:BitmapData;
		private _generateMipmaps:boolean;

		constructor(bitmapData:BitmapData, generateMipmaps:boolean = true)
		{
			super();
			this.bitmapData = bitmapData;
			this._generateMipmaps = generateMipmaps;
		}

		public get bitmapData():BitmapData
		{
			return this._bitmapData;
		}

		public set bitmapData(value:BitmapData)
		{
			if (value == this._bitmapData)
				return;
			
			if (!TextureUtils.isBitmapDataValid(value))
				throw new Error("Invalid this.bitmapData: Width and this.height must be power of 2 and cannot exceed 2048");
			
			this.invalidateContent();
			this.setSize(value.width, value.height);
			
			this._bitmapData = value;
		}

		public get generateMipmaps():boolean
		{
			return this._generateMipmaps;
		}

		public set generateMipmaps(value:boolean)
		{
			this._generateMipmaps = value;
		}

		public get mipMapHolder():BitmapData
		{
			return this._mipMapHolder;
		}

		public set mipMapHolder(value:BitmapData)
		{
			this._mipMapHolder = value;
		}


	}
}
