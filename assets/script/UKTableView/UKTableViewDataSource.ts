import UKTableViewCell from "./cell/UKTableViewCell";

export interface UKTableViewDataSrouce {
    /**
     * 
     * @param index 
     */
    cellAtIndex(index: number): UKTableViewCell;
    
}