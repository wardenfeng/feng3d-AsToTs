module feng3d {


	/**
	 * A uv animation node containing time-based animation data as individual uv animation frames.
	 */
	/**
	 * UV动画剪辑节点
	 * @author feng 2014-5-20
	 */
    export class UVClipNode extends AnimationClipNodeBase {
        private _frames: UVAnimationFrame[] = [];

		/**
		 * 帧数据列表
		 */
        public get frames(): UVAnimationFrame[] {
            return this._frames;
        }

		/**
		 * 创建<code>UVClipNode</code>实例
		 */
        constructor() {
            super();
            this._stateClass = UVClipState;
        }

		/**
		 * 添加帧
		 * @param uvFrame				UV动画帧
		 * @param duration				间隔时间
		 */
        public addFrame(uvFrame: UVAnimationFrame, duration: number) {
            this._frames.push(uvFrame);
            this._durations.push(duration);
            this._numFrames = this._durations.length;

            this._stitchDirty = true;
        }

		/**
		 * @inheritDoc
		 */
        protected updateStitch() {
            super.updateStitch();
            var i: number;

            if (this._durations.length > 0) {

                i = this._numFrames - 1;
                while (i--)
                    this._totalDuration += this._durations[i];

                if (this._stitchFinalFrame || !this._looping)
                    this._totalDuration += this._durations[this._numFrames - 1];
            }

        }
    }
}
