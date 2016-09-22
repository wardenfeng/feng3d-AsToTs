module feng3d
{	

	/**
	 * 纹理通道基类
	 * <p>该类实现了生成与管理渲染程序功能</p>
	 * @author feng 2014-4-15
	 */
	export class MaterialPassBase extends Component
	{
		public context3DBufferOwner:Context3DBufferOwner;

		protected _material:MaterialBase;

		protected _animationSet:IAnimationSet;

		protected _methodSetup:ShaderMethodSetup;

		protected _blendFactorSource:string = Context3DBlendFactor.ONE;
		protected _blendFactorDest:string = Context3DBlendFactor.ZERO;

		protected _depthCompareMode:string = Context3DCompareMode.LESS_EQUAL;
		protected _enableBlending:boolean;

		private _bothSides:boolean;

		protected _lightPicker:LightPickerBase;

		protected _defaultCulling:string = Context3DTriangleFace.BACK;

		protected _writeDepth:boolean = true;

		protected _smooth:boolean = true;
		protected _repeat:boolean = false;
		protected _mipmap:boolean = true;

		protected _numDirectionalLights:number;

		protected _numPointLights:number;

		protected _alphaPremultiplied:boolean;

		private _shaderParams:ShaderParams;

		/**
		 * 创建一个纹理通道基类
		 */
		constructor()
		{
            super();

			this.context3DBufferOwner = new Context3DBufferOwner();
			this.initBuffers();
		}

		/**
		 * Fagal编号中心
		 */
		public get _():any
		{
			return FagalIdCenter.instance;
		}

		/**
		 * The material to which this pass belongs.
		 */
		public get material():MaterialBase
		{
			return this._material;
		}

		public set material(value:MaterialBase)
		{
			this._material = value;
		}

		/**
		 * 渲染参数
		 */
		public get shaderParams():ShaderParams
		{
			return this._shaderParams =this._shaderParams || new ShaderParams();
		}

		/**
		 * 是否平滑
		 */
		public get smooth():boolean
		{
			return this._smooth;
		}

		public set smooth(value:boolean)
		{
			if (this._smooth == value)
				return;
			this._smooth = value;
			this.invalidateShaderProgram();
		}

		/**
		 * 是否重复平铺
		 */
		public get repeat():boolean
		{
			return this._repeat;
		}

		public set repeat(value:boolean)
		{
			if (this._repeat == value)
				return;
			this._repeat = value;
			this.invalidateShaderProgram();
		}

		/**
		 * 贴图是否使用分级细化
		 */
		public get mipmap():boolean
		{
			return this._mipmap;
		}

		public set mipmap(value:boolean)
		{
			if (this._mipmap == value)
				return;
			this._mipmap = value;
			this.invalidateShaderProgram();
		}

		/**
		 * 是否开启混合模式
		 */
		public get enableBlending():boolean
		{
			return this._enableBlending;
		}

		public set enableBlending(value:boolean)
		{
			this._enableBlending = value;
			this.context3DBufferOwner.markBufferDirty(this._.blendFactors);
			this.context3DBufferOwner.markBufferDirty(this._.depthTest);
		}

		/**
		 * 初始化Context3d缓存
		 */
		protected initBuffers()
		{
			this.context3DBufferOwner.mapContext3DBuffer(this._.culling, this.updateCullingBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.blendFactors, this.updateBlendFactorsBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.depthTest, this.updateDepthTestBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.program, this.updateProgramBuffer);
		}

		/**
		 * 动画数据集合
		 */
		public get animationSet():IAnimationSet
		{
			return this._animationSet;
		}

		public set animationSet(value:IAnimationSet)
		{
			if (this._animationSet == value)
				return;

			this._animationSet = value;

			this.invalidateShaderProgram();
		}

		/**
		 * 激活渲染通道
		 * @param shaderParams		渲染参数
		 * @param stage3DProxy		3D舞台代理
		 * @param camera			摄像机
		 */
		public activate(camera:Camera3D, target:TextureProxyBase = null)
		{
			this.shaderParams.useMipmapping = this._mipmap;
			this.shaderParams.useSmoothTextures = this._smooth;
			this.shaderParams.repeatTextures = this._repeat;

			this.shaderParams.alphaPremultiplied = this._alphaPremultiplied && this._enableBlending;

			if (this._animationSet)
				this._animationSet.activate(this.shaderParams, this);
		}

		/**
		 * 清除通道渲染数据
		 * @param stage3DProxy		3D舞台代理
		 */
		public deactivate()
		{
		}

		/**
		 * 更新动画状态
		 * @param renderable			渲染对象
		 * @param stage3DProxy			3D舞台代理
		 * @param camera				摄像机
		 */
		public updateAnimationState(renderable:IRenderable, camera:Camera3D)
		{
			renderable.animator.setRenderState(renderable, camera);
		}

		/**
		 * 渲染
		 * @param renderable			渲染对象
		 * @param stage3DProxy			3D舞台代理
		 * @param camera				摄像机
		 * @param renderIndex			渲染编号
		 */
		public render(renderable:IRenderable, stage3DProxy:Stage3DProxy, camera:Camera3D, renderIndex:number)
		{
			this.updateConstantData(renderable, camera);

			var context3dCache:Context3DCache = renderable.context3dCache;

			context3dCache.addChildBufferOwner(this.context3DBufferOwner);

			//设置渲染参数
			context3dCache.shaderParams = this.shaderParams;

			if (renderable.animator)
				this.updateAnimationState(renderable, camera);

			//绘制图形
			context3dCache.render(stage3DProxy.context3D, renderIndex);

			context3dCache.removeChildBufferOwner(this.context3DBufferOwner);
		}

		/**
		 * 更新常量数据
		 * @param renderable			渲染对象
		 * @param camera				摄像机
		 */
		protected updateConstantData(renderable:IRenderable, camera:Camera3D)
		{

		}

		/**
		 * 标记渲染程序失效
		 */
		public invalidateShaderProgram()
		{
			this.context3DBufferOwner.markBufferDirty(this._.program);
		}

		/**
		 * 更新深度测试缓冲
		 * @param depthTestBuffer			深度测试缓冲
		 */
		protected updateDepthTestBuffer(depthTestBuffer:DepthTestBuffer)
		{
			depthTestBuffer.update(this._writeDepth && !this.enableBlending, this._depthCompareMode);
		}

		/**
		 * 更新混合因子缓冲
		 * @param blendFactorsBuffer		混合因子缓冲
		 */
		protected updateBlendFactorsBuffer(blendFactorsBuffer:BlendFactorsBuffer)
		{
			blendFactorsBuffer.update(this._blendFactorSource, this._blendFactorDest);
		}

		/**
		 * 更新剔除模式缓冲
		 * @param cullingBuffer		剔除模式缓冲
		 */
		protected updateCullingBuffer(cullingBuffer:CullingBuffer)
		{
			cullingBuffer.update(this._bothSides ? Context3DTriangleFace.NONE : this._defaultCulling);
		}

		/**
		 * 更新（编译）渲染程序
		 */
		public updateProgramBuffer(programBuffer:ProgramBuffer)
		{
			var result:FagalShaderResult = FagalRE.runShader(V_Main, F_Main);

			//上传程序
			programBuffer.update(result.vertexCode, result.fragmentCode);
		}

		/**
		 * 灯光采集器
		 */
		public get lightPicker():LightPickerBase
		{
			return this._lightPicker;
		}

		public set lightPicker(value:LightPickerBase)
		{
			if (this._lightPicker)
				this._lightPicker.removeEventListener(Event.CHANGE, this.onLightsChange);
			this._lightPicker = value;
			if (this._lightPicker)
				this._lightPicker.addEventListener(Event.CHANGE, this.onLightsChange);
			this.updateLights();
		}

		/**
		 * 灯光发生变化
		 */
		private onLightsChange(event:Event)
		{
			this.updateLights();
		}

		/**
		 * 更新灯光渲染
		 */
		protected updateLights()
		{
			if (this._lightPicker)
			{
				this._numPointLights = this._lightPicker.numPointLights;
				this._numDirectionalLights = this._lightPicker.numDirectionalLights;
			}
			this.invalidateShaderProgram();
		}

		/**
		 * 设置混合模式
		 * @param value		混合模式
		 */
		public setBlendMode(value:string)
		{
			switch (value)
			{
				case BlendMode.NORMAL:
					this._blendFactorSource = Context3DBlendFactor.ONE;
					this._blendFactorDest = Context3DBlendFactor.ZERO;
					this.enableBlending = false;
					break;
				case BlendMode.LAYER:
					this._blendFactorSource = Context3DBlendFactor.SOURCE_ALPHA;
					this._blendFactorDest = Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA;
					this.enableBlending = true;
					break;
				case BlendMode.MULTIPLY:
					this._blendFactorSource = Context3DBlendFactor.ZERO;
					this._blendFactorDest = Context3DBlendFactor.SOURCE_COLOR;
					this.enableBlending = true;
					break;
				case BlendMode.ADD:
					this._blendFactorSource = Context3DBlendFactor.SOURCE_ALPHA;
					this._blendFactorDest = Context3DBlendFactor.ONE;
					this.enableBlending = true;
					break;
				case BlendMode.ALPHA:
					this._blendFactorSource = Context3DBlendFactor.ZERO;
					this._blendFactorDest = Context3DBlendFactor.SOURCE_ALPHA;
					this.enableBlending = true;
					break;
				case BlendMode.SCREEN:
					this._blendFactorSource = Context3DBlendFactor.ONE;
					this._blendFactorDest = Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR;
					this.enableBlending = true;
					break;
				default:
					throw new ArgumentError("Unsupported blend mode!");
			}
		}

		/**
		 * 是否写入到深度缓存
		 */
		public get writeDepth():boolean
		{
			return this._writeDepth;
		}

		public set writeDepth(value:boolean)
		{
			this._writeDepth = value;
			this.context3DBufferOwner.markBufferDirty(this._.depthTest);
		}

		/**
		 * 深度比较模式
		 */
		public get depthCompareMode():string
		{
			return this._depthCompareMode;
		}

		public set depthCompareMode(value:string)
		{
			this._depthCompareMode = value;
			this.context3DBufferOwner.markBufferDirty(this._.depthTest);
		}

		/**
		 * 是否双面渲染
		 */
		public get bothSides():boolean
		{
			return this._bothSides;
		}

		public set bothSides(value:boolean)
		{
			this._bothSides = value;
			this.context3DBufferOwner.markBufferDirty(this._.culling);
		}

		/**
		 * 渲染中是否使用了灯光
		 */
		protected usesLights():boolean
		{
			return (this._numPointLights > 0 || this._numDirectionalLights > 0);
		}

		/**
		 * Indicates whether visible textures (or other pixels) used by this material have
		 * already been premultiplied. Toggle this if you are seeing black halos around your
		 * blended alpha edges.
		 */
		public get alphaPremultiplied():boolean
		{
			return this._alphaPremultiplied;
		}

		public set alphaPremultiplied(value:boolean)
		{
			this._alphaPremultiplied = value;
			this.invalidateShaderProgram();
		}

		/**
		 * Cleans up any resources used by the current object.
		 * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
		 */
		public dispose()
		{
			if (this._lightPicker)
				this._lightPicker.removeEventListener(Event.CHANGE, this.onLightsChange);
		}
	}
}
