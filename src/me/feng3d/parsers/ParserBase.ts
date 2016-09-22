module feng3d
{

	/**
	 * 解析基类
	 * @author feng 2014-5-16
	 */
	export abstract class ParserBase extends EventDispatcher
	{
		protected static PARSING_DONE:boolean = true;
		protected static MORE_TO_PARSE:boolean = false;

		public _fileName:string;

		protected _dataFormat:string;
		protected _data;
		protected _frameLimit:number;
		protected _lastFrameTime:number;

		/** 依赖资源列表 */
		private _dependencies:ResourceDependency[];
		private _parsingPaused:boolean;
		private _parsingComplete:boolean;
		/** 是否解析失败 */
		private _parsingFailure:boolean;
		private _timer:Timer;
		/**  */
		private _materialMode:number;

		constructor(format:string)
		{
            super();
			this._materialMode = 0;
			this._dataFormat = format;
			this._dependencies = [];
		}

		protected getTextData():string
		{
			return ParserUtil.toString(this._data);
		}

		protected getByteData():ByteArray
		{
			return this._data;
		}

		public set materialMode(newMaterialMode:number)
		{
			this._materialMode = newMaterialMode;
		}

		public get materialMode():number
		{
			return this._materialMode;
		}

		/** 数据格式 */
		public get dataFormat():string
		{
			return this._dataFormat;
		}

		/**
		 * 完成资源分析（派发资源事件）
		 * @param asset 完成的资源
		 * @param name 资源名称
		 */
		protected finalizeAsset(asset:IAsset, name:string = null)
		{
			var type_event:string;
			var type_name:string;

			if (name != null)
				asset.namedAsset.name = name;

			switch (asset.namedAsset.assetType)
			{
				case AssetType.LIGHT_PICKER:
					type_name = 'lightPicker';
					type_event = AssetEvent.LIGHTPICKER_COMPLETE;
					break;
				case AssetType.LIGHT:
					type_name = 'light';
					type_event = AssetEvent.LIGHT_COMPLETE;
					break;
				case AssetType.ANIMATOR:
					type_name = 'animator';
					type_event = AssetEvent.ANIMATOR_COMPLETE;
					break;
				case AssetType.ANIMATION_SET:
					type_name = 'animationSet';
					type_event = AssetEvent.ANIMATION_SET_COMPLETE;
					break;
				case AssetType.ANIMATION_STATE:
					type_name = 'animationState';
					type_event = AssetEvent.ANIMATION_STATE_COMPLETE;
					break;
				case AssetType.ANIMATION_NODE:
					type_name = 'animationNode';
					type_event = AssetEvent.ANIMATION_NODE_COMPLETE;
					break;
				case AssetType.STATE_TRANSITION:
					type_name = 'stateTransition';
					type_event = AssetEvent.STATE_TRANSITION_COMPLETE;
					break;
				case AssetType.TEXTURE:
					type_name = 'texture';
					type_event = AssetEvent.TEXTURE_COMPLETE;
					break;
				case AssetType.TEXTURE_PROJECTOR:
					type_name = 'textureProjector';
					type_event = AssetEvent.TEXTURE_PROJECTOR_COMPLETE;
					break;
				case AssetType.CONTAINER:
					type_name = 'container';
					type_event = AssetEvent.CONTAINER_COMPLETE;
					break;
				case AssetType.GEOMETRY:
					type_name = 'geometry';
					type_event = AssetEvent.GEOMETRY_COMPLETE;
					break;
				case AssetType.MATERIAL:
					type_name = 'material';
					type_event = AssetEvent.MATERIAL_COMPLETE;
					break;
				case AssetType.MESH:
					type_name = 'mesh';
					type_event = AssetEvent.MESH_COMPLETE;
					break;
				case AssetType.SKELETON:
					type_name = 'skeleton';
					type_event = AssetEvent.SKELETON_COMPLETE;
					break;
				case AssetType.SKELETON_POSE:
					type_name = 'skelpose';
					type_event = AssetEvent.SKELETON_POSE_COMPLETE;
					break;
				case AssetType.ENTITY:
					type_name = 'entity';
					type_event = AssetEvent.ENTITY_COMPLETE;
					break;
				case AssetType.SKYBOX:
					type_name = 'skybox';
					type_event = AssetEvent.SKYBOX_COMPLETE;
					break;
				case AssetType.CAMERA:
					type_name = 'camera';
					type_event = AssetEvent.CAMERA_COMPLETE;
					break;
				case AssetType.SEGMENT_SET:
					type_name = 'segmentSet';
					type_event = AssetEvent.SEGMENT_SET_COMPLETE;
					break;
				case AssetType.EFFECTS_METHOD:
					type_name = 'effectsMethod';
					type_event = AssetEvent.EFFECTMETHOD_COMPLETE;
					break;
				case AssetType.SHADOW_MAP_METHOD:
					type_name = 'effectsMethod';
					type_event = AssetEvent.SHADOWMAPMETHOD_COMPLETE;
					break;
				default:
					throw new Error('Unhandled asset type ' + asset.namedAsset.assetType + '. Report as bug!');
			}

			//默认资源名为类型名
			if (!asset.namedAsset.name)
				asset.namedAsset.name = type_name;

			this.dispatchEvent(new AssetEvent(AssetEvent.ASSET_COMPLETE, asset));
			this.dispatchEvent(new AssetEvent(type_event, asset));
		}

		/**
		 * 解决依赖
		 * @param resourceDependency 依赖资源
		 */
		public abstract resolveDependency(resourceDependency:ResourceDependency);

		/**
		 * 解决依赖失败
		 * @param resourceDependency 依赖资源
		 */
		public abstract resolveDependencyFailure(resourceDependency:ResourceDependency);

		public resolveDependencyName(resourceDependency:ResourceDependency, asset:IAsset):string
		{
			return asset.namedAsset.name;
		}

		/**
		 * 是否在解析中
		 */
		protected abstract proceedParsing():boolean;

		/**
		 * 是否暂停解析
		 */
		public get parsingPaused():boolean
		{
			return this._parsingPaused;
		}

		/**
		 * 是否解析完成
		 */
		public get parsingComplete():boolean
		{
			return this._parsingComplete;
		}

		/**
		 * 异步解析数据
		 * @param data 数据
		 * @param frameLimit 帧时间限制
		 */
		public parseAsync(data, frameLimit:number = 30)
		{
			this._data = data;
			this.startParsing(frameLimit);
		}

		/**
		 * A list of dependencies that need to be loaded and resolved for the object being parsed.
		 */
		public get dependencies():ResourceDependency[]
		{
			return this._dependencies;
		}

		/**
		 * 是否还有时间
		 */
		protected hasTime():boolean
		{
			return ((getTimer() - this._lastFrameTime) < this._frameLimit);
		}

		/**
		 * 开始解析数据
		 * @param frameLimit 帧时间限制
		 */
		protected startParsing(frameLimit:number)
		{
			this._frameLimit = frameLimit;
			this._timer = new Timer(this._frameLimit, 0);
			this._timer.addEventListener(TimerEvent.TIMER, this.onInterval);
			this._timer.start();
		}

		/**
		 * 触发解析
		 * @param event
		 */
		protected onInterval(event:TimerEvent = null)
		{
			this._lastFrameTime = getTimer();
			if (this.proceedParsing() && !this._parsingFailure)
				this.finishParsing();
		}

		/**
		 * 暂停解析，去准备依赖项
		 */
		protected pauseAndRetrieveDependencies()
		{
//			if (this._timer)
//				this._timer.stop();
//			this._parsingPaused = true;
//			this.dispatchEvent(new ParserEvent(ParserEvent.READY_FOR_DEPENDENCIES));
		}

		/**
		 * 继续解析，准备好依赖项后
		 */
		public resumeParsingAfterDependencies()
		{
			this._parsingPaused = false;
			if (this._timer)
				this._timer.start();
		}

		/**
		 * 完成解析
		 */
		protected finishParsing()
		{
			if (this._timer)
			{
				this._timer.removeEventListener(TimerEvent.TIMER, this.onInterval);
				this._timer.stop();
			}
			this._timer = null;
			this._parsingComplete = true;
			this.dispatchEvent(new ParserEvent(ParserEvent.PARSE_COMPLETE));
		}

		/**
		 * 添加依赖项
		 * @param id 编号
		 * @param req url请求
		 * @param retrieveAsRawData
		 * @param data
		 * @param suppressErrorEvents
		 */
		protected addDependency(id:string, req:URLRequest, retrieveAsRawData:boolean = false, data = null, suppressErrorEvents:boolean = false)
		{
			this._dependencies.push(new ResourceDependency(id, req, data, this, retrieveAsRawData, suppressErrorEvents));
		}

	}
}
