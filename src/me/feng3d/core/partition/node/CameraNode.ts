module feng3d {

	/**
	 * 摄像机分区节点
	 * @author feng 2015-3-21
	 */
    export class CameraNode extends EntityNode {
		/**
		 * 创建一个摄像机分区节点
		 * @param camera		摄像机
		 */
        constructor(camera: Camera3D) {
            super(camera);
        }

		/**
		 * @inheritDoc
		 */
        public acceptTraverser(traverser: PartitionTraverser) {
        }
    }
}
