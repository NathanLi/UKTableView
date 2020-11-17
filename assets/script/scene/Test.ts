import UKTableView from "../UKTableView/UKTableView";
import { UKTableViewDataSrouce } from "../UKTableView/UKTableViewDataSource";

const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class Test extends cc.Component implements UKTableViewDataSrouce {
    @property(UKTableView)
    private tableView: UKTableView = null;

    @property(cc.Label)
    private lblOffset: cc.Label = null;

    onLoad() {
        const node = new cc.Node();
        const label = node.addComponent(cc.Label);
        label.overflow = cc.Label.Overflow.SHRINK;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        node.setContentSize(cc.winSize.width, 100);

        node.color = cc.Color.BLACK;

        this.tableView.dataSource = this;
        this.tableView.itemEstimateSize = 100;
        this.tableView.registe(node);
        this.tableView.reloadData(100);
    }

    onScrolling() {
        this.lblOffset.string = this.tableView.scrollView.getScrollOffset().toString();
    }

    // MARK: UKTableViewDataSrouce
    cellAtIndex(index: number) {
        const cell = this.tableView.dequeueReusableCell();
        const label = cell.getComponent(cc.Label);

        label.string = index + '';

        if ((index < 2) && (cell.node.height < 101)) {
            this.scheduleOnce(() => {
                cell.node.height += 20 + Math.ceil(Math.random() * 30);
            }, index + 1);
        }
        return cell;
    }
}
