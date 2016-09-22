module feng3d {

	/**
	 * 基础漫反射函数
	 * @author feng 2014-7-1
	 */
    export class BasicDiffuseMethod extends LightingMethodBase {
        public static METHOD_TYPE: string = "DiffuseMethod";

        /** 漫反射纹理 */
        protected _texture: Texture2DBase;

        private _diffuseColor: number = 0xffffff;

        /** 漫反射颜色数据RGBA */
        private diffuseInputData: number[] = [0, 0, 0, 0];

        private alphaThresholdData: number[] = [0, 0, 0, 0];

        /** 是否使用环境光材质 */
        private _useAmbientTexture: boolean;

        protected _alphaThreshold: number = 0;

		/**
		 * 创建一个基础漫反射函数
		 */
        constructor() {
            super();
            this.methodType = BasicDiffuseMethod.METHOD_TYPE;
            this.typeUnique = true;
        }

		/**
		 * @inheritDoc
		 */
        protected initBuffers() {
            super.initBuffers();
            this.context3DBufferOwner.mapContext3DBuffer(this._.texture_fs, this.updateTextureBuffer);
            this.context3DBufferOwner.mapContext3DBuffer(this._.diffuseInput_fc_vector, this.updateDiffuseInputBuffer);
            this.context3DBufferOwner.mapContext3DBuffer(this._.alphaThreshold_fc_vector, this.updateAlphaThresholdBuffer);
        }

        /** 漫反射颜色 */
        public get diffuseColor(): number {
            return this._diffuseColor;
        }

        public set diffuseColor(diffuseColor: number) {
            this._diffuseColor = diffuseColor;
            this.updateDiffuse();
        }

		/**
		 * 更新漫反射值
		 */
        private updateDiffuse() {
            this.diffuseInputData[0] = ((this._diffuseColor >> 16) & 0xff) / 0xff;
            this.diffuseInputData[1] = ((this._diffuseColor >> 8) & 0xff) / 0xff;
            this.diffuseInputData[2] = (this._diffuseColor & 0xff) / 0xff;
        }

        /** 漫反射alpha */
        public get diffuseAlpha(): number {
            return this.diffuseInputData[3];
        }

        public set diffuseAlpha(value: number) {
            this.diffuseInputData[3] = value;
        }

		/**
		 * 更新纹理缓冲
		 */
        private updateTextureBuffer(textureBuffer: FSBuffer) {
            textureBuffer.update(this.texture);
        }

		/**
		 * 更新漫反射输入片段常量缓冲
		 */
        private updateDiffuseInputBuffer(diffuseInputBuffer: FCVectorBuffer) {
            diffuseInputBuffer.update(this.diffuseInputData);
        }

        private updateAlphaThresholdBuffer(fcVectorBuffer: FCVectorBuffer) {
            fcVectorBuffer.update(this.alphaThresholdData);
        }

		/**
		 * 漫反射纹理
		 */
        public get texture(): Texture2DBase {
            return this._texture;
        }

        public set texture(value: Texture2DBase) {
            if ((value != null) != (this._texture != null) || (value && this._texture && (value.hasMipMaps != this._texture.hasMipMaps || value.format != this._texture.format))) {
                this.invalidateShaderProgram();
            }

            this._texture = value;

            this.context3DBufferOwner.markBufferDirty(this._.texture_fs);
        }

		/**
		 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
		 * invisible or entirely opaque, often used with textures for foliage, etc.
		 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
		 */
        public get alphaThreshold(): number {
            return this._alphaThreshold;
        }

        public set alphaThreshold(value: number) {
            if (value < 0)
                value = 0;
            else if (value > 1)
                value = 1;
            if (value == this._alphaThreshold)
                return;

            if (value == 0 || this._alphaThreshold == 0)
                this.invalidateShaderProgram();

            this._alphaThreshold = value;

            this.alphaThresholdData[0] = this._alphaThreshold;
        }

		/**
		 * @inheritDoc
		 */
        public activate(shaderParams: ShaderParams) {
            var commonShaderParams: CommonShaderParams = shaderParams.getOrCreateComponentByClass(CommonShaderParams);

            if (this.texture != null) {
                commonShaderParams.needsUV++;
                commonShaderParams.hasDiffuseTexture++;
                shaderParams.addSampleFlags(this._.texture_fs, this.texture);
            }

            commonShaderParams.usingDiffuseMethod += 1;
            commonShaderParams.alphaThreshold = this._alphaThreshold;

            shaderParams.diffuseModulateMethod = this._modulateMethod;

            var lightShaderParams: LightShaderParams = shaderParams.getOrCreateComponentByClass(LightShaderParams);
            lightShaderParams.needsNormals += lightShaderParams.numLights > 0 ? 1 : 0;
            lightShaderParams.diffuseMethod = F_DiffusePostLighting;
        }

		/**
		 * @inheritDoc
		 */
        public copyFrom(method: ShadingMethodBase) {
            var diff: BasicDiffuseMethod = as(method, BasicDiffuseMethod);
            this.texture = diff.texture;
            this.diffuseAlpha = diff.diffuseAlpha;
            this.diffuseColor = diff.diffuseColor;
        }
    }
}
