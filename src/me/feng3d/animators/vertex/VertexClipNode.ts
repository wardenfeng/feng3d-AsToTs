module feng3d {

	/**
	 * 顶点动画剪辑节点
	 * @author feng 2014-5-30
	 */
    export class VertexClipNode extends AnimationClipNodeBase {
        private _frames: Geometry[] = [];
        private _translations: Vector3D[] = [];

		/**
		 * 创建一个顶点动画剪辑节点
		 */
        constructor() {
            super();
            this._stateClass = VertexClipState;
        }

		/**
		 * 帧数据列表
		 */
        public get frames(): Geometry[] {
            return this._frames;
        }

		/**
		 * 添加顶点动画帧
		 * @param geometry 几何体
		 * @param duration 持续时间
		 * @param translation 偏移量
		 */
        public addFrame(geometry: Geometry, duration: number, translation: Vector3D = null) {
            this._frames.push(geometry);
            this._durations.push(duration);
            this._translations.push(translation || new Vector3D());

            this._numFrames = this._durations.length;

            this._stitchDirty = true;
        }

		/**
		 * @inheritDoc
		 */
        protected updateStitch() {
            super.updateStitch();

            var i: number = this._numFrames - 1;
            var p1: Vector3D, p2: Vector3D, delta: Vector3D;
            while (i--) {
                this._totalDuration += this._durations[i];
                p1 = this._translations[i];
                p2 = this._translations[i + 1];
                delta = p2.subtract(p1);
                this._totalDelta.x += delta.x;
                this._totalDelta.y += delta.y;
                this._totalDelta.z += delta.z;
            }

            if (this._stitchFinalFrame && this._looping) {
                this._totalDuration += this._durations[this._numFrames - 1];
                if (this._numFrames > 1) {
                    p1 = this._translations[0];
                    p2 = this._translations[1];
                    delta = p2.subtract(p1);
                    this._totalDelta.x += delta.x;
                    this._totalDelta.y += delta.y;
                    this._totalDelta.z += delta.z;
                }
            }
        }

    }
}
