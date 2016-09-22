module feng3d {

	/**
	 * 蒙皮子网格
	 * 提供了关节 索引数据与权重数据
	 */
    export class SkinnedSubGeometry extends SubGeometryComponent {
        private _jointsPerVertex: number;

		/**
		 * 创建蒙皮子网格
		 */
        constructor(jointsPerVertex: number) {
            super();
            this._jointsPerVertex = jointsPerVertex;
        }

		/**
		 * 处理被添加事件
		 * @param event
		 */
        protected onBeAddedComponet(event: ComponentEvent) {
            super.onBeAddedComponet(event);

            this.subGeometry.mapVABuffer(this._.animated_va_3, 3);
            this.subGeometry.mapVABuffer(this._.jointweights_va_x, this._jointsPerVertex);
            this.subGeometry.mapVABuffer(this._.jointindex_va_x, this._jointsPerVertex);
        }

		/**
		 * 更新动画顶点数据
		 */
        public updateAnimatedData(value: number[]) {
            this.subGeometry.setVAData(this._.animated_va_3, value);
        }

		/**
		 * 关节权重数据
		 */
        public get jointWeightsData(): number[] {
            var data: number[] = this.subGeometry.getVAData(this._.jointweights_va_x);
            return data;
        }

		/**
		 * 关节索引数据
		 */
        public get jointIndexData(): number[] {
            var data: number[] = this.subGeometry.getVAData(this._.jointindex_va_x);
            return data;
        }

		/**
		 * 更新关节权重数据
		 */
        public updateJointWeightsData(value: number[]) {
            this.subGeometry.setVAData(this._.jointweights_va_x, value);
        }

		/**
		 * 更新关节索引数据
		 */
        public updateJointIndexData(value: number[]) {
            this.subGeometry.setVAData(this._.jointindex_va_x, value);
        }
    }
}
