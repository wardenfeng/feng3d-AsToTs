module feng3d {

	/**
	 * UV动画帧
	 * @author feng 2015-9-18
	 * @see me.feng3d.animators.spriteSheet.SpriteSheetAnimationFrame
	 */
    export class UVAnimationFrame {
		/**
		 * U偏移
		 */
        public offsetU: number;

		/**
		 * V偏移
		 */
        public offsetV: number;

		/**
		 * U缩放
		 */
        public scaleU: number;

		/**
		 * V缩放
		 */
        public scaleV: number;

		/**
		 * 旋转角度（度数）
		 */
        public rotation: number;

		/**
		 * 创建<code>UVAnimationFrame</code>实例
		 *
		 * @param offsetU			U元素偏移
		 * @param offsetV			V元素偏移
		 * @param scaleU			U元素缩放
		 * @param scaleV			V元素缩放
		 * @param rotation			旋转角度（度数）
		 */
        constructor(offsetU: number = 0, offsetV: number = 0, scaleU: number = 1, scaleV: number = 1, rotation: number = 0) {
            this.offsetU = offsetU;
            this.offsetV = offsetV;
            this.scaleU = scaleU;
            this.scaleV = scaleV;
            this.rotation = rotation;
        }
    }
}
