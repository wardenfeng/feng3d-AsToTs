module feng3d {

	/**
	 * sprite动画帧
	 * @author feng 2015-9-18
	 * @see me.feng3d.animators.uv.UVAnimationFrame
	 */
    export class SpriteSheetAnimationFrame {
		/**
		 * U元素偏移
		 */
        public offsetU: number;

		/**
		 * V元素偏移
		 */
        public offsetV: number;

		/**
		 * U元素缩放
		 */
        public scaleU: number;

		/**
		 * V元素缩放
		 */
        public scaleV: number;

		/**
		 * 映射编号
		 */
        public mapID: number;

		/**
		 * 创建<code>SpriteSheetAnimationFrame</code>实例
		 *
		 * @param offsetU			U元素偏移
		 * @param offsetV			V元素偏移
		 * @param scaleU			U元素缩放
		 * @param scaleV			V元素缩放
		 * @param mapID				映射编号
		 */
        constructor(offsetU: number = 0, offsetV: number = 0, scaleU: number = 1, scaleV: number = 1, mapID: number = 0) {
            this.offsetU = offsetU;
            this.offsetV = offsetV;
            this.scaleU = scaleU;
            this.scaleV = scaleV;
            this.mapID = mapID;
        }
    }
}
