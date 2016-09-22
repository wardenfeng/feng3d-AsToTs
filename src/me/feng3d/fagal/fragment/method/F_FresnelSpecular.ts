module feng3d
{
	
	/**
	 *
	 * @author feng 2015-9-24
	 */
	export function F_FresnelSpecular(target)
	{
		var _ = FagalRE.instance.space;
		var shaderParams:ShaderParams = FagalRE.instance.context3DCache.shaderParams;

		var _dataReg = _.fresnelSpecularData_fc_vector;
		var _incidentLight:boolean = shaderParams.incidentLight;

		_.dp3(target.y, _.viewDir_ft_4.xyz, _incidentLight ? target.xyz : _.normal_ft_4.xyz); // dot(V, H)
		_.sub(target.y, _dataReg.z, target.y); // base = 1-dot(V, H)
		_.pow(target.x, target.y, _dataReg.y); // exp = pow(base, 5)
		_.sub(target.y, _dataReg.z, target.y); // 1 - exp
		_.mul(target.y, _dataReg.x, target.y); // f0*(1 - exp)
		_.add(target.y, target.x, target.y); // exp + f0*(1 - exp)
		_.mul(target.w, target.w, target.y);

	}
}
