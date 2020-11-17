import UKTableViewCell from "./cell/UKTableViewCell";
import { IUKLayout } from "./layout/IUKLayout";
import { createUKLayout } from "./layout/UKLayoutFactory";
import { UKTableViewDataSrouce } from "./UKTableViewDataSource";
import { UKTableViewDelegate } from "./UKTableViewDelegate";

const {ccclass, property, menu} = cc._decorator;

enum EScrollEvent {
    'scrolling' = 'scrolling',
    'scroll-began' = 'scroll-began',
    'scroll-ended' = 'scroll-ended',
};

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
        }

        return comp;
    }

    reloadData(): void {
        if (!this.dataSource) {
            return;
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
        this.layout.cellAtIndex = index => this.dataSource.cellAtIndex(index);
    }

    private setupContentSize() {
        const content = this.content;
        const side = this.calContentSide();
        const origin = content.getContentSize();
        content.setContentSize(origin.width, side);

        return side;
    }

    private doLayout() {
        this.layout && this.layout.doLayout(this.scrollView, this.count);
    }

    private calContentSide() {
        this.count = this.dataSource.numberOfCells();
        return this.layout.calContentSize(this.count);
    }

    private sizeAtIndex(index: number): number {
        let size = this.cacheSide[index];
        if (!size) {
            size = this.itemEstimateSize;
            if (this.delegate) {
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

    lateUpdate() {
        this.doLayout();
    }
}