module feng3d {

	/**
	 * 顶点
	 */
    export class Vertex {
        private _x: number;
        private _y: number;
        private _z: number;
        private _index: number;

		/**
		 *
		 * @param x X轴坐标
		 * @param y Y轴坐标
		 * @param z Z轴坐标
		 * @param index 顶点索引
		 */
        constructor(x: number = 0, y: number = 0, z: number = 0, index: number = 0) {
            this._x = x;
            this._y = y;
            this._z = z;
            this._index = index;
        }

		/**
		 * To define/store the index of value object
		 * @param    ind        The index
		 */
        public set index(ind: number) {
            this._index = ind;
        }

        public get index(): number {
            return this._index;
        }

        public get x(): number {
            return this._x;
        }

        public set x(value: number) {
            this._x = value;
        }

        public get y(): number {
            return this._y;
        }

        public set y(value: number) {
            this._y = value;
        }

        public get z(): number {
            return this._z;
        }

        public set z(value: number) {
            this._z = value;
        }

        public clone(): Vertex {
            return new Vertex(this._x, this._y, this._z);
        }

        public toString(): string {
            return this._x + "," + this._y + "," + this._z;
        }

    }
}
