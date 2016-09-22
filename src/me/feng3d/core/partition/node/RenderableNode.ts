module feng3d {

	/**
	 * RenderableNode is a space partitioning leaf node that contains any Entity that is itself a IRenderable
	 * object. This excludes Mesh (since the renderable objects are its SubMesh children).
	 */
    export class RenderableNode extends EntityNode {
        private _renderable: IRenderable;

		/**
		 * Creates a new RenderableNode object.
		 * @param mesh The mesh to be contained in the node.
		 */
        constructor(renderable: IRenderable) {
            super(as(renderable, Entity));
            this._renderable = renderable; // also keep a stronger typed reference
        }

		/**
		 * @inheritDoc
		 */
        public acceptTraverser(traverser: PartitionTraverser) {
            if (traverser.enterNode(this)) {
                super.acceptTraverser(traverser);
                traverser.applyRenderable(this._renderable);
            }
        }

    }
}
