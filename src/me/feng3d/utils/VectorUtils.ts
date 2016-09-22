module feng3d
{


	/**
	 * 向量工具类
	 * @author feng 2014-12-10
	 */
	export class VectorUtils
	{
		/**
		 * 把source添加到target中
		 * @param source 源向量
		 * @param target 目标向量
		 */
		public static add(source:number[], target:number[]):number[]
		{
			var sourceLen:number = target.length;
			var targetLen:number = source.length;
			target.length = target.length + source.length;
			for (var i:number = 0; i < targetLen; i++)
			{
				target[sourceLen + i] = source[i];
			}
			return target;
		}

		/**
		 * 拷贝数组
		 * @param source		源数组
		 * @param target		目标数组
		 * @param offset		在源数组中的偏移量
		 */
		public static copy(source:number[], target:number[], offset:number)
		{
			source.forEach(function(item:number, index:number, ... args)
			{
				target[offset + index] = item;
			});
		}

		/**
		 * 把source添加到target中
		 * @param source 源向量
		 * @param target 目标向量
		 */
		public static add1(source:number[], target:number[], addNum:number):number[]
		{
			var sourceLen:number = target.length;
			var targetLen:number = source.length;
			target.length = target.length + source.length;
			for (var i:number = 0; i < targetLen; i++)
			{
				target[sourceLen + i] = source[i] + addNum;
			}
			return target;
		}


	}
}
