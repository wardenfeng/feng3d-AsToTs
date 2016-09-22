module feng3d {



	/**
	 * Face value object.
	 */
    export class Face {
        private static _calcPoint: Point = new Point();

        private _vertices: number[];
        private _uvs: number[];
        private _faceIndex: number;
        private _v0Index: number;
        private _v1Index: number;
        private _v2Index: number;
        private _uv0Index: number;
        private _uv1Index: number;
        private _uv2Index: number;

		/**
		 * Creates a new <code>Face</code> value object.
		 *
		 * @param    vertices        [optional] 9 entries long Vector.&lt;number&gt; representing the x, y and z of v0, v1, and v2 of a face
		 * @param    uvs            [optional] 6 entries long Vector.&lt;number&gt; representing the u and v of uv0, uv1, and uv2 of a face
		 */
        constructor(vertices: number[] = null, uvs: number[] = null) {
            this._vertices = vertices
            if (this._vertices == null)
                this._vertices = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
            this._uvs = uvs;
            if (this._uvs == null)
                this._uvs = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        }

        //uvs
		/**
		 * To set uv values for either uv0, uv1 or uv2.
		 * @param    index        The id of the uv (0, 1 or 2)
		 * @param    u            The horizontal coordinate of the texture value.
		 * @param    v            The vertical coordinate of the texture value.
		 */
        public setUVat(index: number, u: number, v: number) {
            var ind: number = (index * 2);
            this._uvs[ind] = u;
            this._uvs[ind + 1] = v;
        }

		/**
		 * To store a temp index of a face during a loop
		 * @param    ind        The index
		 */
        public set faceIndex(ind: number) {
            this._faceIndex = ind;
        }

		/**
		 * @return            Returns the tmp index set for this Face object
		 */
        public get faceIndex(): number {
            return this._faceIndex;
        }

        //uv0
		/**
		 * the index set for uv0 in this Face value object
		 * @param    ind        The index
		 */
        public set uv0Index(ind: number) {
            this._uv0Index = ind;
        }

		/**
		 * @return return the index set for uv0 in this Face value object
		 */
        public get uv0Index(): number {
            return this._uv0Index;
        }

		/**
		 * uv0 u and v values
		 * @param    u        The u value
		 * @param    v        The v value
		 */
        public setUv0Value(u: number, v: number) {
            this._uvs[0] = u;
            this._uvs[1] = v;
        }

		/**
		 * @return return the u value of the uv0 of this Face value object
		 */
        public get uv0u(): number {
            return this._uvs[0];
        }

		/**
		 * @return return the v value of the uv0 of this Face value object
		 */
        public get uv0v(): number {
            return this._uvs[1];
        }

        //uv1
		/**
		 * the index set for uv1 in this Face value object
		 * @param    ind        The index
		 */
        public set uv1Index(ind: number) {
            this._uv1Index = ind;
        }

		/**
		 * @return Returns the index set for uv1 in this Face value object
		 */
        public get uv1Index(): number {
            return this._uv1Index;
        }

		/**
		 * uv1 u and v values
		 * @param    u        The u value
		 * @param    v        The v value
		 */
        public setUv1Value(u: number, v: number) {
            this._uvs[2] = u;
            this._uvs[3] = v;
        }

		/**
		 * @return Returns the u value of the uv1 of this Face value object
		 */
        public get uv1u(): number {
            return this._uvs[2];
        }

		/**
		 * @return Returns the v value of the uv1 of this Face value object
		 */
        public get uv1v(): number {
            return this._uvs[3];
        }

        //uv2
		/**
		 * the index set for uv2 in this Face value object
		 * @param    ind        The index
		 */
        public set uv2Index(ind: number) {
            this._uv2Index = ind;
        }

		/**
		 * @return return the index set for uv2 in this Face value object
		 */
        public get uv2Index(): number {
            return this._uv2Index;
        }

		/**
		 * uv2 u and v values
		 * @param    u        The u value
		 * @param    v        The v value
		 */
        public setUv2Value(u: number, v: number) {
            this._uvs[4] = u;
            this._uvs[5] = v;
        }

		/**
		 * @return return the u value of the uv2 of this Face value object
		 */
        public get uv2u(): number {
            return this._uvs[4];
        }

		/**
		 * @return return the v value of the uv2 of this Face value object
		 */
        public get uv2v(): number {
            return this._uvs[5];
        }

        //vertices
		/**
		 * To set uv values for either v0, v1 or v2.
		 * @param    index        The id of the uv (0, 1 or 2)
		 * @param    x            The x value of the vertex.
		 * @param    y            The y value of the vertex.
		 * @param    z            The z value of the vertex.
		 */
        public setVertexAt(index: number, x: number, y: number, z: number) {
            var ind: number = (index * 3);
            this._vertices[ind] = x;
            this._vertices[ind + 1] = y;
            this._vertices[ind + 2] = z;
        }

        //v0
		/**
		 * set the index value for v0
		 * @param    ind            The index value to store
		 */
        public set v0Index(ind: number) {
            this._v0Index = ind;
        }

		/**
		 * @return Returns the index value of the v0 stored in the Face value object
		 */
        public get v0Index(): number {
            return this._v0Index;
        }

		/**
		 * @return Returns a number[] representing the v0 stored in the Face value object
		 */
        public get v0(): number[] {
            return [this._vertices[0], this._vertices[1], this._vertices[2]];
        }

		/**
		 * @return Returns the x value of the v0 stored in the Face value object
		 */
        public get v0x(): number {
            return this._vertices[0];
        }

		/**
		 * @return Returns the y value of the v0 stored in the Face value object
		 */
        public get v0y(): number {
            return this._vertices[1];
        }

		/**
		 * @return Returns the z value of the v0 stored in the Face value object
		 */
        public get v0z(): number {
            return this._vertices[2];
        }

        //v1
		/**
		 * set the index value for v1
		 * @param    ind            The index value to store
		 */
        public set v1Index(ind: number) {
            this._v1Index = ind;
        }

		/**
		 * @return Returns the index value of the v1 stored in the Face value object
		 */
        public get v1Index(): number {
            return this._v1Index;
        }

		/**
		 * @return Returns a number[] representing the v1 stored in the Face value object
		 */
        public get v1(): number[] {
            return [this._vertices[3], this._vertices[4], this._vertices[5]];
        }

		/**
		 * @return Returns the x value of the v1 stored in the Face value object
		 */
        public get v1x(): number {
            return this._vertices[3];
        }

		/**
		 * @return Returns the y value of the v1 stored in the Face value object
		 */
        public get v1y(): number {
            return this._vertices[4];
        }

		/**
		 * @return Returns the z value of the v1 stored in the Face value object
		 */
        public get v1z(): number {
            return this._vertices[5];
        }

        //v2
		/**
		 * set the index value for v2
		 * @param    ind            The index value to store
		 */
        public set v2Index(ind: number) {
            this._v2Index = ind;
        }

		/**
		 * @return return the index value of the v2 stored in the Face value object
		 */
        public get v2Index(): number {
            return this._v2Index;
        }

		/**
		 * @return Returns a number[] representing the v2 stored in the Face value object
		 */
        public get v2(): number[] {
            return [this._vertices[6], this._vertices[7], this._vertices[8]];
        }

		/**
		 * @return Returns the x value of the v2 stored in the Face value object
		 */
        public get v2x(): number {
            return this._vertices[6];
        }

		/**
		 * @return Returns the y value of the v2 stored in the Face value object
		 */
        public get v2y(): number {
            return this._vertices[7];
        }

		/**
		 * @return Returns the z value of the v2 stored in the Face value object
		 */
        public get v2z(): number {
            return this._vertices[8];
        }

		/**
		 * returns a new Face value Object
		 */
        public clone(): Face {
            var nVertices: number[] = [this._vertices[0], this._vertices[1], this._vertices[2],
                this._vertices[3], this._vertices[4], this._vertices[5],
                this._vertices[6], this._vertices[7], this._vertices[8]];

            var nUvs: number[] = [this._uvs[0], this._uvs[1],
                this._uvs[2], this._uvs[3],
                this._uvs[4], this._uvs[5]];

            return new Face(nVertices, nUvs);
        }

		/**
		 * Returns the first two barycentric coordinates for a point on (or outside) the triangle. The third coordinate is 1 - x - y
		 * @param point The point for which to calculate the new target
		 * @param target An optional Point object to store the calculation in order to prevent creation of a new object
		 */
        public getBarycentricCoords(point: Vector3D, target: Point = null): Point {
            var v0x: number = this._vertices[0];
            var v0y: number = this._vertices[1];
            var v0z: number = this._vertices[2];
            var dx0: number = point.x - v0x;
            var dy0: number = point.y - v0y;
            var dz0: number = point.z - v0z;
            var dx1: number = this._vertices[3] - v0x;
            var dy1: number = this._vertices[4] - v0y;
            var dz1: number = this._vertices[5] - v0z;
            var dx2: number = this._vertices[6] - v0x;
            var dy2: number = this._vertices[7] - v0y;
            var dz2: number = this._vertices[8] - v0z;

            var dot01: number = dx1 * dx0 + dy1 * dy0 + dz1 * dz0;
            var dot02: number = dx2 * dx0 + dy2 * dy0 + dz2 * dz0;
            var dot11: number = dx1 * dx1 + dy1 * dy1 + dz1 * dz1;
            var dot22: number = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;
            var dot12: number = dx2 * dx1 + dy2 * dy1 + dz2 * dz1;

            var invDenom: number = 1 / (dot22 * dot11 - dot12 * dot12);
            if (target == null)
                target = new Point();
            target.x = (dot22 * dot01 - dot12 * dot02) * invDenom;
            target.y = (dot11 * dot02 - dot12 * dot01) * invDenom;
            return target;
        }

		/**
		 * Tests whether a given point is inside the triangle
		 * @param point The point to test against
		 * @param maxDistanceToPlane The minimum distance to the plane for the point to be considered on the triangle. This is usually used to allow for rounding error, but can also be used to perform a volumetric test.
		 */
        public containsPoint(point: Vector3D, maxDistanceToPlane: number = .007): boolean {
            if (!this.planeContains(point, maxDistanceToPlane))
                return false;

            this.getBarycentricCoords(point, Face._calcPoint);
            var s: number = Face._calcPoint.x;
            var t: number = Face._calcPoint.y;
            return s >= 0.0 && t >= 0.0 && (s + t) <= 1.0;
        }

        private planeContains(point: Vector3D, epsilon: number = .007): boolean {
            var v0x: number = this._vertices[0];
            var v0y: number = this._vertices[1];
            var v0z: number = this._vertices[2];
            var d1x: number = this._vertices[3] - v0x;
            var d1y: number = this._vertices[4] - v0y;
            var d1z: number = this._vertices[5] - v0z;
            var d2x: number = this._vertices[6] - v0x;
            var d2y: number = this._vertices[7] - v0y;
            var d2z: number = this._vertices[8] - v0z;
            var a: number = d1y * d2z - d1z * d2y;
            var b: number = d1z * d2x - d1x * d2z;
            var c: number = d1x * d2y - d1y * d2x;
            var len: number = 1 / Math.sqrt(a * a + b * b + c * c);
            a *= len;
            b *= len;
            c *= len;
            var dist: number = a * (point.x - v0x) + b * (point.y - v0y) + c * (point.z - v0z);
            return dist > -epsilon && dist < epsilon;
        }

		/**
		 * Returns the target coordinates for a point on a triangle
		 * @param v0 The triangle's first vertex
		 * @param v1 The triangle's second vertex
		 * @param v2 The triangle's third vertex
		 * @param uv0 The UV coord associated with the triangle's first vertex
		 * @param uv1 The UV coord associated with the triangle's second vertex
		 * @param uv2 The UV coord associated with the triangle's third vertex
		 * @param point The point for which to calculate the new target
		 * @param target An optional UV object to store the calculation in order to prevent creation of a new object
		 */
        public getUVAtPoint(point: Vector3D, target: UV = null): UV {
            this.getBarycentricCoords(point, Face._calcPoint);

            var s: number = Face._calcPoint.x;
            var t: number = Face._calcPoint.y;

            if (s >= 0.0 && t >= 0.0 && (s + t) <= 1.0) {
                var u0: number = this._uvs[0];
                var v0: number = this._uvs[1];
                if (target == null)
                    target = new UV();
                target.u = u0 + t * (this._uvs[4] - u0) + s * (this._uvs[2] - u0);
                target.v = v0 + t * (this._uvs[5] - v0) + s * (this._uvs[3] - v0);
                return target;
            } else
                return null;
        }
    }
}
