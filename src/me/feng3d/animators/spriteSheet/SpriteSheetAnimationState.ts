module feng3d {
	/**
	 * sprite动画状态
	 * @author feng 2015-9-18
	 */
    export class SpriteSheetAnimationState extends AnimationClipState implements ISpriteSheetAnimationState {
        private _frames: SpriteSheetAnimationFrame[];
        private _clipNode: SpriteSheetClipNode;
        private _currentFrameID: number = 0;
        private _reverse: boolean;
        private _backAndForth: boolean;
        private _forcedFrame: boolean;

		/**
		 * 创建sprite动画状态实例
		 * @param animator			动画
		 * @param clipNode			动画剪辑节点
		 */
        constructor(animator: AnimatorBase, clipNode: SpriteSheetClipNode) {
            super(animator, clipNode);

            this._clipNode = clipNode;
            this._frames = this._clipNode.frames;
        }

		/**
		 * 是否反向播放
		 */
        public set reverse(b: boolean) {
            this._reverse = b;
        }

		/**
		 * 改变播放方向
		 */
        public set backAndForth(b: boolean) {
            if (b)
                this._reverse = false;
            this._backAndForth = b;
        }

		/**
		 * @inheritDoc
		 */
        public get currentFrameData(): SpriteSheetAnimationFrame {
            if (this._framesDirty)
                this.updateFrames();

            return this._frames[this._currentFrameID];
        }

		/**
		 * 当前帧数
		 */
        public get currentFrameNumber(): number {
            return this._currentFrameID;
        }

        public set currentFrameNumber(frameNumber: number) {
            this._currentFrameID = (frameNumber > this._frames.length - 1) ? this._frames.length - 1 : frameNumber;
            this._forcedFrame = true;
        }

		/**
		 * 总帧数
		 */
        public get totalFrames(): number {
            return (!this._frames) ? 0 : this._frames.length;
        }

		/**
		 * @inheritDoc
		 */
        protected updateFrames() {
            if (this._forcedFrame) {
                this._forcedFrame = false;
                return;
            }

            super.updateFrames();

            if (this._reverse) {

                if (this._currentFrameID - 1 > -1)
                    this._currentFrameID--;

                else {

                    if (this._clipNode.looping) {

                        if (this._backAndForth) {
                            this._reverse = false;
                            this._currentFrameID++;
                        }
                        else
                            this._currentFrameID = this._frames.length - 1;
                    }

                    <SpriteSheetAnimator><any>this._animator.dispatchCycleEvent();
                }

            }
            else {

                if (this._currentFrameID < this._frames.length - 1)
                    this._currentFrameID++;

                else {

                    if (this._clipNode.looping) {

                        if (this._backAndForth) {
                            this._reverse = true;
                            this._currentFrameID--;
                        }
                        else
                            this._currentFrameID = 0;
                    }

                    <SpriteSheetAnimator><any>(this._animator).dispatchCycleEvent();
                }
            }

        }
    }
}
