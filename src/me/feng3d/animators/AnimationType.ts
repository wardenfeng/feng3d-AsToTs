module feng3d {

	/**
	 * 动画类型
	 * @author feng 2015-1-27
	 */
    export enum AnimationType {
        /** 没有动画 */
        NONE,
        /** 顶点动画由GPU计算 */
        VERTEX_CPU,
        /** 顶点动画由GPU计算 */
        VERTEX_GPU,
        /** 骨骼动画由GPU计算 */
        SKELETON_CPU,
        /** 骨骼动画由GPU计算 */
        SKELETON_GPU,
        /** 粒子特效 */
        PARTICLE
    }
}
