import UKTableViewCell from "./cell/UKTableViewCell";
import { IUKLayout } from "./layout/IUKLayout";
import { UKLayoutHorizontal } from "./layout/UKLayoutHorizontal";
import { UKLayoutVertical } from "./layout/UKLayoutVertical";
import { UKTableViewDataSrouce } from "./UKTableViewDataSource";
import { UKTableViewDelegate } from "./UKTableViewDelegate";

const {ccclass, property, executionOrder} = cc._decorator;

export enum EUKTableViewType {
    VERTICAL = 0,
    HORIZONTAL = 1
}

export enum EUKTableViewVerticalDirection {
    TOP_TO_BOTTOM = 0,
    BOTTOM_TO_TOP = 1,
}

export enum EUKTableViewHorizontalDirection {
    LEFT_TO_RIGHT = 0,
    RIGHT_TO_LEFT = 1,
}

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

    @property({tooltip: CC_DEV && 'cell 的估算大小'})
    itemEstimateSize: number = 0;

    @property({
        visible:function() {return this.type == EUKTableViewType.VERTICAL}, 
        tooltip: CC_DEV && '垂直排列子节点的方向，包括：\nTOP_TO_BOTTOM: 从上往下排\nBOTTOM_TO_TOP: 从下往上排',
        type: cc.Enum(EUKTableViewVerticalDirection)
    })
    verticalDirection: EUKTableViewVerticalDirection = EUKTableViewVerticalDirection.TOP_TO_BOTTOM;

    @property({
        visible:function() {return this.type == EUKTableViewType.HORIZONTAL}, 
        tooltip: CC_DEV && '水平排列子节点的方向，包括：\nLEFT_TO_RIGHT: 从上往下排\nRIGHT_TO_LEFT: 从下往上排',
        type: cc.Enum(EUKTableViewHorizontalDirection)
    })
    horizontalDirection: EUKTableViewHorizontalDirection = EUKTableViewHorizontalDirection.LEFT_TO_RIGHT;

    private count: number = 0;
    private layout: IUKLayout;

    private cacheSide: {[index: number]: number} = {};
    private cacheCell: {[identifier: string]: [UKTableViewCell]} = {};
    private registedCell: {[identifier: string]: cc.Node | cc.Prefab} = {};

    delegate?: UKTableViewDelegate;
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
        for (let key in this.cacheCell) {
            this.cacheCell[key].forEach(v => v.destroy());
        }

        for (let key in this.registedCell) {
            this.registedCell[key].destroy();
        }

        if (this.layout) {
            this.layout.destory();
        }

        this.dataSource = null;
        this.delegate = null;
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
        this.registedCell[identifier] = source;
    }

    dequeueReusableCell(identifier?: string): UKTableViewCell {
        if (!identifier) {
            identifier = 'default';
        }

        const cacheCells = this.cacheCell[identifier];
        if (cacheCells && cacheCells.length) {
            return cacheCells.pop();
        }

        const souce = this.registedCell[identifier];
        const node = cc.instantiate(souce) as cc.Node;

        let comp = node.getComponent(UKTableViewCell);
        if (!comp) {
            comp = node.addComponent(UKTableViewCell);
            comp.identifier = identifier;
            comp.__sizeChangedCB = cell => this.onCellSizeChanged(cell);
        }

        return comp;
    }

    reloadData(count: number): void {
        this.count = count;

        if (!this.dataSource) {
            throw 'you should set dataSource!';
        }

        this.recycleAllCells();
        this.resetCache();
        this.setupLayoutArgs();
        this.setupContentSize();
        this.doLayout();
    }
    
    insert(indexs: number[]): void {
        if (!indexs || !indexs.length) {
            return;
        }

        this.count += indexs.length;
        this.resetCache();
        this.setupContentSize();
        this.fixPositions();
        this.doLayout();
    }

    delete(indexs: number[]): void {
        if (!indexs || !indexs.length) {
            return;
        }

        for (let i = 0; i < indexs.length; ++i) {
            const index = indexs[i];
            if (index < 0 || index >= this.count) {
                throw new Error(`${index} not exist!`);
            }
        }

        this.count -= indexs.length;
        this.layout.deleteCellAtIndexs(this.content, indexs);
        this.resetCache();
        this.setupContentSize();
        this.fixPositions();
        this.doLayout();
    }

    /**
     * 
     * @param index 滚动到的目标
     * @param timeInSecond 动画时长
     * @param attenuated 滚动加速度是否衰减
     */
    scrollToIndex(index: number, timeInSecond: number = 0, attenuated = true): void {
        const toIndex = Math.min(Math.max(index, 0), this.count - 1);
        const pos = this.layout.getOffsetOfIndex(this.scrollView, toIndex, this.count);
        this.scrollView.scrollToOffset(pos, timeInSecond, attenuated);
    }

    visiableCells(): UKTableViewCell[] {
        return this.layout.getChildCells(this.content);
    }

    visiableCell(index: number): UKTableViewCell {
        const cells = this.visiableCells();
        return cells.find(c => c.__index == index);
    }

    private setupLayoutArgs() {
        const ndContent = this.content;
        const cclayout = ndContent.getComponent(cc.Layout);

        cclayout && (cclayout.enabled = false);

        this.layout && (this.layout.destory());
        this.layout = this.createLayout();        
    }

    private recycleAllCells() {
        if (this.layout) {
            this.layout.getChildCells(this.content).forEach(cell => {
                this.doRecycleCell(cell);
            });
        }
    }

    private resetCache() {
        this.cacheSide = {
            0: undefined,
            1: undefined,
            2: undefined
        };
    }

    private createLayout() {
        const layoutMaps = {
            [EUKTableViewType.VERTICAL]: () => new UKLayoutVertical(this.verticalDirection == EUKTableViewVerticalDirection.TOP_TO_BOTTOM),
            [EUKTableViewType.HORIZONTAL]: () => new UKLayoutHorizontal(this.horizontalDirection == EUKTableViewHorizontalDirection.LEFT_TO_RIGHT),
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
        const content = this.content;
        const side = this.calContentSide();

        content[this.layout.sideProperName] = side;

        return side;
    }

    private doLayout() {
        this.layout && this.layout.doLayout(this.scrollView, this.count);
    }

    private calContentSide() {
        return this.layout.calContentSize(this.count);
    }

    private sizeAtIndex(index: number): number {
        let size = this.cacheSide[index];
        if (!size) {
            size = this.itemEstimateSize;

            if (this.delegate && this.delegate.estimateSizeAtIndex) {
                size = this.delegate.estimateSizeAtIndex(index);
            }

            this.cacheSide[index] = size;
        }

        return size;
    }

    private doRecycleCell(cell: UKTableViewCell): void {
        cell.node.removeFromParent(false);

        const identifier = cell.identifier;
        if (this.cacheCell[identifier]) {
            this.cacheCell[identifier].push(cell);
        } else {
            this.cacheCell[identifier] = [cell];
        }
    }

    private cellAtIndex(index: number): UKTableViewCell {
        const cell = this.dataSource.cellAtIndex(index);
        return cell;
    }

    private onCellSizeChanged(cell: UKTableViewCell) {
        if (!cell.node.parent) {
            return;
        }

        const index = cell.__index;
        const side = cell.node[this.layout.sideProperName];

        this.cacheSide[index] = side;
        this.setupContentSize();
        this.fixPositions();
    }

    private fixPositions() {
        this.layout.fixPositions(this.scrollView, this.count);
    }

    lateUpdate() {
        this.doLayout();
    }
}
