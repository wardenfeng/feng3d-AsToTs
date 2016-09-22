module feng3d
{
	

	/**
	 * 粒子几何体
	 */
	export class ParticleGeometry extends Geometry
	{
		/**
		 * 粒子数据
		 */
		public particles:ParticleData[];

		/**
		 * 粒子数量
		 */
		public numParticles:number;

		constructor()
		{
			super();
		}

		public clone():Geometry
		{
			var particleGeometry:ParticleGeometry = super.clone() as ParticleGeometry;
			particleGeometry.particles = this.particles;
			particleGeometry.numParticles = this.numParticles;
			return particleGeometry;
		}
	}

}
