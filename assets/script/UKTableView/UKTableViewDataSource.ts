import UKTableViewCell from "./cell/UKTableViewCell";

export interface UKTableViewDataSrouce {
    /**
     * 数量
     */
    numberOfCells(): number;

    /**
     * 
     * @param index 
     */
    cellAtIndex(index: number): UKTableViewCell;
}