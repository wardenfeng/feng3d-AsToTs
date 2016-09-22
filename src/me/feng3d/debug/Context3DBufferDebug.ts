module feng3d {

	/**
	 * 3d环境缓存调试工具类
	 * @author feng 2014-9-9
	 */
    export class Context3DBufferDebug {
		/**
		 * 创建3d环境缓存调试工具类
		 */
        constructor() {
        }

		/**
		 * 调试Context3DCache
		 * @param context3DCache			3D环境缓冲
		 * @return							调试信息
		 */
        public static debug(context3DCache: Context3DCache) {
            var debugInfos = [];

            var debugInfoItem: any;
            debugInfoItem = Context3DBufferDebug.debugInfo(context3DCache.programBuffer);
            debugInfos.push(debugInfoItem);

            for (var key in context3DCache.otherBufferDic) {
                if (context3DCache.otherBufferDic.hasOwnProperty(key)) {
                    var context3DDataBuffer: Context3DBuffer = context3DCache.otherBufferDic[key];
                    debugInfoItem = Context3DBufferDebug.debugInfo(context3DDataBuffer);
                    debugInfos.push(debugInfoItem);
                }
            }

            for (var key in context3DCache.runRegBufferList) {
                if (context3DCache.runRegBufferList.hasOwnProperty(key)) {
                    var registerBuffer: RegisterBuffer = context3DCache.runRegBufferList[key];
                    debugInfoItem = Context3DBufferDebug.debugInfo(registerBuffer);
                    debugInfoItem.shaderRegister = registerBuffer.firstRegister.toString();
                    debugInfos.push(debugInfoItem);
                }
            }

            debugInfoItem = Context3DBufferDebug.debugInfo(context3DCache.indexBuffer);
            debugInfos.push(debugInfoItem);

            return debugInfos;
        }

		/**
		 * 调试Context3DCache
		 * @param context3DBuffer			3D环境缓冲
		 * @return							调试信息
		 */
        private static debugInfo(context3DBuffer: Context3DBuffer): any {
            var debugInfoItem: any = { className: getQualifiedClassName(context3DBuffer), constructorParams: [context3DBuffer.dataTypeId, null] };

            var cla = ClassUtils.getClass(context3DBuffer);

            switch (cla) {
                case ProgramBuffer:
                    var programBuffer: ProgramBuffer = context3DBuffer as ProgramBuffer;
                    debugInfoItem.updateParams = [programBuffer.vertexCode, programBuffer.fragmentCode];
                    break;
                case BlendFactorsBuffer:
                    var blendFactorsBuffer: BlendFactorsBuffer = context3DBuffer as BlendFactorsBuffer;
                    debugInfoItem.updateParams = [blendFactorsBuffer.sourceFactor, blendFactorsBuffer.destinationFactor];
                    break;
                case CullingBuffer:
                    var cullingBuffer: CullingBuffer = context3DBuffer as CullingBuffer;
                    debugInfoItem.updateParams = [cullingBuffer.triangleFaceToCull];
                    break;
                case DepthTestBuffer:
                    var depthTestBuffer: DepthTestBuffer = context3DBuffer as DepthTestBuffer;
                    debugInfoItem.updateParams = [depthTestBuffer.depthMask, depthTestBuffer.passCompareMode];
                    break;
                case FCMatrixBuffer:
                    var fcMatrixBuffer: FCMatrixBuffer = context3DBuffer as FCMatrixBuffer;
                    debugInfoItem.updateParams = [fcMatrixBuffer.matrix, fcMatrixBuffer.transposedMatrix];
                    break;
                case FCVectorBuffer:
                    var fcVectorBuffer: FCVectorBuffer = context3DBuffer as FCVectorBuffer;
                    debugInfoItem.updateParams = [fcVectorBuffer.data, fcVectorBuffer.numRegisters];
                    break;
                case FSBuffer:
                    var fsBuffer: FSBuffer = context3DBuffer as FSBuffer;
                    debugInfoItem.updateParams = [fsBuffer.texture];
                    break;
                case IndexBuffer:
                    var indexBuffer: IndexBuffer = context3DBuffer as IndexBuffer;
                    debugInfoItem.updateParams = [indexBuffer.data, indexBuffer.numIndices, indexBuffer.count, indexBuffer.firstIndex, indexBuffer.numTriangles];
                    break;
                case VABuffer:
                    var vaBuffer: VABuffer = context3DBuffer as VABuffer;
                    debugInfoItem.updateParams = [vaBuffer.dataBuffer.data, vaBuffer.dataBuffer.numVertices, vaBuffer.dataBuffer.data32PerVertex];
                    break;
                case VCMatrixBuffer:
                    var vcMatrixBuffer: VCMatrixBuffer = context3DBuffer as VCMatrixBuffer;
                    debugInfoItem.updateParams = [vcMatrixBuffer.matrix, vcMatrixBuffer.transposedMatrix];
                    break;
                case VCVectorBuffer:
                    var vcVectorBuffer: VCVectorBuffer = context3DBuffer as VCVectorBuffer;
                    debugInfoItem.updateParams = [vcVectorBuffer.data, vcVectorBuffer.numRegisters];
                    break;
                default:
                    throw new Error("无法处理类型：" + cla);
            }

            //编码参数
            ClassUtils.encodeParams(debugInfoItem.updateParams);
            return debugInfoItem;
        }

		/**
		 * 获取Context3DCache
		 * @param obj				3D环境数据
		 * @return					3D环境实例
		 */
        public static getContext3DCache(obj: Object): Context3DCache {
            var context3DCache: Context3DCache = new Context3DCache();

            var arr = as(obj, Array);
            for (var i: number = 0; i < arr.length; i++) {
                var item: any = arr[i];
                var cla = ClassUtils.getClass(item.className);
                var buff: Context3DBuffer = ClassUtils.structureInstance(cla, item.constructorParams);
                ClassUtils.decodeParams(item.updateParams);
                ClassUtils.call(buff, "update", item.updateParams);
                context3DCache.addDataBuffer(buff);

                if (is(buff, RegisterBuffer)) {
                    var regBuff: RegisterBuffer = buff as RegisterBuffer;
                    var regStr: string = item.shaderRegister
                    var myPattern: RegExp = /([a-z]+)(\d+)/;
                    var result = myPattern.exec(regStr);
                    //-------------------
                    regBuff.firstRegister = Number(result[2]);

                    if (context3DCache.runRegBufferList == null) {
                        context3DCache.runRegBufferList = [];
                    }

                    context3DCache.runRegBufferList.push(buff);
                }

            }
            return context3DCache;
        }
    }
}
