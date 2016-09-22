module feng3d {

	/**
	 * 渲染程序缓存
	 * @author feng 2014-8-14
	 */
    export class ProgramBuffer extends Context3DBuffer {
        private bufferItemDic = new Map<Context3D, Program3D>();

        public vertexCode: string;
        public fragmentCode: string;

        /** 是否无效 */
        private bufferInvalid: boolean = true;

        /** 使用到的数据寄存器 */
        public dataRegisterDic;

		/**
		 * 创建一个渲染程序缓存
		 * @param dataTypeId 		数据缓存编号
		 * @param updateFunc 		更新回调函数
		 */
        constructor(dataTypeId: string, updateFunc: Function) {
            super(dataTypeId, updateFunc);
        }

		/**
		 * @inheritDoc
		 */
        protected doUpdateFunc() {
            if (this._updateFunc != null && this._dataDirty) {
                ShaderRegisterCache.invalid();
                this._updateFunc(this);
                this._dataDirty = false;
                this.dataRegisterDic = ShaderRegisterCache.instance.dataRegisterDic;
            }
        }

        public doBuffer(context3D: Context3D) {
            this.doUpdateFunc();

            var program3D: Program3D;

            if (this.bufferInvalid) {
                this.bufferItemDic.getKeys().forEach(key => {
                    var contextTemp: Context3D = key as Context3D;
                    AGALProgram3DCache.getInstance(contextTemp).freeProgram3D(this.bufferItemDic.get(contextTemp));
                });

                this.bufferItemDic.clear();
                this.bufferInvalid = false;
            }

            var oldProgram3D: Program3D = this.bufferItemDic.get(context3D);
            program3D = AGALProgram3DCache.getInstance(context3D).getProgram3D(oldProgram3D, this.vertexCode, this.fragmentCode);
            this.bufferItemDic.push(context3D, program3D);

            context3D.setProgram(program3D);
        }

        public update(vertexCode: string, fragmentCode: string) {
            this.bufferInvalid = true;
            this.vertexCode = vertexCode;
            this.fragmentCode = fragmentCode;
        }
    }
}
