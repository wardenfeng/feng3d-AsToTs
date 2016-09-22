module feng3d {



	/**
	 *
	 * @author feng 2014-4-30
	 */
    export interface IPickingCollider {
		/**
		 * 设置本地射线
		 * @param ray3D		射线
		 */
        setLocalRay(ray3D: Ray3D);

		/**
		 * 测试几何体的碰撞
		 * @param subMesh 						被检测网格
		 * @param pickingCollisionVO 			碰撞数据
		 * @param shortestCollisionDistance 	最短碰撞距离
		 * @param bothSides 					是否三角形双面判定
		 * @return 								是否碰撞
		 */
        testSubMeshCollision(subMesh: SubMesh, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number, bothSides: boolean): boolean;
    }
}
