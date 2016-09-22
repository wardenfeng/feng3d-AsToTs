module feng3d
{
	

	/**
	 * 解析事件
	 * @author feng 2014-5-16
	 */
	export class ParserEvent extends Event
	{
		private _message:string;

		/**
		 * Dispatched when parsing of an asset completed.
		 */
		public static PARSE_COMPLETE:string = 'parseComplete';

		/**
		 * Dispatched when an error occurs while parsing the data (e.g. because it's
		 * incorrectly formatted.)
		 */
		public static PARSE_ERROR:string = 'parseError';

		/**
		 * Dispatched when a parser is ready to have dependencies retrieved and resolved.
		 * This is an internal event that should rarely (if ever) be listened for by
		 * external classes.
		 */
		public static READY_FOR_DEPENDENCIES:string = 'readyForDependencies';

		constructor(type:string, message:string = '')
		{
			super(type);

			this._message = message;
		}

		/**
		 * Additional human-readable message. Usually supplied for PARSE_ERROR events.
		 */
		public get message():string
		{
			return this._message;
		}
	}
}
