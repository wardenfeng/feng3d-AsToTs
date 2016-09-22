module feng3d {

	/**
	 * 网格分区节点
	 * @author feng 2015-3-8
	 */
    export class MeshNode extends EntityNode {
        private _mesh: Mesh;

		/**
		 * 创建一个网格分区节点
		 * @param mesh		网格
		 */
        constructor(mesh: Mesh) {
            super(mesh);
            this._mesh = mesh;
        }

		/**
		 * @inheritDoc
		 */
        public acceptTraverser(traverser: PartitionTraverser) {
            if (traverser.enterNode(this)) {
                super.acceptTraverser(traverser);
                var subs: SubMesh[] = this._mesh.subMeshes;
                var i: number;
                var len: number = subs.length;
                while (i < len)
                    traverser.applyRenderable(subs[i++].renderableBase);
            }
        }
    }
}
