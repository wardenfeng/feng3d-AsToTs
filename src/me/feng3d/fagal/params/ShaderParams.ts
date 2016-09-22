module feng3d {







	/**
	 * 渲染参数
	 * <p>? 是否需要限定组件为ShaderParamsComponent</p>
	 * @author feng 2014-11-4
	 */
    export class ShaderParams extends Component {
        /** 取样标记字典 */
        private sampleFlagsDic;

        /** 是否使用贴图分层细化 */
        public useMipmapping: boolean;
        /** 是否使用平滑纹理 */
        public useSmoothTextures: boolean;
        /** 是否重复纹理 */
        public repeatTextures: boolean;

		/**
		 * 是否为入射光
		 */
        public incidentLight: boolean;

        public specularModelType: string;

        public diffuseModulateMethod: Function;
        public modulateMethod: Function;

        public alphaPremultiplied: boolean;

		/**
		 * 创建一个渲染参数
		 */
        constructor() {
            super();
            this.addEventListener(ComponentEvent.ADDED_COMPONET, this.onAddedComponet);
        }

        protected onAddedComponet(event: ComponentEvent) {
            var shaderParam: Object = event.data.child;

            if (shaderParam.hasOwnProperty("this.init")) {
                shaderParam["this.init"]();
            }
            if (shaderParam.hasOwnProperty("this.preRun")) {
                shaderParam["this.preRun"]();
            }
        }

		/**
		 * 初始化渲染参数
		 */
        public initParams() {
            this.init();

            this.components.forEach(shaderParam => {

                if (shaderParam.hasOwnProperty("this.init")) {
                    shaderParam["this.init"]();
                }
            });

        }

		/**
		 * 渲染前初始化
		 */
        public preRunParams() {
            this.preRun();

            this.components.forEach(shaderParam => {

                if (shaderParam.hasOwnProperty("this.preRun")) {
                    shaderParam["this.preRun"]();
                }
            });

        }

		/**
		 * 初始化
		 */
        public init() {
            this.sampleFlagsDic = {};
        }

		/**
		 * 运行渲染程序前
		 */
        public preRun() {
        }

		/**
		 * 添加纹理取样参数
		 * @param dataTypeId		纹理数据缓冲类型编号
		 * @param texture			纹理代理
		 * @param forceWrap			强制重复纹理参数
		 */
        public addSampleFlags(dataTypeId: string, texture: TextureProxyBase, forceWrap: string = null) {
            this.sampleFlagsDic[dataTypeId] = null;
            if (texture) {
                var flags = TextureUtils.getFlags(this.useMipmapping, this.useSmoothTextures, this.repeatTextures, texture, forceWrap);
                this.sampleFlagsDic[dataTypeId] = flags;
            }
        }

		/**
		 * 设置取样标记
		 * @param dataTypeId		纹理数据缓冲类型编号
		 * @param flags				纹理取样标记
		 */
        public setSampleFlags(dataTypeId: string, flags) {
            this.sampleFlagsDic[dataTypeId] = flags;
        }

		/**
		 * 获取取样标记
		 * @param dataTypeId		纹理数据缓冲类型编号
		 * @return					纹理取样标记
		 */
        public getFlags(dataTypeId: string) {
            return this.sampleFlagsDic[dataTypeId];
        }

    }
}


