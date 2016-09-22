module feng3d {

	/**
	 * 子网格，可渲染对象
	 */
    export class SubMesh extends Component {
        public renderableBase: MeshRenderable;

        public context3DBufferOwner: Context3DBufferOwner;

        protected _parentMesh: Mesh;
        protected _subGeometry: SubGeometry;
        public _index: number;

        protected _materialSelf: MaterialBase;
        private _material: MaterialBase;
        private _materialDirty: boolean;

        private _animator: AnimatorBase;

        private _animationSubGeometry: AnimationSubGeometry;

		/**
		 * 创建一个子网格
		 * @param subGeometry 子几何体
		 * @param parentMesh 父网格
		 * @param material 材质
		 */
        constructor(subGeometry: SubGeometry, parentMesh: Mesh, material: MaterialBase = null) {
            super();
            this.context3DBufferOwner = new Context3DBufferOwner();
            this.renderableBase = new MeshRenderable(this);

            this._parentMesh = parentMesh;
            this.subGeometry = subGeometry;
            this.material = material;

            this._parentMesh.addEventListener(MeshEvent.MATERIAL_CHANGE, this.onMaterialChange);
        }

		/**
		 * 渲染材质
		 */
        public get material(): MaterialBase {
            if (this._materialDirty)
                this.updateMaterial();
            return this._material;
        }

		/**
		 * 自身材质
		 */
        public get materialSelf(): MaterialBase {
            return this._materialSelf;
        }

        public set material(value: MaterialBase) {
            this._materialSelf = value;
            this._materialDirty = true;
        }

		/**
		 * 更新材质
		 */
        private updateMaterial() {
            var value: MaterialBase = this._materialSelf ? this._materialSelf : this._parentMesh.material;
            if (value == this._material)
                return;

            if (this._material) {
                this._material.removeOwner(this.renderableBase);
            }
            this._material = value;
            if (this._material) {
                this._material.addOwner(this.renderableBase);
            }
        }

		/**
		 * 所属实体
		 */
        public get sourceEntity(): Entity {
            return this._parentMesh;
        }

		/**
		 * 子网格
		 */
        public get subGeometry(): SubGeometry {
            return this._subGeometry;
        }

        public set subGeometry(value: SubGeometry) {
            if (this._subGeometry) {
                this.context3DBufferOwner.removeChildBufferOwner(this._subGeometry.context3DBufferOwner);
            }
            this._subGeometry = value;
            if (this._subGeometry) {
                this.context3DBufferOwner.addChildBufferOwner(this._subGeometry.context3DBufferOwner);
            }
        }

		/**
		 * 动画顶点数据(例如粒子特效的时间、位置偏移、速度等等)
		 */
        public get animationSubGeometry(): AnimationSubGeometry {
            return this._animationSubGeometry;
        }

        public set animationSubGeometry(value: AnimationSubGeometry) {
            if (this._animationSubGeometry) {
                this.context3DBufferOwner.removeChildBufferOwner(this._animationSubGeometry.context3DBufferOwner);
            }
            this._animationSubGeometry = value;
            if (this._animationSubGeometry) {
                this.context3DBufferOwner.addChildBufferOwner(this._animationSubGeometry.context3DBufferOwner);
            }
        }

		/**
		 * @inheritDoc
		 */
        public get animator(): AnimatorBase {
            return this._animator;
        }

        public set animator(value: AnimatorBase) {
            if (this._animator) {
                this.context3DBufferOwner.removeChildBufferOwner(this._animator.context3DBufferOwner);
                this.material.animationSet = null;
            }
            this._animator = value;
            if (this._animator) {
                this.context3DBufferOwner.addChildBufferOwner(this._animator.context3DBufferOwner);
                this.material.animationSet = this._animator.animationSet;
            }
        }

		/**
		 * 父网格
		 */
        public get parentMesh(): Mesh {
            return this._parentMesh;
        }

        public get castsShadows(): boolean {
            return this._parentMesh.castsShadows;
        }

		/**
		 * @inheritDoc
		 */
        public get mouseEnabled(): boolean {
            return this._parentMesh.mouseEnabled || this._parentMesh.ancestorsAllowMouseEnabled;
        }

		/**
		 * @inheritDoc
		 */
        public get numTriangles(): number {
            return this._subGeometry.numTriangles;
        }

		/**
		 * 处理材质变化事件
		 */
        private onMaterialChange(event: Event) {
            this._materialDirty = true;
        }

		/**
		 * 销毁
		 */
        public dispose() {
            this.material = null;
        }
    }
}
