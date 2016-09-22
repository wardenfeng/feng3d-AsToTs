module feng3d {

	/**
	 * 点灯光
	 * @author feng 2014-10-9
	 */
    export class PointLight extends LightBase {
        public _radius: number = 90000;
        public _fallOff: number = 100000;
        public _fallOffFactor: number;

        constructor() {
            super();
            this._fallOffFactor = 1 / (this._fallOff * this._fallOff - this._radius * this._radius);
        }

		/**
		 * 灯光可照射的最小距离
		 */
        public get radius(): number {
            return this._radius;
        }

        public set radius(value: number) {
            this._radius = value;
            if (this._radius < 0)
                this._radius = 0;
            else if (this._radius > this._fallOff) {
                this._fallOff = this._radius;
                this.invalidateBounds();
            }

            this._fallOffFactor = 1 / (this._fallOff * this._fallOff - this._radius * this._radius);
        }

		/**
		 * 灯光可照射的最大距离
		 */
        public get fallOff(): number {
            return this._fallOff;
        }

        public set fallOff(value: number) {
            this._fallOff = value;
            if (this._fallOff < 0)
                this._fallOff = 0;
            if (this._fallOff < this._radius)
                this._radius = this._fallOff;
            this._fallOffFactor = 1 / (this._fallOff * this._fallOff - this._radius * this._radius);
            this.invalidateBounds();
        }

		/**
		 * @inheritDoc
		 */
        protected createEntityPartitionNode(): EntityNode {
            return new PointLightNode(this);
        }

		/**
		 * @inheritDoc
		 */
        protected updateBounds() {
            //			super.updateBounds();
            //			this._bounds.fromExtremes(-this._fallOff, -this._fallOff, -this._fallOff, this._fallOff, this._fallOff, this._fallOff);
            this._bounds.fromSphere(new Vector3D(), this._fallOff);
            this._boundsInvalid = false;
        }

        protected createShadowMapper(): ShadowMapperBase {

            return null;
        }

        public getObjectProjectionMatrix(renderable: IRenderable, target: Matrix3D): Matrix3D {
            return null;

        }
    }

}
