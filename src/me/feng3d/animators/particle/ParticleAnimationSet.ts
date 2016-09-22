module feng3d {
	/**
	 * 粒子动画set
	 * @author feng 2014-11-13
	 */
    export class ParticleAnimationSet extends AnimationSetBase implements IAnimationSet {
		/**
		 * 颜色优先级
		 */
        public static COLOR_PRIORITY: number = 18;

        /** 所有粒子动画都需要的时间节点 */
        private _timeNode: ParticleTimeNode;

        private _particleNodes: ParticleNodeBase[] = [];
        private _localStaticNodes: ParticleNodeBase[] = [];

        /** 初始化粒子函数 */
        public initParticleFunc: Function;

        /** 是否为广告牌 */
        public hasBillboard: boolean;

        /** 动画节点列表 */
        private _effects: ParticleNodeBase[] = [];
        /** 动画名称列表 */
        private _effectNames: string[] = [];
        /** 动画字典 */
        private _effectDictionary = {};

        private _usesDuration: boolean = false;
        private _usesLooping: boolean = false;
        private _usesDelay: boolean = false;

		/**
		 * 创建一个粒子动画集合
		 * @param usesDuration	是否持续
		 * @param usesLooping	是否循环
		 * @param usesDelay		是否延时
		 */
        constructor(usesDuration: boolean = false, usesLooping: boolean = false, usesDelay: boolean = false) {
            super();
            this._usesDuration = usesDuration;
            this._usesLooping = usesLooping;
            this._usesDelay = usesDelay;

            //自动添加一个粒子的时间节点
            this.addParticleEffect(this._timeNode = new ParticleTimeNode());
        }

		/**
		 * 粒子节点列表
		 */
        public get particleNodes(): ParticleNodeBase[] {
            return this._particleNodes;
        }

		/**
		 * 添加粒子特效
		 * @param node
		 */
        public addParticleEffect(node: ParticleNodeBase) {
            var i: number;
            if (node.mode == ParticlePropertiesMode.LOCAL_STATIC) {
                this._localStaticNodes.push(node);
            }

            for (i = this._particleNodes.length - 1; i >= 0; i--) {
                if (this._particleNodes[i].priority <= node.priority)
                    break;
            }

            this._particleNodes.splice(i + 1, 0, node);

            this._effectDictionary[node.name] = node;

            this._effects.push(node);
            this.context3DBufferOwner.addChildBufferOwner(node.context3DBufferOwner);

            this._effectNames.push(node.name);
        }

		/**
		 * @inheritDoc
		 */
        public activate(shaderParams: ShaderParams, pass: MaterialPassBase) {
            var particleShaderParams: ParticleShaderParams = shaderParams.getOrCreateComponentByClass(ParticleShaderParams);

            particleShaderParams.usesDuration = this._usesDuration;
            particleShaderParams.usesLooping = this._usesLooping;
            particleShaderParams.usesDelay = this._usesDelay;

            for (var i: number = 0; i < this._effects.length; i++) {
                this._effects[i].processAnimationSetting(shaderParams);
            }

            var animationShaderParams: AnimationShaderParams = shaderParams.getOrCreateComponentByClass(AnimationShaderParams);
            animationShaderParams.animationType = AnimationType.PARTICLE;
        }

		/**
		 * 生成粒子动画数据
		 * @param mesh
		 */
        public generateAnimationSubGeometries(mesh: Mesh) {
            if (this.initParticleFunc == null)
                throw (new Error("no this.initParticleFunc set"));

            var geometry: ParticleGeometry = mesh.geometry as ParticleGeometry;

            if (!geometry)
                throw (new Error("Particle animation can only be performed on a ParticleGeometry object"));

            var i: number;
            var particleSubGeometry: AnimationSubGeometry;
            var subGeometry: SubGeometry;
            var localNode: ParticleNodeBase;

            //注册顶点数据
            mesh.subMeshes.forEach(subMesh => {
                particleSubGeometry = new AnimationSubGeometry();
                //遍历静态本地节点
                this._localStaticNodes.forEach(localNode => {
                    particleSubGeometry.mapVABuffer(localNode.getVaId(), localNode.getVaLen());
                });
                particleSubGeometry.numVertices = subMesh.subGeometry.numVertices;
                subMesh.animationSubGeometry = particleSubGeometry;
            });

            //粒子数据
            var particles: ParticleData[] = geometry.particles;
            //粒子数量
            var numParticles: number = geometry.numParticles;
            //粒子属性
            var particleProperties: ParticleProperties = new ParticleProperties();
            var particle: ParticleData;

            var counterForVertex: number;
            var counterForOneData: number;
            var oneData: number[];
            var numVertices: number;
            var vertexOffset: number;

            //设置默认数据
            particleProperties.total = numParticles;
            particleProperties.startTime = 0;
            particleProperties.duration = 1000;
            particleProperties.delay = 0.1;

            i = 0;
            while (i < numParticles) {
                particleProperties.index = i;
                particle = particles[i];

                //调用函数初始化粒子属性
                this.initParticleFunc(particleProperties);

                //创建本地节点粒子属性
                this._localStaticNodes.forEach(localNode => {
                    localNode.generatePropertyOfOneParticle(particleProperties);
                });

                for (var i = 0; i < mesh.subMeshes.length; i++) {
                    var subMesh = mesh.subMeshes[i];
                    if (subMesh.subGeometry == particle.subGeometry) {
                        particleSubGeometry = subMesh.animationSubGeometry;
                        break;
                    }
                }

                numVertices = particle.numVertices;

                //遍历静态本地节点
                this._localStaticNodes.forEach(localNode => {

                    oneData = localNode.oneData;

                    /** 粒子所在子几何体的顶点位置 */
                    var startVertexIndex: number = particle.startVertexIndex;
                    var vaData: number[] = particleSubGeometry.getVAData(localNode.getVaId());
                    var vaLen: number = particleSubGeometry.getVALen(localNode.getVaId());

                    //收集该粒子的每个顶点数据
                    for (var j: number = 0; j < numVertices; j++) {
                        vertexOffset = (startVertexIndex + j) * vaLen;

                        for (counterForOneData = 0; counterForOneData < vaLen; counterForOneData++)
                            vaData[vertexOffset + counterForOneData] = oneData[counterForOneData];
                    }
                });

                //下一个粒子
                i++;
            }
        }

		/**
		 * 设置渲染状态
		 * @param renderable		可渲染对象
		 * @param camera			摄像机
		 */
        public setRenderState(renderable: IRenderable, camera: Camera3D) {
            for (var i: number = 0; i < this._particleNodes.length; i++) {
                this._particleNodes[i].setRenderState(renderable, camera);
            }
        }
    }
}
