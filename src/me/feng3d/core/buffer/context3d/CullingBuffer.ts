module feng3d {

	/**
	 * 三角形剔除模式缓存
	 * @author feng 2014-8-14
	 */
    export class CullingBuffer extends Context3DBuffer {
        /** 三角形剔除模式 */
        public triangleFaceToCull: string;

		/**
		 * 创建一个三角形剔除模式缓存
		 * @param dataTypeId 		数据缓存编号
		 * @param updateFunc 		更新回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }

		/**
		 * @inheritDoc
		 */
        public doBuffer(context3D: Context3D) {
            this.doUpdateFunc();

            context3D.setCulling(this.triangleFaceToCull);
        }

		/**
		 * 更新
		 * @param triangleFaceToCull
		 */
        public update(triangleFaceToCull: string) {
            this.triangleFaceToCull = triangleFaceToCull;
        }
    }
}
