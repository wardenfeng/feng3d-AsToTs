module feng3d {

	/**
	 * Helper Class to retrieve objects bounds <code>Bounds</code>
	 */

    export class Bounds {

        private static _minX: number;
        private static _minY: number;
        private static _minZ: number;
        private static _maxX: number;
        private static _maxY: number;
        private static _maxZ: number;
        private static _defaultPosition: Vector3D = new Vector3D(0.0, 0.0, 0.0);
        private static _containers = new Map<Container3D, number[]>();

		/**
		 * Calculate the bounds of a Mesh object
		 * @param mesh        Mesh. The Mesh to get the bounds from.
		 * Use the getters of this class to retrieve the results
		 */
        public static getMeshBounds(mesh: Mesh) {
            Bounds.getObjectContainerBounds(mesh);
        }

		/**
		 * Calculate the bounds of an ObjectContainer3D object
		 * @param container        ObjectContainer3D. The ObjectContainer3D to get the bounds from.
		 * Use the getters of this class to retrieve the results
		 */
        public static getObjectContainerBounds(container: Container3D, worldBased: boolean = true) {

            Bounds.reset();
            Bounds.parseObjectContainerBounds(container);

            if (Bounds.isInfinite(Bounds._minX) || Bounds.isInfinite(Bounds._minY) || Bounds.isInfinite(Bounds._minZ) || Bounds.isInfinite(Bounds._maxX) || Bounds.isInfinite(Bounds._maxY) || Bounds.isInfinite(Bounds._maxZ)) {
                return;
            }

            // Transform min/max values to the scene if required
            if (worldBased) {
                var b: number[] = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
                var c: number[] = Bounds.getBoundsCorners(Bounds._minX, Bounds._minY, Bounds._minZ, Bounds._maxX, Bounds._maxY, Bounds._maxZ);
                Bounds.transformContainer(b, c, container.sceneTransform);
                Bounds._minX = b[0];
                Bounds._minY = b[1];
                Bounds._minZ = b[2];
                Bounds._maxX = b[3];
                Bounds._maxY = b[4];
                Bounds._maxZ = b[5];
            }
        }

		/**
		 * Calculate the bounds from a vector of number representing the vertices. &lt;x,y,z,x,y,z.....&gt;
		 * @param vertices        Vector.&lt;number&gt;. The vertices to get the bounds from.
		 * Use the getters of this class to retrieve the results
		 */
        public static getVerticesVectorBounds(vertices: number[]) {
            Bounds.reset();
            var l: number = vertices.length;
            if (l % 3 != 0)
                return;

            var x: number;
            var y: number;
            var z: number;

            for (var i: number = 0; i < l; i += 3) {
                x = vertices[i];
                y = vertices[i + 1];
                z = vertices[i + 2];

                if (x < Bounds._minX)
                    Bounds._minX = x;
                if (x > Bounds._maxX)
                    Bounds._maxX = x;

                if (y < Bounds._minY)
                    Bounds._minY = y;
                if (y > Bounds._maxY)
                    Bounds._maxY = y;

                if (z < Bounds._minZ)
                    Bounds._minZ = z;
                if (z > Bounds._maxZ)
                    Bounds._maxZ = z;
            }
        }

		/**
		 * @param outCenter        Vector3D. Optional Vector3D, if provided the same Vector3D is returned with the bounds center.
		 * @return the center of the bound
		 */
        public static getCenter(outCenter: Vector3D = null): Vector3D {
            var center: Vector3D = outCenter || new Vector3D();
            center.x = Bounds._minX + (Bounds._maxX - Bounds._minX) * .5;
            center.y = Bounds._minY + (Bounds._maxY - Bounds._minY) * .5;
            center.z = Bounds._minZ + (Bounds._maxZ - Bounds._minZ) * .5;

            return center;
        }

		/**
		 * @return the smalest x value
		 */
        public static get minX(): number {
            return Bounds._minX;
        }

		/**
		 * @return the smalest y value
		 */
        public static get minY(): number {
            return Bounds._minY;
        }

		/**
		 * @return the smalest z value
		 */
        public static get minZ(): number {
            return Bounds._minZ;
        }

		/**
		 * @return the biggest x value
		 */
        public static get maxX(): number {
            return Bounds._maxX;
        }

		/**
		 * @return the biggest y value
		 */
        public static get maxY(): number {
            return Bounds._maxY;
        }

		/**
		 * @return the biggest z value
		 */
        public static get maxZ(): number {
            return Bounds._maxZ;
        }

		/**
		 * @return the width value from the bounds
		 */
        public static get width(): number {
            return Bounds._maxX - Bounds._minX;
        }

		/**
		 * @return the height value from the bounds
		 */
        public static get height(): number {
            return Bounds._maxY - Bounds._minY;
        }

		/**
		 * @return the depth value from the bounds
		 */
        public static get depth(): number {
            return Bounds._maxZ - Bounds._minZ;
        }

        private static reset() {
            Bounds._containers.clear();
            Bounds._minX = Bounds._minY = Bounds._minZ = Infinity;
            Bounds._maxX = Bounds._maxY = Bounds._maxZ = -Infinity;
            Bounds._defaultPosition.x = 0.0;
            Bounds._defaultPosition.y = 0.0;
            Bounds._defaultPosition.z = 0.0;
        }

        private static parseObjectContainerBounds(obj: Container3D, parentTransform: Matrix3D = null) {
            if (!obj.visible)
                return;

            var containerBounds: number[] = Bounds._containers.get(obj) || [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
            Bounds._containers.push(obj, containerBounds)

            var child: Container3D;
            var isEntity: Entity = obj as Entity;
            var containerTransform: Matrix3D = new Matrix3D();

            if (isEntity && parentTransform) {
                Bounds.parseObjectBounds(obj, parentTransform);

                containerTransform = obj.transform3D.transform.clone();
                if (parentTransform)
                    containerTransform.append(parentTransform);
            }
            else if (isEntity && !parentTransform) {
                var mat: Matrix3D = obj.transform3D.transform.clone();
                mat.invert();
                Bounds.parseObjectBounds(obj, mat);
            }

            for (var i: number = 0; i < obj.numChildren; ++i) {
                child = obj.getChildAt(i) as Container3D;
                Bounds.parseObjectContainerBounds(child, containerTransform);
            }

            var parentBounds: number[] = Bounds._containers.get(obj.parent);
            if (!isEntity && parentTransform)
                Bounds.parseObjectBounds(obj, parentTransform, true);

            if (parentBounds) {
                parentBounds[0] = Math.min(parentBounds[0], containerBounds[0]);
                parentBounds[1] = Math.min(parentBounds[1], containerBounds[1]);
                parentBounds[2] = Math.min(parentBounds[2], containerBounds[2]);
                parentBounds[3] = Math.max(parentBounds[3], containerBounds[3]);
                parentBounds[4] = Math.max(parentBounds[4], containerBounds[4]);
                parentBounds[5] = Math.max(parentBounds[5], containerBounds[5]);
            }
            else {
                Bounds._minX = containerBounds[0];
                Bounds._minY = containerBounds[1];
                Bounds._minZ = containerBounds[2];
                Bounds._maxX = containerBounds[3];
                Bounds._maxY = containerBounds[4];
                Bounds._maxZ = containerBounds[5];
            }
        }

        private static isInfinite(value: number): boolean {
            return value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY;
        }

        private static parseObjectBounds(oC: Container3D, parentTransform: Matrix3D = null, resetBounds: boolean = false) {
            if (is(oC, LightBase))
                return;

            var e: Entity = oC as Entity;
            var corners: number[];
            var mat: Matrix3D = oC.transform3D.transform.clone();
            var cB: number[] = Bounds._containers.get(oC);
            if (e) {
                if (Bounds.isInfinite(e.minX) || Bounds.isInfinite(e.minY) || Bounds.isInfinite(e.minZ) || Bounds.isInfinite(e.maxX) || Bounds.isInfinite(e.maxY) || Bounds.isInfinite(e.maxZ)) {
                    return;
                }

                corners = Bounds.getBoundsCorners(e.minX, e.minY, e.minZ, e.maxX, e.maxY, e.maxZ);
                if (parentTransform)
                    mat.append(parentTransform);
            }
            else {
                corners = Bounds.getBoundsCorners(cB[0], cB[1], cB[2], cB[3], cB[4], cB[5]);
                if (parentTransform)
                    mat.prepend(parentTransform);
            }

            if (resetBounds) {
                cB[0] = cB[1] = cB[2] = Infinity;
                cB[3] = cB[4] = cB[5] = -Infinity;
            }

            Bounds.transformContainer(cB, corners, mat);
        }

        private static getBoundsCorners(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): number[] {
            return [minX, minY, minZ, minX, minY, maxZ, minX, maxY, minZ, minX, maxY, maxZ, maxX, minY, minZ, maxX, minY, maxZ, maxX, maxY, minZ, maxX, maxY, maxZ];
        }

        private static transformContainer(bounds: number[], corners: number[], matrix: Matrix3D) {

            matrix.transformVectors(corners, corners);

            var x: number;
            var y: number;
            var z: number;

            var pCtr: number = 0;
            while (pCtr < corners.length) {
                x = corners[pCtr++];
                y = corners[pCtr++];
                z = corners[pCtr++];

                if (x < bounds[0])
                    bounds[0] = x;
                if (x > bounds[3])
                    bounds[3] = x;

                if (y < bounds[1])
                    bounds[1] = y;
                if (y > bounds[4])
                    bounds[4] = y;

                if (z < bounds[2])
                    bounds[2] = z;
                if (z > bounds[5])
                    bounds[5] = z;
            }
        }
    }
}
