module feng3d {

	/**
	 * 定义检测相交的工具类
	 * @author feng 2014-4-30
	 */
    export class PickingColliderType {
		/**
		 * Default null collider that forces picker to only use entity bounds for hit calculations on an Entity
		 */
        public static BOUNDS_ONLY: IPickingCollider = null;

		/**
		 * 使用纯AS3计算与实体相交
		 */
        public static AS3_BEST_HIT: IPickingCollider = new AS3PickingCollider(true);

    }
}
