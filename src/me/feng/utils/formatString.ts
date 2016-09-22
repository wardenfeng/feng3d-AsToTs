module feng3d {

	/**
	 * 格式化输出字符串
	 * @param format		需要格式化的字符串
	 * @param ...args		传入一个或多个需要替换的参数
	 *
	 * @example
	 * <pre>
		trace(formatString("[{0} type=\"{1}\" bubbles={2}  cancelable={3}]", "MouseEvent", "click", true, false));

		 // trace output
		 [MouseEvent type="click" bubbles=true  cancelable=false]
	 * </pre>
	 * @author feng 2014-5-7
	 */
    export function formatString(format: string, ...args): string {
        for (var i: number = 0; i < args.length; ++i)
            format = format.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);

        return format;
    }
}
