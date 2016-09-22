module feng3d {
	/**
	 * 实体收集器
	 * <p>为场景分区收集所有场景图中被认为潜在显示对象</p>
	 *
	 * @see me.feng3d.core.partition.Partition3D
	 * @see me.feng3d.entities.Entity
	 *
	 * @author feng 2015-3-1
	 */
    export class EntityCollector extends PartitionTraverser {
        protected _skyBox: SkyBox;
        protected _opaqueRenderableHead: RenderableListItem;
        protected _blendedRenderableHead: RenderableListItem;

        protected _renderableListItemPool: RenderableListItemPool;
        protected _entityListItemPool: EntityListItemPool;
        //----------------------------
        //			灯光
        //----------------------------
        protected _lights: LightBase[];
        private _directionalLights: DirectionalLight[];
        private _pointLights: PointLight[];
        protected _numLights: number;
        private _numDirectionalLights: number;
        private _numPointLights: number;
        //
        protected _numTriangles: number;
        protected _numMouseEnableds: number;
        protected _camera: Camera3D;
        protected _cameraForward: Vector3D;
        private _customCullPlanes: Plane3D[];
        private _cullPlanes: Plane3D[];
        private _numCullPlanes: number;

		/**
		 * 创建一个实体收集器
		 */
        constructor() {
            super();
            this.init();
        }

		/**
		 * 初始化
		 */
        private init() {
            this._lights = [];
            this._directionalLights = [];
            this._pointLights = [];
            this._renderableListItemPool = new RenderableListItemPool();
            this._entityListItemPool = new EntityListItemPool();
        }

		/**
		 * 清除
		 */
        public clear() {
            if (this._camera) {
                this._entryPoint = this._camera.scenePosition;
                this._cameraForward = Matrix3DUtils.getForward(this._camera.transform3D.transform, this._cameraForward);
            }
            this._cullPlanes = this._customCullPlanes ? this._customCullPlanes : (this._camera ? this._camera.frustumPlanes : null);
            this._numCullPlanes = this._cullPlanes ? this._cullPlanes.length : 0;
            this._numTriangles = this._numMouseEnableds = 0;
            this._blendedRenderableHead = null;
            this._opaqueRenderableHead = null;
            this._renderableListItemPool.freeAll();
            this._entityListItemPool.freeAll();
            this._skyBox = null;
            if (this._numLights > 0)
                this._lights.length = this._numLights = 0;
            if (this._numDirectionalLights > 0)
                this._directionalLights.length = this._numDirectionalLights = 0;
            if (this._numPointLights > 0)
                this._pointLights.length = this._numPointLights = 0;
        }

		/**
		 * 提供可见视锥体的摄像机
		 */
        public get camera(): Camera3D {
            return this._camera;
        }

        public set camera(value: Camera3D) {
            this._camera = value;
            this._entryPoint = this._camera.scenePosition;
            this._cameraForward = Matrix3DUtils.getForward(this._camera.transform3D.transform, this._cameraForward);
            this._cullPlanes = this._camera.frustumPlanes;
        }

		/**
		 * 视椎面
		 */
        public get cullPlanes(): Plane3D[] {
            return this._customCullPlanes;
        }

        public set cullPlanes(value: Plane3D[]) {
            this._customCullPlanes = value;
        }

		/**
		 * 天空盒对象
		 */
        public get skyBox(): SkyBox {
            return this._skyBox;
        }

		/**
		 * 不透明渲染对象链表头
		 */
        public get opaqueRenderableHead(): RenderableListItem {
            return this._opaqueRenderableHead;
        }

        public set opaqueRenderableHead(value: RenderableListItem) {
            this._opaqueRenderableHead = value;
        }

		/**
		 * 透明渲染对象链表头
		 */
        public get blendedRenderableHead(): RenderableListItem {
            return this._blendedRenderableHead;
        }

        public set blendedRenderableHead(value: RenderableListItem) {
            this._blendedRenderableHead = value;
        }

		/**
		 * 添加渲染对象到潜在显示对象中
		 * @param renderable	可渲染对象
		 */
        public applyRenderable(renderable: IRenderable) {
            var material: MaterialBase;
            var entity: Entity = renderable.sourceEntity;
            if (renderable.mouseEnabled)
                ++this._numMouseEnableds;
            this._numTriangles += renderable.numTriangles;

            material = renderable.material;
            if (material) {
                var item: RenderableListItem = this._renderableListItemPool.getItem();
                item.renderable = renderable;
                item.materialId = material._uniqueId;
                item.renderOrderId = material._renderOrderId;
                var entityScenePos: Vector3D = entity.scenePosition;
                var dx: number = this._entryPoint.x - entityScenePos.x;
                var dy: number = this._entryPoint.y - entityScenePos.y;
                var dz: number = this._entryPoint.z - entityScenePos.z;
                // project onto this.camera's z-axis
                item.zIndex = dx * this._cameraForward.x + dy * this._cameraForward.y + dz * this._cameraForward.z + entity.zOffset;
                item.renderSceneTransform = renderable.sourceEntity.getRenderSceneTransform(this.camera);
                if (material.requiresBlending) {
                    item.next = this._blendedRenderableHead;
                    this._blendedRenderableHead = item;
                }
                else {
                    item.next = this._opaqueRenderableHead;
                    this._opaqueRenderableHead = item;
                }
            }
        }

		/**
		 * 判断节点是否出现在视锥体中
		 * @param node 用于测试的节点
		 */
        public enterNode(node: NodeBase): boolean {
            var enter: boolean = PartitionTraverser._collectionMark != node._collectionMark && node.isInFrustum(this._cullPlanes, this._numCullPlanes);
            node._collectionMark = PartitionTraverser._collectionMark;
            return enter;
        }

		/**
		 * @inheritDoc
		 */
        public applySkyBox(skyBox: SkyBox) {
            this._skyBox = skyBox;
        }

		/**
		 * @inheritDoc
		 */
        public applyDirectionalLight(light: DirectionalLight) {
            this._lights[this._numLights++] = light;
            this._directionalLights[this._numDirectionalLights++] = light;
        }

		/**
		 * @inheritDoc
		 */
        public applyPointLight(light: PointLight) {
            this._lights[this._numLights++] = light;
            this._pointLights[this._numPointLights++] = light;
        }

		/**
		 * 方向光列表
		 */
        public get directionalLights(): DirectionalLight[] {
            return this._directionalLights;
        }
    }
}
