module feng3d {

	/**
	 * 阴影投射者集合
	 * @author feng 2015-5-29
	 */
    export class ShadowCasterCollector extends EntityCollector {
		/**
		 * 创建阴影投射者集合
		 */
        constructor() {
            super();
        }

		/**
		 * 应用可渲染对象
		 * @param renderable		可渲染对象
		 */
        public applyRenderable(renderable: IRenderable) {
            var material: MaterialBase = renderable.material;
            var entity: Entity = renderable.sourceEntity;
            //收集可投射阴影的可渲染对象
            if (renderable.castsShadows && material) {
                var item: RenderableListItem = this._renderableListItemPool.getItem();
                item.renderable = renderable;
                item.next = this._opaqueRenderableHead;
                var entityScenePos: Vector3D = entity.scenePosition;
                var dx: number = this._entryPoint.x - entityScenePos.x;
                var dy: number = this._entryPoint.y - entityScenePos.y;
                var dz: number = this._entryPoint.z - entityScenePos.z;
                item.zIndex = dx * this._cameraForward.x + dy * this._cameraForward.y + dz * this._cameraForward.z;
                item.renderSceneTransform = renderable.sourceEntity.getRenderSceneTransform(this._camera);
                this._opaqueRenderableHead = item;
            }
        }
    }
}
