module feng3d
{
    export class Context3D
    {
        enableErrorChecking;
        dispose;
        driverInfo;
        setScissorRectangle;
        present;
        clear;
        configureBackBuffer;
        setRenderToTexture;
        setProgram;
        setProgramConstantsFromVector;
        createVertexBuffer;
        drawTriangles;
        createIndexBuffer;
        setDepthTest;
        setBlendFactors;
        setProgramConstantsFromMatrix;
        setProgramConstantsFromByteArray;
        setCulling;
        
        createTexture(width, height, format, b):Texture
        {
            return null;
            
        }
        
        public createProgram():Program3D
        {
            return null;
        }
        
        
        public setRenderToBackBuffer()
        {
            
        }
        
        public setVertexBufferAt;
        
        public setTextureAt(i, b)
        {
            
        }
    }
}