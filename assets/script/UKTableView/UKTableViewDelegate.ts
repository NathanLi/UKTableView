export interface UKTableViewDelegate {
    /**
     * Cell 的边长大小
     * @param index 
     */
    sizeAtIndex(index: number): number;

    /**
     * Cell 的边长大小变动
     * @param index 
     * @param size 变动后的大小
     */
    onSizeChanged(index: number, size: number): void;
}