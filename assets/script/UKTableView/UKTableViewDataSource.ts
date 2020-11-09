export interface UKTableViewDataSrouce {
    /**
     * 数量
     */
    count: number;

    /**
     * 
     * @param index 
     */
    cellAtIndex(index: number): cc.Node;
}