module feng3d {


	/**
	 * 编译切线片段程序(无法线图)
	 * @author feng 2014-11-7
	 */
    export function F_TangentNormalNoMap() {
        var _ = FagalRE.instance.space;

        //标准化法线
        _.nrm(_.normal_ft_4.xyz, _.normal_v);
        //保存w不变
        _.mov(_.normal_ft_4.w, _.normal_v.w);

    }
}
