module feng3d
{
	/**
	 * 线段渲染通道
	 * @author feng 2014-4-16
	 */
	export class SegmentPass extends MaterialPassBase
	{
		/**
		 * (1,1,1,1)向量
		 */
		protected static ONE_VECTOR:number[] = [1, 1, 1, 1];

		/**
		 * 正面向量（Z轴负方向）
		 */
		protected static FRONT_VECTOR:number[] = [0, 0, -1, 0];

		/**
		 * 常量数据
		 */
		private constants:number[] = [0,0,0,0];

		/**
		 * 摄像机坐标系到投影坐标系变换矩阵（c：camera，p：projection）
		 */
		private c2pMatrix:Matrix3D = new Matrix3D();
		/**
		 * 模型坐标系到摄像机坐标系变换矩阵（m：model，c：camera）
		 */
		private m2cMatrix:Matrix3D = new Matrix3D();

		private _thickness:number;

		constructor(thickness:number)
		{
			super();
			this._thickness = thickness;
			this.constants[1] = 1 / 255;

		}

		/**
		 * @inheritDoc
		 */
		protected initBuffers()
		{
			super.initBuffers();
			this.context3DBufferOwner.mapContext3DBuffer(this._.segmentC2pMatrix_vc_matrix, this.updateC2pMatrixBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.segmentM2cMatrix_vc_matrix, this.updateM2cMatrixBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.segmentOne_vc_vector, this.updateOneBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.segmentFront_vc_vector, this.updateFrontBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.segmentConstants_vc_vector, this.updateConstantsBuffer);
		}

		private updateConstantsBuffer(constantsBuffer:VCVectorBuffer)
		{
			constantsBuffer.update(this.constants);
		}

		private updateFrontBuffer(frontBuffer:VCVectorBuffer)
		{
			frontBuffer.update(SegmentPass.FRONT_VECTOR);
		}

		private updateOneBuffer(oneBuffer:VCVectorBuffer)
		{
			oneBuffer.update(SegmentPass.ONE_VECTOR);
		}

		private updateC2pMatrixBuffer(c2pMatrixBuffer:VCMatrixBuffer)
		{
			//设置摄像机投影矩阵
			c2pMatrixBuffer.update(this.c2pMatrix, true);
		}

		private updateM2cMatrixBuffer(m2cMatrixBuffer:VCMatrixBuffer)
		{
			//设置投影矩阵
			m2cMatrixBuffer.update(this.m2cMatrix, true);
		}

		/**
		 * @inheritDoc
		 */
		public updateProgramBuffer(programBuffer:ProgramBuffer)
		{
			var result:FagalShaderResult = FagalRE.runShader(V_Segment, F_Segment);

			//上传程序
			programBuffer.update(result.vertexCode, result.fragmentCode);
		}

		/**
		 * @inheritDoc
		 */
		protected updateConstantData(renderable:IRenderable, camera:Camera3D)
		{
			super.updateConstantData(renderable, camera);

			//线段厚度
			this.constants[0] = this._thickness / 512;

			//摄像机最近距离
			this.constants[2] = camera.lens.near;

			//
			this.m2cMatrix.copyFrom(renderable.sourceEntity.sceneTransform);
			this.m2cMatrix.append(camera.inverseSceneTransform);

			this.c2pMatrix.copyFrom(camera.lens.matrix);
		}
	}
}
