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

    delegate?: UKTableViewDelegate;
    dataSource?: UKTableViewDataSrouce;

    private registCell: {[identifier: string]: cc.Node | cc.Prefab} = {};

    onLoad() {

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

        const count = this.dataSource.numberOfRows;
    }

    private onScrolling() {
        // TODO:
        
    }

    private onScrollBegan() {
        // TODO:

    }

    private onScrollEnd() {
        // TODO:
    }



}