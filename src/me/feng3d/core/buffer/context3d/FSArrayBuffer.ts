module feng3d {

	/**
	 * 纹理数组缓存（解决类似地形多纹理混合）
	 * @author feng 2014-11-6
	 */
    export class FSArrayBuffer extends RegisterBuffer {
        /** 纹理数据 */
        public textures: any[];

		/**
		 * 创建纹理数组缓存
		 * @param dataTypeId 数据编号
		 * @param updateFunc 数据更新回调函数
		 * @param textureFlags	取样参数回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }

		/**
		 * @inheritDoc
		 */
        public doBuffer(context3D: Context3D) {
            this.doUpdateFunc();

            for (var i: number = 0; i < this.textures.length; i++) {
                //从纹理缓存中获取纹理
                var textureBase: TextureBase = TextureCenter.getTexture(context3D, this.textures[i]);

                context3D.setTextureAt(this.firstRegister + i, textureBase);
            }
        }

		/**
		 * 更新纹理
		 * @param textures		纹理数组
		 */
        public update(textures: any[]) {
            this.textures = textures;
        }
    }
}
