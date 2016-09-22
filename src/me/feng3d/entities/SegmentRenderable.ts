module feng3d
{
	
	
	

	/**
	 *
	 * @author feng 2015-12-30
	 */
	export class SegmentRenderable extends Renderable
	{
		private segmentSet:SegmentSet;

		/**
		 * 创建一个可渲染对象基类
		 */
		constructor(subMesh:SegmentSet)
		{
			super();

			this.segmentSet = subMesh;
//			this._context3dCache.addChildBufferOwner(subMesh.context3DBufferOwner);
		}

		/**
		 * @inheritDoc
		 */
		public getMouseEnabled():boolean
		{
			return this.segmentSet.mouseEnabled;
		}

		/**
		 * @inheritDoc
		 */
		public getNumTriangles():number
		{
			return this.segmentSet.numTriangles;
		}

		/**
		 * @inheritDoc
		 */
		public getSourceEntity():Entity
		{
			return this.segmentSet.sourceEntity;
		}

		/**
		 * @inheritDoc
		 */
		public getMaterial():MaterialBase
		{
			return this.segmentSet.material;
		}

		/**
		 * @inheritDoc
		 */
		public getAnimator():AnimatorBase
		{
			return this.segmentSet.animator;
		}

		/**
		 * @inheritDoc
		 */
		public getCastsShadows():boolean
		{
			return this.segmentSet.castsShadows;
		}
	}
}

