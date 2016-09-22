module feng3d {


	/**
	 * 单个粒子数据
	 * @author feng 2014-12-9
	 */
    export class ParticleData {
        /** 粒子索引 */
        public particleIndex: number;
        /** 该粒子所包含的粒子数量 */
        public numVertices: number;
        /** 粒子所在子几何体的顶点位置 */
        public startVertexIndex: number;
        /** 粒子子几何体 */
        public subGeometry: SubGeometry;

        constructor() {

        }
    }

}
