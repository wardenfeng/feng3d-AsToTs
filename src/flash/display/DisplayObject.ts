module feng3d
{
    export class DisplayObject extends EventDispatcher
    {
        alpha;
        
        localToGlobal;
        stage:Stage;
        public visible;
        parent;
        public x;
        public getx()
        {
            return this.x;
        }
        public gety()
        {
            return this.y;
        }
        public y;
         width;
        height;
        transform;
        blendMode;
    }
}