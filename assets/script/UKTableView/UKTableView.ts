import UKTableViewCell from "./cell/UKTableViewCell";
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

    @property({tooltip: CC_DEV && 'cell 的大小，用于简单设置'})
    itemSize: number = 0;

    @property({tooltip: CC_DEV && 'cell 的估算大小'})
    itemEstimateSize: number = 0;

    private count: number = 0;
    private space: number = 0;
    private head: number = 0;
    private tail: number = 0;

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
        const node = this.scrollView.node;
        node.on(EScrollEvent.scrolling, this.onScrolling, this);
    }

    onDestroy() {

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

        this.setupContentSize();
        this.layout();
    }

    private setupContentSize() {
        const content = this.content;
        const side = this.calContentSide();
        const origin = content.getContentSize();
        content.setContentSize(origin.width, side);

        return side;
    }

    private layout() {
        const scroll = this.scrollView;
        const content = scroll.content;
        const offset = scroll.getScrollOffset();

        const contentSize = content.getContentSize();
        const scrollSize = scroll.node.getContentSize();

        const offsetStart = Math.ceil(offset.y);
        const offsetEnd = Math.ceil(Math.min(offset.y + scrollSize.height, contentSize.height));

        // 回收
        const showedIndexs: number[] = [];
        const movedIndexs: number[] = [];
        const children = content.children;

        cc.log('offset: ', offsetStart, offsetEnd);

        children.forEach(child => {
            const cell = child.getComponent(UKTableViewCell);
            
            const end = child.y + child.anchorY * child.height;
            const start = end - child.height;
            
            // 在 scroll view 的外面
            const isOut = (start > (offsetEnd - 1)) || (end < (offsetStart + 1));
            if (isOut) {
                cc.log('开始回收 ：', cell.__index, start, end);

                // 回收
                child.removeFromParent(false);

                const identifier = cell.identifier;
                if (this.cacheCell[identifier]) {
                    this.cacheCell[identifier].push(cell);
                } else {
                    this.cacheCell[identifier] = [cell];
                }

                movedIndexs.push(cell.__index);
            } else {
                showedIndexs.push(cell.__index);
            }
        });

        // 添加
        let nextStart = this.head;
        for (let index = 0; index < this.count; ++index) {
            const start = nextStart;
            const side = this.cacheSide[index];
            const end = start + side;

            if ((showedIndexs.indexOf(index) != -1) || (movedIndexs.indexOf(index) != -1)) {
                nextStart = start + side + this.space;
                continue;
            }

            const isOut = (start > offsetEnd) || (end < offsetStart);
            if (!isOut) {
                const cell = this.dataSource.cellAtIndex(index);
                const node = cell.node;
                
                cell.__index = index;
                node.y = -(start + (1 - node.anchorY) * node.height);
                content.addChild(node);

                cell.__show();
            }

            nextStart = start + side + this.space;
            if (nextStart > offsetEnd) {
                break;
            }
        }

        // cc.log('offset start: ', offsetStart);
        // cc.log('offset end: ', offsetEnd.toString());
    }

    private calContentSide() {
        this.count = this.dataSource.numberOfCells();

        const count = this.count;

        if (!count) {
            return 0;
        }

        // TODO: 计算 head、tail、space
        this.cacheSide = {};

        let size = this.head + this.tail + (count - 1) * this.space;
        let func: (index: number) => number = null;
        if (this.delegate) {
            if (this.delegate.sizeAtIndex) {
                func = index => this.delegate.sizeAtIndex(index);
            } else if (this.delegate.estimateSizeAtIndex) {
                func = index => this.delegate.estimateSizeAtIndex(index);
            }
        } else {
            if (this.itemEstimateSize) {
                func = () => this.itemEstimateSize;
            } else if (this.itemSize) {
                func = () => this.itemSize;
            }
        }

        for (let index = 0; index < count; ++index) {
            const side = func(index);
            size += side;

            this.cacheSide[index] = side;
        }

        return size;        
    }


    private onScrolling() {
        this.layout();
    }
}