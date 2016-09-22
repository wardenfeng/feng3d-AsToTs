module feng3d {





	/**
	 * fagal函数单元
	 * @author feng 2015-8-8
	 */
    export class FagalItem {
        public funcName: string;
        public parameters;

		/**
		 * 创建一个fagal函数单元
		 * @param funcName			函数名称
		 * @param parameters		参数
		 */
        constructor(funcName: string, parameters) {
            this.funcName = funcName;
            this.parameters = parameters;
        }

		/**
		 * 获取参数中出现的寄存器id以及次数
		 * @param parameters			拥有寄存器的参数
		 * @return						寄存器id字典(key:regID,value:count)
		 */
        public getRegCountDic() {
            var dic = {};

            //针对使用到的寄存器计数
            if (this.funcName == "comment") {
                return dic;
            }

            var list: IField[] = this.getIFieldList();

            list.forEach(reg => {

                dic[reg.regId] = dic[reg.regId] + 1;
            });


            return dic;
        }

		/**
		 * 获取寄存器列表
		 */
        private getIFieldList(): IField[] {
            var list: IField[] = [];

            this.parameters.forEach(reg => {

                var registerArrayComplexItem: RegisterArrayComplexItem = reg as RegisterArrayComplexItem;
                if (registerArrayComplexItem != null) {

                    registerArrayComplexItem.complexArgs.forEach(complexArg => {

                        list.push(complexArg);
                    });
                }
                //记录寄存器使用次数
                if (reg != null) {
                    list.push(reg);
                }
            });


            return list;
        }
    }
}
