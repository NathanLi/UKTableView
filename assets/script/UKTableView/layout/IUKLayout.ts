import UKTableViewCell from "../cell/UKTableViewCell";

export interface IUKLayout {
    head: number;
    tail: number;
    space: number;

    minDiff: number;

    destory(): void;

    /**
     * 计算 cell 的边长  
     * 必须注入
     */
    sizeAtIndex?: (index: number) => number;

    /**
     * 生成一个 cell
     */
    cellAtIndex?: (index: number) => UKTableViewCell;

    /**
     * 回收 cell
     */
    recyleCell?: (cell: UKTableViewCell) => void;
    
    initLayout(layout: cc.Layout): void;

    /**
     * 计算内容的总边长
     */
    calContentSize(count: number): number;

    /**
     * 开始布局
     * @param scrollView 
     */
    doLayout(scrollView: cc.ScrollView, count: number): void;

}