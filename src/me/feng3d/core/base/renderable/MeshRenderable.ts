module feng3d {

	/**
	 * 可渲染对象基类
	 * @author feng 2015-5-27
	 */
    export class MeshRenderable extends Renderable {
        public subMesh: SubMesh;

		/**
		 * 创建一个可渲染对象基类
		 */
        constructor(subMesh: SubMesh) {
            super();

            this.subMesh = subMesh;
            this._context3dCache.addChildBufferOwner(subMesh.context3DBufferOwner);
        }

		/**
		 * @inheritDoc
		 */
        public getMouseEnabled(): boolean {
            return this.subMesh.mouseEnabled;
        }

		/**
		 * @inheritDoc
		 */
        public getNumTriangles(): number {
            return this.subMesh.numTriangles;
        }

		/**
		 * @inheritDoc
		 */
        public getSourceEntity(): Entity {
            return this.subMesh.sourceEntity;
        }

		/**
		 * @inheritDoc
		 */
        public getMaterial(): MaterialBase {
            return this.subMesh.material;
        }

		/**
		 * @inheritDoc
		 */
        public getAnimator(): AnimatorBase {
            return this.subMesh.animator;
        }

		/**
		 * @inheritDoc
		 */
        public getCastsShadows(): boolean {
            return this.subMesh.castsShadows;
        }
    }
}
