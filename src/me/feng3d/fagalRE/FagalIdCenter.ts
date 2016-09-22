module feng3d {
	/**
	 * Fagal编号中心
	 * @author feng 2015-7-23
	 */
    export class FagalIdCenter extends Proxy {
        private static _instance: FagalIdCenter;

		/**
		 * 创建Fagal编号中心
		 */
        public FagalIdCenter() {
            if (FagalIdCenter._instance)
                throw new Error("该类为单例");
            FagalIdCenter._instance = this;
        }

		/**
		 * @inheritDoc
		 */
        public hasOwnProperty(V = null): boolean {
            var attr: string = V;
            return FagalRE.idDic[attr] != null;
        }

		/**
		 * @inheritDoc
		 */
        public getProperty(name) {
            var attr: string = name;

            return attr;
        }

		/**
		 * Fagal编号中心实例
		 */
        public static get instance(): FagalIdCenter {
            return FagalIdCenter._instance || new FagalIdCenter();
        }
    }
}
