module feng3d
{
	
	
	

	

	/**
	 * 天空盒材质
	 * @author feng 2014-7-11
	 */
	export class SkyBoxMaterial extends MaterialBase
	{
		private _cubeMap:CubeTextureBase;
		private _skyboxPass:SkyBoxPass;

		/**
		 * 创建天空盒材质实例
		 * @param cubeMap			立方体映射纹理
		 */
		constructor(cubeMap:CubeTextureBase)
		{
            super();
			this._cubeMap = cubeMap;
			this.addPass(this._skyboxPass = new SkyBoxPass());
			this._skyboxPass.cubeTexture = this._cubeMap;
		}

		/**
		 * 立方体映射纹理
		 */
		public get cubeMap():CubeTextureBase
		{
			return this._cubeMap;
		}

		public set cubeMap(value:CubeTextureBase)
		{
			if (value && this._cubeMap && (value.hasMipMaps != this._cubeMap.hasMipMaps || value.format != this._cubeMap.format))
				this.invalidatePasses(null);

			this._cubeMap = value;

			this._skyboxPass.cubeTexture = this._cubeMap;
		}
	}
}
