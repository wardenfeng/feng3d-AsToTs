module feng3d {

	/**
	 * 动画节点基类
	 * @author feng 2014-5-20
	 */
    export class AnimationNodeBase extends Component implements IAsset {
        private _namedAsset: NamedAsset;
        public context3DBufferOwner: Context3DBufferOwner;

        protected _stateClass;

		/**
		 * 状态类
		 */
        public get stateClass() {
            return this._stateClass;
        }

		/**
		 * 创建一个动画节点基类
		 */
        constructor() {
            super();
            this._namedAsset = new NamedAsset(this, AssetType.ANIMATION_NODE);
            this.context3DBufferOwner = new Context3DBufferOwner();
            this.initBuffers();
        }

		/**
		 * 初始化Context3d缓存
		 */
        protected initBuffers() {

        }

		/**
		 * Fagal编号中心
		 */
        public get _(): any {
            return FagalIdCenter.instance;
        }

        public get namedAsset(): NamedAsset {
            return this._namedAsset;
        }


    }
}
