module feng3d
{

	/**
	 * 方向光阴影映射
	 * @author feng 2015-5-28
	 */
	export class DirectionalShadowMapper extends ShadowMapperBase
	{
		protected _overallDepthCamera:Camera3D;
		protected _localFrustum:number[];

		protected _lightOffset:number = 10000;
		protected _matrix:Matrix3D;
		protected _overallDepthLens:FreeMatrixLens;
		protected _snap:number = 64;

		protected _cullPlanes:Plane3D[];
		protected _minZ:number;
		protected _maxZ:number;

		/**
		 * 创建方向光阴影映射
		 */
		constructor()
		{
			super();
			this._cullPlanes = [];
			this._overallDepthLens = new FreeMatrixLens();
			this._overallDepthCamera = new Camera3D(this._overallDepthLens);
			this._localFrustum = [];
            this._localFrustum.length = 8*3;
			this._matrix = new Matrix3D();
		}

		/**
		 * 深度投影矩阵
		 * <p>世界坐标转换为深度图空间</p>
		 */
		public get depthProjection():Matrix3D
		{
			return this._overallDepthCamera.viewProjection;
		}

		/**
		 * 投影深度
		 * Depth projection matrix that projects from scene space to depth map.
		 */
		public get depth():number
		{
			return this._maxZ - this._minZ;
		}

		/**
		 * @inheritDoc
		 */
		protected drawDepthMap(target:TextureProxyBase, stage3DProxy:Stage3DProxy, scene:Scene3D, renderer:DepthRenderer)
		{
			this._casterCollector.camera = this._overallDepthCamera;
			this._casterCollector.cullPlanes = this._cullPlanes;
			this._casterCollector.clear();
			scene.traversePartitions(this._casterCollector);
			renderer.render(stage3DProxy, this._casterCollector, target);
		}

		protected updateCullPlanes(viewCamera:Camera3D)
		{
			var lightFrustumPlanes:Plane3D[] = this._overallDepthCamera.frustumPlanes;
			var viewFrustumPlanes:Plane3D[] = viewCamera.frustumPlanes;
			this._cullPlanes.length = 4;

			this._cullPlanes[0] = lightFrustumPlanes[0];
			this._cullPlanes[1] = lightFrustumPlanes[1];
			this._cullPlanes[2] = lightFrustumPlanes[2];
			this._cullPlanes[3] = lightFrustumPlanes[3];

			var dir:Vector3D = as(this._light,DirectionalLight).sceneDirection;
			var dirX:number = dir.x;
			var dirY:number = dir.y;
			var dirZ:number = dir.z;
			var j:number = 4;
			for (var i:number = 0; i < 6; ++i)
			{
				var plane:Plane3D = viewFrustumPlanes[i];
				if (plane.a * dirX + plane.b * dirY + plane.c * dirZ < 0)
					this._cullPlanes[j++] = plane;
			}
		}

		protected updateDepthProjection(viewCamera:Camera3D)
		{
			this.updateProjectionFromFrustumCorners(viewCamera, viewCamera.lens.frustumCorners, this._matrix);
			this._overallDepthLens.matrix = this._matrix;
			this.updateCullPlanes(viewCamera);
		}

		/**
		 * 更新投影矩阵
		 * @param viewCamera		摄像机
		 * @param corners
		 * @param matrix
		 */
		protected updateProjectionFromFrustumCorners(viewCamera:Camera3D, corners:number[], matrix:Matrix3D)
		{
			var raw:number[] = Matrix3DUtils.RAW_DATA_CONTAINER;
			var dir:Vector3D;
			var x:number, y:number, z:number;
			var minX:number, minY:number;
			var maxX:number, maxY:number;
			var i:number;

			dir = as(this._light,DirectionalLight).sceneDirection;
			this._overallDepthCamera.transform3D.transform = this._light.sceneTransform;
			x = Math.floor((viewCamera.transform3D.x - dir.x * this._lightOffset) / this._snap) * this._snap;
			y = Math.floor((viewCamera.transform3D.y - dir.y * this._lightOffset) / this._snap) * this._snap;
			z = Math.floor((viewCamera.transform3D.z - dir.z * this._lightOffset) / this._snap) * this._snap;
			this._overallDepthCamera.transform3D.x = x;
			this._overallDepthCamera.transform3D.y = y;
			this._overallDepthCamera.transform3D.z = z;

			this._matrix.copyFrom(this._overallDepthCamera.inverseSceneTransform);
			this._matrix.prepend(viewCamera.sceneTransform);
			this._matrix.transformVectors(corners, this._localFrustum);

			minX = maxX = this._localFrustum[0];
			minY = maxY = this._localFrustum[1];
			this._maxZ = this._localFrustum[2];

			i = 3;
			while (i < 24)
			{
				x = this._localFrustum[i];
				y = this._localFrustum[i + 1];
				z = this._localFrustum[i + 2];
				if (x < minX)
					minX = x;
				if (x > maxX)
					maxX = x;
				if (y < minY)
					minY = y;
				if (y > maxY)
					maxY = y;
				if (z > this._maxZ)
					this._maxZ = z;
				i += 3;
			}
			this._minZ = 1;

			var w:number = maxX - minX;
			var h:number = maxY - minY;
			var d:number = 1 / (this._maxZ - this._minZ);

			if (minX < 0)
				minX -= this._snap; // because number() rounds up for < 0
			if (minY < 0)
				minY -= this._snap;
			minX = Math.floor(minX / this._snap) * this._snap;
			minY = Math.floor(minY / this._snap) * this._snap;

			var snap2:number = 2 * this._snap;
			w = Math.floor(w / snap2 + 2) * snap2;
			h = Math.floor(h / snap2 + 2) * snap2;

			maxX = minX + w;
			maxY = minY + h;

			w = 1 / w;
			h = 1 / h;

			raw[0] = 2 * w;
			raw[5] = 2 * h;
			raw[10] = d;
			raw[12] = -(maxX + minX) * w;
			raw[13] = -(maxY + minY) * h;
			raw[14] = -this._minZ * d;
			raw[15] = 1;
			raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;

			matrix.copyRawDataFrom(raw);
		}
	}
}
