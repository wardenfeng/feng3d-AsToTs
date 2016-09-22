

module feng3d
{
    export class BulkLoader extends EventDispatcher
    {
        static LOG_ERRORS;
        
        start;
        isRunning;
        logLevel;
        
        constructor(a)
        {
            super();
        }
        
        static COMPLETE;
        static PROGRESS;
        items;
        
        hasItem(_url)
        {
            
        }
        
        add(_url, d?)
        {
            
        }
        
        get(_url):LoadingItem
        {
            return null;
        }
    }
}