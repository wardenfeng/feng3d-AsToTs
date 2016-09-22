module feng3d
{
	

	/**
	 * 线框立方体
	 * @author feng 2014-4-27
	 */
	export class WireframeCube extends WireframePrimitiveBase
	{
		private _cubeWidth:number;
		private _cubeHeight:number;
		private _cubeDepth:number;

		/**
		 * @param width X轴方向宽度
		 * @param height Y轴方向高度
		 * @param depth Z轴方向深度
		 * @param color 线条颜色
		 * @param thickness 线条厚度
		 */
		constructor(width:number = 100, height:number = 100, depth:number = 100, color:number = 0xFFFFFF, thickness:number = 1)
		{
			super(color, thickness);

			this._cubeWidth = width;
			this._cubeHeight = height;
			this._cubeDepth = depth;

			this.buildGeometry();
		}

		/**
		 * The size of the cube along its X-axis.
		 */
		public get cubeWidth():number
		{
			return this._cubeWidth;
		}

		public set cubeWidth(value:number)
		{
			this._cubeWidth = value;

			this.buildGeometry();
		}

		/**
		 * The size of the cube along its Y-axis.
		 */
		public get cubeHeight():number
		{
			return this._cubeHeight;
		}

		public set cubeHeight(value:number)
		{
			if (value <= 0)
				throw new Error("Value needs to be greater than 0");
			this._cubeHeight = value;

			this.buildGeometry();
		}

		/**
		 * The size of the cube along its Z-axis.
		 */
		public get cubeDepth():number
		{
			return this._cubeDepth;
		}

		public set cubeDepth(value:number)
		{
			this._cubeDepth = value;

			this.buildGeometry();
		}

		/**
		 * @inheritDoc
		 */
		protected buildGeometry()
		{
			this.segmentGeometry.removeAllSegments();

			var v0:Vector3D = new Vector3D();
			var v1:Vector3D = new Vector3D();
			var hw:number = this._cubeWidth * .5;
			var hh:number = this._cubeHeight * .5;
			var hd:number = this._cubeDepth * .5;

			v0.x = -hw;
			v0.y = hh;
			v0.z = -hd;
			v1.x = -hw;
			v1.y = -hh;
			v1.z = -hd;

			this.updateOrAddSegment(0, v0, v1);
			v0.z = hd;
			v1.z = hd;
			this.updateOrAddSegment(1, v0, v1);
			v0.x = hw;
			v1.x = hw;
			this.updateOrAddSegment(2, v0, v1);
			v0.z = -hd;
			v1.z = -hd;
			this.updateOrAddSegment(3, v0, v1);

			v0.x = -hw;
			v0.y = -hh;
			v0.z = -hd;
			v1.x = hw;
			v1.y = -hh;
			v1.z = -hd;
			this.updateOrAddSegment(4, v0, v1);
			v0.y = hh;
			v1.y = hh;
			this.updateOrAddSegment(5, v0, v1);
			v0.z = hd;
			v1.z = hd;
			this.updateOrAddSegment(6, v0, v1);
			v0.y = -hh;
			v1.y = -hh;
			this.updateOrAddSegment(7, v0, v1);

			v0.x = -hw;
			v0.y = -hh;
			v0.z = -hd;
			v1.x = -hw;
			v1.y = -hh;
			v1.z = hd;
			this.updateOrAddSegment(8, v0, v1);
			v0.y = hh;
			v1.y = hh;
			this.updateOrAddSegment(9, v0, v1);
			v0.x = hw;
			v1.x = hw;
			this.updateOrAddSegment(10, v0, v1);
			v0.y = -hh;
			v1.y = -hh;
			this.updateOrAddSegment(11, v0, v1);
		}

	}
}
