export interface UKTableViewDelegate {
    /**
     * 获取行高
     * @param index 
     */
    rowHeight?(index: number): number;
}