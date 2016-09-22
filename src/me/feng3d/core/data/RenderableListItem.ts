module feng3d {




	/**
	 * 可渲染元素链表（元素）
	 * @author feng 2015-3-6
	 */
    export class RenderableListItem {
		/**
		 * 指向下个可渲染列表元素
		 */
        public next: RenderableListItem;
		/**
		 * 当前可渲染对象
		 */
        public renderable: IRenderable;

		/**
		 * 材质编号
		 */
        public materialId: number;
		/**
		 * 渲染顺序编号
		 */
        public renderOrderId: number;
		/**
		 * Z索引
		 */
        public zIndex: number;
		/**
		 * 渲染场景矩阵
		 */
        public renderSceneTransform: Matrix3D;

		/**
		 * 创建一个可渲染列表
		 */
        constructor() {
        }
    }
}
