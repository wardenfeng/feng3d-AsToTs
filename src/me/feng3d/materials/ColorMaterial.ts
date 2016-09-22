module feng3d
{
	

	/**
	 * 颜色材质
	 * @author feng 2014-4-15
	 */
	export class ColorMaterial extends SinglePassMaterialBase
	{
		private _diffuseAlpha:number = 1;

		constructor(color:number = 0xcccccc, alpha:number = 1)
		{
			super();
			this.color = color;
			this.alpha = alpha;
		}

		/**
		 * 透明度
		 */
		public get alpha():number
		{
			return this._screenPass.diffuseMethod.diffuseAlpha;
		}

		public set alpha(value:number)
		{
			if (value > 1)
				value = 1;
			else if (value < 0)
				value = 0;
			this._screenPass.diffuseMethod.diffuseAlpha = this._diffuseAlpha = value;
			this._screenPass.setBlendMode(this.blendMode == BlendMode.NORMAL && this.requiresBlending ? BlendMode.LAYER : this.blendMode);
		}
 
		/**
		 * 颜色
		 */
		public get color():number
		{
			return this._screenPass.diffuseMethod.diffuseColor;
		}

		public set color(value:number)
		{
			this._screenPass.diffuseMethod.diffuseColor = value;
		}
		
		public get requiresBlending():boolean
		{
			return super.getRequiresBlending() || this._diffuseAlpha < 1;
		}
	}
}
