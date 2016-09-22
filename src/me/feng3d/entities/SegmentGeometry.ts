module feng3d {

	/**
	 *
	 * @author feng 2015-12-30
	 */
    export class SegmentGeometry extends Geometry {
        private _segments: Segment[] = [];

        constructor() {
            super();
        }

		/**
		 * 添加线段
		 * @param segment		线段数据
		 */
        public addSegment(segment: Segment, needUpdateGeometry: boolean = true) {
            this._segments.push(segment);

            if (needUpdateGeometry) {
                this.updateGeometry();
            }
        }

        public updateGeometry() {
            this.removeAllSubGeometry();

            var _segmentSubGeometry: SegmentSubGeometry = SegmentUtils.getSegmentSubGeometrys(this._segments);
            this.addSubGeometry(_segmentSubGeometry);
        }

		/**
		 * 获取线段数据
		 * @param index 		线段索引
		 * @return				线段数据
		 */
        public getSegment(index: number): Segment {
            if (index < this._segments.length)
                return this._segments[index];
            return null;
        }

		/**
		 * 移除所有线段
		 */
        public removeAllSegments() {
            this.segments.length = 0;

            this.removeAllSubGeometry();
        }

		/**
		 * 线段列表
		 */
        public get segments(): Segment[] {
            return this._segments;
        }
    }
}
