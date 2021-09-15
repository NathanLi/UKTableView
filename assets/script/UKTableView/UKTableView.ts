import UKTableViewCell, { ICellSizeChangedInfo } from "./cell/UKTableViewCell";
import { EUKTableViewType, EUKVerticalDirection, EUKHorizontalDirection } from "./EUKTableViewType";
import { IUKLayout } from "./layout/IUKLayout";
import { UKLayoutHorizontal } from "./layout/UKLayoutHorizontal";
import { UKLayoutVertical } from "./layout/UKLayoutVertical";
import { UKTableViewDataSrouce } from "./UKTableViewDataSource";

const {ccclass, property, executionOrder} = cc._decorator;

@ccclass
@executionOrder(-1)
export default class UKTableView extends cc.Component {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property({type: cc.Enum(EUKTableViewType), tooltip: CC_DEV && 'VERTICAL: 垂直自动排列\n HORIZONTAL: 水平自动排列'})
    type: EUKTableViewType = EUKTableViewType.VERTICAL;

    @property({
        tooltip: CC_DEV && '容器内上边距，只会在一个布局方向上生效',
        visible:function() {return this.type == EUKTableViewType.VERTICAL},
    })
    paddingTop: number = 0;

    @property({
        tooltip: CC_DEV && '容器内下边距，只会在一个布局方向上生效',
        visible:function() {return this.type == EUKTableViewType.VERTICAL}, 
    })
    paddingBottom: number = 0;

    @property({
        tooltip: CC_DEV && '容器内左边距，只会在一个布局方向上生效',
        visible:function() {return this.type == EUKTableViewType.HORIZONTAL}, 
    })
    paddingLeft: number = 0;

    @property({
        tooltip: CC_DEV && '容器内右边距，只会在一个布局方向上生效',
        visible:function() {return this.type == EUKTableViewType.HORIZONTAL}, 
    })
    paddingRight: number = 0;

    @property({
        visible:function() {return this.type == EUKTableViewType.VERTICAL}, 
        tooltip: CC_DEV && '相邻子节点间的垂直距离',
    })
    spaceY: number = 0;

    @property({
        visible:function() {return this.type == EUKTableViewType.HORIZONTAL}, 
        tooltip: CC_DEV && '相邻子节点间的水平距离',
    })
    spaceX: number = 0;

    @property({
        visible:function() {return this.type == EUKTableViewType.VERTICAL}, 
        tooltip: CC_DEV && '垂直排列子节点的方向，包括：\nTOP_TO_BOTTOM: 从上往下排\nBOTTOM_TO_TOP: 从下往上排',
        type: cc.Enum(EUKVerticalDirection)
    })
    verticalDirection: EUKVerticalDirection = EUKVerticalDirection.TOP_TO_BOTTOM;

    @property({
        visible:function() {return this.type == EUKTableViewType.HORIZONTAL}, 
        tooltip: CC_DEV && '水平排列子节点的方向，包括：\nLEFT_TO_RIGHT: 从上往下排\nRIGHT_TO_LEFT: 从下往上排',
        type: cc.Enum(EUKHorizontalDirection)
    })
    horizontalDirection: EUKHorizontalDirection = EUKHorizontalDirection.LEFT_TO_RIGHT;

    private _reloaded: boolean = false;
    private _count: number = 0;
    private _layout: IUKLayout;

    /** 注册的 cell 的平均边长 */
    private _avgCellSide: number = 0;

    /** 当前正在生成的 cell 的 index */
    private _curGenIndex: number = 0;
    
    /** 用于重新布局的 timer */
    private _timerLayout: number = 0;

    private _cacheSide: {[index: number]: number} = {};
    private _cacheCell: {[identifier: string]: [UKTableViewCell]} = {};
    private _registedCell: {[identifier: string]: cc.Node | cc.Prefab} = {};

    dataSource: UKTableViewDataSrouce;

    private _content: cc.Node = null;
    private get content() {
        if (!cc.isValid(this._content)) {
            this._content = this.scrollView.content;
        }
        return this._content;
    }

    onLoad() {
        this.regsiteFromContent();
    }

