module feng3d
{
	/**
	 * 方向灯光
	 * @author feng 2014-9-11
	 */
	export class DirectionalLight extends LightBase
	{
		private _direction:Vector3D;
		private _tmpLookAt:Vector3D;
		private _sceneDirection:Vector3D;

		/**
		 * 创建一个方向灯光
		 * @param xDir		方向X值
		 * @param yDir		方向Y值
		 * @param zDir		方向Z值
		 */
		constructor(xDir:number = 0, yDir:number = -1, zDir:number = 1)
		{
			super();

			this.direction = new Vector3D(xDir, yDir, zDir);
			this._sceneDirection = new Vector3D();
		}

		/**
		 * 灯光方向
		 */
		public get direction():Vector3D
		{
			return this._direction;
		}

		public set direction(value:Vector3D)
		{
			this._direction = value;
			//lookAt(new Vector3D(x + this._direction.x, y + this._direction.y, z + this._direction.z));
			if (!this._tmpLookAt)
				this._tmpLookAt = new Vector3D();
			this._tmpLookAt.x = this.transform3D.x + this._direction.x;
			this._tmpLookAt.y = this.transform3D.y + this._direction.y;
			this._tmpLookAt.z = this.transform3D.z + this._direction.z;

			this.transform3D.lookAt(this._tmpLookAt);
		}

		/**
		 * 灯光场景方向
		 */
		public get sceneDirection():Vector3D
		{
			if (this._sceneTransformDirty)
				this.updateSceneTransform();
			return this._sceneDirection;
		}

		/**
		 * @inheritDoc
		 */
		protected updateSceneTransform()
		{
			super.updateSceneTransform();
			this.sceneTransform.copyColumnTo(2, this._sceneDirection);
			this._sceneDirection.normalize();
		}

		/**
		 * @inheritDoc
		 */
		protected createEntityPartitionNode():EntityNode
		{
			return new DirectionalLightNode(this);
		}

		/**
		 * @inheritDoc
		 */
		protected getDefaultBoundingVolume():BoundingVolumeBase
		{
			// 方向光源并没有坐标，因此永远在3D场景中
			return new NullBounds();
		}

		/**
		 * @inheritDoc
		 */
		protected updateBounds()
		{
		}

		protected createShadowMapper():ShadowMapperBase
		{
			return new DirectionalShadowMapper();
		}
        
        public getObjectProjectionMatrix(renderable:IRenderable, target:Matrix3D):Matrix3D
        {
            return null;
        }
	}
}
