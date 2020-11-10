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

    private space: number = 0;
    private head: number = 0;
    private tail: number = 0;

    delegate?: UKTableViewDelegate;
    dataSource?: UKTableViewDataSrouce;

    private registCell: {[identifier: string]: cc.Node | cc.Prefab} = {};
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
        node.on(EScrollEvent["scroll-began"], this.onScrollBegan, this);
        node.on(EScrollEvent["scroll-ended"], this.onScrollEnd, this);
    }

    onDestroy() {

    }

    onEnable() {

    }

    onDisable() {

    }

    register(source: cc.Node | cc.Prefab, identifier: string): void {
        this.registCell[identifier] = source;
    }

    dequeueReusableCell(identifier: string): cc.Node {
        const souce = this.registCell[identifier];
        const node = cc.instantiate(souce) as cc.Node;

        return node;
    }

    reloadData(): void {
        if (!this.dataSource) {
            return;
        }

        this.setupContentSize();
    }

    private setupContentSize() {
        const content = this.content;
        const side = this.calContentSide();
        const origin = content.getContentSize();
        content.setContentSize(origin.width, side);

        return side;
    }

    private calContentSide() {
        const count = this.dataSource.count;

        if (!count) {
            return 0;
        }

        // TODO: 计算 head、tail、space
        let size = this.head + this.tail + (count - 1) * this.space;

        let func: (index: number) => number = null;
        if (this.delegate) {
            if (this.delegate.sizeAtIndex) {
                func = index => this.delegate.sizeAtIndex(index);
            } else if (this.delegate.estimateSizeAtIndex) {
                func = index => this.delegate.estimateSizeAtIndex(index);
            }
        }

        if (func) {
            for (let index = 0; index < count; ++index) {
               size += func(index);
            }
        } else {
            size += (this.itemSize * count);
        }

        return size;        
    }


    private onScrolling() {
        // TODO:
        const scoll = this.scrollView;
        const pos = scoll.getContentPosition();
        const side = scoll.getScrollOffset();
        const ndContent = scoll.content;
    }

    private onScrollBegan() {
        // TODO:

    }

    private onScrollEnd() {
        // TODO:
    }



}