module feng3d
{	

	/**
	 * 天空盒通道
	 * @author feng 2014-7-11
	 */
	export class SkyBoxPass extends MaterialPassBase
	{
		private cameraPos:number[] = [0,0,0,0];
		private scaleSkybox:number[] =[0,0,0,0];
		private modelViewProjection:Matrix3D = new Matrix3D();

		private _cubeTexture:CubeTextureBase;

		/**
		 * 创建一个天空盒通道
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		protected initBuffers()
		{
			super.initBuffers();
			this.context3DBufferOwner.mapContext3DBuffer(this._.skyboxTexture_fs, this.updateTextureBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.projection_vc_matrix, this.updateProjectionBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.camerapos_vc_vector, this.updateCameraPosBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.scaleSkybox_vc_vector, this.updateScaleSkyboxBuffer);
		}

		private updateProjectionBuffer(projectionBuffer:VCMatrixBuffer)
		{
			projectionBuffer.update(this.modelViewProjection, true);
		}

		private updateCameraPosBuffer(cameraPosBuffer:VCVectorBuffer)
		{
			cameraPosBuffer.update(this.cameraPos);
		}

		private updateScaleSkyboxBuffer(scaleSkyboxBuffer:VCVectorBuffer)
		{
			scaleSkyboxBuffer.update(this.scaleSkybox);
		}

		private updateTextureBuffer(textureBuffer:FSBuffer)
		{
			textureBuffer.update(this._cubeTexture);
		}

		/**
		 * @inheritDoc
		 */
		protected updateDepthTestBuffer(depthTestBuffer:DepthTestBuffer)
		{
			super.updateDepthTestBuffer(depthTestBuffer);

			depthTestBuffer.update(false, Context3DCompareMode.LESS);
		}

		/**
		 * 立方体纹理
		 */
		public get cubeTexture():CubeTextureBase
		{
			return this._cubeTexture;
		}

		public set cubeTexture(value:CubeTextureBase)
		{
			this._cubeTexture = value;
			this.context3DBufferOwner.markBufferDirty(this._.skyboxTexture_fs);
		}

		/**
		 * @inheritDoc
		 */
		public updateProgramBuffer(programBuffer:ProgramBuffer)
		{
			var result:FagalShaderResult = FagalRE.runShader(V_SkyBox, F_SkyBox);

			//上传程序
			programBuffer.update(result.vertexCode, result.fragmentCode);
		}

		/**
		 * @inheritDoc
		 */
		protected updateConstantData(renderable:IRenderable, camera:Camera3D)
		{
			super.updateConstantData(renderable, camera);
			this.modelViewProjection.identity();
			this.modelViewProjection.append(renderable.sourceEntity.sceneTransform);
			this.modelViewProjection.append(camera.viewProjection);
		}

		/**
		 * @inheritDoc
		 */
		public activate(camera:Camera3D, target:TextureProxyBase = null)
		{
			super.activate(camera, target);

			var pos:Vector3D = camera.scenePosition;
			this.cameraPos[0] = pos.x;
			this.cameraPos[1] = pos.y;
			this.cameraPos[2] = pos.z;
			this.cameraPos[3] = 0;

			this.scaleSkybox[0] = this.scaleSkybox[1] = this.scaleSkybox[2] = camera.lens.far / Math.sqrt(4);
			this.scaleSkybox[3] = 1;

			//通用渲染参数
			this.shaderParams.addSampleFlags(this._.skyboxTexture_fs, this._cubeTexture, Context3DWrapMode.CLAMP);
		}
	}
}
