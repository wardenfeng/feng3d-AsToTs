module feng3d
{
	
	/**
	 *
	 * @author feng 2014-8-26
	 */
	export class IndexBufferItem
	{
		/** 是否无效 */
		public invalid:boolean = true;

		public indexBuffer3D:IndexBuffer3D;

		public context3D:Context3D;

		constructor(context3D:Context3D,numIndices:number)
		{
			this.context3D = context3D;
			this.indexBuffer3D = context3D.createIndexBuffer(numIndices);
			this.invalid = true;
		}

		public uploadFromVector(data:number[], startOffset:number, count:number)
		{
			this.indexBuffer3D.uploadFromVector(data, startOffset, count);
			this.invalid = false;
		}

		public drawTriangles(firstIndex:number = 0, numTriangles:number = -1)
		{
			this.context3D.drawTriangles(this.indexBuffer3D, firstIndex, numTriangles);
		}

	}
}
