module feng3d
{
	

	

	/**
	 * 位图立方体纹理代理
	 * @author feng 2014-7-12
	 */
	export class BitmapCubeTexture extends CubeTextureBase
	{
		private _bitmapDatas:BitmapData[];

		public optimizeForRenderToTexture:boolean = false;
		public streamingLevels:number = 0

		/**
		 * 创建位图立方体纹理代理
		 * @param posX			X正方向位图
		 * @param negX			X负方向位图
		 * @param posY			Y正方向位图
		 * @param negY			Y负方向位图
		 * @param posZ			Z正方向位图
		 * @param negZ			Z负方向位图
		 */
		constructor(posX:BitmapData, negX:BitmapData, posY:BitmapData, negY:BitmapData, posZ:BitmapData, negZ:BitmapData)
		{
			super();

			this._bitmapDatas = [];
			this.testSize(this._bitmapDatas[0] = posX);
			this.testSize(this._bitmapDatas[1] = negX);
			this.testSize(this._bitmapDatas[2] = posY);
			this.testSize(this._bitmapDatas[3] = negY);
			this.testSize(this._bitmapDatas[4] = posZ);
			this.testSize(this._bitmapDatas[5] = negZ);

			this.setSize(posX.width, posX.height);
		}

		/**
		 * 位图列表
		 */
		public get bitmapDatas():BitmapData[]
		{
			return this._bitmapDatas;
		}

		/**
		 * 正X方向位图（右面位图）
		 */
		public get positiveX():BitmapData
		{
			return this._bitmapDatas[0];
		}

		public set positiveX(value:BitmapData)
		{
			this.testSize(value);
			this.invalidateContent();
			this.setSize(value.width, value.height);
			this._bitmapDatas[0] = value;
		}

		/**
		 * 负X方向位图（左面位图）
		 */
		public get negativeX():BitmapData
		{
			return this._bitmapDatas[1];
		}

		public set negativeX(value:BitmapData)
		{
			this.testSize(value);
			this.invalidateContent();
			this.setSize(value.width, value.height);
			this._bitmapDatas[1] = value;
		}

		/**
		 * 正Y方向位图（上面位图）
		 */
		public get positiveY():BitmapData
		{
			return this._bitmapDatas[2];
		}

		public set positiveY(value:BitmapData)
		{
			this.testSize(value);
			this.invalidateContent();
			this.setSize(value.width, value.height);
			this._bitmapDatas[2] = value;
		}

		/**
		 * 负Y方向位图（下面位图）
		 */
		public get negativeY():BitmapData
		{
			return this._bitmapDatas[3];
		}

		public set negativeY(value:BitmapData)
		{
			this.testSize(value);
			this.invalidateContent();
			this.setSize(value.width, value.height);
			this._bitmapDatas[3] = value;
		}

		/**
		 * 正Z方向位图（前面位图）
		 */
		public get positiveZ():BitmapData
		{
			return this._bitmapDatas[4];
		}

		public set positiveZ(value:BitmapData)
		{
			this.testSize(value);
			this.invalidateContent();
			this.setSize(value.width, value.height);
			this._bitmapDatas[4] = value;
		}

		/**
		 * 负Z方向位图（后面位图）
		 */
		public get negativeZ():BitmapData
		{
			return this._bitmapDatas[5];
		}

		public set negativeZ(value:BitmapData)
		{
			this.testSize(value);
			this.invalidateContent();
			this.setSize(value.width, value.height);
			this._bitmapDatas[5] = value;
		}

		/**
		 * 检查位图尺寸
		 * @param value		位图
		 */
		private testSize(value:BitmapData)
		{
			if (value.width != value.height)
				throw new Error("BitmapData should have equal this.width and this.height!");
			if (!TextureUtils.isBitmapDataValid(value))
				throw new Error("Invalid bitmapData: Width and this.height must be power of 2 and cannot exceed 2048");
		}
	}
}
