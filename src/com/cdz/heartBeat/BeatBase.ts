module feng3d {

	/**
	 * 心跳基础类
	 * @author cdz 2015-10-27
	 */
    export class BeatBase {

		/**
		 * 心跳类型
		 */
        public BeatType: string;

		/**
		 * 心跳间隔
		 */
        protected _beatInterval: number;

		/**
		 * 上次跳动时间
		 */
        protected _lastBeatTime: Date;

        private _isSuspend: boolean = false;

        constructor() {
            this._beatInterval = 50 / 3; //设置默认时间
        }

		/**
		 * 设置跳动间隔， 毫秒为单位
		 * @param interval 时间间隔
		 *
		 */
        public setInterval(interval: number) {
            this._beatInterval = interval;
        }

		/**
		 * 开始跳动
		 *
		 */
        public beginBeat() {
            this._lastBeatTime = new Date();
        }

		/**
		 * 心跳
		 * @param nowDate
		 *
		 */
        public beat(nowDate: Date) {
            if (this._isSuspend) {
                return;
            }

            var deltaTime: number = nowDate.getTime() - this._lastBeatTime.getTime();
            if (deltaTime >= this._beatInterval) {
                this._lastBeatTime = nowDate;
                GlobalDispatcher.instance.dispatchEvent(new HeartBeatEvent(this.BeatType));
            }
        }

		/**
		 * 挂起
		 */
        public suspend() {
            this._isSuspend = true;
        }

		/**
		 * 恢复
		 */
        public resume() {
            this._isSuspend = false;
        }

		/**
		 * 析构
		 */
        public dispose() {
            this._lastBeatTime = null;
        }
    }
}
