module feng3d {

	/**
	 * 几何体
	 * @author feng 2014-3-17
	 */
    export class Geometry extends Component implements IAsset {
        private _namedAsset: NamedAsset;
        private _subGeometries: SubGeometry[];

        public get subGeometries(): SubGeometry[] {
            return this._subGeometries;
        }
        
        public getSubGeometries(): SubGeometry[] {
            return this._subGeometries;
        }

        constructor() {
            super();
            this._namedAsset = new NamedAsset(this, AssetType.GEOMETRY);
            this._subGeometries = [];
        }

		/**
		 * 顶点个数
		 */
        public get numVertices(): number {
            var _numVertices: number;
            for (var i: number = 0; i < this._subGeometries.length; i++) {
                _numVertices += this._subGeometries[i].numVertices;
            }
            return _numVertices;
        }

		/**
		 * 应用变换矩阵
		 * @param transform 变换矩阵
		 */
        public applyTransformation(transform: Matrix3D) {
            var len: number = this._subGeometries.length;
            for (var i: number = 0; i < len; ++i)
                this._subGeometries[i].applyTransformation(transform);
        }

		/**
		 * 添加子几何体
		 * @param subGeometry 子几何体
		 */
        public addSubGeometry(subGeometry: SubGeometry) {
            this._subGeometries.push(subGeometry);

            subGeometry.parent = this;

            this.dispatchEvent(new GeometryEvent(GeometryEvent.SUB_GEOMETRY_ADDED, subGeometry));
        }

		/**
		 * 移除子几何体
		 * @param subGeometry 子几何体
		 */
        public removeSubGeometry(subGeometry: SubGeometry) {
            this._subGeometries.splice(this._subGeometries.indexOf(subGeometry), 1);
            subGeometry.parent = null;

            this.dispatchEvent(new GeometryEvent(GeometryEvent.SUB_GEOMETRY_REMOVED, subGeometry));
        }

        protected removeAllSubGeometry() {
            for (var i: number = this._subGeometries.length - 1; i >= 0; i--) {
                this.removeSubGeometry(this._subGeometries[i]);
            }
        }

        public clone(): Geometry {
            var cls = getDefinitionByName(getQualifiedClassName(this));
            var clone: Geometry = new cls();

            var len: number = this._subGeometries.length;
            for (var i: number = 0; i < len; ++i)
                clone.addSubGeometry(this._subGeometries[i].clone());
            return clone;
        }

		/**
		 * 缩放几何体
		 * @param scale 缩放系数
		 */
        public scale(scale: number) {
            var numSubGeoms: number = this._subGeometries.length;
            for (var i: number = 0; i < numSubGeoms; ++i) {
                var subGeometryTransformation: SubGeometryTransformation = this._subGeometries[i].getOrCreateComponentByClass(SubGeometryTransformation);
                subGeometryTransformation.scale(scale);
            }
        }

		/**
		 * 缩放uv
		 * @param scaleU u缩放系数
		 * @param scaleV v缩放系数
		 */
        public scaleUV(scaleU: number = 1, scaleV: number = 1) {
            var numSubGeoms: number = this._subGeometries.length;
            for (var i: number = 0; i < numSubGeoms; ++i) {
                var subGeometryTransformation: SubGeometryTransformation = this._subGeometries[i].getOrCreateComponentByClass(SubGeometryTransformation);
                subGeometryTransformation.scaleUV(scaleU, scaleV);
            }
        }

        public dispose() {
            var numSubGeoms: number = this._subGeometries.length;

            for (var i: number = 0; i < numSubGeoms; ++i) {
                var subGeom: SubGeometry = this._subGeometries[0];
                this.removeSubGeometry(subGeom);
                subGeom.dispose();
            }
        }

        public get namedAsset(): NamedAsset {
            return this._namedAsset;
        }
    }
}
