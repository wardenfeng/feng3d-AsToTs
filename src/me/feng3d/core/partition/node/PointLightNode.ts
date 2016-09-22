module feng3d {




	/**
	 * 点光源分区节点
	 * @author feng 2015-3-23
	 */
    export class PointLightNode extends EntityNode {
        private _light: PointLight;

		/**
		 * 创建一个点光源分区节点
		 * @param light		点光源
		 */
        constructor(light: PointLight) {
            super(light);
            this._light = light;
        }

		/**
		 * 点光源
		 */
        public get light(): PointLight {
            return this._light;
        }

		/**
		 * @inheritDoc
		 */
        public acceptTraverser(traverser: PartitionTraverser) {
            if (traverser.enterNode(this)) {
                super.acceptTraverser(traverser);
                traverser.applyPointLight(this._light);
            }
        }
    }
}
