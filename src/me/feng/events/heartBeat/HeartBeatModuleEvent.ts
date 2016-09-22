module feng3d {



	/**
	 *
	 * @author cdz 2015-10-31
	 */
    export class HeartBeatModuleEvent extends Event {
        /** 注册心跳类型 */
        public static REGISTER_BEAT_TYPE: string = "registerBeatType";

        /** 注销心跳类型 */
        public static UNREGISTER_BEAT_TYPE: string = "unregisterBeatType";

        /** 暂停一个心跳类型 */
        public static SUSPEND_ONE_BEAT: string = "suspendOneBeat";

        /** 恢复心跳类型 */
        public static RESUME_ONE_BEAT: string = "resumeOneBeat";

        /** 停止所有心跳 */
        public static SUSPEND_All_BEAT: string = "suspendAllBeat";

        /** 停止所有心跳 */
        public static RESUME_ALL_BEAT: string = "resumeAllBeat";

		/**
		 * 创建任务模块事件
		 * @param type 					事件的类型
		 * @param data					事件携带的数据
		 * @param bubbles 				确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
		 * @param cancelable 			确定是否可以取消 Event 对象。默认值为 false。
		 */
        constructor(type: string, data = null, bubbles: boolean = false, cancelable: boolean = false) {
            super(type, data, bubbles, cancelable);
        }
    }
}
