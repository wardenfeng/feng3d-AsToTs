module feng3d {



	/**
	 * 两个骨骼动画节点间进行线性插值得出骨骼姿势
	 * @author feng 2014-5-20
	 */
    export class SkeletonBinaryLERPNode extends AnimationNodeBase {
		/**
		 * 为混合输出提供输入节点A
		 */
        public inputA: AnimationNodeBase;

		/**
		 * 为混合输出提供输入节点B
		 */
        public inputB: AnimationNodeBase;

		/**
		 * 创建<code>SkeletonBinaryLERPNode</code>对象
		 */
        constructor() {
            super();
            this._stateClass = SkeletonBinaryLERPState;
        }

		/**
		 * @inheritDoc
		 */
        public getAnimationState(animator: AnimatorBase): SkeletonBinaryLERPState {
            return animator.getAnimationState(this) as SkeletonBinaryLERPState;
        }
    }
}
