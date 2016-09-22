module feng3d {

	/**
	 *
	 * @author cdz 2015-10-31
	 */
    export class HeartBeatModuleData {
		/**
		 * 心跳类型名称
		 * @see
		 */
        public BeatType: string;

		/**
		 * 心跳时间间隔 单位毫秒
		 */
        public Interval: number;

		/**
		 *
		 * @param taskCollectionType			任务集合类型名称
		 * @param taskCollectionTypeClass		任务集合类型定义
		 */
        constructor(BeatType: string, Interval: number) {
            this.BeatType = BeatType;
            this.Interval = Interval;
        }
    }
}
