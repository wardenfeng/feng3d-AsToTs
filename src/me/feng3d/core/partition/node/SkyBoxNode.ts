module feng3d {

	/**
	 * 天空盒分区节点
	 * @author feng 2015-3-8
	 */
    export class SkyBoxNode extends EntityNode {
        private _skyBox: SkyBox;

		/**
		 * 创建SkyBoxNode实例
		 * @param skyBox		天空盒实例
		 */
        constructor(skyBox: SkyBox) {
            super(skyBox);
            this._skyBox = skyBox;
        }

		/**
		 * @inheritDoc
		 */
        public acceptTraverser(traverser: PartitionTraverser) {
            if (traverser.enterNode(this)) {
                super.acceptTraverser(traverser);
                traverser.applySkyBox(this._skyBox);
            }
        }

		/**
		 * @inheritDoc
		 */
        public isInFrustum(planes: Plane3D[], numPlanes: number): boolean {
            planes = planes;
            numPlanes = numPlanes;
            return true;
        }
    }
}
