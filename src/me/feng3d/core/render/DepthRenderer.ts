module feng3d {
	/**
	 * 深度渲染器
	 * @author feng 2015-5-28
	 */
    export class DepthRenderer extends RendererBase {
        private _activeMaterial: MaterialBase;

		/**
		 * 创建一个深度渲染器
		 */
        constructor() {
            super();
            this._backgroundR = 1;
            this._backgroundG = 1;
            this._backgroundB = 1;
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

                var depthPass: DepthMapPass = this._activeMaterial.depthPass;
                //初始化渲染参数
                depthPass.shaderParams.initParams();
                //激活渲染通道
                depthPass.activate(camera, target);

                item2 = item;
                do {
                    depthPass.render(item2.renderable, stage3DProxy, camera, this._renderIndex++);

                    item2 = item2.next;
                } while (item2 && item2.renderable.material == this._activeMaterial);

                depthPass.deactivate();
                item = item2;
            }
        }
    }
}
