module feng3d {

	/**
	 * 骨骼线性插值状态接口
	 * @author feng 2015-9-18
	 */
    export class SkeletonBinaryLERPState extends AnimationStateBase implements ISkeletonAnimationState {
        private _blendWeight: number = 0;
        private _skeletonAnimationNode: SkeletonBinaryLERPNode;
        private _skeletonPose: SkeletonPose = new SkeletonPose();
        private _skeletonPoseDirty: boolean = true;
        private _inputA: ISkeletonAnimationState;
        private _inputB: ISkeletonAnimationState;

		/**
		 * 混合权重	(0[inputA],1[inputB])
		 */
        public get blendWeight(): number {
            return this._blendWeight;
        }

        public set blendWeight(value: number) {
            this._blendWeight = value;

            this._positionDeltaDirty = true;
            this._skeletonPoseDirty = true;
        }

		/**
		 * 创建SkeletonBinaryLERPState实例
		 * @param animator						动画
		 * @param skeletonAnimationNode			骨骼动画节点
		 */
        constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonBinaryLERPNode) {
            super(animator, skeletonAnimationNode);

            this._skeletonAnimationNode = skeletonAnimationNode;

            this._inputA = <ISkeletonAnimationState><any>animator.getAnimationState(this._skeletonAnimationNode.inputA);
            this._inputB = <ISkeletonAnimationState><any>animator.getAnimationState(this._skeletonAnimationNode.inputB);
        }

		/**
		 * @inheritDoc
		 */
        public phase(value: number) {
            this._skeletonPoseDirty = true;

            this._positionDeltaDirty = true;

            this._inputA.phase(value);
            this._inputB.phase(value);
        }

		/**
		 * @inheritDoc
		 */
        protected updateTime(time: number) {
            this._skeletonPoseDirty = true;

            this._inputA.update(time);
            this._inputB.update(time);

            super.updateTime(time);
        }

		/**
		 * @inheritDoc
		 */
        public getSkeletonPose(skeleton: Skeleton): SkeletonPose {
            if (this._skeletonPoseDirty)
                this.updateSkeletonPose(skeleton);

            return this._skeletonPose;
        }

		/**
		 * @inheritDoc
		 */
        protected updatePositionDelta() {
            this._positionDeltaDirty = false;

            var deltA: Vector3D = this._inputA.positionDelta;
            var deltB: Vector3D = this._inputB.positionDelta;

            this._rootDelta.x = deltA.x + this._blendWeight * (deltB.x - deltA.x);
            this._rootDelta.y = deltA.y + this._blendWeight * (deltB.y - deltA.y);
            this._rootDelta.z = deltA.z + this._blendWeight * (deltB.z - deltA.z);
        }

		/**
		 * 更新骨骼姿势
		 * @param skeleton		骨骼
		 */
        private updateSkeletonPose(skeleton: Skeleton) {
            this._skeletonPoseDirty = false;

            var endPose: JointPose;
            var endPoses: JointPose[] = this._skeletonPose.jointPoses;
            var poses1: JointPose[] = this._inputA.getSkeletonPose(skeleton).jointPoses;
            var poses2: JointPose[] = this._inputB.getSkeletonPose(skeleton).jointPoses;
            var pose1: JointPose, pose2: JointPose;
            var p1: Vector3D, p2: Vector3D;
            var tr: Vector3D;
            var numJoints: number = skeleton.numJoints;

            // :s
            if (endPoses.length != numJoints)
                endPoses.length = numJoints;

            for (var i: number = 0; i < numJoints; ++i) {
                endPose = endPoses[i];
                if (endPose == null)
                    endPose = endPoses[i] = new JointPose();
                pose1 = poses1[i];
                pose2 = poses2[i];
                p1 = pose1.translation;
                p2 = pose2.translation;

                endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._blendWeight);

                tr = endPose.translation;
                tr.x = p1.x + this._blendWeight * (p2.x - p1.x);
                tr.y = p1.y + this._blendWeight * (p2.y - p1.y);
                tr.z = p1.z + this._blendWeight * (p2.z - p1.z);
            }
        }
    }
}
