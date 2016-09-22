module feng3d
{
	
	/**
	 * FresnelSpecularMethod provides a specular shading method that causes stronger highlights on grazing view angles.
	 */
	export class FresnelSpecularMethod extends PhongSpecularMethod
	{
		private _incidentLight:boolean;
		private _fresnelPower:number = 5;
		private _normalReflectance:number = .028; // default value for skin

		private data:number[] = [0, 0, 1, 0];

		/**
		 * Creates a new FresnelSpecularMethod object.
		 * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
		 * @param baseSpecularMethod The specular method to which the fresnel equation. Defaults to BasicSpecularMethod.
		 */
		constructor(basedOnSurface:boolean = true)
		{
			// may want to offer diff speculars
			super();
			this._incidentLight = !basedOnSurface;
		}

		/**
		 * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
		 */
		public get basedOnSurface():boolean
		{
			return !this._incidentLight;
		}

		public set basedOnSurface(value:boolean)
		{
			if (this._incidentLight != value)
				return;

			this._incidentLight = !value;

			this.invalidateShaderProgram();
		}

		/**
		 * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
		 */
		public get fresnelPower():number
		{
			return this._fresnelPower;
		}

		public set fresnelPower(value:number)
		{
			this._fresnelPower = value;
		}

		/**
		 * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
		 */
		public get normalReflectance():number
		{
			return this._normalReflectance;
		}

		public set normalReflectance(value:number)
		{
			this._normalReflectance = value;
		}

		protected initBuffers()
		{
			super.initBuffers();
			this.context3DBufferOwner.mapContext3DBuffer(this._.fresnelSpecularData_fc_vector, this.updateSpecularDataBuffer1);
		}

		private updateSpecularDataBuffer1(fcVectorBuffer:FCVectorBuffer)
		{
			fcVectorBuffer.update(this.data);
		}

		/**
		 * @inheritDoc
		 */
		public activate(shaderParams:ShaderParams)
		{
			super.activate(shaderParams);

			this.data[0] = this._normalReflectance;
			this.data[1] = this._fresnelPower;

			shaderParams.incidentLight = this._incidentLight;

			shaderParams.modulateMethod = F_FresnelSpecular;
		}
	}
}
