module feng3d {

	/**
	 *
	 * @author feng 2014-4-30
	 */
    export class PickingColliderBase {
        protected ray3D: Ray3D;

        constructor() {
        }

		/**
		 * 获取碰撞法线
		 * @param indexData 顶点索引数据
		 * @param vertexData 顶点数据
		 * @param triangleIndex 三角形索引
		 * @param normal 碰撞法线
		 * @return 碰撞法线
		 *
		 */
        protected getCollisionNormal(indexData: number[], vertexData: number[], triangleIndex: number, normal: Vector3D = null): Vector3D {
            var i0: number = indexData[triangleIndex] * 3;
            var i1: number = indexData[triangleIndex + 1] * 3;
            var i2: number = indexData[triangleIndex + 2] * 3;

            var side0x: number = vertexData[i1] - vertexData[i0];
            var side0y: number = vertexData[i1 + 1] - vertexData[i0 + 1];
            var side0z: number = vertexData[i1 + 2] - vertexData[i0 + 2];
            var side1x: number = vertexData[i2] - vertexData[i0];
            var side1y: number = vertexData[i2 + 1] - vertexData[i0 + 1];
            var side1z: number = vertexData[i2 + 2] - vertexData[i0 + 2];

            if (!normal)
                normal = new Vector3D();
            normal.x = side0y * side1z - side0z * side1y;
            normal.y = side0z * side1x - side0x * side1z;
            normal.z = side0x * side1y - side0y * side1x;
            normal.w = 1;
            normal.normalize();
            return normal;
        }

		/**
		 * 获取碰撞uv
		 * @param indexData 顶点数据
		 * @param uvData uv数据
		 * @param triangleIndex 三角形所有
		 * @param v
		 * @param w
		 * @param u
		 * @param uvOffset
		 * @param uvStride
		 * @param uv uv坐标
		 * @return 碰撞uv
		 */
        protected getCollisionUV(indexData: number[], uvData: number[], triangleIndex: number, v: number, w: number, u: number, uvOffset: number, uvStride: number, uv: Point = null): Point {
            var uIndex: number = indexData[triangleIndex] * uvStride + uvOffset;
            var uv0x: number = uvData[uIndex];
            var uv0y: number = uvData[uIndex + 1];
            uIndex = indexData[triangleIndex + 1] * uvStride + uvOffset;
            var uv1x: number = uvData[uIndex];
            var uv1y: number = uvData[uIndex + 1];
            uIndex = indexData[triangleIndex + 2] * uvStride + uvOffset;
            var uv2x: number = uvData[uIndex];
            var uv2y: number = uvData[uIndex + 1];
            if (!uv)
                uv = new Point();
            uv.x = u * uv0x + v * uv1x + w * uv2x;
            uv.y = u * uv0y + v * uv1y + w * uv2y;
            return uv;
        }

		/**
		 * 设置碰撞射线
		 */
        public setLocalRay(ray3D: Ray3D) {
            this.ray3D = ray3D;
        }
    }
}
