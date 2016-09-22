module feng3d
{
	
	
	
	

	
	
	
	
	

	/**
	 * sprite动画剪辑节帮助程序
	 * @author feng 2015-9-18
	 */
	export class SpriteSheetHelper
	{
		/**
		 * 创建sprite动画剪辑节帮助程序实例
		 */
		constructor()
		{
		}

		/**
		 * 根据影片剪辑生成纹理列表
		 * @param sourceMC					源影片剪辑
		 * @param cols						U方向个数
		 * @param rows						V方向个数
		 * @param width						宽度
		 * @param height					高度
		 * @param transparent 				是否透明
		 * @param backgroundColor			贝爷颜色
		 */
		public generateFromMovieClip(sourceMC:MovieClip, cols:number, rows:number, width:number, height:number, transparent:boolean = false, backgroundColor:number = 0):Texture2DBase[]
		{
			var spriteSheets:Texture2DBase[] = [];
			var framesCount:number = sourceMC.totalFrames;
			var i:number = framesCount;
			var w:number = width;
			var h:number = height;

			if (!TextureUtils.isPowerOfTwo(w))
				w = TextureUtils.getBestPowerOf2(w);
			if (!TextureUtils.isPowerOfTwo(h))
				h = TextureUtils.getBestPowerOf2(h);

			var spriteSheet:BitmapData;
			var destCellW:number = Math.round(h / cols);
			var destCellH:number = Math.round(w / rows);
			//var cellRect:Rectangle = new Rectangle(0, 0, destCellW, destCellH);

			var mcFrameW:number = sourceMC.width;
			var mcFrameH:number = sourceMC.height;

			var sclw:number = destCellW / mcFrameW;
			var sclh:number = destCellH / mcFrameH;
			var t:Matrix = new Matrix();
			t.scale(sclw, sclh);

			var tmpCache:BitmapData = new BitmapData(mcFrameW * sclw, mcFrameH * sclh, transparent, transparent ? 0x00FFFFFF : backgroundColor);

			var u:number, v:number;
			var cellsPerMap:number = cols * rows;
			var maps:number = framesCount / cellsPerMap;
			if (maps < framesCount / cellsPerMap)
				maps++;

			var pastePoint:Point = new Point();
			var frameNum:number = 0;
			var bitmapTexture:BitmapTexture;

			while (maps--)
			{

				u = v = 0;
				spriteSheet = new BitmapData(w, h, transparent, transparent ? 0x00FFFFFF : backgroundColor);

				for (i = 0; i < cellsPerMap; i++)
				{
					frameNum++;
					if (frameNum <= framesCount)
					{
						pastePoint.x = Math.round(destCellW * u);
						pastePoint.y = Math.round(destCellH * v);
						sourceMC.gotoAndStop(frameNum);
						tmpCache.draw(sourceMC, t, null, "normal", tmpCache.rect, true);
						spriteSheet.copyPixels(tmpCache, tmpCache.rect, pastePoint);

						if (transparent)
							tmpCache.fillRect(tmpCache.rect, 0x00FFFFFF);

						u++;
						if (u == cols)
						{
							u = 0;
							v++;
						}

					}
					else
						break;

				}

				bitmapTexture = new BitmapTexture(spriteSheet);
				spriteSheets.push(bitmapTexture);
			}

			tmpCache.dispose();

			return spriteSheets;
		}

		/**
		 * 生成一个SpriteSheetClipNode
		 * @param animID					动画编号
		 * @param cols						U方向个数
		 * @param rows						V方向个数
		 * @param mapCount					映射数量
		 * @param from						起始索引
		 * @param to						终止索引
		 */
		public generateSpriteSheetClipNode(animID:string, cols:number, rows:number, mapCount:number = 1, from:number = 0, to:number = 0):SpriteSheetClipNode
		{
			var spriteSheetClipNode:SpriteSheetClipNode = new SpriteSheetClipNode();
			spriteSheetClipNode.name = animID;

			var u:number, v:number;
			var framesCount:number = cols * rows;

			if (mapCount < 1)
				mapCount = 1;
			if (to == 0 || to < from || to > framesCount * mapCount)
				to = cols * rows * mapCount;

			if (from > to)
				throw new Error("Param 'from' must be lower than the 'to' param.");

			var scaleV:number = 1 / rows;
			var scaleU:number = 1 / cols;

			var frame:SpriteSheetAnimationFrame;

			var i:number, j:number;
			var animFrames:number = 0;

			for (i = 0; i < mapCount; ++i)
			{
				u = v = 0;

				for (j = 0; j < framesCount; ++j)
				{

					if (animFrames >= from && animFrames < to)
					{

						frame = new SpriteSheetAnimationFrame();
						frame.offsetU = scaleU * u;
						frame.offsetV = scaleV * v;
						frame.scaleU = scaleU;
						frame.scaleV = scaleV;
						frame.mapID = i;

						spriteSheetClipNode.addFrame(frame, 16);
					}

					if (animFrames == to)
						return spriteSheetClipNode;

					animFrames++;

					u++;
					if (u == cols)
					{
						u = 0;
						v++;
					}
				}
			}

			return spriteSheetClipNode;
		}
	}
}
