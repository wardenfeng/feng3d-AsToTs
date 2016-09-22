module feng3d {

	/**
	 * 无空间包围盒，用于表示一直处于视锥体内或之外
	 * <p>用于某些一直处于视锥体的实体，例如方向光源、天空盒等</p>
	 * @author feng 2015-3-21
	 */
    export class NullBounds extends BoundingVolumeBase {
        private _alwaysIn: boolean;
        private _renderable: WireframePrimitiveBase;

		/**
		 * 构建空无空间包围盒
		 * @param alwaysIn				是否总在视锥体内
		 * @param renderable			渲染实体
		 */
        constructor(alwaysIn: boolean = true, renderable: WireframePrimitiveBase = null) {
            super();
            this._alwaysIn = alwaysIn;
            this._renderable = renderable;
            this._max.x = this._max.y = this._max.z = Number.POSITIVE_INFINITY;
            this._min.x = this._min.y = this._min.z = this._alwaysIn ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        }
        
        /**
		 * 更新边界渲染实体
		 */
        protected updateBoundingRenderable()
        {
            
        }

		/**
		 * @inheritDoc
		 */
        protected createBoundingRenderable(): WireframePrimitiveBase {
            return this._renderable || new WireframeSphere(100, 16, 12, 0xffffff, 0.5);
        }

		/**
		 * @inheritDoc
		 */
        public isInFrustum(planes: Plane3D[], numPlanes: number): boolean {
            planes = planes;
            numPlanes = numPlanes;
            return this._alwaysIn;
        }

		/**
		 * @inheritDoc
		 */
        public fromGeometry(geometry: Geometry) {
        }

		/**
		 * @inheritDoc
		 */
        public fromExtremes(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number) {
        }

		/**
		 * @inheritDoc
		 */
        public transformFrom(bounds: BoundingVolumeBase, matrix: Matrix3D) {
            matrix = matrix;
            this._alwaysIn = as(bounds, NullBounds)._alwaysIn;
        }
    }
}
