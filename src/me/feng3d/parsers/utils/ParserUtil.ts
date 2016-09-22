module feng3d
{
	

	/**
	 * 解析工具类
	 */
	export class ParserUtil
	{
		/**
		 * 把数据转换为字符串
		 * @param data 数据
		 * @param length 需要转换的长度
		 * @return
		 */
		public static toString(data, length:number = 0):string
		{
			var ba:ByteArray;

			length =length || Number.MAX_VALUE;

			if (is(data , String))
				return as(data,String).substr(0, length);

			ba = as(data,ByteArray);
			if (ba)
			{
				ba.position = 0;
				return ba.readUTFBytes(Math.min(ba.bytesAvailable, length));
			}

			return null;
		}
	}
}
