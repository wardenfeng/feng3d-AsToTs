module feng3d {

	/**
	 * 3D视图
	 * @author feng 2014-3-17
	 */
    export class View3D extends Sprite {
		/**
		 * 射线坐标临时变量
		 */
        private static tempRayPosition: Vector3D = new Vector3D();
		/**
		 * 射线方向临时变量
		 */
        private static tempRayDirection: Vector3D = new Vector3D();

        private _width: number = 0;
        private _height: number = 0;

        private _localPos: Point = new Point();
        private _globalPos: Point = new Point();
        private _globalPosDirty: boolean;

        protected _parentIsStage: boolean;

        private _antiAlias: number;

        protected _backBufferInvalid: boolean = true;

        private _camera: Camera3D;

        private _scene: Scene3D;

        protected _entityCollector: EntityCollector;

        private _stage3DProxy: Stage3DProxy;

        /** 渲染器 */
        protected _renderer: RendererBase;
        /** 是否被添加到舞台 */
        private _addedToStage: boolean;
        /** 是否强行使用软件渲染 */
        private _forceSoftware: boolean;
        /** 指定 Flash Player 支持低级别 GPU 的范围 */
        private _profile: string;

        private _backgroundColor: number = 0x000000;
        private _backgroundAlpha: number = 1;

        protected _mouse3DManager: Mouse3DManager;

		/**
		 * 点击区域
		 */
        private _hitField: Sprite;

        private _scissorRectDirty: boolean = true;
        private _viewportDirty: boolean = true;

        protected _aspectRatio: number;

        protected _shareContext: boolean = false;

		/**
		 * 创建一个3D视图
		 * @param scene 				场景
		 * @param camera 				摄像机
		 * @param renderer				渲染器
		 * @param forceSoftware			是否强行使用软件渲染
		 * @param profile				指定 Flash Player 支持低级别 GPU 的范围
		 */
        constructor(scene: Scene3D = null, camera: Camera3D = null, renderer: RendererBase = null, forceSoftware: boolean = false, profile: string = Context3DProfile.STANDARD) {
            super();
            this._scene = scene || new Scene3D();
            this._camera = camera || new Camera3D();
            this._renderer = renderer || new DefaultRenderer();

            this._forceSoftware = forceSoftware;
            this._profile = profile;

            this._entityCollector = this._renderer.createEntityCollector();
            this._entityCollector.camera = this._camera;

            this.initHitField();

            this._mouse3DManager = new Mouse3DManager();
            this._mouse3DManager.enableMouseListeners(this);

            this.addEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage,  0, true);
            this.addEventListener(Event.ADDED, this.onAdded,  0, true);
            this.addEventListener(Event.REMOVED_FROM_STAGE, this.onRemoveFromeStage,  0, true);

            this._camera.partition = this._scene.partition;
        }

        public set x(value: number) {
            if (this.x == value)
                return;

            this._localPos.x = this.x = value;

            this._globalPos.x = this.parent ? this.parent.localToGlobal(this._localPos).x : value;
            this._globalPosDirty = true;
        }

        public set y(value: number) {
            if (this.y == value)
                return;

            this._localPos.y = value;

            this._globalPos.y = this.parent ? this.parent.localToGlobal(this._localPos).y : value;
            this._globalPosDirty = true;
        }

        public set visible(value: boolean) {
            var _visible = value;

            if (this._stage3DProxy && !this._shareContext)
                this._stage3DProxy.visible = value;
        }

		/**
		 * The amount of anti-aliasing to be used.
		 */
        public get antiAlias(): number {
            return this._antiAlias;
        }

        public set antiAlias(value: number) {
            this._antiAlias = value;

            this._backBufferInvalid = true;
        }

		/**
		 * 摄像机
		 */
        public get camera(): Camera3D {
            return this._camera;
        }

        public set camera(value: Camera3D) {
            this._camera.removeEventListener(CameraEvent.LENS_CHANGED, this.onLensChanged);

            this._camera = value;
            this._entityCollector.camera = this._camera;

            if (this._scene)
                this._camera.partition = this._scene.partition;

            this._camera.addEventListener(CameraEvent.LENS_CHANGED, this.onLensChanged);

            this._scissorRectDirty = true;
            this._viewportDirty = true;

        }

		/**
		 * 处理镜头改变事件
		 */
        private onLensChanged(event: CameraEvent) {
            this._scissorRectDirty = true;
            this._viewportDirty = true;
        }

		/**
		 * 处理添加到舞台事件
		 */
        private onAddedToStage(event: Event) {
            this._addedToStage = true;

            if (!this._stage3DProxy) {
                this._stage3DProxy = Stage3DManager.getInstance(this.stage).getFreeStage3DProxy(this._forceSoftware, this._profile);
                //				this._stage3DProxy.addEventListener(Stage3DEvent.VIEWPORT_UPDATED, onViewportUpdated);
                this._stage3DProxy.addEventListener(Stage3DEvent.CONTEXT3D_RECREATED, this.onContext3DRecreated);
            }

            this._stage3DProxy.visible = true;

            if (this._width == 0)
                this.width = this.stage.stageWidth;

            if (this._height == 0)
                this.height = this.stage.stageHeight;
        }

		/**
		 * 添加事件
		 * @param event
		 */
        private onAdded(event: Event) {
            this._parentIsStage = (this.parent == this.stage);

            this._globalPos = this.parent.localToGlobal(this._localPos);
            this._globalPosDirty = true;
        }

		/**
		 * 处理3D环境被重建事件
		 */
        private onContext3DRecreated(event: Stage3DEvent) {
            //			_depthTextureInvalid = true;
        }

		/**
		 * 处理从舞台移除事件
		 */
        private onRemoveFromeStage(event: Event) {
            this._stage3DProxy.visible = false;
        }

		/**
		 * 初始化点击区域
		 */
        private initHitField() {
            this._hitField = new Sprite();
            this._hitField.alpha = 0;
            this._hitField.doubleClickEnabled = true;
            this._hitField.graphics.beginFill(0x000000);
            this._hitField.graphics.drawRect(0, 0, 100, 100);
            this.addChild(this._hitField);
        }

		/**
		 * 添加源码地址
		 * @param url
		 */
        public addSourceURL(url: string) {

        }

		/**
		 * 渲染3D视图
		 */
        public render() {
            //当3D环境被系统释放，不能进行渲染
            if (!this.stage3DProxy.recoverFromDisposal()) {
                this._backBufferInvalid = true;
                return;
            }

            //重置渲染设置
            if (this._backBufferInvalid)
                this.updateBackBuffer();

            if (!this._parentIsStage) {
                var globalPos: Point = this.parent.localToGlobal(this._localPos);
                if (this._globalPos.x != globalPos.x || this._globalPos.y != globalPos.y) {
                    this._globalPos = globalPos;
                    this._globalPosDirty = true;
                }
            }

            if (this._globalPosDirty)
                this.updateGlobalPos();

            this._entityCollector.clear();

            //收集渲染实体
            this._scene.traversePartitions(this._entityCollector);

            this._renderer.shareContext = this._shareContext;

            //渲染收集的实体对象
            this._renderer.render(this.stage3DProxy, this._entityCollector);

            //收集场景显示对象
            this._scene.collectMouseCollisionEntitys();

            if (!this._shareContext) {
                this.stage3DProxy.present();

                //获取鼠标射线
                var mouseRay3D: Ray3D = this.getMouseRay3D();
                //更新鼠标碰撞
                this._mouse3DManager.fireMouseEvents(mouseRay3D, this._scene.mouseCollisionEntitys);
            }

            // register that a view has been rendered
            this.stage3DProxy.bufferClear = false;
        }

        /** 3d场景 */
        public get scene(): Scene3D {
            return this._scene;
        }

		/**
		 * @private
		 */
        public set scene(value: Scene3D) {
            this._scene = value;
        }

		/**
		 * 3D舞台代理
		 */
        public get stage3DProxy(): Stage3DProxy {
            return this._stage3DProxy;
        }

        public set stage3DProxy(value: Stage3DProxy) {
            this._stage3DProxy = value;

            this._stage3DProxy = this.stage3DProxy;

            this._globalPosDirty = true;
        }

		/**
		 * 宽度
		 */
        public get width(): number {
            return this._width;
        }

        public set width(value: number) {
            //限制软件渲染时最大宽度
            if (this._stage3DProxy && this._stage3DProxy.usesSoftwareRendering && value > 2048)
                value = 2048;

            if (this._width == value)
                return;

            this._hitField.width = value;
            this._width = value;

            this._aspectRatio = this._width / this._height;
            this._camera.lens.aspectRatio = this._aspectRatio;

            this._backBufferInvalid = true;
        }

		/**
		 * 高度
		 */
        public get height(): number {
            return this._height;
        }

        public set height(value: number) {
            //限制软件渲染时最大高度
            if (this._stage3DProxy && this._stage3DProxy.usesSoftwareRendering && value > 2048)
                value = 2048;

            if (this._height == value)
                return;

            this._hitField.height = value;
            this._height = value;

            this._aspectRatio = this._width / this._height;
            this._camera.lens.aspectRatio = this._aspectRatio;

            this._backBufferInvalid = true;
        }

		/**
		 * 渲染面数
		 */
        public get renderedFacesCount(): number {
            return 0;
        }

		/**
		 * Defers control of Context3D clear() and present() calls to Stage3DProxy, enabling multiple Stage3D frameworks
		 * to share the same Context3D object.
		 */
        public get shareContext(): boolean {
            return this._shareContext;
        }

        public set shareContext(value: boolean) {
            if (this._shareContext == value)
                return;

            this._shareContext = value;
            this._globalPosDirty = true;
        }

		/**
		 * 更新背景缓冲大小
		 */
        protected updateBackBuffer() {
            if (this._stage3DProxy.context3D && !this._shareContext) {
                if (this._width && this._height) {
                    if (this._stage3DProxy.usesSoftwareRendering) {
                        if (this._width > 2048)
                            this._width = 2048;
                        if (this._height > 2048)
                            this._height = 2048;
                    }

                    this._stage3DProxy.configureBackBuffer(this._width, this._height, this._antiAlias);
                    this._backBufferInvalid = false;
                }
                else {
                    this.width = this.stage.stageWidth;
                    this.height = this.stage.stageHeight;
                }
            }
        }

		/**
		 * 更新全局坐标
		 */
        protected updateGlobalPos() {
            this._globalPosDirty = false;

            if (!this._stage3DProxy)
                return;
            this._stage3DProxy.x = this._globalPos.x;
            this._stage3DProxy.y = this._globalPos.y;
        }

		/**
		 * 背景颜色
		 */
        public set backgroundColor(value: number) {
            this._backgroundColor = value;
            this._renderer.backgroundColor = this._backgroundColor;
        }

		/**
		 * 投影坐标（世界坐标转换为3D视图坐标）
		 * @param point3d 世界坐标
		 * @return 屏幕的绝对坐标
		 */
        public project(point3d: Vector3D): Vector3D {
            var v: Vector3D = this._camera.project(point3d);

            v.x = (v.x + 1.0) * this._width / 2.0;
            v.y = (v.y + 1.0) * this._height / 2.0;

            return v;
        }

		/**
		 * 屏幕坐标投影到场景坐标
		 * @param nX 屏幕坐标X ([0-width])
		 * @param nY 屏幕坐标Y ([0-height])
		 * @param sZ 到屏幕的距离
		 * @param v 场景坐标（输出）
		 * @return 场景坐标
		 */
        public unproject(sX: number, sY: number, sZ: number, v: Vector3D = null): Vector3D {
            var gpuPos: Point = this.screenToGpuPosition(new Point(sX, sY));
            return this._camera.unproject(gpuPos.x, gpuPos.y, sZ, v);
        }

		/**
		 * 屏幕坐标转GPU坐标
		 * @param screenPos 屏幕坐标 (x:[0-width],y:[0-height])
		 * @return GPU坐标 (x:[-1,1],y:[-1-1])
		 */
        public screenToGpuPosition(screenPos: Point): Point {
            var gpuPos: Point = new Point();
            gpuPos.x = (screenPos.x * 2 - this._width) / this._stage3DProxy.width;
            gpuPos.y = (screenPos.y * 2 - this._height) / this._stage3DProxy.height;
            return gpuPos;
        }

		/**
		 * 获取鼠标射线（与鼠标重叠的摄像机射线）
		 */
        public getMouseRay3D(): Ray3D {
            return this.getRay3D(this.mouseX, this.mouseY);
        }

		/**
		 * 获取与坐标重叠的射线
		 * @param x view3D上的X坐标
		 * @param y view3D上的X坐标
		 * @return
		 */
        public getRay3D(x: number, y: number): Ray3D {
            //摄像机坐标
            var rayPosition: Vector3D = this.unproject(x, y, 0, View3D.tempRayPosition);
            //摄像机前方1处坐标
            var rayDirection: Vector3D = this.unproject(x, y, 1, View3D.tempRayDirection);
            //射线方向
            rayDirection.x = rayDirection.x - rayPosition.x;
            rayDirection.y = rayDirection.y - rayPosition.y;
            rayDirection.z = rayDirection.z - rayPosition.z;
            rayDirection.normalize();
            //定义射线
            var ray3D: Ray3D = new Ray3D(rayPosition, rayDirection);
            return ray3D;
        }

		/**
		 * 渲染器
		 */
        public get renderer(): RendererBase {
            return this._renderer;
        }

        public set renderer(value: RendererBase) {
            this._renderer.dispose();
            this._renderer = value;
            this._entityCollector = this._renderer.createEntityCollector();
            this._entityCollector.camera = this._camera;
            this._renderer.backgroundColor = this._backgroundColor;
            this._renderer.backgroundAlpha = this._backgroundAlpha;
            this._renderer.viewWidth = this._width;
            this._renderer.viewHeight = this._height;

            this._backBufferInvalid = true;
        }

    }
}
