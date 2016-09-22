module feng3d {

	/**
	 * 分区横越者
	 * @author feng 2015-3-1
	 */
    export abstract class PartitionTraverser {
		/**
		 * 3D场景
		 */
        public scene: Scene3D;

		/**
		 * 进入点
		 */
        public _entryPoint: Vector3D;

		/**
		 * 碰撞标记，避免多次检测
		 */
        public static _collectionMark: number;

		/**
		 * 构建一个分区横越者
		 */
        constructor() {
        }

		/**
		 * 进入节点
		 * <p>正在穿过节点，或者正在与该节点进行检测</p>
		 * @param node 		被进入的节点
		 * @return			true：需要进一步检测子节点
		 */
        public enterNode(node: NodeBase): boolean {
            node = node;
            return true;
        }

		/**
		 * 应用天空盒
		 * @param skyBox		天空盒
		 */
        public abstract applySkyBox(skyBox: SkyBox);

		/**
		 * 应用渲染对象
		 * @param renderable		被横越者通过的可渲染对象
		 */
        public abstract applyRenderable(renderable: IRenderable);

		/**
		 * 应用方向光源
		 * @param light		被横越者通过的方向光源
		 */
        public abstract applyDirectionalLight(light: DirectionalLight);

		/**
		 * 应用点光源
		 * @param light		被横越者通过的点光源
		 */
        public abstract applyPointLight(light: PointLight);
    }
}
