import UKTableViewCell from "./cell/UKTableViewCell";
import { UKTableViewDataSrouce } from "./UKTableViewDataSource";
import { UKTableViewDelegate } from "./UKTableViewDelegate";

const {ccclass, property, menu} = cc._decorator;

enum EScrollEvent {
    'scrolling' = 'scrolling',
    'scroll-began' = 'scroll-began',
    'scroll-ended' = 'scroll-ended',
};

enum EUKTableViewDir {
    TopToBottom = 0,
    BottomToTop = 1,
    LeftToRight = 2,
    RightToLeft = 3,
}

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

    private dir = EUKTableViewDir.TopToBottom;  // 0 Top to bottom；1 bottom to top.
    private layoutOffset: number = 0;

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

        this.setupLayoutArgs();
        this.setupContentSize();
        this.layout();
    }

    private setupLayoutArgs() {
        const ndContent = this.content;
        const layout = ndContent.getComponent(cc.Layout);

        if (!layout || (layout.type == cc.Layout.Type.GRID)) {
            this.tail = 0;
            this.head = 0;
            this.space = 0;
            this.dir = EUKTableViewDir.TopToBottom;
            return;
        }

        if (layout.type == cc.Layout.Type.HORIZONTAL) {
            this.space = layout.spacingX;
            if (layout.horizontalDirection == cc.Layout.HorizontalDirection.RIGHT_TO_LEFT) {
                this.dir = EUKTableViewDir.RightToLeft;
                this.head = layout.paddingRight;
                this.tail = layout.paddingLeft;
            } else {
                this.dir = EUKTableViewDir.LeftToRight;
                this.head = layout.paddingLeft;
                this.tail = layout.paddingRight;
            }
            return;
        }

        this.space = layout.spacingY;
        if (layout.verticalDirection == cc.Layout.VerticalDirection.BOTTOM_TO_TOP) {
            this.dir = EUKTableViewDir.BottomToTop;
            this.head = layout.paddingBottom;
            this.tail = layout.paddingTop;
        } else {
            this.dir = EUKTableViewDir.TopToBottom;
            this.head = layout.paddingTop;
            this.tail = layout.paddingBottom;
        }
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
        const contentHeight = content.height;
        const scrollHeight = scroll.node.height;

        const top = (1 - content.anchorY) * contentHeight;
        const bottom = top - contentHeight;
    
        const basePos = content.anchorY * contentHeight;
        const offset = scroll.getScrollOffset();
        const position = scroll.getContentPosition() as any as cc.Vec2;

        const contentSize = content.getContentSize();
        const scrollSize = scroll.node.getContentSize();

        const visiableStart = Math.min(top - offset.y, top);
        const visiableEnd = visiableStart - scrollHeight;

        if (Math.abs(visiableStart - this.layoutOffset) < 10) {
            return;
        }

        this.layoutOffset = visiableStart;

        // 回收
        const showedIndexs: number[] = [];
        const children = content.children;

        // cc.log('position: ', position.y);
        // cc.log('offset: ', offset.toString());
        // cc.log('show: ', visiableStart, visiableEnd);
        // return;

        let time = performance.now();

        children.forEach(child => {
            const cell = child.getComponent(UKTableViewCell);
            const end = child.y - child.anchorY * child.height;
            const start = end + child.height;
            
            // 在 scroll view 的外面
            const isOut = (start < (visiableEnd - 1)) || (end > (visiableStart + 1));
            if (isOut) {
                // cc.log('开始回收 ：', cell.__index, start, (visiableEnd + 1), end, (visiableStart - 1), (start < (visiableEnd - 1)), (end > (visiableStart + 1)));

                // 回收
                child.removeFromParent(false);

                const identifier = cell.identifier;
                if (this.cacheCell[identifier]) {
                    this.cacheCell[identifier].push(cell);
                } else {
                    this.cacheCell[identifier] = [cell];
                }

            } else {
                showedIndexs.push(cell.__index);
            }
            showedIndexs.push(cell.__index);
        });

        let now = performance.now();
        // cc.log('回收：', (now - time), 'ms');

        // 添加
        let hasAdd = false;
        let nextStart = top - this.head;
        for (let index = 0; index < this.count; ++index) {

            const start = nextStart;
            const side = this.cacheSide[index];
            const end = start - side;

            
            if (showedIndexs.indexOf(index) != -1) {
                nextStart = end - this.space;
                // cc.log(`${index} continue`);
                // continue;
            } else {
                const isOut = (end > visiableStart) || (start < visiableEnd);
                if (!isOut) {
                    const cell = this.dataSource.cellAtIndex(index);
                    const node = cell.node;
                    
                    content.addChild(node);
                    
                    cell.__index = index;
                    node.height = side;
                    node.y = (start - (1 - node.anchorY) * side);
                    
                    // cc.log(`index=${index}, side=${side}, node.height=${node.height}`);
                    
                    cell.__show();
                    hasAdd = true;
                }
            }
            
            
            
            nextStart = end - this.space;
            if (nextStart < visiableEnd) {
                break; 
            }
        }

        const duration = (performance.now() - now);
        // cc.log('添加：', duration, 'ms', hasAdd, forTimes);
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

    lateUpdate() {
        // this.layout();
    }
}