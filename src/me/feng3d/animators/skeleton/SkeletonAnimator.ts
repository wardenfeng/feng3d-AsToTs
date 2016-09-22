module feng3d {
	/**
	 * 骨骼动画
	 * @author feng 2014-5-27
	 */
    export class SkeletonAnimator extends AnimatorBase {
        private _globalMatrices: number[] = [];
        private _globalPose: SkeletonPose = new SkeletonPose();
        private _globalPropertiesDirty: boolean;
        private _numJoints: number;
        private _animationStates1 = new Map<SubGeometry, SubGeomAnimationState>();

        private _skeleton: Skeleton;
        private _forceCPU: boolean;
        private _jointsPerVertex: number;
        private _activeSkeletonState: ISkeletonAnimationState;

		/**
		 * 当前骨骼姿势的全局矩阵
		 * @see #globalPose
		 */
        public get globalMatrices(): number[] {
            if (this._globalPropertiesDirty)
                this.updateGlobalProperties();

            return this._globalMatrices;
        }

		/**
		 * 当前全局骨骼姿势
		 */
        public get globalPose(): SkeletonPose {
            if (this._globalPropertiesDirty)
                this.updateGlobalProperties();

            return this._globalPose;
        }

		/**
		 * 骨骼
		 */
        public get skeleton(): Skeleton {
            return this._skeleton;
        }

		/**
		 * 是否强行使用cpu
		 */
        public get forceCPU(): boolean {
            return this._forceCPU;
        }

		/**
		 * 创建一个骨骼动画类
		 * @param animationSet 动画集合
		 * @param skeleton 骨骼
		 * @param forceCPU 是否强行使用cpu
		 */
        constructor(animationSet: SkeletonAnimationSet, skeleton: Skeleton, forceCPU: boolean = false) {
            super(animationSet);

            this._skeleton = skeleton;
            this._forceCPU = forceCPU;
            this._jointsPerVertex = animationSet.jointsPerVertex;

            if (this._forceCPU || this._jointsPerVertex > 4)
                this._animationSet.cancelGPUCompatibility();

            animationSet.numJoints = this._skeleton.numJoints;
            this._numJoints = this._skeleton.numJoints;

            this._globalMatrices.length = this._numJoints * 12;

            //初始化骨骼变换矩阵
            var j: number;
            for (var i: number = 0; i < this._numJoints; ++i) {
                this._globalMatrices[j++] = 1;
                this._globalMatrices[j++] = 0;
                this._globalMatrices[j++] = 0;
                this._globalMatrices[j++] = 0;
                this._globalMatrices[j++] = 0;
                this._globalMatrices[j++] = 1;
                this._globalMatrices[j++] = 0;
                this._globalMatrices[j++] = 0;
                this._globalMatrices[j++] = 0;
                this._globalMatrices[j++] = 0;
                this._globalMatrices[j++] = 1;
                this._globalMatrices[j++] = 0;
            }
        }

		/**
		 * @inheritDoc
		 */
        protected initBuffers() {
            super.initBuffers();
            this.context3DBufferOwner.mapContext3DBuffer(this._.globalmatrices_vc_vector, this.updateGlobalmatricesBuffer);
        }

        private updateGlobalmatricesBuffer(globalmatricesBuffer: VCVectorBuffer) {
            globalmatricesBuffer.update(this._globalMatrices);
        }

		/**
		 * 播放动画
		 * @param name 动作名称
		 * @param offset 偏移量
		 */
        public play(name: string, transition: IAnimationTransition = null, offset: number = NaN) {
            if (this._activeAnimationName != name) {
                this._activeAnimationName = name;

                if (!this._animationSet.hasAnimation(name))
                    throw new Error("Animation root node " + name + " not found!");

                if (transition && this._activeNode) {
                    //setup the transition
                    this._activeNode = transition.getAnimationNode(this, this._activeNode, this._animationSet.getAnimation(name), this._absoluteTime);
                    this._activeNode.addEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this.onTransitionComplete);
                }
                else
                    this._activeNode = this._animationSet.getAnimation(name);

                this._activeState = this.getAnimationState(this._activeNode);

                if (this.updatePosition) {
                    //this.update straight away to this.reset position deltas
                    this._activeState.update(this._absoluteTime);
                    this._activeState.positionDelta;
                }

                this._activeSkeletonState = this._activeState as ISkeletonAnimationState;
            }

            this.start();

            //使用时间偏移量处理特殊情况
            if (!isNaN(offset))
                this.reset(name, offset);
        }

		/**
		 * @inheritDoc
		 */
        public setRenderState(renderable: IRenderable, camera: Camera3D) {
            //检查全局变换矩阵
            if (this._globalPropertiesDirty)
                this.updateGlobalProperties();

            var meshRenderable: any = renderable;
            var subGeometry: SubGeometry = meshRenderable.subMesh.subGeometry;

            if (this._animationSet.usesCPU) {
                var subGeomAnimState: SubGeomAnimationState = this._animationStates1.get(subGeometry);
                if (subGeomAnimState == null) {
                    subGeomAnimState = new SubGeomAnimationState(subGeometry);
                    this._animationStates1.push(subGeometry, subGeomAnimState);
                }

                //检查动画数据
                if (subGeomAnimState.dirty) {
                    this.morphGeometry(subGeomAnimState, subGeometry);
                    subGeomAnimState.dirty = false;
                }
                //更新动画数据到几何体
                var skinnedGeom: SkinnedSubGeometry = subGeometry.getOrCreateComponentByClass(SkinnedSubGeometry);
                skinnedGeom.updateAnimatedData(subGeomAnimState.animatedVertexData);
            }
        }

		/**
		 * @inheritDoc
		 */
        protected updateDeltaTime(dt: number) {
            super.updateDeltaTime(dt);

            this.context3DBufferOwner.markBufferDirty(this._.globalmatrices_vc_vector);

            //invalidate pose matrices
            this._globalPropertiesDirty = true;

            this._animationStates1.getKeys().forEach(key => {
                this._animationStates1.get(key).dirty = true;
            });

        }

		/**
		 * 更新骨骼全局变换矩阵
		 */
        private updateGlobalProperties() {
            this._globalPropertiesDirty = false;

            //获取全局骨骼姿势
            this.localToGlobalPose(this._activeSkeletonState.getSkeletonPose(this._skeleton), this._globalPose, this._skeleton);

            //姿势变换矩阵
            //矩阵偏移量
            var mtxOffset: number;
            var globalPoses: JointPose[] = this._globalPose.jointPoses;
            var raw: number[];
            var ox: number, oy: number, oz: number, ow: number;
            var xy2: number, xz2: number, xw2: number;
            var yz2: number, yw2: number, zw2: number;
            var n11: number, n12: number, n13: number;
            var n21: number, n22: number, n23: number;
            var n31: number, n32: number, n33: number;
            var m11: number, m12: number, m13: number, m14: number;
            var m21: number, m22: number, m23: number, m24: number;
            var m31: number, m32: number, m33: number, m34: number;
            var joints: SkeletonJoint[] = this._skeleton.joints;
            var pose: JointPose;
            var quat: Quaternion;
            var vec: Vector3D;
            var t: number;

            //遍历每个关节
            for (var i: number = 0; i < this._numJoints; ++i) {
                //读取关节全局姿势数据
                pose = globalPoses[i];
                quat = pose.orientation;
                vec = pose.translation;
                ox = quat.x;
                oy = quat.y;
                oz = quat.z;
                ow = quat.w;

                //计算关节的全局变换矩阵
                xy2 = (t = 2.0 * ox) * oy;
                xz2 = t * oz;
                xw2 = t * ow;
                yz2 = (t = 2.0 * oy) * oz;
                yw2 = t * ow;
                zw2 = 2.0 * oz * ow;

                yz2 = 2.0 * oy * oz;
                yw2 = 2.0 * oy * ow;
                zw2 = 2.0 * oz * ow;
                ox *= ox;
                oy *= oy;
                oz *= oz;
                ow *= ow;

                //保存关节的全局变换矩阵
                n11 = (t = ox - oy) - oz + ow;
                n12 = xy2 - zw2;
                n13 = xz2 + yw2;
                n21 = xy2 + zw2;
                n22 = -t - oz + ow;
                n23 = yz2 - xw2;
                n31 = xz2 - yw2;
                n32 = yz2 + xw2;
                n33 = -ox - oy + oz + ow;

                //初始状态 下关节的 逆矩阵
                raw = joints[i].inverseBindPose;
                m11 = raw[0];
                m12 = raw[4];
                m13 = raw[8];
                m14 = raw[12];
                m21 = raw[1];
                m22 = raw[5];
                m23 = raw[9];
                m24 = raw[13];
                m31 = raw[2];
                m32 = raw[6];
                m33 = raw[10];
                m34 = raw[14];

                //计算关节全局变换矩阵(通过初始状态 关节逆矩阵与全局变换矩阵 计算 当前状态的关节矩阵)
                this._globalMatrices[mtxOffset] = n11 * m11 + n12 * m21 + n13 * m31;
                this._globalMatrices[mtxOffset + 1] = n11 * m12 + n12 * m22 + n13 * m32;
                this._globalMatrices[mtxOffset + 2] = n11 * m13 + n12 * m23 + n13 * m33;
                this._globalMatrices[mtxOffset + 3] = n11 * m14 + n12 * m24 + n13 * m34 + vec.x;
                this._globalMatrices[mtxOffset + 4] = n21 * m11 + n22 * m21 + n23 * m31;
                this._globalMatrices[mtxOffset + 5] = n21 * m12 + n22 * m22 + n23 * m32;
                this._globalMatrices[mtxOffset + 6] = n21 * m13 + n22 * m23 + n23 * m33;
                this._globalMatrices[mtxOffset + 7] = n21 * m14 + n22 * m24 + n23 * m34 + vec.y;
                this._globalMatrices[mtxOffset + 8] = n31 * m11 + n32 * m21 + n33 * m31;
                this._globalMatrices[mtxOffset + 9] = n31 * m12 + n32 * m22 + n33 * m32;
                this._globalMatrices[mtxOffset + 10] = n31 * m13 + n32 * m23 + n33 * m33;
                this._globalMatrices[mtxOffset + 11] = n31 * m14 + n32 * m24 + n33 * m34 + vec.z;

                //跳到下个矩阵位置
                mtxOffset = mtxOffset + 12;
            }
        }

		/**
		 * 几何体变形
		 * @param state 动画几何体数据
		 * @param subGeom 蒙皮几何体
		 */
        private morphGeometry(state: SubGeomAnimationState, subGeom: SubGeometry) {
            var skinnedGeom: SkinnedSubGeometry = subGeom.getOrCreateComponentByClass(SkinnedSubGeometry);

            //几何体顶点数据
            var vertexData: number[] = subGeom.vertexPositionData;
            //动画顶点数据（目标数据）
            var targetData: number[] = state.animatedVertexData;
            var jointIndices: number[] = skinnedGeom.jointIndexData;
            var jointWeights: number[] = skinnedGeom.jointWeightsData;
            var index: number;
            var j: number, k: number;
            var vx: number, vy: number, vz: number;
            var len: number = vertexData.length;
            var weight: number;
            var vertX: number, vertY: number, vertZ: number;
            var m11: number, m12: number, m13: number, m14: number;
            var m21: number, m22: number, m23: number, m24: number;
            var m31: number, m32: number, m33: number, m34: number;

            //计算每个顶点的坐标，法线、切线
            while (index < len) {
                //提取原始顶点坐标、法线、切线数据
                vertX = vertexData[index];
                vertY = vertexData[index + 1];
                vertZ = vertexData[index + 2];
                vx = 0;
                vy = 0;
                vz = 0;
                k = 0;
                //遍历与该顶点相关的关节权重
                while (k < this._jointsPerVertex) {
                    weight = jointWeights[j];
                    if (weight > 0) {
                        //读取该关节的全局变换矩阵
                        var mtxOffset: number = jointIndices[j++] << 2;
                        m11 = this._globalMatrices[mtxOffset];
                        m12 = this._globalMatrices[mtxOffset + 1];
                        m13 = this._globalMatrices[mtxOffset + 2];
                        m14 = this._globalMatrices[mtxOffset + 3];
                        m21 = this._globalMatrices[mtxOffset + 4];
                        m22 = this._globalMatrices[mtxOffset + 5];
                        m23 = this._globalMatrices[mtxOffset + 6];
                        m24 = this._globalMatrices[mtxOffset + 7];
                        m31 = this._globalMatrices[mtxOffset + 8];
                        m32 = this._globalMatrices[mtxOffset + 9];
                        m33 = this._globalMatrices[mtxOffset + 10];
                        m34 = this._globalMatrices[mtxOffset + 11];
                        //根据关节的全局变换矩阵与对应权重计算出对该坐标的影响值
                        vx += weight * (m11 * vertX + m12 * vertY + m13 * vertZ + m14);
                        vy += weight * (m21 * vertX + m22 * vertY + m23 * vertZ + m24);
                        vz += weight * (m31 * vertX + m32 * vertY + m33 * vertZ + m34);
                        ++k;
                    }
                    else {
                        j += this._jointsPerVertex - k;
                        k = this._jointsPerVertex;
                    }
                }

                //保存最终计算得出的坐标、法线、切线数据
                targetData[index] = vx;
                targetData[index + 1] = vy;
                targetData[index + 2] = vz;

                //跳到下个顶点的起始位置
                index = index + subGeom.vertexPositionStride;
            }
        }

		/**
		 * 本地转换到全局姿势
		 * @param sourcePose 原姿势
		 * @param targetPose 目标姿势
		 * @param skeleton 骨骼
		 */
        protected localToGlobalPose(sourcePose: SkeletonPose, targetPose: SkeletonPose, skeleton: Skeleton) {
            var globalPoses: JointPose[] = targetPose.jointPoses;
            var globalJointPose: JointPose;
            var joints: SkeletonJoint[] = skeleton.joints;
            var len: number = sourcePose.numJointPoses;
            var jointPoses: JointPose[] = sourcePose.jointPoses;
            var parentIndex: number;
            var joint: SkeletonJoint;
            var parentPose: JointPose;
            var pose: JointPose;
            var or: Quaternion;
            var tr: Vector3D;
            var gTra: Vector3D;
            var gOri: Quaternion;

            var x1: number, y1: number, z1: number, w1: number;
            var x2: number, y2: number, z2: number, w2: number;
            var x3: number, y3: number, z3: number;

            //初始化全局骨骼姿势长度
            if (globalPoses.length != len)
                globalPoses.length = len;

            for (var i: number = 0; i < len; ++i) {
                //初始化单个全局骨骼姿势
                if (globalPoses[i] == null) {
                    globalPoses[i] = new JointPose();
                }
                globalJointPose = globalPoses[i];
                joint = joints[i];
                parentIndex = joint.parentIndex;
                pose = jointPoses[i];

                //世界方向偏移
                gOri = globalJointPose.orientation;
                //全局位置偏移
                gTra = globalJointPose.translation;

                //计算全局骨骼的 方向偏移与位置偏移
                if (parentIndex < 0) {
                    //处理跟骨骼(直接赋值)
                    tr = pose.translation;
                    or = pose.orientation;
                    gOri.x = or.x;
                    gOri.y = or.y;
                    gOri.z = or.z;
                    gOri.w = or.w;
                    gTra.x = tr.x;
                    gTra.y = tr.y;
                    gTra.z = tr.z;
                }
                else {
                    //处理其他骨骼

                    //找到父骨骼全局姿势
                    parentPose = globalPoses[parentIndex];

                    or = parentPose.orientation;
                    tr = pose.translation;
                    //提取父姿势的世界方向数据
                    x2 = or.x;
                    y2 = or.y;
                    z2 = or.z;
                    w2 = or.w;
                    //提取当前姿势相对父姿势的位置数据
                    x3 = tr.x;
                    y3 = tr.y;
                    z3 = tr.z;

                    //计算当前姿势相对父姿势在全局中的位置偏移方向(有点没搞懂，我只能这么说如果一定要我来计算的话，我一定能做出来)
                    w1 = -x2 * x3 - y2 * y3 - z2 * z3;
                    x1 = w2 * x3 + y2 * z3 - z2 * y3;
                    y1 = w2 * y3 - x2 * z3 + z2 * x3;
                    z1 = w2 * z3 + x2 * y3 - y2 * x3;

                    //计算当前骨骼全局姿势的位置数据（父姿势的世界坐标加上当前姿势相对父姿势转换为全局的坐标变化量）
                    tr = parentPose.translation;
                    gTra.x = -w1 * x2 + x1 * w2 - y1 * z2 + z1 * y2 + tr.x;
                    gTra.y = -w1 * y2 + x1 * z2 + y1 * w2 - z1 * x2 + tr.y;
                    gTra.z = -w1 * z2 - x1 * y2 + y1 * x2 + z1 * w2 + tr.z;

                    //提取父姿势的世界方向数据
                    x1 = or.x;
                    y1 = or.y;
                    z1 = or.z;
                    w1 = or.w;
                    //提取当前姿势相对父姿势的方向数据
                    or = pose.orientation;
                    x2 = or.x;
                    y2 = or.y;
                    z2 = or.z;
                    w2 = or.w;

                    //根据父姿势的世界方向数据与当前姿势的方向数据计算当前姿势的世界方向数据
                    gOri.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                    gOri.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
                    gOri.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
                    gOri.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
                }
            }
        }

		/**
		 * 处理动画变换完成时间
		 */
        private onTransitionComplete(event: AnimationStateEvent) {
            if (event.type == AnimationStateEvent.TRANSITION_COMPLETE) {
                event.animationNode.removeEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this.onTransitionComplete);
                if (this._activeState == event.animationState) {
                    this._activeNode = this._animationSet.getAnimation(this._activeAnimationName);
                    this._activeState = this.getAnimationState(this._activeNode);
                    this._activeSkeletonState = this._activeState as ISkeletonAnimationState;
                }
            }
        }

    }
    
    /**
     * 动画状态几何体数据
     */
    class SubGeomAnimationState {
        /**
         * 动画顶点数据
         */
        public animatedVertexData: number[];
        public dirty: boolean = true;

        /**
         * 创建一个动画当前状态的数据类(用来保存动画顶点数据)
         */
        constructor(subGeom: SubGeometry) {
            this.animatedVertexData = subGeom.vertexPositionData.concat();
        }
    }
}





