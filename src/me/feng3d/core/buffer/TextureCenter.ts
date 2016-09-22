module feng3d {
	/**
	 * 纹理缓存中心
	 * @author feng 2014-8-14
	 */
    export class TextureCenter {
        /** 纹理字典 */
        private static textureDic = new Map<TextureProxyBase, Map<Context3D, TextureBase>>();

		/**
		 * 创建一个纹理缓存中心
		 */
        constructor() {
        }

		/**
		 * 获取纹理
		 * @param context3D		3D环境
		 * @param texture		纹理代理
		 * @return				纹理
		 */
        public static getTexture(context3D: Context3D, texture: TextureProxyBase): TextureBase {
            //冲缓存中取纹理
            var textureBase: TextureBase = TextureCenter.$getTexture(context3D, texture);
            if (textureBase)
                return textureBase;

            //创建位图纹理
            var bitmapTexture: BitmapTexture = texture as BitmapTexture;
            if (bitmapTexture)
                return TextureCenter.createTexture(context3D, bitmapTexture);

            //创建立方体纹理
            var bitmapCubeTexture: BitmapCubeTexture = texture as BitmapCubeTexture;
            if (bitmapCubeTexture)
                return TextureCenter.createCubeTexture(context3D, bitmapCubeTexture);

            var renderTexture: RenderTexture = texture as RenderTexture;
            if (renderTexture)
                return TextureCenter.createRenderTexture(context3D, renderTexture);

            return null;
        }

		/**
		 * 获取纹理
		 * @param context3D		3D环境
		 * @param texture		纹理代理
		 * @return				纹理
		 */
        private static $getTexture(context3D: Context3D, texture: TextureProxyBase): TextureBase {
            if (TextureCenter.textureDic.get(texture) == null || TextureCenter.textureDic.get(texture).get(context3D) == null) {
                return null;
            }
            return TextureCenter.textureDic.get(texture).get(context3D);
        }

		/**
		 * 创建纹理
		 * @param context3D				3D环境
		 * @param bitmapTexture			位图纹理代理
		 * @return						纹理
		 */
        private static createTexture(context3D: Context3D, bitmapTexture: BitmapTexture): TextureBase {
            var texture: Texture = context3D.createTexture(bitmapTexture.width, bitmapTexture.height, bitmapTexture.format, true);

            if (bitmapTexture.generateMipmaps)
                MipmapGenerator.generateMipMaps(bitmapTexture.bitmapData, texture, bitmapTexture.mipMapHolder, true);
            else
                texture.uploadFromBitmapData(bitmapTexture.bitmapData, 0);

            TextureCenter.saveTextureBuffer(bitmapTexture, context3D, texture);

            return texture;
        }

		/**
		 * 创建纹理
		 * @param context3D				3D环境
		 * @param renderTexture			渲染纹理代理
		 * @return						纹理
		 */
        private static createRenderTexture(context3D: Context3D, renderTexture: RenderTexture): TextureBase {
            var texture: Texture = context3D.createTexture(renderTexture.width, renderTexture.height, renderTexture.format, true);

            var bmp: BitmapData = new BitmapData(renderTexture.width, renderTexture.height, false, 0xff0000);
            MipmapGenerator.generateMipMaps(bmp, texture);
            bmp.dispose();

            TextureCenter.saveTextureBuffer(renderTexture, context3D, texture);

            return texture;
        }

		/**
		 * 创建立方体纹理
		 * @param context3D				3D环境
		 * @param bitmapTexture			位图立方体纹理代理
		 * @return						立方体纹理
		 */
        private static createCubeTexture(context3D: Context3D, bitmapTexture: BitmapCubeTexture): TextureBase {
            var texture: CubeTexture = context3D["createCubeTexture"](bitmapTexture.size, bitmapTexture.format, bitmapTexture.optimizeForRenderToTexture, bitmapTexture.streamingLevels);

            var _bitmapDatas: BitmapData[] = bitmapTexture.bitmapDatas;

            for (var i: number = 0; i < 6; ++i)
                MipmapGenerator.generateMipMaps(_bitmapDatas[i], texture, null, _bitmapDatas[i].transparent, i);

            TextureCenter.saveTextureBuffer(bitmapTexture, context3D, texture);

            return texture;
        }

		/**
		 * 保存纹理缓存
		 * @param texture				纹理代理
		 * @param context3D				3D环境
		 * @param textureBase			纹理
		 */
        private static saveTextureBuffer(texture: TextureProxyBase, context3D: Context3D, textureBase: TextureBase) {
            var textureDic1: Map<Context3D, TextureBase> = TextureCenter.textureDic.get(texture);
            if (textureDic1 == null) {
                textureDic1 = new Map<Context3D, TextureBase>();
                TextureCenter.textureDic.push(texture, textureDic1);
            }
            textureDic1.push(context3D, textureBase);
        }
    }
}
