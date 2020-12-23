import UKTableView from "../UKTableView/UKTableView";
import { UKTableViewDataSrouce } from "../UKTableView/UKTableViewDataSource";
import { UKTableViewDelegate } from "../UKTableView/UKTableViewDelegate";
import ChatUserTextCell from "./chat/cell/ChatUserTextCell";
import { ChatModel } from "./chat/model/ChatModel";
import { testChatModels } from "./chat/model/TestModels";

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

    private models: ChatModel[] = testChatModels.concat();

    onLoad() {
        this.tableView.registe(this.preChatText, EChatCellType.text);
        this.tableView.delegate = this;
        this.tableView.dataSource = this;

        this.scheduleOnce(() => {
            this.tableView.reloadData();
        });
    }

    clickBack() {
        cc.director.loadScene('Test');
    }

    clickSend() {
        
    }

    // MARK: UKTableViewDataSrouce
    cellAtIndex(index: number) {
        const cell = this.tableView.dequeueReusableCell(EChatCellType.text);
        const chatCell = cell.getComponent(ChatUserTextCell);
        chatCell.render(this.models[index]);
        return cell;
    }

    numberOfCell() {
        return this.models.length;
    }

    // MARK: UKTableViewDelegate
    estimateSizeAtIndex(index: number) {
        return 100;
    }
}   
