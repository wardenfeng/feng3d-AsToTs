module feng3d
{
	

	
	
	
	

	/**
	 * 天空盒顶点渲染程序
	 * @author feng 2014-11-4
	 */
	export class V_SkyBox extends FagalMethod
	{
		constructor()
		{
            super();
			this._shaderType = Context3DProgramType.VERTEX;
		}

		public runFunc()
		{
			var _ = FagalRE.instance.space;

			var vt0:Register = _.getFreeTemp("缩放后的顶点坐标");
			_.comment("缩放到天空盒应有的大小");
			_.mul(vt0, _.position_va_3, _.scaleSkybox_vc_vector);
			_.comment("把天空盒中心放到摄像机位置");
			_.add(vt0, vt0, _.camerapos_vc_vector);
			_.comment("投影天空盒坐标");
			_.m44(_._op, vt0, _.projection_vc_matrix)
			_.comment("占坑用的，猜的");
			_.mov(_.uv_v, _.position_va_3);
		}
	}
}


