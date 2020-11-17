export interface UKTableViewDelegate {
    /**
     * 估算的行高
     * @param index 
     */
    estimateSizeAtIndex?(index: number): number;
}