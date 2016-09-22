module feng3d {

    //[Event(name = "enterFrame", type = "flash.events.Event")]
    //[Event(name = "exitFrame", type = "flash.events.Event")]

	/**
	 * 3D舞台代理
	 */
    export class Stage3DProxy extends EventDispatcher {
        private _frameEventDriver: Shape = new Shape();

        private _context3D: Context3D;
        private _stage3DIndex: number = -1;

        private _usesSoftwareRendering: boolean;
        private _profile: string;
        private _stage3D: Stage3D;
        private _stage3DManager: Stage3DManager;
        private _backBufferWidth: number;
        private _backBufferHeight: number;
        private _antiAlias: number;
        private _backBufferEnableDepthAndStencil: boolean = true;
        private _contextRequested: boolean;
        private _scissorRect: Rectangle;
        private _backBufferDirty: boolean;
        private _viewPort: Rectangle;
        private _enterFrame: Event;
        private _exitFrame: Event;
        private _viewportUpdated: Stage3DEvent;
        private _viewportDirty: boolean;
        private _bufferClear: boolean;
        private _color: number;

		/**
		 * 创建一个3D舞台代理
		 * @param stage3DIndex		被代理3D舞台编号
		 * @param stage3D			被代理的3D舞台
		 * @param stage3DManager	3D舞台管理类
		 * @param forceSoftware		是否强制软件渲染
		 * @param profile
		 */
        constructor(stage3DIndex: number, stage3D: Stage3D, stage3DManager: Stage3DManager, forceSoftware: boolean = false, profile: string = "baseline") {
            super();
            this._stage3DIndex = stage3DIndex;
            this._stage3D = stage3D;
            this._stage3D.x = 0;
            this._stage3D.y = 0;
            this._stage3D.visible = true;
            this._stage3DManager = stage3DManager;
            this._viewPort = new Rectangle();

            this._stage3D.addEventListener(Event.CONTEXT3D_CREATE, this.onContext3DUpdate, 1000, false);
            this.requestContext(forceSoftware, profile);
        }

		/**
		 * The background color of the Stage3D.
		 */
        public get color(): number {
            return this._color;
        }

        public set color(color: number) {
            this._color = color;
        }

		/**
		 * 通知视窗发生变化
		 */
        private notifyViewportUpdated() {
            if (this._viewportDirty)
                return;

            this._viewportDirty = true;

            if (!this.hasEventListener(Stage3DEvent.VIEWPORT_UPDATED))
                return;

            this._viewportUpdated = new Stage3DEvent(Stage3DEvent.VIEWPORT_UPDATED);

            this.dispatchEvent(this._viewportUpdated);
        }

		/**
		 * 通知进入帧事件
		 */
        private notifyEnterFrame() {
            if (!this.hasEventListener(Event.ENTER_FRAME))
                return;

            if (!this._enterFrame)
                this._enterFrame = new Event(Event.ENTER_FRAME);

            this.dispatchEvent(this._enterFrame);
        }

		/**
		 * 通知退出帧事件
		 */
        private notifyExitFrame() {
            if (!this.hasEventListener(Event.EXIT_FRAME))
                return;

            if (!this._exitFrame)
                this._exitFrame = new Event(Event.EXIT_FRAME);

            this.dispatchEvent(this._exitFrame);
        }

		/**
		 * 释放3D舞台代理，同时释放3D舞台中的3D环境
		 */
        public dispose() {
            this._stage3DManager.removeStage3DProxy(this);
            this._stage3D.removeEventListener(Event.CONTEXT3D_CREATE, this.onContext3DUpdate);
            this.freeContext3D();
            this._stage3D = null;
            this._stage3DManager = null;
            this._stage3DIndex = -1;
        }

		/**
		 * 设置渲染缓冲区的视口尺寸和其他属性
		 * @param backBufferWidth		缓冲区的宽度，以像素为单位。
		 * @param backBufferHeight		缓冲区的高度，以像素为单位。
		 * @param antiAlias				一个整数值，指定所请求的消除锯齿品质。该值与消除锯齿时使用的子实例的数量相关联。使用更多子实例要求执行更多的计算，尽管相对性能影响取决于特定的渲染硬件。消除锯齿的类型和是否执行消除锯齿操作取决于设备和渲染模式。软件渲染上下文完全不支持消除锯齿。
		 */
        public configureBackBuffer(backBufferWidth: number, backBufferHeight: number, antiAlias: number) {
            if (backBufferWidth < 50)
                backBufferWidth = 50;
            if (backBufferHeight < 50)
                backBufferHeight = 50;
            var oldWidth: number = this._backBufferWidth;
            var oldHeight: number = this._backBufferHeight;

            this._backBufferWidth = this._viewPort.width = backBufferWidth;
            this._backBufferHeight = this._viewPort.height = backBufferHeight;

            if (oldWidth != this._backBufferWidth || oldHeight != this._backBufferHeight)
                this.notifyViewportUpdated();

            this._antiAlias = antiAlias;

            if (this._context3D)
                this._context3D.configureBackBuffer(backBufferWidth, backBufferHeight, antiAlias, this._backBufferEnableDepthAndStencil);
        }

		/**
		 * 清除与重置缓冲区
		 */
        public clear() {
            if (!this._context3D)
                return;

            if (this._backBufferDirty) {
                this.configureBackBuffer(this._backBufferWidth, this._backBufferHeight, this._antiAlias);
                this._backBufferDirty = false;
            }

            this._context3D.clear( //
                ((this._color >> 16) & 0xff) / 255.0, //
                ((this._color >> 8) & 0xff) / 255.0, //
                (this._color & 0xff) / 255.0, //
                ((this._color >> 24) & 0xff) / 255.0);

            this._bufferClear = true;
        }

		/**
		 * 显示渲染缓冲
		 */
        public present() {
            if (!this._context3D)
                return;

            this._context3D.present();
        }

		/**
		 * 添加事件侦听
		 * @param type							事件的类型
		 * @param listener						处理事件的侦听器函数
		 * @param useCapture					确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段
		 * @param priority						事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
		 * @param useWeakReference				确定对侦听器的引用是强引用，还是弱引用。强引用（默认值）可防止您的侦听器被当作垃圾回收。弱引用则没有此作用。
		 */
        public addEventListener(type: string, listener: Function, priority: number = 0, useWeakReference: boolean = false) {
            super.addEventListener(type, listener, priority, useWeakReference);

            if ((type == Event.ENTER_FRAME || type == Event.EXIT_FRAME) && !this._frameEventDriver.hasEventListener(Event.ENTER_FRAME))
                this._frameEventDriver.addEventListener(Event.ENTER_FRAME, this.onEnterFrame, priority, useWeakReference);
        }

		/**
		 * 移除事件侦听
		 * @param type				事件的类型
		 * @param listener			要删除的侦听器函数
		 * @param useCapture		指出是为捕获阶段还是为目标和冒泡阶段注册了侦听器。如果为捕获阶段以及目标和冒泡阶段注册了侦听器，则需要对 removeEventListener() 进行两次调用才能将这两个侦听器删除，一次调用将 useCapture() 设置为 true，另一次调用将 useCapture() 设置为 false。
		 */
        public removeEventListener(type: string, listener: Function) {
            super.removeEventListener(type, listener);

            // Remove the main rendering listener if no EnterFrame listeners remain
            if (!this.hasEventListener(Event.ENTER_FRAME) && !this.hasEventListener(Event.EXIT_FRAME) && this._frameEventDriver.hasEventListener(Event.ENTER_FRAME))
                this._frameEventDriver.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame);
        }

		/**
		 * 裁剪矩形
		 */
        public get scissorRect(): Rectangle {
            return this._scissorRect;
        }

        public set scissorRect(value: Rectangle) {
            this._scissorRect = value;
            this._context3D.setScissorRectangle(this._scissorRect);
        }

		/**
		 * 3D舞台编号
		 */
        public get stage3DIndex(): number {
            return this._stage3DIndex;
        }

		/**
		 * 3D舞台
		 */
        public get stage3D(): Stage3D {
            return this._stage3D;
        }

		/**
		 * 3D环境
		 */
        public get context3D(): Context3D {
            return this._context3D;
        }

		/**
		 * 驱动信息
		 */
        public get driverInfo(): string {
            return this._context3D ? this._context3D.driverInfo : null;
        }

		/**
		 * 是否在软件模式渲染
		 */
        public get usesSoftwareRendering(): boolean {
            return this._usesSoftwareRendering;
        }

		/**
		 * 3D舞台X坐标
		 */
        public get x(): number {
            return this._stage3D.x;
        }

        public set x(value: number) {
            if (this._viewPort.x == value)
                return;

            this._stage3D.x = this._viewPort.x = value;

            this.notifyViewportUpdated();
        }

		/**
		 * 3D舞台Y坐标
		 */
        public get y(): number {
            return this._stage3D.y;
        }

        public set y(value: number) {
            if (this._viewPort.y == value)
                return;

            this._stage3D.y = this._viewPort.y = value;

            this.notifyViewportUpdated();
        }

		/**
		 * 3D舞台宽度
		 */
        public get width(): number {
            return this._backBufferWidth;
        }

        public set width(width: number) {
            if (this._viewPort.width == width)
                return;

            if (width < 50)
                width = 50;
            this._backBufferWidth = this._viewPort.width = width;
            this._backBufferDirty = true;

            this.notifyViewportUpdated();
        }

		/**
		 * 3D舞台高度
		 */
        public get height(): number {
            return this._backBufferHeight;
        }

        public set height(height: number) {
            if (this._viewPort.height == height)
                return;

            if (height < 50)
                height = 50;
            this._backBufferHeight = this._viewPort.height = height;
            this._backBufferDirty = true;

            this.notifyViewportUpdated();
        }

		/**
		 * 抗锯齿值
		 */
        public get antiAlias(): number {
            return this._antiAlias;
        }

        public set antiAlias(antiAlias: number) {
            this._antiAlias = antiAlias;
            this._backBufferDirty = true;
        }

		/**
		 * 视窗矩形
		 */
        public get viewPort(): Rectangle {
            this._viewportDirty = false;

            return this._viewPort;
        }

		/**
		 * 是否可见
		 */
        public get visible(): boolean {
            return this._stage3D.visible;
        }

        public set visible(value: boolean) {
            this._stage3D.visible = value;
        }

		/**
		 * 缓冲区清理状态
		 */
        public get bufferClear(): boolean {
            return this._bufferClear;
        }

        public set bufferClear(newBufferClear: boolean) {
            this._bufferClear = newBufferClear;
        }

		/**
		 * 释放3D环境
		 */
        private freeContext3D() {
            if (this._context3D) {
                this._context3D.dispose();
                this.dispatchEvent(new Stage3DEvent(Stage3DEvent.CONTEXT3D_DISPOSED));
            }
            this._context3D = null;
        }

		/**
		 * 处理3D环境变化事件
		 */
        private onContext3DUpdate(event: Event) {
            if (this._stage3D.context3D) {
                var hadContext: boolean = (this._context3D != null);
                this._context3D = this._stage3D.context3D;
                this._context3D.enableErrorChecking = Debug.agalDebug;

                this._usesSoftwareRendering = (this._context3D.driverInfo.indexOf('Software') == 0);

                // Only configure back buffer if this.width and this.height have been set,
                // which they may not have been if View3D.render() has yet to be
                // invoked for the first time.
                if (this._backBufferWidth && this._backBufferHeight)
                    this._context3D.configureBackBuffer(this._backBufferWidth, this._backBufferHeight, this._antiAlias, this._backBufferEnableDepthAndStencil);

                // Dispatch the appropriate event depending on whether context was
                // created for the first time or recreated after a device loss.
                this.dispatchEvent(new Stage3DEvent(hadContext ? Stage3DEvent.CONTEXT3D_RECREATED : Stage3DEvent.CONTEXT3D_CREATED));

            }
            else
                throw new Error("Rendering context lost!");
        }

		/**
		 * 请求3D环境
		 */
        private requestContext(forceSoftware: boolean = false, profile: string = Context3DProfile.STANDARD) {
            // If forcing software, we can be certain that the
            // returned Context3D will be running software mode.
            // If not, we can't be sure and should stick to the
            // old value (will likely be same if re-requesting.)
            this._usesSoftwareRendering = this._usesSoftwareRendering || forceSoftware;
            this._profile = profile;

            // ugly stuff for backward compatibility
            var renderMode: string = forceSoftware ? Context3DRenderMode.SOFTWARE : Context3DRenderMode.AUTO;
            if (profile == "baseline")
                this._stage3D.requestContext3D(renderMode);
            else {
                try {
                    this._stage3D.requestContext3D(renderMode, profile);
                }
                catch (error) {
                    throw "An error occurred creating a context using the given profile. Profiles are not supported for the SDK this was compiled with.";
                }
            }

            this._contextRequested = true;
        }

		/**
		 * 处理进入帧事件
		 */
        private onEnterFrame(event: Event) {
            if (!this._context3D)
                return;

            this.clear();

            this.notifyEnterFrame();

            this.present();

            this.notifyExitFrame();
        }

		/**
		 *	判断3D环境是否可用
		 */
        public recoverFromDisposal(): boolean {
            if (!this._context3D)
                return false;
            if (this._context3D.driverInfo == "Disposed") {
                this._context3D = null;
                this.dispatchEvent(new Stage3DEvent(Stage3DEvent.CONTEXT3D_DISPOSED));
                return false;
            }
            return true;
        }
    }
}
