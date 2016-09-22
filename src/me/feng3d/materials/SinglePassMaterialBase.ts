module feng3d {















	/**
	 * 单通道纹理
	 * @author feng 2014-6-5
	 */
    export class SinglePassMaterialBase extends MaterialBase {
        protected _screenPass: SuperShaderPass;
        private _alphaBlending: boolean;

		/**
		 * 创建一个单通道纹理
		 */
        constructor() {
            super();
            this.addPass(this._screenPass = new SuperShaderPass());
        }

		/**
		 * The number of "effect" methods added to the material.
		 */
        public get numMethods(): number {
            return this._screenPass.numMethods;
        }

		/**
		 * @inheritDoc
		 */
        public set blendMode(value: string) {
            super.setBlendMode(value);
            this._screenPass.setBlendMode(this.blendMode == BlendMode.NORMAL && this.requiresBlending ? BlendMode.LAYER : this.blendMode);
        }

		/**
		 * @inheritDoc
		 */
        public get requiresBlending(): boolean {
            return super.getRequiresBlending() || this._alphaBlending;
        }

        /**
          * @inheritDoc
          */
        public getRequiresBlending(): boolean {
            return this.requiresBlending;
        }

		/**
		 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
		 * invisible or entirely opaque, often used with textures for foliage, etc.
		 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
		 */
        public get alphaThreshold(): number {
            return this._screenPass.diffuseMethod.alphaThreshold;
        }

        public set alphaThreshold(value: number) {
            this._screenPass.diffuseMethod.alphaThreshold = value;
        }

		/**
		 * 环境光反射颜色
		 */
        public get ambientColor(): number {
            return this._screenPass.ambientMethod.ambientColor;
        }

        public set ambientColor(value: number) {
            this._screenPass.ambientMethod.ambientColor = value;
        }

		/**
		 * 镜面反射光反射颜色
		 */
        public get specularColor(): number {
            return this._screenPass.specularMethod.specularColor;
        }

        public set specularColor(value: number) {
            this._screenPass.specularMethod.specularColor = value;
        }

		/**
		 * 镜面反射光反射强度
		 */
        public get specular(): number {
            return this._screenPass.specularMethod ? this._screenPass.specularMethod.specular : 0;
        }

        public set specular(value: number) {
            if (this._screenPass.specularMethod)
                this._screenPass.specularMethod.specular = value;
        }

		/**
		 * 环境光反射强度
		 */
        public get ambient(): number {
            return this._screenPass.ambientMethod.ambient;
        }

        public set ambient(value: number) {
            this._screenPass.ambientMethod.ambient = value;
        }

		/**
		 * 是否透明度混合
		 */
        public get alphaBlending(): boolean {
            return this._alphaBlending;
        }

        public set alphaBlending(value: boolean) {
            this._alphaBlending = value;
            this._screenPass.setBlendMode(this.blendMode == BlendMode.NORMAL && this.requiresBlending ? BlendMode.LAYER : this.blendMode);
            //			this._screenPass.preserveAlpha = this.requiresBlending;
        }

		/**
		 * 漫反射函数
		 */
        public get diffuseMethod(): BasicDiffuseMethod {
            return this._screenPass.diffuseMethod;
        }

        public set diffuseMethod(value: BasicDiffuseMethod) {
            this._screenPass.diffuseMethod = value;
        }

		/**
		 * The method used to generate the per-pixel normals. Defaults to BasicNormalMethod.
		 */
        public get normalMethod(): BasicNormalMethod {
            return this._screenPass.normalMethod;
        }

        public set normalMethod(value: BasicNormalMethod) {
            this._screenPass.normalMethod = value;
        }

		/**
		 * 环境光函数
		 */
        public get ambientMethod(): BasicAmbientMethod {
            return this._screenPass.ambientMethod;
        }

        public set ambientMethod(value: BasicAmbientMethod) {
            this._screenPass.ambientMethod = value;
        }

		/**
		 * 镜面反射函数
		 */
        public get specularMethod(): BasicSpecularMethod {
            return this._screenPass.specularMethod;
        }

        public set specularMethod(value: BasicSpecularMethod) {
            this._screenPass.specularMethod = value;
        }

		/**
		 * 法线贴图
		 */
        public get normalMap(): Texture2DBase {
            return this._screenPass.normalMethod.normalMap;
        }

        public set normalMap(value: Texture2DBase) {
            this._screenPass.normalMethod.normalMap = value;
        }

		/**
		 * 镜面反射光泽图
		 */
        public get specularMap(): Texture2DBase {
            return this._screenPass.specularMethod.texture;
        }

        public set specularMap(value: Texture2DBase) {
            if (this._screenPass.specularMethod)
                this._screenPass.specularMethod.texture = value;
            else
                throw new Error("No this.specular method was set to assign the specularGlossMap to");
        }

		/**
		 * 高光值
		 */
        public get gloss(): number {
            return this._screenPass.specularMethod ? this._screenPass.specularMethod.gloss : 0;
        }

        public set gloss(value: number) {
            if (this._screenPass.specularMethod)
                this._screenPass.specularMethod.gloss = value;
        }

		/**
		 * 阴影映射函数
		 */
        public get shadowMethod(): ShadowMapMethodBase {
            return this._screenPass.shadowMethod;
        }

        public set shadowMethod(value: ShadowMapMethodBase) {
            this._screenPass.shadowMethod = value;
        }

		/**
		 * @inheritDoc
		 */
        public set lightPicker(value: LightPickerBase) {
            super.setLightPicker(value);
            this._screenPass.lightPicker = value;
        }

		/**
		 * 添加特效函数
		 * @param method		特效函数
		 */
        public addMethod(method: EffectMethodBase) {
            this._screenPass.addMethod(method);
        }
    }
}
