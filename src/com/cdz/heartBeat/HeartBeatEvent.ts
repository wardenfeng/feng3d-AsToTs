module feng3d {


	/**
	 *
	 * @author cdz 2015-10-31
	 */
    export class HeartBeatEvent extends Event {
        /** 渲染心跳 */
        public static RENDER_BEAT: string = "renderBeat";

        /** 逻辑心跳 */
        public static LOGIC_BEAT: string = "logicBeat";

        /** 资源解析心跳 */
        public static RESOURCE_PARSE_BEAT: string = "resourceParseBeat";

        /** 物理心跳 */
        public static PHYSICS_BEAT: string = "physicsBeat";

        /** 鼠标检测心跳 */
        public static MOUSE_CHECK_BEAT: string = "MouseCheckBeat";

        constructor(type: string, data = null, bubbles: boolean = false, cancelable: boolean = false) {
            super(type, data, bubbles, cancelable);
        }
    }
}
