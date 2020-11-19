import UKTableViewCell from "./cell/UKTableViewCell";
import { IUKLayout } from "./layout/IUKLayout";
import { createUKLayout } from "./layout/UKLayoutFactory";
import { UKTableViewDataSrouce } from "./UKTableViewDataSource";
import { UKTableViewDelegate } from "./UKTableViewDelegate";

const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class UKTableView extends cc.Component {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property({tooltip: CC_DEV && 'cell 的估算大小'})
    itemEstimateSize: number = 0;

    private count: number = 0;
    private layout: IUKLayout;

    private cacheSide: {[index: number]: number} = {};
    private cacheCell: {[identifier: string]: [UKTableViewCell]} = {};
    private registCell: {[identifier: string]: cc.Node | cc.Prefab} = {};

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
    }

    onDestroy() {
        if (this.layout) {
            this.layout.destory();
        }
    }

    onEnable() {

    }

    onDisable() {

    }

    registe(source: cc.Node | cc.Prefab, identifier?: string): void {
        if (!identifier) {
            identifier = 'default';
        }
        this.registCell[identifier] = source;
    }

    dequeueReusableCell(identifier?: string): UKTableViewCell {
        if (!identifier) {
            identifier = 'default';
        }

        const cacheCells = this.cacheCell[identifier];
        if (cacheCells && cacheCells.length) {
            return cacheCells.pop();
        }

        const souce = this.registCell[identifier];
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

        this.setupLayoutArgs();
        this.setupContentSize();
        this.doLayout();
    }

    private setupLayoutArgs() {
        const ndContent = this.content;
        const layout = ndContent.getComponent(cc.Layout);

        layout && (layout.enabled = false);

        this.cacheSide = {};

        this.layout && (this.layout.destory());
        this.layout = createUKLayout(layout);
        this.layout.recyleCell = cell => this.cycleCell(cell);
        this.layout.sizeAtIndex = index => this.sizeAtIndex(index);
        this.layout.cellAtIndex = index => this.cellAtIndex(index);
    }

    private setupContentSize() {
        const content = this.content;
        const side = this.calContentSide();

        content[this.layout.sideProperName] = side;

        cc.log('更新内容大小：', side);

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

    private cycleCell(cell: UKTableViewCell): void {
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
        const index = cell.__index;
        const side = cell.node[this.layout.sideProperName];

        this.cacheSide[index] = side;
        this.setupContentSize();
        this.layout.fixPositions(this.scrollView, this.count);
    }

    lateUpdate() {
        this.doLayout();
    }
}
