module feng3d
{
	

	/**
	 * 单条线段数据
	 * @author feng 2014-4-9
	 */
	export class Segment
	{
		protected _thickness:number;
		protected _start:Vector3D;
		protected _end:Vector3D;
		protected _startR:number;
		protected _startG:number;
		protected _startB:number;
		protected _endR:number;
		protected _endG:number;
		protected _endB:number;

		private _startColor:number;
		private _endColor:number;

		/**
		 * 创建一条线段数据
		 * @param start 起点坐标
		 * @param end 终点坐标
		 * @param colorStart 起点颜色
		 * @param colorEnd 终点颜色
		 * @param thickness 线段厚度
		 */		
		constructor(start:Vector3D, end:Vector3D, colorStart:number = 0x333333, colorEnd:number = 0x333333, thickness:number = 1)
		{
			this._thickness = thickness * .5;
			this._start = start;
			this._end = end;
			this.startColor = colorStart;
			this.endColor = colorEnd;
		}

		/**
		 * 更新线段信息
		 * @param start 起点坐标
		 * @param end 终点坐标
		 * @param colorStart 起点颜色
		 * @param colorEnd 终点颜色
		 * @param thickness 线段厚度
		 */		
		public updateSegment(start:Vector3D, end:Vector3D, colorStart:number = 0x333333, colorEnd:number = 0x333333, thickness:number = 1)
		{
			this._start = start;
			this._end = end;

			if (this._startColor != colorStart)
				this.startColor = colorStart;

			if (this._endColor != colorEnd)
				this.endColor = colorEnd;

			this._thickness = thickness * .5;

		}

		/**
		 * 起点坐标
		 */
		public get start():Vector3D
		{
			return this._start;
		}

		public set start(value:Vector3D)
		{
			this._start = value;

		}

		/**
		 * 终点坐标
		 */
		public get end():Vector3D
		{
			return this._end;
		}

		public set end(value:Vector3D)
		{
			this._end = value;
		}

		/**
		 * 线段厚度
		 */
		public get thickness():number
		{
			return this._thickness * 2;
		}

		public set thickness(value:number)
		{
			this._thickness = value * .5;

		}

		/**
		 * 起点颜色
		 */
		public get startColor():number
		{
			return this._startColor;
		}

		public set startColor(color:number)
		{
			this._startR = ((color >> 16) & 0xff) / 255;
			this._startG = ((color >> 8) & 0xff) / 255;
			this._startB = (color & 0xff) / 255;

			this._startColor = color;
		}

		/**
		 * 终点颜色
		 */
		public get endColor():number
		{
			return this._endColor;
		}

		public set endColor(color:number)
		{
			this._endR = ((color >> 16) & 0xff) / 255;
			this._endG = ((color >> 8) & 0xff) / 255;
			this._endB = (color & 0xff) / 255;

			this._endColor = color;
		}

		public dispose()
		{
			this._start = null;
			this._end = null;
		}

		public get startR():number
		{
			return this._startR;
		}

		public get startG():number
		{
			return this._startG;
		}

		public get startB():number
		{
			return this._startB;
		}

		public get endR():number
		{
			return this._endR;
		}

		public get endG():number
		{
			return this._endG;
		}

		public get endB():number
		{
			return this._endB;
		}
	}
}
