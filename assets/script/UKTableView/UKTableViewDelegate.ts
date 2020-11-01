export interface UKTableViewDelegate {
    /**
     * 获取行高
     * @param index 
     */
    sizeAtIndex?(index: number): cc.Size;

    /**
     * 估算的行高
     * @param index 
     */
    estimateSizeAtIndex?(index: number): cc.Size;
}