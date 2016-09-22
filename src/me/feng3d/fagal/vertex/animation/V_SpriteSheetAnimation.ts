module feng3d
{
	
	

	/**
	 * Sprite动画顶点渲染程序
	 * @author feng 2015-9-5
	 */
	export function V_SpriteSheetAnimation(UVSource:Register, UVTarget:Register)
	{
		var _ = FagalRE.instance.space;

		var tempUV:any = _.getFreeTemp();

		var constantRegID:any = _.spriteSheetVectorFrame_vc_vector;

		//计算平移缩放
		_.mov(tempUV, UVSource);
		_.mul(tempUV.xy, tempUV.xy, constantRegID.zw);
		_.add(tempUV.xy, tempUV.xy, constantRegID.xy);
		_.mov(UVTarget, tempUV);
	}
}
