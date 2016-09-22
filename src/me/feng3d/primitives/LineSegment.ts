module feng3d
{
	

	

	/**
	 * A Line Segment primitive.
	 */
	export class LineSegment extends Segment
	{

		public TYPE:string = "line";

		/**
		 * Create a line segment
		 * @param v0 Start position of the line segment
		 * @param v1 Ending position of the line segment
		 * @param color0 Starting color of the line segment
		 * @param color1 Ending colour of the line segment
		 * @param thickness Thickness of the line
		 */
		constructor(v0:Vector3D, v1:Vector3D, color0:number = 0x333333, color1:number = 0x333333, thickness:number = 1)
		{
			super(v0, v1, color0, color1, thickness);
		}

	}
}
