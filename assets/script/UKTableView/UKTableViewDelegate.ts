export interface UKTableViewDelegate {
    /**
     * 获取行高
     * @param index 
     */
    heightAtIndex?(index: number): number;

    /**
     * 估算的行高
     * @param index 
     */
    estimateHeightAtIndex?(index: number): number;
}