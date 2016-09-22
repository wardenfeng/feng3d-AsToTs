module feng3d {




	/**
	 * 淡入淡出变换状态
	 * @author feng 2015-9-18
	 */
    export class CrossfadeTransitionState extends SkeletonBinaryLERPState {
        private _skeletonAnimationNode1: CrossfadeTransitionNode;
        private _animationStateTransitionComplete: AnimationStateEvent;

		/**
		 * 创建淡入淡出变换状态实例
		 * @param animator						动画
		 * @param skeletonAnimationNode			骨骼动画节点
		 */
        constructor(animator: AnimatorBase, skeletonAnimationNode: CrossfadeTransitionNode) {
            super(animator, skeletonAnimationNode);

            this._skeletonAnimationNode1 = skeletonAnimationNode;
        }

		/**
		 * @inheritDoc
		 */
        protected updateTime(time: number) {
            this.blendWeight = Math.abs(time - this._skeletonAnimationNode1.startBlend) / (1000 * this._skeletonAnimationNode1.blendSpeed);

            if (this.blendWeight >= 1) {
                this.blendWeight = 1;
                if (this._animationStateTransitionComplete == null)
                    this._animationStateTransitionComplete = new AnimationStateEvent(AnimationStateEvent.TRANSITION_COMPLETE, this._animator, this, this._skeletonAnimationNode1)
                this._skeletonAnimationNode1.dispatchEvent(this._animationStateTransitionComplete);
            }

            super.updateTime(time);
        }
    }
}
