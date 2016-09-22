module feng3d {


	/**
	 * sprite动画状态接口
	 * @author feng 2015-9-18
	 */
    export interface ISpriteSheetAnimationState extends IAnimationState {
		/**
		 * 当前帧数据
		 */
        currentFrameData: SpriteSheetAnimationFrame;

		/**
		 * 当前帧数
		 */
        currentFrameNumber: number;
    }
}
