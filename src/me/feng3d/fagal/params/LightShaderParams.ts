module feng3d {



	/**
	 * 灯光渲染参数
	 * @author feng 2015-12-1
	 */
    export class LightShaderParams extends Component {
        //-----------------------------------------
        //		灯光渲染参数
        //-----------------------------------------
        /** 点光源数量 */
        public numPointLights: number;
        private _numDirectionalLights: number;
        /** 是否使用灯光衰减 */
        public useLightFallOff: boolean = true;

        /** 是否需要视线 */
        public needsViewDir: number;

        /** 方向光源数量 */
        public get numDirectionalLights(): number {
            return this._numDirectionalLights;
        }

		/**
		 * @private
		 */
        public set numDirectionalLights(value: number) {
            this._numDirectionalLights = value;
        }

        /** 漫反射函数 */
        public diffuseMethod: Function;
        /** 是否使用镜面反射函数 */
        public usingSpecularMethod: number;

        /** 是否需要法线 */
        public needsNormals: number;
        /** 是否有法线贴图 */
        public hasNormalTexture: boolean;
        /** 是否有光泽贴图 */
        public hasSpecularTexture: number;

        //------------- 渲染过程参数 ---------------
        /** 是否为第一个渲染的镜面反射灯光 */
        public isFirstSpecLight: boolean;

        /** 是否为第一个渲染的漫反射灯光 */
        public isFirstDiffLight: boolean;

		/**
		 * 灯光渲染参数
		 */
        constructor() {
            super();
        }

		/**
		 * 初始化
		 */
        public init() {
            //
            this.numPointLights = 0;
            this.numDirectionalLights = 0;
            this.needsNormals = 0;
            this.needsViewDir = 0;
        }

		/**
		 * 运行渲染程序前
		 */
        public preRun() {
            this.isFirstSpecLight = true;
            this.isFirstDiffLight = true;
        }

        /** 灯光数量 */
        public get numLights(): number {
            return this.numPointLights + this.numDirectionalLights;
        }

        /** 是否需要世界坐标 */
        public get needWorldPosition(): boolean {
            return this.needsViewDir > 0 || this.numPointLights > 0;
        }

        /** 片段程序是否需要世界坐标 */
        public get usesGlobalPosFragment(): boolean {
            return this.numPointLights > 0;
        }
    }
}
