module feng3d {

	/**
	 * 
	 * @author feng 2014-5-19
	 */
    export class ColorMultiPassMaterial extends MultiPassMaterialBase {
        private _ambientColor: number = 0xffffff;
        private _specularColor: number = 0xffffff;
        private _specular: number = 1;

        constructor(color: number = 0xcccccc) {
            super();
        }

        public get ambientColor(): number {
            return this._ambientColor;
        }

        public set ambientColor(value: number) {
            this._ambientColor = value;
        }

        public get specularColor(): number {
            return this._specularColor;
        }

        public set specularColor(value: number) {
            this._specularColor = value;
        }

        public get specular(): number {
            return this._specular;
        }

        public set specular(value: number) {
            this._specular = value;
        }


    }
}