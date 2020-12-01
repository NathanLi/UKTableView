import UKTableViewCell from "../cell/UKTableViewCell";

export interface IUKLayout {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    
    spaceY: number;
    spaceX: number;

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
    
    /**
     * 计算内容的总边长
     */
    calContentSize(count: number): number;

    /**
     * 根据索引插入可见的 cells
     * @param content 
     * @param indexs 
     */
    insertCellAtIndexs(content: cc.Node, indexs: number[]): void;

    /**
     * 根据索引删除可见的 cells
     * @param indexs 
     */
    deleteCellAtIndexs(content: cc.Node, indexs: number[]): void;

    /**
     * 开始布局(会有回收、添加cell)
     * @param scrollView 
     * @param count 元素的总数量
     */
    doLayout(scrollView: cc.ScrollView, count: number): void;

    /**
     * 重新布局(不会回收、添加 cell)
     */
    fixPositions(scrollView: cc.ScrollView, count: number): void;

    /**
     * 获取 content 中的所有的 cell
     * @param content 
     */
    getChildCells(content: cc.Node): UKTableViewCell[];

    /**
     * 获取 index 相对 scrollView 左上角原点的偏移 (永远为正)
     * @param index 
     */
    getOffsetOfIndex(scroll: cc.ScrollView, eleIndex: number, eleCount: number): cc.Vec2;

    /** 更新边长 */
    setSide(node: cc.Node, side: number): void;
    /** 获取边长 */
    getSide(node: cc.Node): number;
}