module feng3d {
	/**
	 * 深度测试缓存
	 * @author feng 2014-8-28
	 */
    export class DepthTestBuffer extends Context3DBuffer {
        public depthMask: boolean;
        public passCompareMode: string;

		/**
		 * 创建一个深度测试缓存
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

            context3D.setDepthTest(this.depthMask, this.passCompareMode);
        }

		/**
		 * 更新
		 * @param depthMask
		 * @param passCompareMode
		 */
        public update(depthMask: boolean, passCompareMode: string) {
            this.depthMask = depthMask;
            this.passCompareMode = passCompareMode;
        }
    }
}
