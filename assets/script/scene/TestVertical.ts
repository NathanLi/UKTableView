import UKTableViewCell from "../UKTableView/cell/UKTableViewCell";
import UKTableView from "../UKTableView/UKTableView";
import { UKTableViewDataSrouce } from "../UKTableView/UKTableViewDataSource";

const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class TestVertical extends cc.Component implements UKTableViewDataSrouce {
    @property(UKTableView)
    private tableView: UKTableView = null;

    private count = 40;

    onLoad() {
        this.tableView.dataSource = this;
        this.tableView.reloadData(this.count);
    }

    clickBack() {
        cc.director.loadScene('Test');
    }

    clickReload() {
        this.tableView.reloadData(this.count);
    }

    clickToTop() {
        this.tableView.scrollToIndex(0, 0.3);
    }

    clickToBottom() {
        this.tableView.scrollToIndex(32, 0.3);
    }

    // MARK: UKTableViewDataSrouce
    cellAtIndex(index: number): UKTableViewCell {
        const cell = this.tableView.dequeueReusableCell();
        cell.getComponentInChildren(cc.Label).string = `cell: ${index}`;
        cell.getComponentInChildren(cc.Sprite).node.color = (index % 2) == 0 ? cc.Color.WHITE : cc.Color.GRAY;
        return cell;
    }
}
