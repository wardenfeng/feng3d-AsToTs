module feng3d
{
	
	
	
	
	
	
	
	
	
	

	

	/**
	 * 渲染函数设置
	 * @author feng 2014-7-1
	 */
	export class ShaderMethodSetup extends Component
	{
		public context3DBufferOwner:Context3DBufferOwner;

		private uniqueMethodDic;

		public methods:ShadingMethodBase[];

		/**
		 * 创建一个渲染函数设置
		 */
		constructor()
		{
            super();
			this.context3DBufferOwner = new Context3DBufferOwner();
			this.initBuffers();

			this.uniqueMethodDic = {};
			this.methods = [];

			this.addMethod(new BasicNormalMethod());
			this.addMethod(new BasicAmbientMethod());
			this.addMethod(new BasicDiffuseMethod());
			this.addMethod(new BasicSpecularMethod());
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
		public get _():FagalIdCenter
		{
			return FagalIdCenter.instance;
		}

		/**
		 * The number of "effect" methods added to the material.
		 */
		public get numMethods():number
		{
			return this.methods.length;
		}

		/**
		 * 漫反射函数
		 */
		public get diffuseMethod():BasicDiffuseMethod
		{
			return this.uniqueMethodDic[BasicDiffuseMethod.METHOD_TYPE];
		}

		public set diffuseMethod(value:BasicDiffuseMethod)
		{
			this.addUniqueMethod(value);
		}

		/**
		 * 镜面反射函数
		 */
		public get specularMethod():BasicSpecularMethod
		{
			return this.uniqueMethodDic[BasicSpecularMethod.METHOD_TYPE];
		}

		public set specularMethod(value:BasicSpecularMethod)
		{
			this.addUniqueMethod(value);
		}

		/**
		 * 法线函数
		 */
		public get normalMethod():BasicNormalMethod
		{
			return this.uniqueMethodDic[BasicNormalMethod.METHOD_TYPE];
		}

		public set normalMethod(value:BasicNormalMethod)
		{
			this.addUniqueMethod(value);
		}

		/**
		 * 漫反射函数
		 */
		public get ambientMethod():BasicAmbientMethod
		{
			return this.uniqueMethodDic[BasicAmbientMethod.METHOD_TYPE];
		}

		public set ambientMethod(value:BasicAmbientMethod)
		{
			this.addUniqueMethod(value);
		}

		/**
		 * 阴影映射函数
		 */
		public get shadowMethod():ShadowMapMethodBase
		{
			return this.uniqueMethodDic[ShadowMapMethodBase.METHOD_TYPE];
		}

		public set shadowMethod(value:ShadowMapMethodBase)
		{
			this.addUniqueMethod(value);
		}

		/**
		 * 通知渲染程序失效
		 */
		private invalidateShaderProgram()
		{
			this.dispatchEvent(new ShadingMethodEvent(ShadingMethodEvent.SHADER_INVALIDATED));
		}

		/**
		 * 渲染程序失效事件处理函数
		 */
		private onShaderInvalidated(event:ShadingMethodEvent)
		{
			this.invalidateShaderProgram();
		}

		/**
		 * 添加渲染函数
		 * @param method			渲染函数
		 */
		public addMethod(method:ShadingMethodBase)
		{
			if (method.typeUnique)
			{
				this.addUniqueMethod(method);
			}
			else
			{
				this.$addMethod(method);
			}
		}

		/**
		 * 移除渲染函数
		 * @param method			渲染函数
		 */
		public removeMethod(method:ShadingMethodBase)
		{
			if (method.typeUnique)
			{
				this.removeUniqueMethod(method)
			}
			else
			{
				this.$removeMethod(method);
			}
		}

		/**
		 * 添加唯一渲染函数
		 * @param method			渲染函数
		 */
		private addUniqueMethod(method:ShadingMethodBase)
		{
			var oldMethod:ShadingMethodBase = this.uniqueMethodDic[method.methodType];
			if (oldMethod != null)
			{
				method.copyFrom(oldMethod);
				this.$removeMethod(oldMethod);
			}
			this.$addMethod(method);
			this.uniqueMethodDic[method.methodType] = method;

			this.invalidateShaderProgram();
		}

		/**
		 * 移除唯一渲染函数
		 * @param method			渲染函数
		 */
		private removeUniqueMethod(method:ShadingMethodBase)
		{
			this.$removeMethod(method);
			this.uniqueMethodDic[method.methodType] = null;
		}

		/**
		 * 添加函数
		 * @param method			渲染函数
		 */
		private $addMethod(method:ShadingMethodBase)
		{
			method.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated);
			this.context3DBufferOwner.addChildBufferOwner(method.context3DBufferOwner);
			this.methods.push(method);
			this.invalidateShaderProgram();
		}

		/**
		 * 删除函数
		 * @param method			渲染函数
		 */
		private $removeMethod(method:ShadingMethodBase)
		{
			method.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated);
			this.context3DBufferOwner.removeChildBufferOwner(method.context3DBufferOwner);
			var index:number = this.methods.indexOf(method);
			this.methods.splice(index, 1);
			this.invalidateShaderProgram();
		}

		/**
		 * 设置渲染状态
		 * @param renderable		可渲染对象
		 * @param stage3DProxy		3D舞台代理
		 * @param camera			摄像机
		 */
		public setRenderState(renderable:IRenderable, camera:Camera3D)
		{
			for (var i:number = 0; i < this.methods.length; i++)
			{
				this.methods[i].setRenderState(renderable, camera);
			}
		}

		/**
		 * 激活
		 * @param shaderParams		渲染参数
		 * @param stage3DProxy		3D舞台代理
		 */
		public activate(shaderParams:ShaderParams)
		{
			for (var i:number = 0; i < this.methods.length; i++)
			{
				this.methods[i].activate(shaderParams);
			}
		}

		/**
		 * 初始化常量数据
		 */
		public initConstants()
		{
			for (var i:number = 0; i < this.methods.length; i++)
			{
				this.methods[i].initConstants();
			}
		}
	}
}