    onDestroy() {
        for (let key in this._cacheCell) {
            this._cacheCell[key].forEach(v => v.destroy());
        }

        for (let key in this._registedCell) {
            const value = this._registedCell[key];
            if (isNode(value)) {
                value.destroy();
            }
        }

        if (this._layout) {
            this._layout.destory();
        }

        this.dataSource = null;
    }

    private regsiteFromContent() {
        this.content.children.slice().forEach(node => {
            const comp = node.getComponent(UKTableViewCell);
            if (comp && comp.identifier) {
                this.registe(node, comp.identifier);
            }
        });

        this.content.removeAllChildren();
    }

    registe(source: cc.Node | cc.Prefab, identifier?: string): void {
        if (!identifier) {
            identifier = 'default';
        }
        this._registedCell[identifier] = source;
    }

    dequeueReusableCell(identifier?: string): UKTableViewCell {
        if (!identifier) {
            identifier = 'default';
        }

        const cacheCells = this._cacheCell[identifier] || [];
        const side = this.sizeAtIndex(this._curGenIndex);

        let cell = cacheCells.pop();
        if (!cell) {
            const souce = this._registedCell[identifier];
            const node = cc.instantiate(souce) as cc.Node;
            cell = node.getComponent(UKTableViewCell);
            if (!cell) {
                cell = node.addComponent(UKTableViewCell);
                cell.identifier = identifier;
            }
            // this._layout.setSide(cell.node, side);
        }

        cell.__toUse();
        cell.node.on(UKTableViewCell.EventSizeChanged, this.onCellSizeChanged, this);

        return cell;
    }

    reloadData(): void {
        if (!this.dataSource) {
            throw 'you should set dataSource!';
        }

        this._count = this.dataSource.numberOfCell();;

        this.recycleAllCells();
        this.resetCache();
        this.setupLayoutArgs();
        this.setupContentSize();

        if (!this._reloaded) {
            this._reloaded = true;
            // init the offset
            if (this.type == EUKTableViewType.VERTICAL) {
                if (this.verticalDirection == EUKVerticalDirection.BOTTOM_TO_TOP) {
                    this.scrollView.scrollToBottom();
                } else {
                    this.scrollView.scrollToTop();
                }
            } else {
                if (this.horizontalDirection == EUKHorizontalDirection.RIGHT_TO_LEFT) {
                    this.scrollView.scrollToRight();
                } else {
                    this.scrollView.scrollToLeft();
                }
            }
        }

        this.doLayout();
    }
    
    insert(indexs: number[]): void {
        if (!indexs || !indexs.length) {
            return;
        }

        // indexs 的合法性校验
        const maxCount = this._count + indexs.length;
        for (let i = 0; i < indexs.length; ++i) {
            const index = indexs[i];
            if (index < 0 || index >= maxCount) {
                throw new Error(`${index} not exist!`);
            }
        }

        this._count += indexs.length;
        this._layout.insertCellAtIndexs(this.content, indexs);
        this.resetCache();
        this._relayoutNextTime();
    }

    delete(indexs: number[]): void {
        if (!indexs || !indexs.length) {
            return;
        }

        for (let i = 0; i < indexs.length; ++i) {
            const index = indexs[i];
            if (index < 0 || index >= this._count) {
                throw new Error(`${index} not exist!`);
            }
        }

        this._count -= indexs.length;
        this._layout.deleteCellAtIndexs(this.content, indexs);
        this.resetCache();
        this._relayoutNextTime();
    }

    /**
     * 
     * @param index 滚动到的目标
     * @param timeInSecond 动画时长
     * @param attenuated 滚动加速度是否衰减
     */
    scrollToIndex(index: number, timeInSecond: number = 0, attenuated = true): void {
        const toIndex = Math.min(Math.max(index, 0), this._count - 1);
        const pos = this._layout.getOffsetOfIndex(this.scrollView, toIndex, this._count);
        this.scrollView.scrollToOffset(pos, timeInSecond, attenuated);
    }

    visiableCells(): UKTableViewCell[] {
        return this._layout.getChildCells(this.content);
    }

    visiableCell(index: number): UKTableViewCell {
        const cells = this.visiableCells();
        return cells.find(c => c.index == index);
    }

    private setupLayoutArgs() {
        const ndContent = this.content;
        const cclayout = ndContent.getComponent(cc.Layout);

        cclayout && (cclayout.enabled = false);

        this._layout && (this._layout.destory());
        this._layout = this.createLayout();       
        
        this.calAveSide();
    }

