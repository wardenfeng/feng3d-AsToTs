module feng3d {


	/**
	 * 顶点动画 子网格
	 * @author feng 2014-8-28
	 */
    export class VertexSubGeometry extends SubGeometryComponent {
        constructor() {
            super();
        }

		/**
		 * 处理被添加事件
		 * @param event
		 */
        protected onBeAddedComponet(event: ComponentEvent) {
            super.onBeAddedComponet(event);

            this.subGeometry.mapVABuffer(this._.position0_va_3, 3);
            this.subGeometry.mapVABuffer(this._.position1_va_3, 3);

            this.updateVertexData0(this.subGeometry.vertexPositionData.concat());
            this.updateVertexData1(this.subGeometry.vertexPositionData.concat());
        }

        public updateVertexData0(vertices: number[]) {
            this.subGeometry.updateVertexPositionData(vertices);
            this.subGeometry.setVAData(this._.position0_va_3, vertices);
        }

        public updateVertexData1(vertices: number[]) {
            this.subGeometry.setVAData(this._.position1_va_3, vertices);
        }
    }
}
