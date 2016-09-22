module feng3d {


	/**
	 * 注视点控制器
	 * @author feng 2014-10-10
	 */
    export class LookAtController extends ControllerBase {
        protected _lookAtPosition: Vector3D;
        protected _lookAtObject: Container3D;

        protected _upAxis: Vector3D = Vector3D.Y_AXIS;
        private _pos: Vector3D = new Vector3D();

		/**
		 * 创建注视点控制器
		 * @param targetObject 控制对象
		 * @param lookAtObject 被注视对象
		 */
        constructor(targetObject: Entity = null, lookAtObject: Container3D = null) {
            super(targetObject);

            if (lookAtObject)
                this.lookAtObject = lookAtObject;
            else
                this.lookAtPosition = new Vector3D();
        }

		/**
		 * 目标对象的上朝向
		 */
        public get upAxis(): Vector3D {
            return this._upAxis;
        }

        public set upAxis(upAxis: Vector3D) {
            this._upAxis = upAxis;

            this.notifyUpdate();
        }

		/**
		 * 被注视目标所在位置
		 */
        public get lookAtPosition(): Vector3D {
            return this._lookAtPosition;
        }

        public set lookAtPosition(val: Vector3D) {
            if (this._lookAtObject) {
                this._lookAtObject.removeEventListener(Transform3DEvent.SCENETRANSFORM_CHANGED, this.onLookAtObjectChanged);
                this._lookAtObject = null;
            }

            this._lookAtPosition = val;

            this.notifyUpdate();
        }

		/**
		 * 被注视目标
		 */
        public get lookAtObject(): Container3D {
            return this._lookAtObject;
        }

        public set lookAtObject(val: Container3D) {
            if (this._lookAtPosition)
                this._lookAtPosition = null;

            if (this._lookAtObject == val)
                return;

            if (this._lookAtObject)
                this._lookAtObject.removeEventListener(Transform3DEvent.SCENETRANSFORM_CHANGED, this.onLookAtObjectChanged);

            this._lookAtObject = val;

            if (this._lookAtObject)
                this._lookAtObject.addEventListener(Transform3DEvent.SCENETRANSFORM_CHANGED, this.onLookAtObjectChanged);

            this.notifyUpdate();
        }

		/**
		 * 处理注视目标变化事件
		 */
        private onLookAtObjectChanged(event: Transform3DEvent) {
            this.notifyUpdate();
        }

		/**
		 * @inheritDoc
		 */
        public update() {
            if (this._targetObject) {
                if (this._lookAtPosition) {
                    this._targetObject.transform3D.lookAt(this._lookAtPosition, this._upAxis);
                }
                else if (this._lookAtObject) {
                    if (this._targetObject.parent && this._lookAtObject.parent) {
                        if (this._targetObject.parent != this._lookAtObject.parent) { // different spaces
                            this._pos.x = this._lookAtObject.scenePosition.x;
                            this._pos.y = this._lookAtObject.scenePosition.y;
                            this._pos.z = this._lookAtObject.scenePosition.z;
                            //
                            Matrix3DUtils.transformVector(this._targetObject.parent.inverseSceneTransform, this._pos, this._pos);
                        }
                        else { //one parent
                            Matrix3DUtils.getTranslation(this._lookAtObject.transform3D.transform, this._pos);
                        }
                    }
                    else if (this._lookAtObject.scene) {
                        this._pos.x = this._lookAtObject.scenePosition.x;
                        this._pos.y = this._lookAtObject.scenePosition.y;
                        this._pos.z = this._lookAtObject.scenePosition.z;
                    }
                    else {
                        Matrix3DUtils.getTranslation(this._lookAtObject.transform3D.transform, this._pos);
                    }
                    this._targetObject.transform3D.lookAt(this._pos, this._upAxis);
                }
            }
        }
    }
}
