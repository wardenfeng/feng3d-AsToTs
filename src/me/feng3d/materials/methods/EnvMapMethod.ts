module feng3d {












	/**
	 * 环境映射函数
	 * @author feng 2015-8-27
	 */
    export class EnvMapMethod extends EffectMethodBase {
        private _envMapData: number[] = [1, 0, 0, 0];

        private _cubeTexture: CubeTextureBase;
        private _alpha: number;
        private _mask: Texture2DBase;

		/**
		 * 创建EnvMapMethod实例
		 * @param envMap		环境映射贴图
		 * @param alpha			反射率
		 */
        constructor(envMap: CubeTextureBase, alpha: number = 1) {
            super();
            this._cubeTexture = envMap;
            this.alpha = alpha;
        }

		/**
		 * 用来调节反射率的纹理
		 */
        public get mask(): Texture2DBase {
            return this._mask;
        }

        public set mask(value: Texture2DBase) {
            if ((value != null) != (this._mask != null) || (value && this._mask && (value.hasMipMaps != this._mask.hasMipMaps || value.format != this._mask.format))) {
                this.invalidateShaderProgram();
            }
            this._mask = value;

            this.context3DBufferOwner.markBufferDirty(this._.envMapMaskTexture_fs);
        }

		/**
		 * 环境映射贴图
		 */
        public get envMap(): CubeTextureBase {
            return this._cubeTexture;
        }

        public set envMap(value: CubeTextureBase) {
            this._cubeTexture = value;

            this.context3DBufferOwner.markBufferDirty(this._.envMapcubeTexture_fs);
        }

		/**
		 * 反射率
		 */
        public get alpha(): number {
            return this._alpha;
        }

        public set alpha(value: number) {
            this._alpha = value;
            this._envMapData[0] = this._alpha;
        }

		/**
		 * @inheritDoc
		 */
        protected initBuffers() {
            super.initBuffers();
            this.context3DBufferOwner.mapContext3DBuffer(this._.envMapcubeTexture_fs, this.updateCubeTextureBuffer);
            this.context3DBufferOwner.mapContext3DBuffer(this._.envMapMaskTexture_fs, this.updateMaskTextureBuffer);
            this.context3DBufferOwner.mapContext3DBuffer(this._.envMapData_fc_vector, this.updateDataBuffer);
        }

        private updateCubeTextureBuffer(fsBuffer: FSBuffer) {
            fsBuffer.update(this._cubeTexture);
        }

        private updateMaskTextureBuffer(fsBuffer: FSBuffer) {
            fsBuffer.update(this._mask);
        }

        private updateDataBuffer(fcVectorBuffer: FCVectorBuffer) {
            fcVectorBuffer.update(this._envMapData);
        }

		/**
		 * @inheritDoc
		 */
        public activate(shaderParams: ShaderParams) {
            var commonShaderParams: CommonShaderParams = shaderParams.getOrCreateComponentByClass(CommonShaderParams);
            if (this._mask != null)
                commonShaderParams.needsUV += 1;

            var lightShaderParams: LightShaderParams = shaderParams.getOrCreateComponentByClass(LightShaderParams);
            lightShaderParams.needsNormals++;
            lightShaderParams.needsViewDir++;

            //			shaderParams.needsView = true;

            var envShaderParams: EnvShaderParams = shaderParams.getOrCreateComponentByClass(EnvShaderParams);
            envShaderParams.useEnvMapMethod++;
            if (this._mask != null)
                envShaderParams.useEnvMapMask += 1;

            shaderParams.addSampleFlags(this._.envMapcubeTexture_fs, this._cubeTexture);
            shaderParams.addSampleFlags(this._.envMapMaskTexture_fs, this._mask);

            //			var context:Context3D = stage3DProxy._context3D;
            //			vo.fragmentData[vo.fragmentConstantsIndex] = this._alpha;
            //			context.setTextureAt(vo.texturesIndex, this._cubeTexture.getTextureForStage3D(stage3DProxy));
            //			if (this._mask)
            //				context.setTextureAt(vo.texturesIndex + 1, this._mask.getTextureForStage3D(stage3DProxy));
        }
    }
}
