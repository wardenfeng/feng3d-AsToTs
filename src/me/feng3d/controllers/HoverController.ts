module feng3d {

	/**
	 * 盘旋控制器
	 * @author feng 2014-10-10
	 */
    export class HoverController extends LookAtController {
        public _currentPanAngle: number = 0;
        public _currentTiltAngle: number = 90;

        protected _origin: Vector3D = new Vector3D(0.0, 0.0, 0.0);
        private _panAngle: number = 0;
        private _tiltAngle: number = 90;
        private _distance: number = 1000;
        private _minPanAngle: number = -Infinity;
        private _maxPanAngle: number = Infinity;

        private _minTiltAngle: number = -90;
        private _maxTiltAngle: number = 90;
        private _yFactor: number = 2;
        private _wrapPanAngle: boolean = false;
        private _pos1: Vector3D = new Vector3D();

		/**
		 * 创建盘旋控制器
		 * @param targetObject 控制对象
		 * @param lookAtObject 被注视对象
		 * @param panAngle 摄像机以Y轴旋转的角度
		 * @param tiltAngle 摄像机以X轴旋转的角度
		 * @param distance 与注视对象的距离
		 * @param minTiltAngle 以X轴旋转的最小角度。
		 * @param maxTiltAngle 以X轴旋转的最大角度。
		 * @param minPanAngle 以Y轴旋转的最小角度。
		 * @param maxPanAngle 以Y轴旋转的最大角度。
		 * @param yFactor
		 * @param wrapPanAngle 是否把角度约束在0到360度
		 */
        constructor(targetObject: Entity = null, lookAtObject: Container3D = null, panAngle: number = 0, tiltAngle: number = 90, distance: number = 1000, minTiltAngle: number = -90, maxTiltAngle: number = 90, minPanAngle: number = NaN, maxPanAngle: number = NaN, yFactor: number = 2, wrapPanAngle: boolean = false) {
            super(targetObject, lookAtObject);

            this.distance = distance;
            this.panAngle = panAngle;
            this.tiltAngle = tiltAngle;
            this.minPanAngle = minPanAngle || -Infinity;
            this.maxPanAngle = maxPanAngle || Infinity;
            this.minTiltAngle = minTiltAngle;
            this.maxTiltAngle = maxTiltAngle;
            this.yFactor = yFactor;
            this.wrapPanAngle = wrapPanAngle;

            //values passed in contrustor are applied immediately
            this._currentPanAngle = this._panAngle;
            this._currentTiltAngle = this._tiltAngle;
        }

		/**
		 * 与注视目标的距离
		 */
        public get distance(): number {
            return this._distance;
        }

        public set distance(val: number) {
            if (this._distance == val)
                return;

            this._distance = val;

            this.notifyUpdate();
        }

		/**
		 * 最小摆动角度
		 */
        public get minPanAngle(): number {
            return this._minPanAngle;
        }

        public set minPanAngle(val: number) {
            if (this._minPanAngle == val)
                return;

            this._minPanAngle = val;

            this.panAngle = Math.max(this._minPanAngle, Math.min(this._maxPanAngle, this._panAngle));
        }

		/**
		 * 最大摆动角度
		 */
        public get maxPanAngle(): number {
            return this._maxPanAngle;
        }

        public set maxPanAngle(val: number) {
            if (this._maxPanAngle == val)
                return;

            this._maxPanAngle = val;

            this.panAngle = Math.max(this._minPanAngle, Math.min(this._maxPanAngle, this._panAngle));
        }

		/**
		 * 倾斜角度
		 */
        public get tiltAngle(): number {
            return this._tiltAngle;
        }

        public set tiltAngle(val: number) {
            val = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, val));

            if (this._tiltAngle == val)
                return;

            this._tiltAngle = val;

            this.notifyUpdate();
        }

		/**
		 * 最小倾斜角度
		 */
        public get minTiltAngle(): number {
            return this._minTiltAngle;
        }

        public set minTiltAngle(val: number) {
            if (this._minTiltAngle == val)
                return;

            this._minTiltAngle = val;

            this.tiltAngle = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, this._tiltAngle));
        }

		/**
		 * 最大倾斜角度
		 */
        public get maxTiltAngle(): number {
            return this._maxTiltAngle;
        }

        public set maxTiltAngle(val: number) {
            if (this._maxTiltAngle == val)
                return;

            this._maxTiltAngle = val;

            this.tiltAngle = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, this._tiltAngle));
        }

		/**
		 * y因子，用于体现摄像机水平与垂直旋转的差异
		 * @see #distance
		 */
        public get yFactor(): number {
            return this._yFactor;
        }

        public set yFactor(val: number) {
            if (this._yFactor == val)
                return;

            this._yFactor = val;

            this.notifyUpdate();
        }

		/**
		 * 是否把角度约束在0到360度
		 */
        public get wrapPanAngle(): boolean {
            return this._wrapPanAngle;
        }

        public set wrapPanAngle(val: boolean) {
            if (this._wrapPanAngle == val)
                return;

            this._wrapPanAngle = val;

            this.notifyUpdate();
        }

		/**
		 * 摆动角度
		 */
        public get panAngle(): number {
            return this._panAngle;
        }

        public set panAngle(val: number) {
            val = Math.max(this._minPanAngle, Math.min(this._maxPanAngle, val));

            if (this._panAngle == val)
                return;

            this._panAngle = val;

            this.notifyUpdate();
        }

		/**
		 * 更新当前倾斜与摆动角度
		 * @see    #tiltAngle
		 * @see    #panAngle
		 * @see    #steps
		 */
        public update() {
            if (this._tiltAngle != this._currentTiltAngle || this._panAngle != this._currentPanAngle) {
                if (this._wrapPanAngle) {
                    if (this._panAngle < 0) {
                        this._currentPanAngle += this._panAngle % 360 + 360 - this._panAngle;
                        this._panAngle = this._panAngle % 360 + 360;
                    }
                    else {
                        this._currentPanAngle += this._panAngle % 360 - this._panAngle;
                        this._panAngle = this._panAngle % 360;
                    }

                    while (this._panAngle - this._currentPanAngle < -180)
                        this._currentPanAngle -= 360;

                    while (this._panAngle - this._currentPanAngle > 180)
                        this._currentPanAngle += 360;
                }

                this._currentPanAngle = this._panAngle;
                this._currentTiltAngle = this._tiltAngle;

                //snap coords if angle differences are close
                if ((Math.abs(this.tiltAngle - this._currentTiltAngle) < 0.01) && (Math.abs(this._panAngle - this._currentPanAngle) < 0.01)) {
                    this._currentTiltAngle = this._tiltAngle;
                    this._currentPanAngle = this._panAngle;
                }
            }

            if (!this._targetObject)
                return;

            if (this._lookAtPosition) {
                this._pos1.x = this._lookAtPosition.x;
                this._pos1.y = this._lookAtPosition.y;
                this._pos1.z = this._lookAtPosition.z;
            }
            else if (this._lookAtObject) {
                if (this._targetObject.parent && this._lookAtObject.parent) {
                    if (this._targetObject.parent != this._lookAtObject.parent) { // different spaces
                        this._pos1.x = this._lookAtObject.scenePosition.x;
                        this._pos1.y = this._lookAtObject.scenePosition.y;
                        this._pos1.z = this._lookAtObject.scenePosition.z;
                        Matrix3DUtils.transformVector(this._targetObject.parent.inverseSceneTransform, this._pos1, this._pos1);
                    }
                    else { //one parent
                        Matrix3DUtils.getTranslation(this._lookAtObject.transform3D.transform, this._pos1);
                    }
                }
                else if (this._lookAtObject.scene) {
                    this._pos1.x = this._lookAtObject.scenePosition.x;
                    this._pos1.y = this._lookAtObject.scenePosition.y;
                    this._pos1.z = this._lookAtObject.scenePosition.z;
                }
                else {
                    Matrix3DUtils.getTranslation(this._lookAtObject.transform3D.transform, this._pos1);
                }
            }
            else {
                this._pos1.x = this._origin.x;
                this._pos1.y = this._origin.y;
                this._pos1.z = this._origin.z;
            }

            this._targetObject.transform3D.x = this._pos1.x + this._distance * Math.sin(this._currentPanAngle * MathConsts.DEGREES_TO_RADIANS) * Math.cos(this._currentTiltAngle * MathConsts.DEGREES_TO_RADIANS);
            this._targetObject.transform3D.z = this._pos1.z + this._distance * Math.cos(this._currentPanAngle * MathConsts.DEGREES_TO_RADIANS) * Math.cos(this._currentTiltAngle * MathConsts.DEGREES_TO_RADIANS);
            this._targetObject.transform3D.y = this._pos1.y + this._distance * Math.sin(this._currentTiltAngle * MathConsts.DEGREES_TO_RADIANS) * this._yFactor;
            super.update();
        }
    }
}
