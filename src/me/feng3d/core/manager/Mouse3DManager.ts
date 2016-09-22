module feng3d {
	/**
	 * 鼠标事件管理
	 * @author feng 2014-4-29
	 */
    export class Mouse3DManager {
        /** 射线采集器(采集射线穿过场景中物体的列表) */
        private _mousePicker: RaycastPicker = new RaycastPicker(false);

        /** 收集的鼠标事件列表 */
        private mouseEventList: string[] = [];

        /** 是否开启鼠标事件检测 */
        private mouseEventOpen: boolean = false;

        /** 当前相交数据 */
        private _collidingObject: PickingCollisionVO;
        /** 上次相交数据 */
        private _previousCollidingObject: PickingCollisionVO;

        /** 普通鼠标事件与3d鼠标事件对应关系 */
        private static eventMap;

        constructor() {
            if (Mouse3DManager.eventMap == null) {
                Mouse3DManager.eventMap = {};
                Mouse3DManager.eventMap[MouseEvent.CLICK] = MouseEvent3D.CLICK;
                Mouse3DManager.eventMap[MouseEvent.DOUBLE_CLICK] = MouseEvent3D.DOUBLE_CLICK;
                Mouse3DManager.eventMap[MouseEvent.MOUSE_DOWN] = MouseEvent3D.MOUSE_DOWN;
                Mouse3DManager.eventMap[MouseEvent.MOUSE_MOVE] = MouseEvent3D.MOUSE_MOVE;
                Mouse3DManager.eventMap[MouseEvent.MOUSE_OUT] = MouseEvent3D.MOUSE_OUT;
                Mouse3DManager.eventMap[MouseEvent.MOUSE_OVER] = MouseEvent3D.MOUSE_OVER;
                Mouse3DManager.eventMap[MouseEvent.MOUSE_UP] = MouseEvent3D.MOUSE_UP;
                Mouse3DManager.eventMap[MouseEvent.MOUSE_WHEEL] = MouseEvent3D.MOUSE_WHEEL;
            }
        }

		/**
		 * 开启鼠标事件
		 */
        public enableMouseListeners(view: View3D) {
            view.addEventListener(MouseEvent.MOUSE_OVER, this.onMouseOver);
            view.addEventListener(MouseEvent.MOUSE_OUT, this.onMouseOut);
        }

        private onMouseOver(event: MouseEvent) {
            var view: Sprite = event.currentTarget as Sprite;
            for (var eventType in Mouse3DManager.eventMap) {
                if (Mouse3DManager.eventMap.hasOwnProperty(eventType)) {
                    view.addEventListener(eventType, this.onMouseEvent);
                }
            }
            this.mouseEventList.length = 0;
            this.mouseEventOpen = true;
        }

        private onMouseOut(event: MouseEvent) {
            var view: Sprite = event.currentTarget as Sprite;

            for (var eventType in Mouse3DManager.eventMap) {
                if (Mouse3DManager.eventMap.hasOwnProperty(eventType)) {
                    view.removeEventListener(eventType, this.onMouseEvent);
                }
            }

            this.mouseEventOpen = false;
        }

		/**
		 * 收集玩家触发的鼠标事件
		 */
        private onMouseEvent(event: MouseEvent) {
            this.mouseEventList.push(event.type);
        }

		/**
		 * 处理玩家触发的鼠标事件
		 */
        public fireMouseEvents(mouseRay3D: Ray3D, mouseCollisionEntitys: Entity[]) {
            //玩家未触发鼠标事件时，直接返回
            if (!this.mouseEventOpen) {
                return;
            }

            var mouseEvent3DList: MouseEvent3D[] = [];

            //计算得到鼠标射线相交的物体
            this._collidingObject = this._mousePicker.getViewCollision(mouseRay3D, mouseCollisionEntitys);

            //处理3d对象的Over与Out事件
            var mouseEventType: string;
            var mouseEvent3D: MouseEvent3D;
            if (this._collidingObject != this._previousCollidingObject) {
                if (this._previousCollidingObject) {
                    mouseEvent3D = this.createMouseEvent3D(MouseEvent.MOUSE_OUT, this._previousCollidingObject);
                    mouseEvent3DList.push(mouseEvent3D);
                }
                if (this._collidingObject) {
                    mouseEvent3D = this.createMouseEvent3D(MouseEvent.MOUSE_OVER, this._collidingObject);
                    mouseEvent3DList.push(mouseEvent3D);
                }
            }

            //遍历收集的鼠标事件
            while (this._collidingObject && this.mouseEventList.length > 0) {
                mouseEventType = this.mouseEventList.pop();
                //处理鼠标事件
                mouseEvent3D = this.createMouseEvent3D(mouseEventType, this._collidingObject);
                mouseEvent3DList.push(mouseEvent3D);
            }

            this.dispatchAllEvent(mouseEvent3DList);

            this.mouseEventList.length = 0;
            mouseEvent3DList.length = 0;
            this._previousCollidingObject = this._collidingObject;
        }

		/**
		 * 抛出所有3D鼠标事件
		 * @param mouseEvent3DList
		 */
        private dispatchAllEvent(mouseEvent3DList: MouseEvent3D[]) {
            var mouseEvent3D: MouseEvent3D;
            var dispatcher: Container3D;
            while (mouseEvent3DList.length > 0) {
                mouseEvent3D = mouseEvent3DList.pop();
                if (mouseEvent3D && mouseEvent3D.object) {
                    dispatcher = mouseEvent3D.object;
                    if (dispatcher) {
                        dispatcher.dispatchEvent(mouseEvent3D);
                    }
                }
            }
        }

		/**
		 * 创建3D鼠标事件
		 * @param sourceEvent 2d鼠标事件
		 * @param collider 碰撞信息
		 * @return 3D鼠标事件
		 */
        private createMouseEvent3D(sourceEventType: string, collider: PickingCollisionVO = null): MouseEvent3D {
            var mouseEvent3DType: string = Mouse3DManager.eventMap[sourceEventType];
            if (mouseEvent3DType == null)
                return null;

            var mouseEvent3D: MouseEvent3D = new MouseEvent3D(mouseEvent3DType);
            mouseEvent3D.object = collider.firstEntity;
            mouseEvent3D.collider = collider;
            return mouseEvent3D;
        }
    }
}
