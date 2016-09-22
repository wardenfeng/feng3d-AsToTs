module feng3d {

	/**
	 * 纹理类型
	 * @author feng 2014-10-23
	 */
    export class TextureType {
        /**  Images in this texture all are 2-dimensional. They have width and height, but no depth. */
        public static TYPE_2D = "2d";

        /**  Images in this texture all are 3-dimensional. They have width, height, and depth. */
        public static TYPE_3D = "3d";

        /**  There are exactly 6 distinct sets of 2D images, all of the same size. They act as 6 faces of a cube. */
        public static TYPE_CUBE = "cube";
    }
}
