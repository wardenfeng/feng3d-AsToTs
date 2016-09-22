module feng3d
{
    
	/**
	 * MipmapGenerator is a helper class that uploads BitmapData to a Texture including mipmap levels.
	 */
	export class MipmapGenerator
	{
		private static _matrix:Matrix = new Matrix();
		private static _rect:Rectangle = new Rectangle();
		
		/**
		 * Uploads a BitmapData with mip maps to a target Texture object.
		 * @param source The source BitmapData to upload.
		 * @param target The target Texture to upload to.
		 * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
		 * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
		 */
		public static generateMipMaps(source:BitmapData, target:TextureBase, mipmap:BitmapData = null, alpha:boolean = false, side:number = -1)
		{
			var w:number = source.width,
				h:number = source.height;
			var i:number;
			var regen:boolean = mipmap != null;
			mipmap =mipmap || new BitmapData(w, h, alpha);
			
			MipmapGenerator._rect.width = w;
			MipmapGenerator._rect.height = h;
			
			while (w >= 1 || h >= 1) {
				if (alpha)
					mipmap.fillRect(MipmapGenerator._rect, 0);
				
				MipmapGenerator._matrix.a = MipmapGenerator._rect.width/source.width;
				MipmapGenerator._matrix.d = MipmapGenerator._rect.height/source.height;
				
				mipmap.draw(source, MipmapGenerator._matrix, null, null, null, true);
				
				if (is(target , Texture))
					as(target,Texture).uploadFromBitmapData(mipmap, i++);
				else
					as(target,CubeTexture).uploadFromBitmapData(mipmap, side, i++);
				
				w = w/2;
				h = h/2;
				
				MipmapGenerator._rect.width = w > 1? w : 1;
				MipmapGenerator._rect.height = h > 1? h : 1;
			}
			
			if (!regen)
				mipmap.dispose();
		}
	}
}
