module feng3d {

	/**
	 * 平面阴影映射通道
	 * @author feng 2015-5-29
	 */
    export class PlanarShadowPass extends MaterialPassBase {
		/**
		 * 物体投影变换矩阵（模型空间坐标-->GPU空间坐标）
		 */
        private modelViewProjection: Matrix3D = new Matrix3D();

		/**
		 * 阴影颜色
		 */
        private shadowColorCommonsData: number[] = [0, 0, 0, 0];

        public static groundY: number = 50;

		/**
		 * 创建深度映射通道
		 */
        constructor() {
            super();
            this.shadowColorCommonsData = [1, 0, 0, 1];
        }

		/**
		 * @inheritDoc
		 */
        protected initBuffers() {
            super.initBuffers();
            this.context3DBufferOwner.mapContext3DBuffer(this._.projection_vc_matrix, this.updateProjectionBuffer);
            this.context3DBufferOwner.mapContext3DBuffer(this._.shadowColorCommonsData_fc_vector, this.updateShadowColorCommonsDataBuffer);
        }

		/**
		 * 更新投影矩阵缓冲
		 * @param projectionBuffer		投影矩阵缓冲
		 */
        protected updateProjectionBuffer(projectionBuffer: VCMatrixBuffer) {
            projectionBuffer.update(this.modelViewProjection, true);
        }

		/**
		 * 更新阴影颜色常数
		 * @param fcVectorBuffer
		 */
        protected updateShadowColorCommonsDataBuffer(fcVectorBuffer: FCVectorBuffer) {
            fcVectorBuffer.update(this.shadowColorCommonsData);
        }

		/**
		 * @inheritDoc
		 */
        public render(renderable: IRenderable, stage3DProxy: Stage3DProxy, camera: Camera3D, renderIndex: number) {
            //场景变换矩阵（物体坐标-->世界坐标）
            var sceneTransform: Matrix3D = renderable.sourceEntity.getRenderSceneTransform(camera);

            var shadowMatrix3D: Matrix3D = this.getShadowMatrix3D();

            //投影矩阵（世界坐标-->投影坐标）
            var projectionmatrix: Matrix3D = camera.viewProjection;

            //物体投影变换矩阵
            this.modelViewProjection.identity();
            this.modelViewProjection.append(sceneTransform);
            this.modelViewProjection.append(shadowMatrix3D);
            this.modelViewProjection.append(projectionmatrix);

            super.render(renderable, stage3DProxy, camera, renderIndex)
        }

		/**
		 * 参考《实时阴影技术》P22
		 * @return 平面投影矩阵
		 */
        private getShadowMatrix3D(): Matrix3D {
            var _sunVector3D: Vector3D = new Vector3D(0, 10000, 0); //太阳的方向

            var l: Vector3D = _sunVector3D.clone();
            var n: Vector3D = new Vector3D(0, 1, 0);
            var nl: number = n.dotProduct(l);
            var d: number = -PlanarShadowPass.groundY;

            var mat1: Matrix3D = new Matrix3D( //
                [//
                    nl + d - n.x * l.x, -n.y * l.x, -n.z * l.x, -d * l.x, //
                    -n.x * l.y, nl + d - n.y * l.y, -n.z * l.y, -d * l.y, //
                    -n.x * l.y, -n.y * l.z, nl + d - n.z * l.z, -d * l.z, //
                    -n.x, -n.y, -n.z, nl //
                ]
                //
            );
            mat1.transpose();
            return mat1;
        }

		/**
		 * @inheritDoc
		 */
        public updateProgramBuffer(programBuffer: ProgramBuffer) {
            var result: FagalShaderResult = FagalRE.runShader(V_Main_PlanarShadow, F_Main_PlanarShadow);

            //上传程序
            programBuffer.update(result.vertexCode, result.fragmentCode);
        }
    }
}
