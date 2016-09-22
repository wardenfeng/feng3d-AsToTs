module feng3d
{
	

	/**
	 * 近方向光阴影映射
	 * @author feng 2015-5-28
	 */
	export class NearDirectionalShadowMapper extends DirectionalShadowMapper
	{
		private _coverageRatio:number;

		/**
		 * 创建近方向光阴影映射
		 * @param coverageRatio		覆盖比例
		 */
		constructor(coverageRatio:number = .5)
		{
			super();
			this.coverageRatio = coverageRatio;
		}

		/**
		 * 阴影的覆盖视椎体的比例
		 * <p>0表示视椎体内看不到阴影，0.5表示从近平面到与远平面之间可以看到阴影，1表示视椎体内都可以看到阴影。</p>
		 * <p><b>注：看到阴影的前提是有阴影产生</b></p>
		 */
		public get coverageRatio():number
		{
			return this._coverageRatio;
		}

		public set coverageRatio(value:number)
		{
			if (value > 1)
				value = 1;
			else if (value < 0)
				value = 0;

			this._coverageRatio = value;
		}

		/**
		 * @inheritDoc
		 */
		protected updateDepthProjection(viewCamera:Camera3D)
		{
			var corners:number[] = viewCamera.lens.frustumCorners;

			for (var i:number = 0; i < 12; ++i)
			{
				var v:number = corners[i];
				this._localFrustum[i] = v;
				this._localFrustum[i + 12] = v + (corners[i + 12] - v) * this._coverageRatio;
			}

			this.updateProjectionFromFrustumCorners(viewCamera, this._localFrustum, this._matrix);
			this._overallDepthLens.matrix = this._matrix;
		}
	}
}
