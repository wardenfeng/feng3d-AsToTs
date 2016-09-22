module feng3d {

	/**
	 * 输出纹理缓冲
	 * @author feng 2015-6-3
	 */
    export class OCBuffer extends RegisterBuffer {
        /** 纹理数据 */
        public texture: TextureProxyBase;

        private enableDepthAndStencil: boolean = true;
        private surfaceSelector: number = 0;
        private _antiAlias: number = 0;

		/**
		 * 创建一个输出纹理缓冲
		 * @param dataTypeId 		数据缓存编号
		 * @param updateFunc 		更新回调函数
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

            context3D.setRenderToTexture(textureBase, true, 0, 0, this.firstRegister);
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
