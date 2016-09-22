module feng3d
{

	/**
	 * 粒子属性模型
	 * @author feng 2014-11-13
	 */
	export class ParticlePropertiesMode
	{
		/**
		 * 全局粒子属性，数据将上传至常量寄存器中
		 */
		public static GLOBAL:number = 0;

		/**
		 * 本地静态粒子属性，数据将上传顶点属性寄存器
		 */
		public static LOCAL_STATIC:number = 1;

	}
}
