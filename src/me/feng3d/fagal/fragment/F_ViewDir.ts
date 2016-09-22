module feng3d {


	/**
	 * 视线片段渲染函数
	 * @author feng 2014-11-7
	 */
    export function F_ViewDir() {
        var _ = FagalRE.instance.space;

        //标准化视线
        _.nrm(_.viewDir_ft_4.xyz, _.viewDir_v);
        //保持w不变
        _.mov(_.viewDir_ft_4.w, _.viewDir_v.w);
    }
}
