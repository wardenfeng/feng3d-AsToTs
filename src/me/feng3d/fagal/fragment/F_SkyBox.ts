module feng3d
{
	
	/**
	 * 天空盒片段渲染程序
	 * @author feng 2014-11-4
	 */
	export class F_SkyBox extends FagalMethod
	{
		constructor()
		{
            super();
			this._shaderType = Context3DProgramType.FRAGMENT;
		}

		public runFunc()
		{
			var _ = FagalRE.instance.space;

			//获取纹理数据
			_.tex(_._oc, _.uv_v, _.skyboxTexture_fs);
		}
	}
}
