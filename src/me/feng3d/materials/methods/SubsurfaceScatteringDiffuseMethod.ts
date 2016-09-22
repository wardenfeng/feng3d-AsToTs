module feng3d
{
		

	/**
	 * SubsurfaceScatteringDiffuseMethod provides a depth map-based diffuse shading method that mimics the scattering of
	 * light inside translucent surfaces. It allows light to shine through an object and to soften the diffuse shading.
	 * It can be used for candle wax, ice, skin, ...
	 */
	export class SubsurfaceScatteringDiffuseMethod extends CompositeDiffuseMethod
	{
		private _depthPass:SingleObjectDepthPass;
		private _propReg;
		private _scattering:number;
		private _translucency:number = 1;
		private _lightColorReg;
		private _scatterColor:number = 0xffffff;
		private _decReg;
		private _scatterR:number = 1.0;
		private _scatterG:number = 1.0;
		private _scatterB:number = 1.0;
		private _targetReg;

		private vertexToTexData:number[] = [0.5, -0.5, 0, 1];
		private f$ColorData:number[] = [1.0, 1.0, 1.0, 1.0];

		private fragmentData0:number[] = [1.0, 1.0 / 255, 1.0 / 65025, 1.0 / 16581375];
		private fragmentData1:number[] = [0.2, 1, 0.5, -0.1];

		private _isFirstLight:boolean;
		private _depthMap:TextureProxyBase;
		private lightProjection:Matrix3D = new Matrix3D();

		/**
		 * Creates a new SubsurfaceScatteringDiffuseMethod object.
		 * @param depthMapSize The size of the depth map used.
		 * @param depthMapOffset The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
		 */
		constructor(depthMapSize:number = 512, depthMapOffset:number = 15)
		{
			super();
            this._baseMethod._modulateMethod = this.scatterLight;
			this._passes = [];
			this._depthPass = new SingleObjectDepthPass(depthMapSize, depthMapOffset);
			this._passes.push(this._depthPass);
			this._scattering = 0.2;
			this._translucency = 1;
		}

		private get depthMap():TextureProxyBase
		{
			return this._depthMap;
		}

		private set depthMap(value:TextureProxyBase)
		{
			if (this._depthMap != value)
			{
				this._depthMap = value;
				this.context3DBufferOwner.markBufferDirty(this._.SSD$depthMap_fs);
			}
		}

		/**
		 * @inheritDoc
		 */
		protected initBuffers()
		{
			super.initBuffers();

			this.context3DBufferOwner.mapContext3DBuffer(this._.SSD$ToTex_vc_vector, this.SSD$ToTexBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.SSD$f$ColorData_vc_vector, this.f$ColorDataBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.SSD$fragmentData0_vc_vector, this.fragmentData0Buffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.SSD$fragmentData1_vc_vector, this.fragmentData1Buffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.SSD$depthMap_fs, this.updateDepthMapBuffer);

			this.context3DBufferOwner.mapContext3DBuffer(this._.SSD$LightProjection_vc_matrix, this.updateLightProjectionBuffer);
		}

		private SSD$ToTexBuffer(vcVectorBuffer:VCVectorBuffer)
		{
			vcVectorBuffer.update(this.vertexToTexData);
		}

		private f$ColorDataBuffer(fcVectorBuffer:FCVectorBuffer)
		{
			fcVectorBuffer.update(this.f$ColorData);
		}

		private fragmentData0Buffer(fcVectorBuffer:FCVectorBuffer)
		{
			fcVectorBuffer.update(this.fragmentData0);
		}

		private fragmentData1Buffer(fcVectorBuffer:FCVectorBuffer)
		{
			fcVectorBuffer.update(this.fragmentData1);
		}

		private updateDepthMapBuffer(textureBuffer:FSBuffer)
		{
			textureBuffer.update(this.depthMap);
		}

		protected updateLightProjectionBuffer(vcMatrixBuffer:VCMatrixBuffer)
		{
			vcMatrixBuffer.update(this.lightProjection, true);
		}

		public cleanCompilationData()
		{
			super.cleanCompilationData();

			this._propReg = null;
			this._lightColorReg = null;
			this._decReg = null;
			this._targetReg = null;
		}

		/**
		 * The amount by which the light scatters. It can be used to set the translucent surface's thickness. Use low
		 * values for skin.
		 */
		public get scattering():number
		{
			return this._scattering;
		}

		public set scattering(value:number)
		{
			this._scattering = value;
		}

		/**
		 * The translucency of the object.
		 */
		public get translucency():number
		{
			return this._translucency;
		}

		public set translucency(value:number)
		{
			this._translucency = value;
		}

		/**
		 * The colour of the "insides" of the object, ie: the colour the light becomes after leaving the object.
		 */
		public get scatterColor():number
		{
			return this._scatterColor;
		}

		public set scatterColor(scatterColor:number)
		{
			this._scatterColor = scatterColor;
			this._scatterR = ((scatterColor >> 16) & 0xff) / 0xff;
			this._scatterG = ((scatterColor >> 8) & 0xff) / 0xff;
			this._scatterB = (scatterColor & 0xff) / 0xff;
		}

		/**
		 * @inheritDoc
		 */
		public getVertexCode()
		{
			var vt0:Register;

			var _ = FagalRE.instance.space;

			var lightProjection;
			var toTexRegister = _.SSD$ToTex_vc_vector;
			var temp = _.getFreeTemp();

			var _lightProjVarying = _.SSD$LightProj_v;

			lightProjection = _.SSD$LightProjection_vc_matrix;

			_.m44(temp, vt0, lightProjection); //
			_.div(temp.xyz, temp.xyz, temp.w); //
			_.mul(temp.xy, temp.xy, toTexRegister.xy); //
			_.add(temp.xy, temp.xy, toTexRegister.xx); //
			_.mov(_lightProjVarying.xyz, temp.xyz); //
			_.mov(_lightProjVarying.w, _.position_va_3.w);
		}

		/**
		 * @inheritDoc
		 */
		public getFragmentPreLightingCode()
		{
			var _ = FagalRE.instance.space;

			this._decReg = _.SSD$dec_fc_vector;
			this._propReg = _.SSD$prop_fc_vector;
		}

		/**
		 * @inheritDoc
		 */
		public getFragmentCodePerLight()
		{
			var lightColReg:Register;

			this._isFirstLight = true;
			this._lightColorReg = lightColReg;
		}

		/**
		 * @inheritDoc
		 */
		public getFragmentPostLightingCode()
		{
			var targetReg;

			var _ = FagalRE.instance.space;

			var temp = _.getFreeTemp();

			var _colorReg = _.SSD$Color_fc_vector;

			_.mul(temp.xyz, this._lightColorReg.xyz, this._targetReg.w); //
			_.mul(temp.xyz, temp.xyz, _colorReg.xyz); //
			_.add(targetReg.xyz, targetReg.xyz, temp.xyz);
		}

		/**
		 * @inheritDoc
		 */
		public activate(shaderParams:ShaderParams)
		{
			super.activate(shaderParams);

			this.f$ColorData[0] = this._scatterR;
			this.f$ColorData[1] = this._scatterG;
			this.f$ColorData[2] = this._scatterB;

			this.fragmentData1[0] = this._scattering;
			this.fragmentData1[1] = this._translucency;
		}

		/**
		 * @inheritDoc
		 */
		public setRenderState(renderable:IRenderable, camera:Camera3D)
		{
			this.depthMap = this._depthPass.getDepthMap(renderable);

			var projection:Matrix3D = this._depthPass.getProjection(renderable);
			this.lightProjection.copyFrom(projection);
		}

		/**
		 * Generates the code for this method
		 */
		private scatterLight()
		{
			var _ = FagalRE.instance.space;
			var shaderParams:ShaderParams = FagalRE.instance.context3DCache.shaderParams;
			var lightShaderParams:LightShaderParams = shaderParams.getOrCreateComponentByClass(LightShaderParams);

			// only scatter first light
			if (!this._isFirstLight)
				return;
			this._isFirstLight = false;

			var targetReg;

			var depthReg = _.SSD$depthMap_fs;

			if (lightShaderParams.needsViewDir > 0)
				this._targetReg = _.viewDir_ft_4;
			else
			{
				this._targetReg = _.getFreeTemp();
			}

			var _lightProjVarying = _.SSD$LightProj_v;
			var _colorReg = _.SSD$Color_fc_vector;

			var temp = _.getFreeTemp();
			"tex " + temp + ", " + _lightProjVarying + ", " + depthReg + " <2d,nearest,clamp>\n";
			// reencode RGBA
			_.dp4(targetReg.z, temp, this._decReg);
			// currentDistanceToLight - closestDistanceToLight
			_.sub(targetReg.z, _lightProjVarying.z, targetReg.z);

			_.sub(targetReg.z, this._propReg.x, targetReg.z);
			_.mul(targetReg.z, this._propReg.y, targetReg.z);
			_.sat(targetReg.z, targetReg.z);

			// targetReg.x contains dot(lightDir, normal)
			// modulate according to incident light angle (scatter = scatter*(-.5*dot(light, normal) + .5)
			_.neg(targetReg.y, targetReg.x);
			_.mul(targetReg.y, targetReg.y, this._propReg.z);
			_.add(targetReg.y, targetReg.y, this._propReg.z);
			_.mul(this._targetReg.w, targetReg.z, targetReg.y);

			// blend diffuse: d' = (1-s)*d + s*1
			_.sub(targetReg.y, _colorReg.w, this._targetReg.w);
			_.mul(targetReg.w, targetReg.w, targetReg.y);

		}
	}
}
