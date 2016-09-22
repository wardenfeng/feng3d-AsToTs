module feng3d {



	/**
	 * UV动画剪辑状态
	 * @author feng 2015-9-18
	 */
    export class UVClipState extends AnimationClipState implements IUVAnimationState {
        private _frames: UVAnimationFrame[];
        private _uvClipNode: UVClipNode;
        private _currentUVFrame: UVAnimationFrame;
        private _nextUVFrame: UVAnimationFrame;

		/**
		 * @inheritDoc
		 */
        public get currentUVFrame(): UVAnimationFrame {
            if (this._framesDirty)
                this.updateFrames();

            return this._currentUVFrame;
        }

		/**
		 * @inheritDoc
		 */
        public get nextUVFrame(): UVAnimationFrame {
            if (this._framesDirty)
                this.updateFrames();

            return this._nextUVFrame;
        }

		/**
		 * 创建UVClipState实例
		 * @param animator				动画
		 * @param uvClipNode			UV动画剪辑节点
		 */
        constructor(animator: AnimatorBase, uvClipNode: UVClipNode) {
            super(animator, uvClipNode);

            this._uvClipNode = uvClipNode;
            this._frames = this._uvClipNode.frames;
        }

		/**
		 * @inheritDoc
		 */
        protected updateFrames() {
            super.updateFrames();

            if (this._frames.length > 0) {

                if (this._frames.length == 2 && this._currentFrame == 0) {

                    this._currentUVFrame = this._frames[1];
                    this._nextUVFrame = this._frames[0];

                }
                else {

                    this._currentUVFrame = this._frames[this._currentFrame];

                    if (this._uvClipNode.looping && this._nextFrame >= this._uvClipNode.lastFrame)
                        this._nextUVFrame = this._frames[0];
                    else
                        this._nextUVFrame = this._frames[this._nextFrame];

                }

            }
        }

    }
}
