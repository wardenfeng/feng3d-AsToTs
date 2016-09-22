module feng3d
{
	
	
	
	
	
	export class DefaultMaterialManager
	{
		private static _defaultTextureBitmapData:BitmapData;
		private static _defaultMaterial:TextureMaterial;
		private static _defaultTexture:BitmapTexture;
		
		public static getDefaultMaterial():TextureMaterial
		{
			if (!DefaultMaterialManager._defaultTexture)
				DefaultMaterialManager.createDefaultTexture();
			
			if (!DefaultMaterialManager._defaultMaterial)
				DefaultMaterialManager.createDefaultMaterial();
			
			return DefaultMaterialManager._defaultMaterial;
		}
		
		public static getDefaultTexture():BitmapTexture
		{
			if (!DefaultMaterialManager._defaultTexture)
				DefaultMaterialManager.createDefaultTexture();
			
			return DefaultMaterialManager._defaultTexture;
		}
		
		private static createDefaultTexture(color:number = 0XFFFFFF)
		{
			DefaultMaterialManager._defaultTextureBitmapData = new BitmapData(8, 8, false, 0x0);
			
			//create chekerboard
			var i:number, j:number;
			for (i = 0; i < 8; i++) {
				for (j = 0; j < 8; j++) {
					if ((j & 1) ^ (i & 1))
						DefaultMaterialManager._defaultTextureBitmapData.setPixel(i, j, 0XFFFFFF);
				}
			}
			
			DefaultMaterialManager._defaultTexture = new BitmapTexture(DefaultMaterialManager._defaultTextureBitmapData);
		}
		
		private static createDefaultMaterial()
		{
			DefaultMaterialManager._defaultMaterial = new TextureMaterial(DefaultMaterialManager._defaultTexture);
			DefaultMaterialManager._defaultMaterial.mipmap = false;
			DefaultMaterialManager._defaultMaterial.smooth = false;
		}
	}
}
