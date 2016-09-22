module feng3d
{
	
	
	
	
	
	
	
	
	

	

	/**
	 * 渲染函数基类
	 * @author feng 2014-7-1
	 */
	export class ShadingMethodBase extends Component
	{
		public context3DBufferOwner:Context3DBufferOwner;

		protected _passes:MaterialPassBase[];

		/**
		 * 渲染函数类型
		 * <p>当typeUnique为true时，用于唯一性判断</p>
		 * @see #typeUnique
		 */
		public methodType:string;

		/**
		 * 是否唯一
		 * <p>值为true时一个pass只能包含一个该类型函数，否则允许多个</p>
		 * @see #methodType
		 */
		public typeUnique:boolean = false;

		/**
		 * 创建渲染寄函数基类
		 */
		constructor()
		{
			super();

			this.context3DBufferOwner = new Context3DBufferOwner();
			this.initBuffers();
		}

		/**
		 * 初始化Context3d缓存
		 */
		protected initBuffers()
		{

		}

		/**
		 * Fagal编号中心
		 */
		public get _():any
		{
			return FagalIdCenter.instance;
		}

		/**
		 * 激活渲染函数
		 * @param shaderParams 		渲染参数
		 */
		public activate(shaderParams:ShaderParams)
		{

		}

		/**
		 * 设置渲染状态
		 * @param renderable 		渲染对象
		 * @param camera 			摄像机
		 */
		public setRenderState(renderable:IRenderable, camera:Camera3D)
		{

		}

		/**
		 * 初始化常量数据
		 */
		public initConstants()
		{

		}

		/**
		 * 清除编译数据
		 */
		public cleanCompilationData()
		{
		}

		/**
		 * 使渲染程序失效
		 */
		protected invalidateShaderProgram()
		{
			this.dispatchEvent(new ShadingMethodEvent(ShadingMethodEvent.SHADER_INVALIDATED));
		}

		/**
		 * 拷贝渲染方法
		 * @param method		被拷贝的方法
		 */
		public copyFrom(method:ShadingMethodBase)
		{
		}

		/**
		 * Any passes required that render to a texture used by this method.
		 */
		public get passes():MaterialPassBase[]
		{
			return this._passes;
		}

		/**
		 * Cleans up any resources used by the current object.
		 */
		public dispose()
		{

		}
	}
}
