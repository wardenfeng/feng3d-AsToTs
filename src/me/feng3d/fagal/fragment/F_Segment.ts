module feng3d
{
	/**
	 * 线段片段渲染程序
	 * @author feng 2014-10-28
	 */
	export class F_Segment extends FagalMethod
	{
		constructor()
		{
            super()
			this._shaderType = Context3DProgramType.FRAGMENT;
		}

		public runFunc()
		{
			var _ = FagalRE.instance.space;

			_.comment("传递顶点颜色数据" + _.color_v + "到片段寄存器" + _._oc);
			_.mov(_._oc, _.color_v);
		}
	}
}


