module feng3d {

    /**
     * 获取feng3d运行时间
     */
    export function getTimer(): number {
        return Date.now() - $feng3dStartTime;
    }
}