module feng3d {


	/**
	 * sprite动画剪辑节点
	 * @author feng 2015-9-18
	 */
    export class SpriteSheetClipNode extends AnimationClipNodeBase {
        private _frames: SpriteSheetAnimationFrame[] = [];

		/**
		 * 创建<code>SpriteSheetClipNode</code>实例.
		 */
        constructor() {
            super();
            this._stateClass = SpriteSheetAnimationState;
        }

		/**
		 * 帧列表
		 */
        public get frames(): SpriteSheetAnimationFrame[] {
            return this._frames;
        }

		/**
		 * 添加帧到动画节点
		 * @param spriteSheetAnimationFrame				sprite动画帧
		 * @param duration								间隔时间
		 */
        public addFrame(spriteSheetAnimationFrame: SpriteSheetAnimationFrame, duration: number) {
            this._frames.push(spriteSheetAnimationFrame);
            this._durations.push(duration);
            this._numFrames = this._durations.length;

            this._stitchDirty = false;
        }
    }
}
