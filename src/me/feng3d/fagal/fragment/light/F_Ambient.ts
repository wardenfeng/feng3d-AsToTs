module feng3d {
	/**
	 * 环境光片段渲染程序
	 * @author feng 2014-11-7
	 */
    export function F_Ambient() {
        var _ = FagalRE.instance.space;

        var shaderParams: ShaderParams = FagalRE.instance.context3DCache.shaderParams;
        var commonShaderParams: CommonShaderParams = shaderParams.getOrCreateComponentByClass(CommonShaderParams);

        if (commonShaderParams.useAmbientTexture > 0) {
            var mAmbient_ft: any = _.getFreeTemp("环境颜色值临时变量");
            _.tex(mAmbient_ft, _.uv_v, _.ambientTexture_fs);
            // apparently, still needs to un-premultiply :s
            _.div(mAmbient_ft.xyz, mAmbient_ft.xyz, mAmbient_ft.w);
            _.mov(_.finalColor_ft_4, mAmbient_ft);
        }
        else {
            _.mov(_.finalColor_ft_4, _.ambientColor_fc_vector);
        }

    }
}


