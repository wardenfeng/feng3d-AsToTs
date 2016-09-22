module feng3d {

	/**
	 * 寄存器矩阵
	 * @author feng 2014-11-4
	 */
    export class RegisterMatrix extends RegisterArray {
		/**
		 *
		 * @param regId
		 */
        constructor(regId: string) {
            super(regId);

            this.regLen = 4;
        }

		/**
		 * @inheritDoc
		 */
        public clear() {
            this.regLen = 4;
            this.index = -1;
        }


    }
}
