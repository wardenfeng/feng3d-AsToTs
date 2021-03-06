module feng3d
{
	
	
	
	/**
	 * 摄像机事件
	 * @author feng 2014-10-14
	 */
	export class CameraEvent extends Event
	{
		public static LENS_CHANGED:string = "lensChanged";
		
		constructor(type:string, camera:Camera3D = null, bubbles:boolean=false)
		{
			super(type, camera, bubbles);
		}
		
		public get camera():Camera3D
		{
			return this.data as Camera3D;
		}
	}
}