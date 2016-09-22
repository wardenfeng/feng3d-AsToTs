module feng3d
{
	/**
	 * 资源处理
	 * @author feng 2014-3-24
	 */
	export class Cast
	{
		private static _notClasses = {};
		private static _classes = {};

		/**
		 * 获取类定义
		 * @param name		类描述字符串
		 * @return			类定义
		 */
		public static tryClass(name:string):Object
		{
			if (Cast._notClasses[name])
				return name;

			var result = Cast._classes[name];

			if (result != null)
				return result;

			try
			{
				result = getDefinitionByName(name);
				Cast._classes[name] = result;
				return result;
			}
			catch (error)
			{
			}

			Cast._notClasses[name] = true;

			return name;
		}

		/**
		 * 转换位图数据
		 * @param data		位图数据
		 * @return 			位图数据
		 */
		public static bitmapData(data):BitmapData
		{
			if (data == null)
				return null;

			if (is(data , String))
				data = Cast.tryClass(data);

			if (is(data , Function))
			{
				try
				{
					data = new data;
				}
				catch (bitmapError)
				{
					data = new data(0, 0);
				}
			}

			if (is(data , BitmapData))
				return data;

			if (is(data , Bitmap))
			{
				if ((data as Bitmap).hasOwnProperty("Cast.bitmapData")) // if (data is BitmapAsset)
					return as(data , Bitmap).bitmapData;
			}

			if (is(data , DisplayObject))
			{
				var ds:DisplayObject = data as DisplayObject;
				var bmd:BitmapData = new BitmapData(ds.width, ds.height, true, 0x00FFFFFF);
				var mat:Matrix = ds.transform.matrix.clone();
				mat.tx = 0;
				mat.ty = 0;
				bmd.draw(ds, mat, ds.transform.colorTransform, ds.blendMode, bmd.rect, true);
				return bmd;
			}

			throw new Error("Can't cast to BitmapData: " + data);
		}

		/**
		 * 转换位图纹理
		 * @param data		位图数据
		 * @return 			位图纹理
		 */
		public static bitmapTexture(data):BitmapTexture
		{
			if (data == null)
				return null;

			if (is(data , String))
				data = Cast.tryClass(data);

			if (is(data , Function))
			{
				try
				{
					data = new data;
				}
				catch (materialError)
				{
					data = new data(0, 0);
				}
			}

			if (is(data , Texture))
				return data;

			try
			{
				var bmd:BitmapData = Cast.bitmapData(data);
				return new BitmapTexture(bmd);
			}
			catch (error)
			{
			}

			throw new Error("Can't cast to BitmapTexture: " + data);
		}
	}
}
