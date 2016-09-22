module feng3d {


	/**
	 * 漫反射纹理取样
	 * @author feng 2014-11-6
	 */
    export function F_DiffuseTexure() {
        var _ = FagalRE.instance.space;
        var shaderParams: ShaderParams = FagalRE.instance.context3DCache.shaderParams;
        var commonShaderParams: CommonShaderParams = shaderParams.getOrCreateComponentByClass(CommonShaderParams);

        _.tex(_.mDiff_ft, _.uv_v, _.texture_fs);

        if (commonShaderParams.alphaThreshold > 0) {
            var cutOffReg = _.alphaThreshold_fc_vector;
            _.sub(_.mDiff_ft.w, _.mDiff_ft.w, cutOffReg.x);
            _.kil(_.mDiff_ft.w);
            _.add(_.mDiff_ft.w, _.mDiff_ft.w, cutOffReg.x);
        }
    }
}
