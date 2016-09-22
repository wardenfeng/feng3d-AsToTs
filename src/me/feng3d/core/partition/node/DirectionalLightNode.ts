module feng3d {



	/**
	 * 方向光分区节点
	 * @author feng 2015-3-21
	 */
    export class DirectionalLightNode extends EntityNode {
        private _light: DirectionalLight;

		/**
		 * 创建一个方向光分区节点
		 * @param light 		方向光
		 */
        constructor(light: DirectionalLight) {
            super(light);
            this._light = light;
        }

		/**
		 * 方向光
		 */
        public get light(): DirectionalLight {
            return this._light;
        }

		/**
		 * @inheritDoc
		 */
        public acceptTraverser(traverser: PartitionTraverser) {
            if (traverser.enterNode(this)) {
                super.acceptTraverser(traverser);
                traverser.applyDirectionalLight(this._light);
            }
        }
    }
}
