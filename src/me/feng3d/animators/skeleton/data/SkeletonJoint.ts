module feng3d
{
	
	/**
	 * 骨骼关节数据
	 * @author feng 2014-5-20
	 */
	export class SkeletonJoint
	{
		/** 父关节索引 （-1说明本身是总父节点，这个序号其实就是行号了，譬如上面”origin“节点的序号就是0，无父节点； "body"节点序号是1，父节点序号是0，也就是说父节点是”origin“）*/
		public parentIndex:number = -1;
		
		/** 关节名字 */
		public name:string;
		
		/** bind-pose姿态下节点的位置（位移）和旋转 */
		public inverseBindPose:number[];
		
		constructor()
		{
		}
	}
}