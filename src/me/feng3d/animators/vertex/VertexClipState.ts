module feng3d
{
	
	/**
	 * 顶点动画剪辑状态
	 * @author feng 2015-9-18
	 */
	export class VertexClipState extends AnimationClipState implements IVertexAnimationState
	{
		private _frames:Geometry[];
		private _vertexClipNode:VertexClipNode;
		private _currentGeometry:Geometry;
		private _nextGeometry:Geometry;

		/**
		 * @inheritDoc
		 */
		public get currentGeometry():Geometry
		{
			if (this._framesDirty)
				this.updateFrames();

			return this._currentGeometry;
		}

		/**
		 * @inheritDoc
		 */
		public get nextGeometry():Geometry
		{
			if (this._framesDirty)
				this.updateFrames();

			return this._nextGeometry;
		}

		/**
		 * 创建VertexClipState实例
		 * @param animator				动画
		 * @param vertexClipNode		顶点动画节点
		 */
		constructor(animator:AnimatorBase, vertexClipNode:VertexClipNode)
		{
			super(animator, vertexClipNode);

			this._vertexClipNode = vertexClipNode;
			this._frames = this._vertexClipNode.frames;
		}

		/**
		 * @inheritDoc
		 */
		protected updateFrames()
		{
			super.updateFrames();

			this._currentGeometry = this._frames[this._currentFrame];

			if (this._vertexClipNode.looping && this._nextFrame >= this._vertexClipNode.lastFrame)
			{
				this._nextGeometry = this._frames[0];
				this._animator.dispatchCycleEvent();
			}
			else
				this._nextGeometry = this._frames[this._nextFrame];
		}
	}
}
