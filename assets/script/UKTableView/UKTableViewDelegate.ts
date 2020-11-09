export interface UKTableViewDelegate {
    /**
     * 获取行高
     * @param index 
     */
    sizeAtIndex?(index: number): number;

    /**
     * 估算的行高
     * @param index 
     */
    estimateSizeAtIndex?(index: number): number;
}