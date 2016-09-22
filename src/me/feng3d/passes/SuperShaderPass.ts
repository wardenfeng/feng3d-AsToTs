module feng3d
{

	/**
	 * 超级渲染通道
	 * <p>提供灯光渲染相关信息</p>
	 * @author feng 2014-7-1
	 */
	export class SuperShaderPass extends CompiledPass
	{
		/** 方向光源场景方向数据 */
		private dirLightSceneDirData:number[] = [];

		/** 方向光源漫反射光颜色数据 */
		private dirLightDiffuseData:number[] = [];

		/** 方向光源镜面反射颜色数据 */
		private dirLightSpecularData:number[] = [];

		/** 点光源场景位置数据 */
		private pointLightScenePositionData:number[] = [];

		/** 点光源漫反射光颜色数据 */
		private pointLightDiffuseData:number[] = [];

		/** 点光源镜面反射颜色数据 */
		private pointLightSpecularData:number[] = [];

		/**
		 * 创建超级渲染通道
		 */
		constructor()
		{
			super();
		}

		/**
		 * The number of "effect" methods added to the material.
		 */
		public get numMethods():number
		{
			return this._methodSetup.numMethods;
		}

		/**
		 * @inheritDoc
		 */
		protected initBuffers()
		{
			super.initBuffers();
			this.context3DBufferOwner.mapContext3DBuffer(this._.dirLightSceneDir_fc_vector, this.updateDirLightSceneDirBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.dirLightDiffuse_fc_vector, this.updateDirLightDiffuseReg);
			this.context3DBufferOwner.mapContext3DBuffer(this._.dirLightSpecular_fc_vector, this.updateDirLightSpecularBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.pointLightScenePos_fc_vector, this.updatePointLightScenePositionBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.pointLightDiffuse_fc_vector, this.updatePointLightDiffuseReg);
			this.context3DBufferOwner.mapContext3DBuffer(this._.pointLightSpecular_fc_vector, this.updatePointLightSpecularBuffer);
		}

		private updateDirLightSpecularBuffer(dirLightSpecularBuffer:FCVectorBuffer)
		{
			dirLightSpecularBuffer.update(this.dirLightSpecularData);
		}

		private updateDirLightDiffuseReg(dirLightDiffuseBuffer:FCVectorBuffer)
		{
			dirLightDiffuseBuffer.update(this.dirLightDiffuseData);
		}

		private updateDirLightSceneDirBuffer(dirLightSceneDirBuffer:FCVectorBuffer)
		{
			dirLightSceneDirBuffer.update(this.dirLightSceneDirData);
		}

		private updatePointLightSpecularBuffer(pointLightSpecularBuffer:FCVectorBuffer)
		{
			pointLightSpecularBuffer.update(this.pointLightSpecularData);
		}

		private updatePointLightDiffuseReg(pointLightDiffuseBuffer:FCVectorBuffer)
		{
			pointLightDiffuseBuffer.update(this.pointLightDiffuseData);
		}

		private updatePointLightScenePositionBuffer(pointLightScenePositionBuffer:FCVectorBuffer)
		{
			pointLightScenePositionBuffer.update(this.pointLightScenePositionData);
		}

		/**
		 * 添加特效函数
		 * @param method		特效函数
		 */
		public addMethod(method:EffectMethodBase)
		{
			this._methodSetup.addMethod(method);
		}

		/**
		 * @inheritDoc
		 */
		public activate(camera:Camera3D, target:TextureProxyBase = null)
		{
			if (this._lightPicker)
			{
				var lightShaderParams:LightShaderParams = this.shaderParams.getOrCreateComponentByClass(LightShaderParams);
				lightShaderParams.numPointLights = this._lightPicker.numPointLights;
				lightShaderParams.numDirectionalLights = this._lightPicker.numDirectionalLights;
			}

			var methods:ShadingMethodBase[] = this._methodSetup.methods;
			var len:number = methods.length;
			for (var i:number = 0; i < len; ++i)
			{
				methods[i].activate(this.shaderParams);
			}

			super.activate(camera);
		}

		/**
		 * @inheritDoc
		 */
		protected updateLightConstants()
		{
			var dirLight:DirectionalLight;
			var pointLight:PointLight;
			var sceneDirection:Vector3D;
			var scenePosition:Vector3D;
			var len:number;
			var i:number, k:number;

			var dirLights:DirectionalLight[] = this._lightPicker.directionalLights;
			len = dirLights.length;
			for (i = 0; i < len; ++i)
			{
				dirLight = dirLights[i];
				sceneDirection = dirLight.sceneDirection;

				this._ambientLightR += dirLight._ambientR;
				this._ambientLightG += dirLight._ambientG;
				this._ambientLightB += dirLight._ambientB;

				this.dirLightSceneDirData[i * 4 + 0] = -sceneDirection.x;
				this.dirLightSceneDirData[i * 4 + 1] = -sceneDirection.y;
				this.dirLightSceneDirData[i * 4 + 2] = -sceneDirection.z;
				this.dirLightSceneDirData[i * 4 + 3] = 1;

				this.dirLightDiffuseData[i * 4 + 0] = dirLight._diffuseR;
				this.dirLightDiffuseData[i * 4 + 1] = dirLight._diffuseG;
				this.dirLightDiffuseData[i * 4 + 2] = dirLight._diffuseB;
				this.dirLightDiffuseData[i * 4 + 3] = 1;

				this.dirLightSpecularData[i * 4 + 0] = dirLight._specularR;
				this.dirLightSpecularData[i * 4 + 1] = dirLight._specularG;
				this.dirLightSpecularData[i * 4 + 2] = dirLight._specularB;
				this.dirLightSpecularData[i * 4 + 3] = 1;
			}

			var pointLights:PointLight[] = this._lightPicker.pointLights;
			len = pointLights.length;
			for (i = 0; i < len; ++i)
			{
				pointLight = pointLights[i];
				scenePosition = pointLight.scenePosition;

				this._ambientLightR += pointLight._ambientR;
				this._ambientLightG += pointLight._ambientG;
				this._ambientLightB += pointLight._ambientB;

				this.pointLightScenePositionData[i * 4 + 0] = scenePosition.x;
				this.pointLightScenePositionData[i * 4 + 1] = scenePosition.y;
				this.pointLightScenePositionData[i * 4 + 2] = scenePosition.z;
				this.pointLightScenePositionData[i * 4 + 3] = 1;

				this.pointLightDiffuseData[i * 4 + 0] = pointLight._diffuseR;
				this.pointLightDiffuseData[i * 4 + 1] = pointLight._diffuseG;
				this.pointLightDiffuseData[i * 4 + 2] = pointLight._diffuseB;
				this.pointLightDiffuseData[i * 4 + 3] = pointLight._radius * pointLight._radius;

				this.pointLightSpecularData[i * 4 + 0] = pointLight._specularR;
				this.pointLightSpecularData[i * 4 + 1] = pointLight._specularG;
				this.pointLightSpecularData[i * 4 + 2] = pointLight._specularB;
				this.pointLightSpecularData[i * 4 + 3] = pointLight._fallOffFactor;
			}

		}
	}
}
