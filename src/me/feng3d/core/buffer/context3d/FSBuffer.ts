module feng3d {

	/**
	 * 纹理缓存
	 * @author feng 2014-8-14
	 */
    export class FSBuffer extends RegisterBuffer {
        /** 纹理数据 */
        public texture: TextureProxyBase;

		/**
		 * 创建纹理数据缓存
		 * @param dataTypeId 	数据编号
		 * @param updateFunc 	数据更新回调函数
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

            //从纹理缓存中获取纹理
            var textureBase: TextureBase = TextureCenter.getTexture(context3D, this.texture);

            context3D.setTextureAt(this.firstRegister, textureBase);
        }

		/**
		 * 更新纹理数据
		 * @param texture
		 */
        public update(texture: TextureProxyBase) {
            this.texture = texture;
        }
    }
}
