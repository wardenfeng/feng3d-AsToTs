module feng3d {

	/**
	 * 3D环境缓冲编号集合
	 * @author feng 2015-7-21
	 */
    export class Context3DBufferID {
        private static _instance: Context3DBufferID;

		/**
		 * 创建3D环境缓冲编号集合
		 */
        constructor() {
        }

        public static get instance(): Context3DBufferID {
            if (Context3DBufferID._instance == null)
                Context3DBufferID._instance = new Context3DBufferID();
            return Context3DBufferID._instance;
        }
    }
}
