module feng3d {




	/**
	 * 提供动画数据集合的接口
	 * @author feng 2015-9-18
	 */
    export interface IAnimationSet {
		/**
		 * 检查是否有该动作名称
		 * @param name			动作名称
		 */
        hasAnimation(name: string): boolean;

		/**
		 * 获取动画节点
		 * @param name			动作名称
		 */
        getAnimation(name: string): AnimationNodeBase;

		/**
		 * 判断是否使用CPU计算
		 * @private
		 */
        usesCPU: boolean;

		/**
		 * 取消使用GPU计算
		 * @private
		 */
        cancelGPUCompatibility();

		/**
		 * 激活状态，收集GPU渲染所需数据及其状态
		 * @param shaderParams			渲染参数
		 * @param pass					材质渲染通道
		 */
        activate(shaderParams: ShaderParams, pass: MaterialPassBase)
    }
}
