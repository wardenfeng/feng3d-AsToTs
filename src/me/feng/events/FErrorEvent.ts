module feng3d {


	/**
	 * 错误事件
	 * <p>为了与flash.events.ErrorEvent区分添加前缀F</p>
	 * @author feng 2015-12-7
	 */
    export class FErrorEvent extends ComponentEvent {
		/**
		 * 错误事件
		 */
        public static ERROR_EVENT: string = "errorEvent";

		/**
		 * 是否已经处理错误
		 */
        public isProcessed: boolean;

        constructor(type: string, data = null, bubbles: boolean = false, cancelable: boolean = false) {
            super(type, data, bubbles, cancelable);
        }
    }
}
