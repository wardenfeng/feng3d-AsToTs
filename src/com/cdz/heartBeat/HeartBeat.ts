module feng3d {

	/**
	 ** 心跳模块类
	 * @includeExample HeatBeatModuleTest.as
	 * @author cdz 2015-10-31
	 */
    export class HeartBeat {
        private static heartBeatManager: HeartBeatManager;

		/**
		 * 初始化模块
		 */
        public static init() {
            HeartBeat.heartBeatManager || (HeartBeat.heartBeatManager = new HeartBeatManager());
        }
    }
}
