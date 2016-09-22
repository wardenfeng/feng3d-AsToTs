module feng3d {

	/**
	 * 广告牌节点
	 * @author feng 2014-11-13
	 */
    export class ParticleBillboardNode extends ParticleNodeBase {
        private _matrix: Matrix3D = new Matrix3D;

        /** 广告牌轴线 */
        public _billboardAxis: Vector3D;

        /**
		 * 顶点数据编号
		 */
        public getVaId(): string {
            return "";
        }

		/**
		 * 顶点数据长度
		 */
        public getVaLen(): number {
            return 0;
        }

		/**
		 * 创建一个广告牌节点
		 * @param billboardAxis
		 */
        constructor(billboardAxis: Vector3D = null) {
            super("ParticleBillboard", ParticlePropertiesMode.GLOBAL, 0, 4);

            this.billboardAxis = billboardAxis;
        }

		/**
		 * @inheritDoc
		 */
        protected initBuffers() {
            super.initBuffers();

            this.context3DBufferOwner.mapContext3DBuffer(this._.particleBillboard_vc_matrix, this.updateBillboardMatrixBuffer);
        }

        private updateBillboardMatrixBuffer(billboardMatrixBuffer: VCMatrixBuffer) {
            billboardMatrixBuffer.update(this._matrix, true);
        }

		/**
		 * @inheritDoc
		 */
        public setRenderState(renderable: IRenderable, camera: Camera3D) {
            var comps: Vector3D[];
            if (this._billboardAxis) {
                var pos: Vector3D = renderable.sourceEntity.sceneTransform.position;
                var look: Vector3D = camera.sceneTransform.position.subtract(pos);
                var right: Vector3D = look.crossProduct(this._billboardAxis);
                right.normalize();
                look = this._billboardAxis.crossProduct(right);
                look.normalize();

                //create a quick inverse projection matrix
                this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
                comps = Matrix3DUtils.decompose(this._matrix, Orientation3D.AXIS_ANGLE);
                this._matrix.copyColumnFrom(0, right);
                this._matrix.copyColumnFrom(1, this._billboardAxis);
                this._matrix.copyColumnFrom(2, look);
                this._matrix.copyColumnFrom(3, pos);
                this._matrix.appendRotation(-comps[1].w * MathConsts.RADIANS_TO_DEGREES, comps[1]);
            }
            else {
                //create a quick inverse projection matrix
                this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
                this._matrix.append(camera.inverseSceneTransform);

                //decompose using axis angle rotations
                comps = Matrix3DUtils.decompose(this._matrix, Orientation3D.AXIS_ANGLE);

                //recreate the matrix with just the rotation data
                this._matrix.identity();
                this._matrix.appendRotation(-comps[1].w * MathConsts.RADIANS_TO_DEGREES, comps[1]);
            }

            this.context3DBufferOwner.markBufferDirty(this._.particleBillboard_vc_matrix);
        }

		/**
		 * 广告牌轴线
		 */
        public get billboardAxis(): Vector3D {
            return this._billboardAxis;
        }

        public set billboardAxis(value: Vector3D) {
            this._billboardAxis = value ? value.clone() : null;
            if (this._billboardAxis)
                this._billboardAxis.normalize();
        }

		/**
		 * @inheritDoc
		 */
        public processAnimationSetting(shaderParams: ShaderParams) {
            var particleShaderParams: ParticleShaderParams = shaderParams.getOrCreateComponentByClass(ParticleShaderParams);

            particleShaderParams.changePosition++;
            particleShaderParams[this.name] = true;
        }
    }
}
