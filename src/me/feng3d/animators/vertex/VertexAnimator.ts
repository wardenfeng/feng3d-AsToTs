module feng3d {

	/**
	 * 顶点动画
	 * @author feng 2014-5-13
	 */
    export class VertexAnimator extends AnimatorBase {
        private _weights: number[] = [1, 0, 0, 0];

        private _vertexAnimationSet: VertexAnimationSet;
        private _poses: Geometry[] = [];
        private _numPoses: number;

        private _activeVertexState: IVertexAnimationState;

		/**
		 * 创建一个顶点动画
		 * @param vertexAnimationSet 顶点动画集合
		 */
        constructor(vertexAnimationSet: VertexAnimationSet) {
            super(vertexAnimationSet);

            this._vertexAnimationSet = vertexAnimationSet;
            this._numPoses = vertexAnimationSet.numPoses;
        }

		/**
		 * @inheritDoc
		 */
        protected initBuffers() {
            super.initBuffers();
            this.context3DBufferOwner.mapContext3DBuffer(this._.weights_vc_vector, this.updateWeightsBuffer);
        }

        private updateWeightsBuffer(weightsBuffer: VCVectorBuffer) {
            weightsBuffer.update(this._weights);
        }

		/**
		 * 播放动画
		 * @param name 动作名称
		 * @param offset 时间偏移量
		 */
        public play(name: string, transition: IAnimationTransition = null, offset: number = NaN) {
            if (this._activeAnimationName != name) {
                this._activeAnimationName = name;

                if (!this._vertexAnimationSet.hasAnimation(name))
                    throw new Error("Animation root node " + name + " not found!");

                //获取活动的骨骼状态
                this._activeNode = this._vertexAnimationSet.getAnimation(name) as VertexClipNode;

                this._activeState = this.getAnimationState(this._activeNode);

                if (this.updatePosition) {
                    //this.update straight away to this.reset position deltas
                    this._activeState.update(this._absoluteTime);
                    this._activeState.positionDelta;
                }

                this._activeVertexState = this._activeState as IVertexAnimationState;
            }

            this.start();

            //使用时间偏移量处理特殊情况
            if (!isNaN(offset))
                this.reset(name, offset);
        }

		/**
		 * @inheritDoc
		 */
        protected updateDeltaTime(dt: number) {
            super.updateDeltaTime(dt);

            this._poses[0] = this._activeVertexState.getCurrentGeometry();
            this._poses[1] = this._activeVertexState.getNextGeometry();
            this._weights[0] = 1 - (this._weights[1] = this._activeVertexState.getBlendWeight());
        }

		/**
		 * @inheritDoc
		 */
        public setRenderState(renderable: IRenderable, camera: Camera3D) {
            //没有姿势时，使用默认姿势
            if (!this._poses.length) {
                this.setNullPose(renderable)
                return;
            }

            // this type of animation can only be SubMesh
            var subMesh: SubMesh = as(renderable, MeshRenderable).subMesh;
            var subGeom: SubGeometry = subMesh.subGeometry;

            var vertexSubGeom: VertexSubGeometry = subGeom.getOrCreateComponentByClass(VertexSubGeometry);
            //				//获取默认姿势几何体数据
            subGeom = this._poses[0].subGeometries[subMesh._index] || subMesh.subGeometry;
            vertexSubGeom.updateVertexData0(subGeom.vertexPositionData.concat());

            subGeom = this._poses[1].subGeometries[subMesh._index] || subMesh.subGeometry;
            vertexSubGeom.updateVertexData1(subGeom.vertexPositionData.concat());
        }

		/**
		 * 设置空姿势
		 * @param renderable		渲染对象
		 */
        private setNullPose(renderable: IRenderable) {
            var subMesh: SubMesh = as(renderable, MeshRenderable).subMesh;

            var subGeom: SubGeometry = subMesh.subGeometry;
        }

        public addOwner(mesh: Mesh) {
            var geometry: Geometry = mesh.geometry;

            var i: number;
            var subGeometry: SubGeometry;
            for (i = 0; i < geometry.subGeometries.length; i++) {
                subGeometry = geometry.subGeometries[i] as SubGeometry;
                subGeometry.getOrCreateComponentByClass(VertexSubGeometry);
            }

            super.addOwner(mesh);
        }
    }
}
