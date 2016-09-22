module feng3d {

	/**
	 * 3d环境缓存类型管理者
	 * @author feng 2014-9-3
	 */
    export class Context3DBufferTypeManager {
        private static NAME_REGEXP: string = "[a-zA-Z0-9$]";

        /** 缓存类型字典 */
        private bufferTypeDic;

        private typeClassDic;

        /** 实例 */
        private static _instance: Context3DBufferTypeManager;

        private static config = [ //
            ["blendFactors", BlendFactorsBuffer], //
            ["culling", CullingBuffer], //
            ["depthTest", DepthTestBuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_fc_bytes", FCByteArrayBuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_fc_matrix", FCMatrixBuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_fc_vector", FCVectorBuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_fs_array", FSArrayBuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_fs", FSBuffer], //
            ["index", IndexBuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_oc", OCBuffer], //
            ["program", ProgramBuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_va_([1-4x])", VABuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_vc_bytes", VCByteArrayBuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_vc_matrix", VCMatrixBuffer], //
            ["(" + Context3DBufferTypeManager.NAME_REGEXP + "+)?_vc_vector", VCVectorBuffer], //
        ];

		/**
		 * 创建3d环境缓存类型管理者
		 */
        constructor() {
            if (Context3DBufferTypeManager._instance)
                throw new Error("单例模式");
            Context3DBufferTypeManager._instance = this;
            this.bufferTypeDic = {};
            this.typeClassDic = {};
        }

		/**
		 * 3d环境缓存类型管理者实例
		 */
        private static get instance(): Context3DBufferTypeManager {
            return Context3DBufferTypeManager._instance || new Context3DBufferTypeManager();
        }

		/**
		 * 获取或创建3d缓存类型
		 * @param typeId 		3d缓存类型编号
		 * @return				3d缓存类型实例
		 */
        public static getBufferType(typeId: string): Context3DBufferType {
            return Context3DBufferTypeManager.instance.getBufferType(typeId);
        }

		/**
		 * 获取3d缓存类定义
		 * @param typeId 		3d缓存类型编号
		 * @return				3d缓存类定义
		 */
        public static getBufferClass(typeId: string) {
            return Context3DBufferTypeManager.instance.getBufferClass(typeId);
        }

		/**
		 * 获取或创建3d缓存类型
		 * @param typeId 		3d缓存类型编号
		 * @return				3d缓存类型实例
		 */
        public getBufferType(typeId: string): Context3DBufferType {
            var bufferType: Context3DBufferType = this.bufferTypeDic[typeId];

            if (bufferType)
                return bufferType;

            this.bufferTypeDic[typeId] = bufferType = new Context3DBufferType();

            var types = typeId.split("_");
            bufferType.registerType = types[1];
            bufferType.dataType = types[2];

            return bufferType;
        }

		/**
		 * 获取3d缓存类定义
		 * @param typeId 		3d缓存类型编号
		 * @return				3d缓存类定义
		 */
        public getBufferClass(typeId: string) {
            var cls = this.typeClassDic[typeId];
            if (cls == null) {
                for (var i: number = 0; i < Context3DBufferTypeManager.config.length; i++) {
                    var result = typeId.match(as(Context3DBufferTypeManager.config[i][0], String));
                    if (result != null && result.input == result[0]) {
                        return Context3DBufferTypeManager.config[i][1];
                    }
                }
            }
            throw new Error("无法为" + typeId + "匹配到3d缓存类");
        }
    }
}
