module feng3d {


	/**
	 * 材质发生变化时抛出
	 */
    //[Event(name = "materialChange", type = "me.feng3d.events.MeshEvent")]

	/**
	 * 网格
	 * @author feng 2014-4-9
	 */
    export class Mesh extends Entity implements IMaterialOwner {
        protected _subMeshes: SubMesh[];

        protected _geometry: Geometry;

        protected _materialSelf: MaterialBase;

        protected _animator: AnimatorBase;

        private _castsShadows: boolean = true;

		/**
		 * 新建网格
		 * @param geometry 几何体
		 * @param material 材质
		 */
        constructor(geometry: Geometry = null, material: MaterialBase = null) {
            super();
            this._namedAsset._assetType = AssetType.MESH;
            this._subMeshes = [];

            this.geometry = geometry || new Geometry();

            this.material = material || DefaultMaterialManager.getDefaultMaterial();
        }

        /** 几何形状 */
        public get geometry(): Geometry {
            return this._geometry;
        }

        public set geometry(value: Geometry) {
            var i: number;

            if (this._geometry) {
                this._geometry.removeEventListener(GeometryEvent.SHAPE_CHANGE, this.onGeometryBoundsInvalid);
                this._geometry.removeEventListener(GeometryEvent.SUB_GEOMETRY_ADDED, this.onSubGeometryAdded);
                this._geometry.removeEventListener(GeometryEvent.SUB_GEOMETRY_REMOVED, this.onSubGeometryRemoved);

                for (i = 0; i < this._subMeshes.length; ++i)
                    this._subMeshes[i].dispose();
                this._subMeshes.length = 0;
            }

            this._geometry = value;

            if (this._geometry) {
                this._geometry.addEventListener(GeometryEvent.SHAPE_CHANGE, this.onGeometryBoundsInvalid);
                this._geometry.addEventListener(GeometryEvent.SUB_GEOMETRY_ADDED, this.onSubGeometryAdded);
                this._geometry.addEventListener(GeometryEvent.SUB_GEOMETRY_REMOVED, this.onSubGeometryRemoved);

                var subGeoms: SubGeometry[] = this._geometry.subGeometries;

                for (i = 0; i < subGeoms.length; ++i)
                    this.addSubMesh(subGeoms[i]);
            }

            this.invalidateBounds();
        }

		/**
		 * 渲染材质
		 */
        public getMaterial(): MaterialBase {
            return this._materialSelf;
        }

		/**
		 * 自身材质
		 */
        public get materialSelf(): MaterialBase {
            return this._materialSelf;
        }

        public set material(value: MaterialBase) {
            if (value == this._materialSelf)
                return;
            if (this._materialSelf)
                this._materialSelf.removeOwner(this);
            this._materialSelf = value;
            if (this._materialSelf)
                this._materialSelf.addOwner(this);

            this.dispatchEvent(new MeshEvent(MeshEvent.MATERIAL_CHANGE));
        }

		/**
		 * 源实体
		 */
        public get sourceEntity(): Entity {
            return this;
        }

		/**
		 * @inheritDoc
		 */
        protected updateBounds() {
            this._bounds.fromGeometry(this.geometry);
            this._boundsInvalid = false;
        }

		/**
		 * @inheritDoc
		 */
        public collidesBefore(shortestCollisionDistance: number, findClosest: boolean): boolean {
            this._pickingCollider.setLocalRay(this._pickingCollisionVO.localRay);
            this._pickingCollisionVO.renderable = null;

            var len: number = this._subMeshes.length;
            for (var i: number = 0; i < len; ++i) {
                var subMesh: SubMesh = this._subMeshes[i];
                //var ignoreFacesLookingAway:boolean = _material ? !_material.bothSides : true;
                if (this._pickingCollider.testSubMeshCollision(subMesh, this._pickingCollisionVO, shortestCollisionDistance,false)) {
                    shortestCollisionDistance = this._pickingCollisionVO.rayEntryDistance;
                    this._pickingCollisionVO.renderable = <any>subMesh.renderableBase;
                    if (!findClosest)
                        return true;
                }
            }

            return this._pickingCollisionVO.renderable != null;
        }

		/**
		 * @inheritDoc
		 */
        public getAnimator(): AnimatorBase {
            return this._animator;
        }

        public set animator(value: AnimatorBase) {
            if (this._animator)
                this._animator.removeOwner(this);

            this._animator = value;

            var i: number;

            for (i = 0; i < this.subMeshes.length; i++) {
                var subMesh: SubMesh = this.subMeshes[i];
                subMesh.animator = this._animator;
            }

            if (this._animator)
                this._animator.addOwner(this);
        }

		/**
		 * 子网格列表
		 */
        public get subMeshes(): SubMesh[] {
            return this._subMeshes;
        }

		/**
		 * 添加子网格包装子几何体
		 * @param subGeometry		被添加的子几何体
		 */
        protected addSubMesh(subGeometry: SubGeometry) {
            var subMesh: SubMesh = new SubMesh(subGeometry, this, null);
            var len: number = this._subMeshes.length;
            subMesh._index = len;
            this._subMeshes[len] = subMesh;
            this.invalidateBounds();
        }

		/**
		 * 处理几何体边界变化事件
		 */
        private onGeometryBoundsInvalid(event: GeometryEvent) {
            this.invalidateBounds();
        }

		/**
		 * 处理子几何体添加事件
		 */
        private onSubGeometryAdded(event: GeometryEvent) {
            this.addSubMesh(event.subGeometry);
            this.invalidateBounds();
        }

		/**
		 * 处理子几何体移除事件
		 */
        private onSubGeometryRemoved(event: GeometryEvent) {
            var subMesh: SubMesh;
            var subGeom: SubGeometry = event.subGeometry;
            var len: number = this._subMeshes.length;
            var i: number;

            for (i = 0; i < len; ++i) {
                subMesh = this._subMeshes[i];
                if (subMesh.subGeometry == subGeom) {
                    subMesh.dispose();
                    this._subMeshes.splice(i, 1);
                    break;
                }
            }

            --len;
            for (; i < len; ++i)
                this._subMeshes[i]._index = i;

            this.invalidateBounds();
        }

		/**
		 * 是否捕获阴影
		 */
        public get castsShadows(): boolean {
            return this._castsShadows;
        }

        public set castsShadows(value: boolean) {
            this._castsShadows = value;
        }

		/**
		 * @inheritDoc
		 */
        protected createEntityPartitionNode(): EntityNode {
            return new MeshNode(this);
        }
    }
}
