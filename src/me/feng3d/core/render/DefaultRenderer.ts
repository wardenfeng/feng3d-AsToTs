module feng3d {

	/**
	 * 默认渲染器，使用根据材质渲染场景图
	 * @author feng 2015-3-5
	 */
    export class DefaultRenderer extends RendererBase {
        private static SCREEN_PASSES: number = 2;
        private static ALL_PASSES: number = 3;
        private _activeMaterial: MaterialBase;

        private _depthRenderer: DepthRenderer;
        private _planarShadowRenderer: PlanarShadowRenderer;

		/**
		 * 是否使用平面阴影
		 */
        public static usePlanarShadow: boolean;

		/**
		 * 创建一个默认渲染器
		 */
        constructor() {
            super();
            this._depthRenderer = new DepthRenderer();
            this._planarShadowRenderer = new PlanarShadowRenderer();
        }

		/**
		 * @inheritDoc
		 */
        protected executeRender(stage3DProxy: Stage3DProxy, entityCollector: EntityCollector, target: TextureProxyBase = null) {
            if (!DefaultRenderer.usePlanarShadow) {
                this.updateLights(stage3DProxy, entityCollector);
            }
            super.executeRender(stage3DProxy, entityCollector, target);

            if (DefaultRenderer.usePlanarShadow) {
                this._planarShadowRenderer.render(stage3DProxy, entityCollector, target);
            }
        }

		/**
		 * @inheritDoc
		 */
        protected draw(stage3DProxy: Stage3DProxy, entityCollector: EntityCollector, target: TextureProxyBase) {
            var _context: Context3D = stage3DProxy.context3D;

            _context.setBlendFactors(Context3DBlendFactor.ONE, Context3DBlendFactor.ZERO);

            if (entityCollector.skyBox) {
                if (this._activeMaterial)
                    this._activeMaterial.deactivate();
                this._activeMaterial = null;

                _context.setDepthTest(false, Context3DCompareMode.ALWAYS);
                this.drawSkyBox(stage3DProxy, entityCollector);
            }

            _context.setDepthTest(true, Context3DCompareMode.LESS_EQUAL);

            this.drawRenderables(stage3DProxy, entityCollector.opaqueRenderableHead, entityCollector);
            this.drawRenderables(stage3DProxy, entityCollector.blendedRenderableHead, entityCollector);

            _context.setDepthTest(false, Context3DCompareMode.LESS_EQUAL);

            if (this._activeMaterial)
                this._activeMaterial.deactivate();

            this._activeMaterial = null;
        }

		/**
		 * Draw the skybox if present.
		 * @param entityCollector The EntityCollector containing all potentially visible information.
		 */
		/**
		 * 绘制天空盒
		 * @param stage3DProxy				3D舞台代理
		 * @param entityCollector			实体收集器
		 *
		 */
        private drawSkyBox(stage3DProxy: Stage3DProxy, entityCollector: EntityCollector) {
            var renderable: IRenderable = entityCollector.skyBox.subMeshes[0].renderableBase;
            var camera: Camera3D = entityCollector.camera;

            var material: MaterialBase = renderable.material;

            material.updateMaterial();
            var pass: MaterialPassBase = material.getPass(0);
            //初始化渲染参数
            pass.shaderParams.initParams();
            //激活渲染通道
            pass.activate(camera);
            pass.render(renderable, stage3DProxy, camera, this._renderIndex++);
            pass.deactivate();
        }

		/**
		 * 绘制可渲染列表
		 * @param renderables 			可渲染列表
		 * @param entityCollector 		实体收集器，包含所有潜在显示实体信息
		 */
        private drawRenderables(stage3DProxy: Stage3DProxy, item: RenderableListItem, entityCollector: EntityCollector) {
            var numPasses: number;
            var j: number;
            var camera: Camera3D = entityCollector.camera;
            var item2: RenderableListItem;

            while (item) {
                this._activeMaterial = item.renderable.material;
                this._activeMaterial.updateMaterial();

                numPasses = this._activeMaterial.numPasses;
                j = 0;

                do {
                    item2 = item;

                    var pass: MaterialPassBase = this._activeMaterial.getPass(j);

                    //初始化渲染参数
                    pass.shaderParams.initParams();
                    //激活渲染通道
                    pass.activate(camera);

                    do {
                        pass.render(item2.renderable, stage3DProxy, camera, this._renderIndex++);

                        item2 = item2.next;
                    } while (item2 && item2.renderable.material == this._activeMaterial);
                    this._activeMaterial.deactivatePass(j);

                } while (++j < numPasses);

                item = item2;
            }
        }

		/**
		 * 更新灯光
		 * @param stage3DProxy				3D场景代理
		 * @param entityCollector			实体集合
		 */
        private updateLights(stage3DProxy: Stage3DProxy, entityCollector: EntityCollector) {
            var dirLights: DirectionalLight[] = entityCollector.directionalLights;
            var len: number, i: number;
            var light: LightBase;
            var shadowMapper: ShadowMapperBase;

            len = dirLights.length;
            for (i = 0; i < len; ++i) {
                light = dirLights[i];
                shadowMapper = light.shadowMapper;
                if (light.castsShadows && (shadowMapper.autoUpdateShadows || shadowMapper._shadowsInvalid))
                    shadowMapper.renderDepthMap(stage3DProxy, entityCollector, this._depthRenderer);
            }
        }
    }
}
