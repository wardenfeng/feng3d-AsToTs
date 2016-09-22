module feng3d {


	/**
	 * 实体排序接口
	 * <p>为优化渲染EntityCollector排序</p>
	 * @author feng 2015-3-6
	 */
    export interface IEntitySorter {
		/**
		 * 排序实体收集器中潜在显示对象
		 * @param collector		实体收集器
		 */
        sort(collector: EntityCollector);
    }
}
