import UKTableViewCell from "./cell/UKTableViewCell";

export interface UKTableViewDataSrouce {
    /**
     * 根据索引获取 cell
     * @param index 
     */
    cellAtIndex(index: number): UKTableViewCell;

    /**
     * cell 的数量
     */
    numberOfCell(): number;
}