module feng3d
{
	

	
	

	

	/**
	 * 资源依赖(包含需要加载与处理的资源)
	 * @author feng 2014-5-19
	 */
	export class ResourceDependency
	{
		private _id:string;
		private _req:URLRequest;
		private _assets:IAsset[];
		private _parentParser:ParserBase;
		private _data;
		private _retrieveAsRawData:boolean;
		private _suppressAssetEvents:boolean;
		private _dependencies:ResourceDependency[];

		public success:boolean;

		/**
		 * 创建资源依赖
		 * @param id 编号
		 * @param req url请求
		 * @param data 数据
		 * @param parentParser 被依赖的解析者
		 * @param retrieveAsRawData
		 * @param suppressAssetEvents
		 */
		constructor(id:string, req:URLRequest, data, parentParser:ParserBase, retrieveAsRawData:boolean = false, suppressAssetEvents:boolean = false)
		{
			this._id = id;
			this._req = req;
			this._parentParser = parentParser;
			this._data = data;
			this._retrieveAsRawData = retrieveAsRawData;
			this._suppressAssetEvents = suppressAssetEvents;

			this._assets = [];
			this._dependencies = [];
		}

		public get id():string
		{
			return this._id;
		}

		public get assets():IAsset[]
		{
			return this._assets;
		}

		public get dependencies():ResourceDependency[]
		{
			return this._dependencies;
		}

		public get request():URLRequest
		{
			return this._req;
		}

		public get retrieveAsRawData():boolean
		{
			return this._retrieveAsRawData;
		}

		public get suppresAssetEvents():boolean
		{
			return this._suppressAssetEvents;
		}

		public get data()
		{
			return this._data;
		}

		public setData(data)
		{
			this._data = data;
		}

		/**
		 * 被依赖的解析者
		 */
		public get parentParser():ParserBase
		{
			return this._parentParser;
		}

		/**
		 * 解决依赖
		 */
		public resolve()
		{
			if (this._parentParser)
				this._parentParser.resolveDependency(this);
		}

		/**
		 * 解决失败
		 */
		public resolveFailure()
		{
			if (this._parentParser)
				this._parentParser.resolveDependencyFailure(this);
		}

		/**
		 * 解决资源的名称
		 */
		public resolveName(asset:IAsset):string
		{
			if (this._parentParser)
				return this._parentParser.resolveDependencyName(this, asset);
			return asset.namedAsset.name;
		}

	}
}
