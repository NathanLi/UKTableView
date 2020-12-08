import UKTableView from "../UKTableView/UKTableView";
import { UKTableViewDataSrouce } from "../UKTableView/UKTableViewDataSource";
import { UKTableViewDelegate } from "../UKTableView/UKTableViewDelegate";
import { ChatModel } from "./chat/model/ChatModel";

const {ccclass, property, menu} = cc._decorator;

enum EChatCellType {
    text = 'text',
}

@ccclass
export default class Chat extends cc.Component implements UKTableViewDataSrouce, UKTableViewDelegate {
    @property(UKTableView)
    private tableView: UKTableView = null;

    @property(cc.EditBox)
    private edbText: cc.EditBox = null;

    @property(cc.Prefab)
    private preChatText: cc.Prefab = null;

    private models: ChatModel[] = [];

    onLoad() {
        this.tableView.registe(this.preChatText, EChatCellType.text);
        this.tableView.delegate = this;
        this.tableView.dataSource = this;
    }

    clickBack() {
        cc.director.loadScene('Test');
    }

    onTextEditEnd() {

    }

    // MARK: UKTableViewDataSrouce
    cellAtIndex(index: number) {
        const cell = this.tableView.dequeueReusableCell(EChatCellType.text);
        
        return cell;
    }

    // MARK: UKTableViewDelegate
    estimateSizeAtIndex(index: number) {
        return 100;
    }
}   
