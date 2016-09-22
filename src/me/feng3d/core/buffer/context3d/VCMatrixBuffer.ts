module feng3d {

	/**
	 * Context3D 顶点矩阵常量数据缓存
	 * @author feng 2014-8-20
	 */
    export class VCMatrixBuffer extends ConstantsBuffer {
        /** 静态矩阵数据 */
        public matrix: Matrix3D;

        /** transposedMatrix 如果为 true，则将按颠倒顺序将矩阵条目复制到寄存器中。默认值为 false。 */
        public transposedMatrix: boolean;

		/**
		 * 创建顶点矩阵常量数据缓存
		 * @param dataTypeId 		数据编号
		 * @param updateFunc 		数据更新回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }

		/**
		 * @inheritDoc
		 */
        public doBuffer(context3D: Context3D) {
            this.doUpdateFunc();

            context3D.setProgramConstantsFromMatrix(Context3DProgramType.VERTEX, this.firstRegister, this.matrix, this.transposedMatrix);
        }

		/**
		 * 更新数据
		 * @param matrix					静态矩阵数据
		 * @param transposedMatrix			如果为 true，则将按颠倒顺序将矩阵条目复制到寄存器中。默认值为 false。
		 */
        public update(matrix: Matrix3D, transposedMatrix: boolean = false) {
            this.matrix = matrix;
            this.transposedMatrix = transposedMatrix;
        }
    }
}
