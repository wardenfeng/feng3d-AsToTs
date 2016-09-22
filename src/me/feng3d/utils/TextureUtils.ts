module feng3d
{
	
	
	
	

	
	

	/**
	 * 纹理工具类
	 * @author feng 2015-7-7
	 */
	export class TextureUtils
	{
		/**
		 * 支持的最大纹理尺寸
		 */
		private static MAX_SIZE:number = 4096;

		/**
		 * 判断是否为有效位图
		 * @param bitmapData		位图
		 * @return
		 */
		public static isBitmapDataValid(bitmapData:BitmapData):boolean
		{
			if (bitmapData == null)
				return true;

			return TextureUtils.isDimensionValid(bitmapData.width) && TextureUtils.isDimensionValid(bitmapData.height);
		}

		/**
		 * 尺寸是否有效
		 * @param d		尺寸
		 * @return
		 */
		public static isDimensionValid(d:number):boolean
		{
			return d >= 1 && d <= TextureUtils.MAX_SIZE && TextureUtils.isPowerOfTwo(d);
		}

		/**
		 * 是否为2的指数次方
		 * @param value			被检查的值
		 * @return
		 */
		public static isPowerOfTwo(value:number):boolean
		{
			return value ? ((value & -value) == value) : false;
		}

		/**
		 * 转换为最佳2的指数次方值
		 * @param value			尺寸
		 * @return
		 */
		public static getBestPowerOf2(value:number):number
		{
			var p:number = 1;

			while (p < value)
				p <<= 1;

			if (p > TextureUtils.MAX_SIZE)
				p = TextureUtils.MAX_SIZE;

			return p;
		}

		/**
		 * 获取纹理取样参数
		 * @param useMipmapping 		是否使用贴图分层细化
		 * @param useSmoothTextures 	是否使用平滑纹理
		 * @param repeatTextures 		是否重复纹理
		 * @param texture 				取样纹理
		 * @param forceWrap 			强制重复纹理参数
		 * @return
		 */
		public static getFlags(useMipmapping:boolean, useSmoothTextures:boolean, repeatTextures:boolean, texture:TextureProxyBase, forceWrap:string = null)
		{
			var flags = [texture.type];

			var enableMipMaps:boolean = useMipmapping && texture.hasMipMaps;
			if (useSmoothTextures)
			{
				flags.push(Context3DTextureFilter.LINEAR);
				if (enableMipMaps)
					flags.push(Context3DMipFilter.MIPLINEAR);
			}
			else
			{
				flags.push(Context3DTextureFilter.NEAREST);
				if (enableMipMaps)
					flags.push(Context3DMipFilter.MIPNEAREST);
			}

			if (forceWrap)
			{
				flags.push(forceWrap);
			}
			else
			{
				if (!(is(texture , BitmapCubeTexture)))
				{
					if (repeatTextures)
					{
						flags.push(Context3DWrapMode.REPEAT);
					}
					else
					{
						flags.push(Context3DWrapMode.CLAMP);
					}
				}
			}

			return flags;
		}
	}
}
