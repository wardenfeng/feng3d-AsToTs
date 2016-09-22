module feng3d
{
	
	
	

	

	/**
	 * PhongSpecularMethod provides a specular method that provides Phong highlights.
	 */
	export class PhongSpecularMethod extends BasicSpecularMethod
	{
		/**
		 * Creates a new PhongSpecularMethod object.
		 */
		constructor()
		{
			super();
		}

		public activate(shaderParams:ShaderParams)
		{
			super.activate(shaderParams);

			shaderParams.specularModelType = SpecularModelType.PHONG;
		}
	}
}

