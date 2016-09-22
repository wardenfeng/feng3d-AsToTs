module feng3d
{
	/**
	 * 深度映射通道
	 * @author feng 2015-5-29
	 */
	export class DepthMapPass extends MaterialPassBase
	{
		/**
		 * 物体投影变换矩阵（模型空间坐标-->GPU空间坐标）
		 */
		private modelViewProjection:Matrix3D = new Matrix3D();

		/**
		 * 通用数据
		 */
		private depthCommonsData0:number[] = [1.0, 255.0, 255.0 * 255.0, 255.0 * 255.0 * 255.0];

		/**
		 * 通用数据
		 */
		private depthCommonsData1:number[] = [1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0];

		private _depthMap:TextureProxyBase;

		/**
		 * 创建深度映射通道
		 */
		constructor()
		{
			super();
		}

		/**
		 * 深度图纹理
		 */
		public get depthMap():TextureProxyBase
		{
			return this._depthMap;
		}

		public set depthMap(value:TextureProxyBase)
		{
			this._depthMap = value;
			this.context3DBufferOwner.markBufferDirty(this._.depthMap_oc);
		}

		/**
		 * @inheritDoc
		 */
		protected initBuffers()
		{
			super.initBuffers();
			this.context3DBufferOwner.mapContext3DBuffer(this._.projection_vc_matrix, this.updateProjectionBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.depthCommonData0_fc_vector, this.updateDepthCommonData0Buffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.depthCommonData1_fc_vector, this.updateDepthCommonData1Buffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.depthMap_oc, this.updateTextureBuffer);
		}

		/**
		 * 更新投影矩阵缓冲
		 * @param projectionBuffer		投影矩阵缓冲
		 */
		protected updateProjectionBuffer(projectionBuffer:VCMatrixBuffer)
		{
			projectionBuffer.update(this.modelViewProjection, true);
		}

		/**
		 * 更新深度顶点常数0 (1.0, 255.0, 65025.0, 16581375.0)
		 * @param fcVectorBuffer
		 */
		protected updateDepthCommonData0Buffer(fcVectorBuffer:FCVectorBuffer)
		{
			fcVectorBuffer.update(this.depthCommonsData0);
		}

		/**
		 * 更新深度顶点常数1 (1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0)
		 * @param fcVectorBuffer
		 */
		protected updateDepthCommonData1Buffer(fcVectorBuffer:FCVectorBuffer)
		{
			fcVectorBuffer.update(this.depthCommonsData1);
		}

		/**
		 * 更新深度图纹理
		 * @param textureBuffer
		 */
		private updateTextureBuffer(textureBuffer:OCBuffer)
		{
			textureBuffer.update(this._depthMap);
		}

		/**
		 * @inheritDoc
		 */
		public activate(camera:Camera3D, target:TextureProxyBase = null)
		{
			//初始化渲染参数
			this.shaderParams.initParams();

			super.activate(camera, target);

			this._depthMap = target;
		}

		/**
		 * @inheritDoc
		 */
		public render(renderable:IRenderable, stage3DProxy:Stage3DProxy, camera:Camera3D, renderIndex:number)
		{
			//场景变换矩阵（物体坐标-->世界坐标）
			var sceneTransform:Matrix3D = renderable.sourceEntity.getRenderSceneTransform(camera);
			//投影矩阵（世界坐标-->投影坐标）
			var projectionmatrix:Matrix3D = camera.viewProjection;

			//物体投影变换矩阵
			this.modelViewProjection.identity();
			this.modelViewProjection.append(sceneTransform);
			this.modelViewProjection.append(projectionmatrix);

			super.render(renderable, stage3DProxy, camera, renderIndex);
		}

		/**
		 * @inheritDoc
		 */
		public updateProgramBuffer(programBuffer:ProgramBuffer)
		{
			var result:FagalShaderResult = FagalRE.runShader(V_Main_DepthMap, F_Main_DepthMap);

			//上传程序
			programBuffer.update(result.vertexCode, result.fragmentCode);
		}
	}
}
