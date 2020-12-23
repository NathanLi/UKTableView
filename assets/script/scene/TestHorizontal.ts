import UKTableViewCell from "../UKTableView/cell/UKTableViewCell";
import UKTableView from "../UKTableView/UKTableView";
import { UKTableViewDataSrouce } from "../UKTableView/UKTableViewDataSource";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestHorizontal extends cc.Component implements UKTableViewDataSrouce {
    @property(UKTableView)
    private tableView: UKTableView = null;

    @property(cc.EditBox)
    private edbToIndex: cc.EditBox = null;

    @property(cc.EditBox)
    private edbModifyIndexs: cc.EditBox = null;

    private count = 40;

    onLoad() {
        this.tableView.dataSource = this;
        this.scheduleOnce(() => {
            this.tableView.reloadData();
        });
    }

    clickBack() {
        cc.director.loadScene('Test');
    }

    clickReload() {
        this.tableView.reloadData();
    }

    clickToIndex() {
        const index = Number(this.edbToIndex.string);
        if (index === NaN) {
            this.edbToIndex.string = '';
            return;
        }

        this.tableView.scrollToIndex(index, 0.3);
    }

    clickAddIndexs() {
        const indexs = this.edbModifyIndexs.string.split(',').map(s => Number(s));
        for (let i in indexs) {
            const num = indexs[i];
            if (num === NaN || num < 0) {
                this.edbModifyIndexs.string = '';
                return;
            }

            if (num > this.count) {
                cc.error(`${num} 超过了当前的总数`);
                return;
            }
        }

        this.count += indexs.length;
        this.tableView.insert(indexs);
    }

    clickDeleteIndexs() {
        const indexs = this.edbModifyIndexs.string.split(',').map(s => Number(s));
        for (let i in indexs) {
            const num = indexs[i];
            if (num === NaN || num < 0) {
                this.edbModifyIndexs.string = '';
                return;
            }

            if (num >= this.count) {
                cc.error(`${num} 超过了当前的总数`);
                return;
            }
        }

        this.count -= indexs.length;
        this.tableView.delete(indexs);
    }

    // MARK: UKTableViewDataSrouce
    cellAtIndex(index: number): UKTableViewCell {
        const cell = this.tableView.dequeueReusableCell();
        cell.getComponentInChildren(cc.Label).string = `cell: ${index}`;
        cell.getComponentInChildren(cc.Sprite).node.color = (index % 2) == 0 ? cc.Color.WHITE : cc.Color.GRAY;
        return cell;
    }

    numberOfCell() {
        return this.count;
    }
}
