module feng3d
{
	
	
	
	/**
	 * 
	 * @author feng 2014-9-10
	 */
	export class Container3DEvent extends Event
	{
		constructor(type:string, data=null, bubbles:boolean=false)
		{
			super(type, data, bubbles);
		}
	}
}