export interface UKTableViewDataSrouce {
    /**
     * 数量
     */
    numberOfCell: number;

    /**
     * 
     * @param index 
     */
    cellAtIndex(index: number): cc.Node;
}