module feng3d {


	/**
	 * 淡入淡出变换节点
	 * @author feng 2014-5-20
	 */
    export class CrossfadeTransitionNode extends SkeletonBinaryLERPNode {
		/**
		 * 混合速度
		 */
        public blendSpeed: number;

		/**
		 * 开始混合
		 */
        public startBlend: number;

		/**
		 * 创建<code>CrossfadeTransitionNode</code>实例
		 */
        constructor() {
            super();
            this._stateClass = CrossfadeTransitionState;
        }
    }
}
