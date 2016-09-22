module feng3d {



	/**
	 * 线段渲染数据缓存
	 * @author feng 2014-5-9
	 */
    export class SegmentSubGeometry extends SubGeometry {
        constructor() {
            super();
        }

        protected initBuffers() {
            super.initBuffers();

            this.mapVABuffer(this._.segmentStart_va_3, 3);
            this.mapVABuffer(this._.segmentEnd_va_3, 3);
            this.mapVABuffer(this._.segmentThickness_va_1, 1);
            this.mapVABuffer(this._.segmentColor_va_4, 4);
        }

        public get vertexPositionData(): number[] {
            return this.pointData0;
        }

        public get pointData0(): number[] {
            var data: number[] = this.getVAData(this._.segmentStart_va_3);
            return data;
        }

        public get pointData1(): number[] {
            var data: number[] = this.getVAData(this._.segmentEnd_va_3);
            return data;
        }

        public get thicknessData(): number[] {
            var data: number[] = this.getVAData(this._.segmentThickness_va_1);
            return data;
        }

        public get colorData(): number[] {
            var data: number[] = this.getVAData(this._.segmentColor_va_4);
            return data;
        }

        public get pointData0Stride(): number {
            return 3;
        }

        public get pointData1Stride(): number {
            return 3;
        }

        public get thicknessDataStride(): number {
            return 1;
        }

        public get colorDataStride(): number {
            return 4;
        }

        public updatePointData0(value: number[]) {
            this.setVAData(this._.segmentStart_va_3, value);
        }

        public updatePointData1(value: number[]) {
            this.setVAData(this._.segmentEnd_va_3, value);
        }

        public updateThicknessData(value: number[]) {
            this.setVAData(this._.segmentThickness_va_1, value);
        }

        public updateColorData(value: number[]) {
            this.setVAData(this._.segmentColor_va_4, value);
        }

    }
}
