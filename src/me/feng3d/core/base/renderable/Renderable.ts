module feng3d {
	/**
	 * 可渲染对象基类
	 * @author feng 2015-5-27
	 */
    export abstract class Renderable extends Component implements IRenderable {
        protected _context3dCache: Context3DCache;

		/**
		 * 创建一个可渲染对象基类
		 */
        constructor() {
            super();
            this._context3dCache = new Context3DCache();
        }

		/**
		 * Fagal编号中心
		 */
        public get _(): any {
            return FagalIdCenter.instance;
        }

		/**
		 * @inheritDoc
		 */
        public get context3dCache(): Context3DCache {
            return this._context3dCache;
        }

		/**
		 * @inheritDoc
		 */
        mouseEnabled: boolean;

		/**
		 * @inheritDoc
		 */
        numTriangles: number;

		/**
		 * @inheritDoc
		 */
        sourceEntity: Entity;

		/**
		 * @inheritDoc
		 */
        material: MaterialBase;

		/**
		 * @inheritDoc
		 */
        animator: AnimatorBase;

		/**
		 * @inheritDoc
		 */
        castsShadows: boolean;
    }
}
