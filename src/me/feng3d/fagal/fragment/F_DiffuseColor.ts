module feng3d {



	/**
	 * 漫反射材质颜色
	 * @author feng 2014-11-6
	 */
    export function F_DiffuseColor() {
        var _ = FagalRE.instance.space;

        //漫射输入静态数据 
        _.mov(_.mDiff_ft, _.diffuseInput_fc_vector);
    }
}
