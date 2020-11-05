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

    @property({tooltip: CC_DEV && 'cell 的高度，用于快捷设置行高'})
    itemHeight?: number = 0;

    @property({tooltip: CC_DEV && 'cell 的间隔'})
    space?: number = 0;

    delegate?: UKTableViewDelegate;
    dataSource?: UKTableViewDataSrouce;

    private registCell: {[identifier: string]: cc.Node | cc.Prefab} = {};

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
        // TODO:
        if (!this.dataSource) {
            return;
        }

        const count = this.dataSource.numberOfCell;
        
    }

    private calContentHeightOrWidth() {
        
    }

    private onScrolling() {
        // TODO:
        const scoll = this.scrollView;
        const pos = scoll.getContentPosition();
        const ndContent = scoll.content;


    }

    private onScrollBegan() {
        // TODO:

    }

    private onScrollEnd() {
        // TODO:
    }



}