module feng3d
{
	

	/**
	 * 纹理材质工厂
	 * @author feng 2014-7-7
	 */
	export class MaterialUtils
	{
		private static dispatcher:GlobalDispatcher = GlobalDispatcher.instance;

		/**
		 * 创建纹理材质
		 * @param url		贴图路径
		 * @return			纹理材质
		 */
		public static createTextureMaterial(url:string):TextureMaterial
		{
			Load.init();

			var textureMaterial:TextureMaterial = new TextureMaterial(DefaultMaterialManager.getDefaultTexture());

			var loadObj:LoadModuleEventData = new LoadModuleEventData();
			loadObj.urls = [url];
			loadObj.addEventListener(LoadUrlEvent.LOAD_SINGLE_COMPLETE, MaterialUtils.onLoadSingleComplete);

			loadObj.data = {textureMaterial: textureMaterial}
			MaterialUtils.dispatcher.dispatchEvent(new LoadModuleEvent(LoadModuleEvent.LOAD_RESOURCE, loadObj));

			return textureMaterial;
		}

		protected static onLoadSingleComplete(event:LoadUrlEvent)
		{
			var loadData:LoadModuleEventData = event.target as LoadModuleEventData;
			var textureMaterial:TextureMaterial = loadData.data.textureMaterial;
			var bitmap:Bitmap = event.loadTaskItem.loadingItem.content;
			textureMaterial.texture = Cast.bitmapTexture(bitmap);
		}
	}
}


