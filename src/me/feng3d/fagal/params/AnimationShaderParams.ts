module feng3d {




	/**
	 * 动画渲染参数
	 * @author feng 2015-12-1
	 */
    export class AnimationShaderParams extends Component {
        //-----------------------------------------
        //		动画渲染参数
        //-----------------------------------------
        /** 骨骼动画中的骨骼数量 */
        public numJoints: number;

        /** 每个顶点关联关节的数量 */
        public jointsPerVertex: number;

        /** 动画Fagal函数类型 */
        public animationType: AnimationType;

        /** 是否使用uv动画 */
        public useUVAnimation: number;

        /** 是否使用SpritSheet动画 */
        public useSpriteSheetAnimation: number;

		/**
		 * 动画渲染参数
		 */
        constructor() {
            super();
        }

        public init() {
            //
            this.numJoints = 0;
            this.animationType = AnimationType.NONE;
            this.useUVAnimation = 0;
        }
    }
}