    private calAveSide() {
        let sideCount = 0;
        let sourceCount = 0;
        for (let key of Object.keys(this._registedCell)) {
            let value = this._registedCell[key];
            let side = 0;

            if ((value as cc.Prefab).data) {
                side = this._layout.getSide((value as cc.Prefab).data);
            } else {
                side = this._layout.getSide(value as cc.Node);
            }

            sideCount += side;
            sourceCount += 1;
        }

        this._avgCellSide = sideCount / sourceCount;
    }

    private recycleAllCells() {
        if (this._layout) {
            this._layout.getChildCells(this.content).forEach(cell => {
                this.doRecycleCell(cell);
            });
        }
    }

    private resetCache() {
        this._cacheSide = {
            0: undefined,
            1: undefined,
            2: undefined
        };
    }

    private createLayout() {
        const layoutMaps = {
            [EUKTableViewType.VERTICAL]: () => new UKLayoutVertical(this.verticalDirection == EUKVerticalDirection.TOP_TO_BOTTOM),
            [EUKTableViewType.HORIZONTAL]: () => new UKLayoutHorizontal(this.horizontalDirection == EUKHorizontalDirection.LEFT_TO_RIGHT),
        };

        const layout: IUKLayout = layoutMaps[this.type]();

        layout.paddingTop = this.paddingTop;
        layout.paddingBottom = this.paddingBottom;
        layout.paddingLeft = this.paddingLeft;
        layout.paddingRight = this.paddingRight;
        layout.spaceX = this.spaceX;
        layout.spaceY = this.spaceY;
        layout.recyleCell = cell => this.doRecycleCell(cell);
        layout.sizeAtIndex = index => this.sizeAtIndex(index);
        layout.cellAtIndex = index => this.cellAtIndex(index);
        return layout;
    }

    private setupContentSize() {
        this._layout.setupContentSize(this.scrollView, this._count);
    }

    private doLayout() {
        this._layout && this._layout.doLayout(this.scrollView, this._count);
    }

    private sizeAtIndex(index: number): number {
        let size = this._cacheSide[index];
        if (!size) {
            this._cacheSide[index] = this._avgCellSide;
        }

        return size;
    }

    private doRecycleCell(cell: UKTableViewCell): void {
        cell.__prepareForReuse();
        cell.node.removeFromParent(false);

        const identifier = cell.identifier;
        if (this._cacheCell[identifier]) {
            this._cacheCell[identifier].push(cell);
        } else {
            this._cacheCell[identifier] = [cell];
        }
    }

    private cellAtIndex(index: number): UKTableViewCell {
        this._curGenIndex = index;

        const cell = this.dataSource.cellAtIndex(index);
        cell.__fixIndex(index);

        const side = this._layout.getSide(cell.node);
        const cache = this._cacheSide[index];
        if (cache && (side != cache)) {
            this._cacheSide[index] = side;
            this._relayoutNextTime();
        }

        return cell;
    }

    private onCellSizeChanged(event: cc.Event.EventCustom) {
        const info: ICellSizeChangedInfo = event.getUserData();
        const cell = info.cell;
        if (!cell.node.parent) {
            return;
        }

        const side = this._layout.getSide(cell.node);
        const index = cell.index;
        this._cacheSide[index] = side;

        this._relayoutNextTime();
    }

    /**
     * 下一个时间片进行重新布局
     * 
     * 不实时布局的的原因在于：
     * 多个 cell 的 side 可能同时在更改，在布局的过程中，有 cell 的 side 也可能会改。如果实时布局，那么可能会导致布局不正确。
     */
    private _relayoutNextTime() {
        if (this._timerLayout) {
            return;
        }

        this._timerLayout = setTimeout(() => {
            if (cc.isValid(this, true)) {
                this._relayout();
            }
        });
    }

    private _relayout() {
        this._timerLayout = 0;
        this.setupContentSize();
        this.fixCellPositions();
    }

    private fixCellPositions() {
        this._layout.fixPositions(this.scrollView, this._count);
    }

    lateUpdate() {
        this.doLayout();
    }
}

function isNode(v: cc.Node | cc.Prefab): boolean {
    return (v as cc.Prefab).data == undefined;
}