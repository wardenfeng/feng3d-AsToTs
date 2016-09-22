module feng3d {

	/**
	 * SpriteSheet材质
	 * @author feng 2014-4-15
	 */
    export class SpriteSheetMaterial extends TextureMaterial {
        private _diffuses: Texture2DBase[];
        private _normals: Texture2DBase[];
        private _speculars: Texture2DBase[];

        private _TBDiffuse: Texture2DBase;
        private _TBNormal: Texture2DBase;
        private _TBSpecular: Texture2DBase;

        private _currentMapID: number;

		/**
		 * 创建SpriteSheetMaterial实例
		 *
		 * @param diffuses			漫反射纹理列表
		 * @param normals			法线纹理列表
		 * @param speculars			高光纹理列表
		 * @param smooth			是否平滑
		 * @param repeat			是否重复
		 * @param mipmap			是否使用mipmap
		 */
        constructor(diffuses: Texture2DBase[], normals: Texture2DBase[] = null, speculars: Texture2DBase[] = null, smooth: boolean = true, repeat: boolean = false, mipmap: boolean = true) {
            super(diffuses[0], smooth, repeat, mipmap);
            this._diffuses = diffuses;
            this._normals = normals;
            this._speculars = speculars;

            this.initTextures();


            if (this._TBNormal)
                this.normalMap = this._TBNormal;

            if (this._TBSpecular)
                this.specularMap = this._TBSpecular;

        }

        private initTextures() {
            if (!this._diffuses || this._diffuses.length == 0)
                throw new Error("you must pass at least one bitmapdata into diffuses param!");

            this._TBDiffuse = this._diffuses[0];

            if (this._normals && this._normals.length > 0) {
                if (this._normals.length != this._diffuses.length)
                    throw new Error("The amount of normals bitmapDatas must be same as the amount of diffuses param!");

                this._TBNormal = this._normals[0];
            }

            if (this._speculars && this._speculars.length > 0) {
                if (this._speculars.length != this._diffuses.length)
                    throw new Error("The amount of normals bitmapDatas must be same as the amount of diffuses param!");

                this._TBSpecular = this._speculars[0];
            }

            this._currentMapID = 0;

        }

		/**
		 * 切换
		 * @param mapID			映射编号
		 * @return				是否切换成功
		 */
        public swap(mapID: number = 0): boolean {

            if (this._currentMapID != mapID) {

                this._currentMapID = mapID;

                this._TBDiffuse = this._diffuses[mapID];
                this.texture = this._TBDiffuse;

                if (this._TBNormal)
                    this.normalMap = this._TBNormal = this._normals[mapID];

                if (this._TBSpecular)
                    this.specularMap = this._TBSpecular = this._speculars[mapID];

                return true;

            }

            return false;

        }

    }
}
