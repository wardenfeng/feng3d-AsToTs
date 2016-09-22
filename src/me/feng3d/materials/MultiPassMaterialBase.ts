module feng3d {


	/**
	 *
	 * @author feng 2014-5-19
	 */
    export class MultiPassMaterialBase extends MaterialBase {
        constructor() {
            super();
        }

        public get texture(): Texture2DBase {
            return null;
        }

        public set texture(value: Texture2DBase) {
        }
    }
}
