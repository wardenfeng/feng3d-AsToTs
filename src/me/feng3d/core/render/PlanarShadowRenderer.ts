module feng3d {

	/**
	 * 平面阴影渲染器
	 * @author feng 2015-8-23
	 */
    export class PlanarShadowRenderer extends RendererBase {
        private _activeMaterial: MaterialBase;

		/**
		 * 创建一个深度渲染器
		 */
        constructor() {
            super();
        }

		/**
		 * @inheritDoc
		 */
        protected executeRender(stage3DProxy: Stage3DProxy, entityCollector: EntityCollector, target: TextureProxyBase = null) {
            var _context: Context3D = stage3DProxy.context3D;

            if (this._renderableSorter)
                this._renderableSorter.sort(entityCollector);

            _context.setDepthTest(false, Context3DCompareMode.ALWAYS);

            //绘制
            this.draw(stage3DProxy, entityCollector, target);
        }

		/**
		 * @inheritDoc
		 */
        protected draw(stage3DProxy: Stage3DProxy, entityCollector: EntityCollector, target: TextureProxyBase) {
            var _context: Context3D = stage3DProxy.context3D;

            _context.setBlendFactors(Context3DBlendFactor.ONE, Context3DBlendFactor.ZERO);
            _context.setDepthTest(true, Context3DCompareMode.LESS);
            this.drawRenderables(stage3DProxy, entityCollector.opaqueRenderableHead, entityCollector, target);

            this._activeMaterial = null;
        }

		/**
		 * 绘制渲染列表
		 * @param stage3DProxy			3D场景代理
		 * @param item					渲染对象列表单元
		 * @param entityCollector		实体集合
		 * @param target				渲染目标
		 */
        private drawRenderables(stage3DProxy: Stage3DProxy, item: RenderableListItem, entityCollector: EntityCollector, target: TextureProxyBase) {
            var camera: Camera3D = entityCollector.camera;
            var item2: RenderableListItem;

            while (item) {
                this._activeMaterial = item.renderable.material;

                var planarShadowPass: PlanarShadowPass = this._activeMaterial.planarShadowPass;

                //初始化渲染参数
                planarShadowPass.shaderParams.initParams();
                //激活渲染通道
                planarShadowPass.activate(camera, target);

                item2 = item;
                do {
                    if (item2.renderable.castsShadows) {
                        planarShadowPass.render(item2.renderable, stage3DProxy, camera, this._renderIndex++);
                    }
                    item2 = item2.next;
                } while (item2 && item2.renderable.material == this._activeMaterial);
                planarShadowPass.deactivate();

                item = item2;
            }
        }

    }
}
