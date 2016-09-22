module feng3d
{
	
	

	
	
	
	
	
	
	
	
	

	

	/**
	 * Sprite3D is a 3D billboard, a renderable rectangular area that is always aligned with the projection plane.
	 * As a result, no perspective transformation occurs on a Sprite3D object.
	 *
	 * todo: mvp generation or vertex shader code can be optimized
	 */
	export class Sprite3D extends Mesh
	{
		// TODO: Replace with CompactSubGeometry
		private static _sprite3DGeometry:SubGeometry;
		//private static _pickingSubMesh:SubGeometry;

		private _spriteMatrix:Matrix3D;

		private _pickingSubMesh:SubMesh;
		private _pickingTransform:Matrix3D;
		private _camera:Camera3D;

		private _width:number;
		private _height:number;
		private _shadowCaster:boolean = false;

		constructor(material:MaterialBase, width:number, height:number)
		{
			super();
			this.transform3D.addEventListener(Transform3DEvent.TRANSFORM_UPDATED, this.onTransformUpdated);

			this.material = material;
			this._width = width;
			this._height = height;
			this._spriteMatrix = new Matrix3D();
			if (!Sprite3D._sprite3DGeometry)
			{
				Sprite3D._sprite3DGeometry = new SubGeometry();
				Sprite3D._sprite3DGeometry.numVertices = 4;
				Sprite3D._sprite3DGeometry.updateVertexPositionData([-.5, .5, .0, .5, .5, .0, .5, -.5, .0, -.5, -.5, .0]);
				Sprite3D._sprite3DGeometry.updateUVData([.0, .0, 1.0, .0, 1.0, 1.0, .0, 1.0]);
				Sprite3D._sprite3DGeometry.updateIndexData([0, 1, 2, 0, 2, 3]);
				Sprite3D._sprite3DGeometry.updateVertexTangentData([1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0]);
				Sprite3D._sprite3DGeometry.updateVertexNormalData([.0, .0, -1.0, .0, .0, -1.0, .0, .0, -1.0, .0, .0, -1.0]);
			}
			this.geometry.addSubGeometry(Sprite3D._sprite3DGeometry);
		}

		public set pickingCollider(value:IPickingCollider)
		{
			super.setPickingCollider(value);
			if (value)
			{ // this.bounds collider is the only null value
				this._pickingSubMesh = new SubMesh(Sprite3D._sprite3DGeometry, null);
				this._pickingTransform = new Matrix3D();
			}
		}

		public get width():number
		{
			return this._width;
		}

		public set width(value:number)
		{
			if (this._width == value)
				return;
			this._width = value;
			this.transform3D.invalidateTransform();
		}

		public get height():number
		{
			return this._height;
		}

		public set height(value:number)
		{
			if (this._height == value)
				return;
			this._height = value;
			this.transform3D.invalidateTransform();
		}

		public get castsShadows():boolean
		{
			return this._shadowCaster;
		}

		protected updateBounds()
		{
			this._bounds.fromExtremes(-.5 * this.transform3D.scaleX, -.5 * this.transform3D.scaleY, -.5 * this.transform3D.scaleZ, .5 * this.transform3D.scaleX, .5 * this.transform3D.scaleY, .5 * this.transform3D.scaleZ);
			this._boundsInvalid = false;
		}

		protected onTransformUpdated(event:Transform3DEvent)
		{
			this.transform3D.transform.prependScale(this._width, this._height, Math.max(this._width, this._height));
		}

		public collidesBefore(shortestCollisionDistance:number, findClosest:boolean):boolean
		{
			findClosest = findClosest;
			var viewTransform:Matrix3D = this._camera.inverseSceneTransform.clone();
			viewTransform.transpose();
			var rawViewTransform:number[] = Matrix3DUtils.RAW_DATA_CONTAINER;
			viewTransform.copyRawDataTo(rawViewTransform);
			rawViewTransform[3] = 0;
			rawViewTransform[7] = 0;
			rawViewTransform[11] = 0;
			rawViewTransform[12] = 0;
			rawViewTransform[13] = 0;
			rawViewTransform[14] = 0;

			this._pickingTransform.copyRawDataFrom(rawViewTransform);
			this._pickingTransform.prependScale(this._width, this._height, Math.max(this._width, this._height));
			this._pickingTransform.appendTranslation(this.scenePosition.x, this.scenePosition.y, this.scenePosition.z);
			this._pickingTransform.invert();

			var localRayPosition:Vector3D = this._pickingTransform.transformVector(this._pickingCollisionVO.ray3D.position);
			var localRayDirection:Vector3D = this._pickingTransform.deltaTransformVector(this._pickingCollisionVO.ray3D.direction);

			var ray3D:Ray3D = new Ray3D(localRayPosition, localRayDirection);
			this._pickingCollider.setLocalRay(ray3D);

			this._pickingCollisionVO.renderable = null;
			if (this._pickingCollider.testSubMeshCollision(this._pickingSubMesh, this._pickingCollisionVO, shortestCollisionDistance,false))
				this._pickingCollisionVO.renderable = this._pickingSubMesh.renderableBase;

			return this._pickingCollisionVO.renderable != null;
		}

		public getRenderSceneTransform(camera:Camera3D):Matrix3D
		{
			var comps:Vector3D[] = Matrix3DUtils.decompose(camera.sceneTransform);
			var scale:Vector3D = comps[2];
			comps[0].x = this.scenePosition.x;
			comps[0].y = this.scenePosition.y;
			comps[0].z = this.scenePosition.z;
			scale.x = this._width * this.transform3D.scaleX;
			scale.y = this._height * this.transform3D.scaleY;
			this._spriteMatrix.recompose(comps);
			return this._spriteMatrix;
		}
	}
}
