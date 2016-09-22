module feng3d {

	/**
	 * 阴影映射基类
	 * @author feng 2015-5-28
	 */
    export abstract class ShadowMapperBase {
        protected _casterCollector: ShadowCasterCollector;

        private _depthMap: TextureProxyBase;
        protected _depthMapSize: number = 2048;
        protected _light: LightBase;

        private _autoUpdateShadows: boolean = true;

        public _shadowsInvalid: boolean;

		/**
		 * 创建阴影映射
		 */
        constructor() {
            this._casterCollector = this.createCasterCollector();
        }

		/**
		 * 创建阴影投射者集合
		 */
        protected createCasterCollector(): ShadowCasterCollector {
            return new ShadowCasterCollector();
        }

		/**
		 * 灯光
		 */
        public get light(): LightBase {
            return this._light;
        }

        public set light(value: LightBase) {
            this._light = value;
        }

		/**
		 * 深度图
		 */
        public get depthMap(): TextureProxyBase {
            return this._depthMap = this._depthMap || this.createDepthTexture();
        }

		/**
		 * 是否自动更新阴影
		 */
        public get autoUpdateShadows(): boolean {
            return this._autoUpdateShadows;
        }

		/**
		 * 渲染深度图
		 * @param stage3DProxy			3D场景代理
		 * @param entityCollector		实体集合
		 * @param renderer				渲染器
		 */
        public renderDepthMap(stage3DProxy: Stage3DProxy, entityCollector: EntityCollector, renderer: DepthRenderer) {
            this._shadowsInvalid = false;
            this.updateDepthProjection(entityCollector.camera);
            this._depthMap = this._depthMap || this.createDepthTexture();
            this.drawDepthMap(this._depthMap, stage3DProxy, entityCollector.scene, renderer);
        }

		/**
		 * 创建深度纹理
		 */
        protected createDepthTexture(): TextureProxyBase {
            return new RenderTexture(this._depthMapSize, this._depthMapSize);
        }

		/**
		 * 更新深度投影矩阵
		 * @param viewCamera		摄像机
		 */
        protected abstract updateDepthProjection(viewCamera: Camera3D);

		/**
		 * 绘制深度图
		 * @param depthMap				深度图纹理
		 * @param stage3DProxy			3D舞台代理
		 * @param scene					场景
		 * @param renderer				渲染器
		 */
        protected abstract drawDepthMap(depthMap: TextureProxyBase, stage3DProxy: Stage3DProxy, scene: Scene3D, renderer: DepthRenderer);

		/**
		 * 深度图尺寸
		 */
        public get depthMapSize(): number {
            return this._depthMapSize;
        }

        public set depthMapSize(value: number) {
            if (value == this._depthMapSize)
                return;
            this._depthMapSize = value;
        }

		/**
		 * 销毁
		 */
        public dispose() {

        }
    }
}
