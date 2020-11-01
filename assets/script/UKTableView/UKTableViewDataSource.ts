export interface UKTableViewDataSrouce {
    /**
     * 数量
     */
    numberOfRows: number;

    /**
     * 
     * @param index 
     */
    cellAtIndex(index: number): cc.Node;
}