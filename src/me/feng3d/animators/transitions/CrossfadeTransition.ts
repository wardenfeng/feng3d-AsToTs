module feng3d {




	/**
	 * 淡入淡出变换
	 * @author feng 2015-9-18
	 */
    export class CrossfadeTransition implements IAnimationTransition {
        public blendSpeed: number = 0.5;

		/**
		 * 创建淡入淡出变换实例
		 * @param blendSpeed			混合速度
		 */
        constructor(blendSpeed: number) {
            this.blendSpeed = blendSpeed;
        }

		/**
		 * @inheritDoc
		 */
        public getAnimationNode(animator: AnimatorBase, startNode: AnimationNodeBase, endNode: AnimationNodeBase, startBlend: number): AnimationNodeBase {
            var crossFadeTransitionNode: CrossfadeTransitionNode = new CrossfadeTransitionNode();
            crossFadeTransitionNode.inputA = startNode;
            crossFadeTransitionNode.inputB = endNode;
            crossFadeTransitionNode.blendSpeed = this.blendSpeed;
            crossFadeTransitionNode.startBlend = startBlend;

            return crossFadeTransitionNode;
        }
    }
}
