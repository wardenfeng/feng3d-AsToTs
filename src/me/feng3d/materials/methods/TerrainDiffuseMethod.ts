module feng3d
{

	/**
	 * 地形渲染函数
	 * @author feng 2014-7-16
	 */
	export class TerrainDiffuseMethod extends BasicDiffuseMethod
	{
		private tileData:number[] = [0,0,0,0];
		private _blendingTexture:Texture2DBase;
		private _splats;
		private _numSplattingLayers:number;

		constructor(splatTextures, blendingTexture:Texture2DBase, tileData:number[])
		{
			super();

			this.splats = splatTextures;

			for (var i:number = 0; i < this.tileData.length && i < tileData.length; i++)
			{
				this.tileData[i] = tileData[i];
			}

			this.blendingTexture = blendingTexture;
			this._numSplattingLayers = this.splats.length;
			if (this._numSplattingLayers > 4)
				throw new Error("More than 4 splatting layers is not supported!");
		}

		public get splats()
		{
			return this._splats;
		}

		public set splats(value)
		{
			this._splats = value;
			this.context3DBufferOwner.markBufferDirty(this._.terrainTextures_fs_array);
		}

		public get blendingTexture():Texture2DBase
		{
			return this._blendingTexture;
		}

		public set blendingTexture(value:Texture2DBase)
		{
			this._blendingTexture = value;
			this.context3DBufferOwner.markBufferDirty(this._.blendingtexture_fs);
		}

		protected initBuffers()
		{
			super.initBuffers();
			this.context3DBufferOwner.mapContext3DBuffer(this._.blendingtexture_fs, this.updateBlendingTextureBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.terrainTextures_fs_array, this.updateTerrainTextureBuffer);
			this.context3DBufferOwner.mapContext3DBuffer(this._.tile_fc_vector, this.updateTileDataBuffer);
		}

		private updateTerrainTextureBuffer(terrainTextureBufferArr:FSArrayBuffer)
		{
			terrainTextureBufferArr.update(this.splats);
		}

		private updateTileDataBuffer(tileDataBuffer:FCVectorBuffer)
		{
			tileDataBuffer.update(this.tileData);
		}

		private updateBlendingTextureBuffer(nBlendingTextureBuffer:FSBuffer)
		{
			nBlendingTextureBuffer.update(this.blendingTexture);
		}

		public activate(shaderParams:ShaderParams)
		{
			super.activate(shaderParams);

			//通用渲染参数
			var terrainShaderParams:TerrainShaderParams = shaderParams.getOrCreateComponentByClass(TerrainShaderParams);

			terrainShaderParams.splatNum = this._numSplattingLayers;

			shaderParams.addSampleFlags(this._.texture_fs, this.texture, Context3DWrapMode.REPEAT);
			shaderParams.addSampleFlags(this._.terrainTextures_fs_array, this.splats[0], Context3DWrapMode.REPEAT);
			shaderParams.addSampleFlags(this._.blendingtexture_fs, this.blendingTexture);

			var lightShaderParams:LightShaderParams = shaderParams.getOrCreateComponentByClass(LightShaderParams);
			lightShaderParams.diffuseMethod = F_TerrainDiffusePostLighting;
		}
	}
}
