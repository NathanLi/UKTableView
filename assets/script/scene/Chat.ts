import UKTableView from "../UKTableView/UKTableView";
import { UKTableViewDataSrouce } from "../UKTableView/UKTableViewDataSource";
import { UKTableViewDelegate } from "../UKTableView/UKTableViewDelegate";
import ChatTimeCell from "./chat/cell/ChatTimeCell";
import ChatUserTextCell from "./chat/cell/ChatUserTextCell";
import { ChatModelManager, ChatTextModel, IChatModel } from "./chat/model/ChatModel";
import { TestChatModels } from "./chat/model/TestModels";

const {ccclass, property, menu} = cc._decorator;

enum EChatCellType {
    text = 'text',
    time = 'time'
}

@ccclass
export default class Chat extends cc.Component implements UKTableViewDataSrouce, UKTableViewDelegate {
    @property(UKTableView)
    private tableView: UKTableView = null;

    @property(cc.EditBox)
    private edbText: cc.EditBox = null;

    @property(cc.Prefab)
    private preChatText: cc.Prefab = null;

    @property(cc.Prefab)
    private preChatTime: cc.Prefab = null;

    private models: IChatModel[] = TestChatModels.concat();

    onLoad() {
        this.tableView.registe(this.preChatText, EChatCellType.text);
        this.tableView.registe(this.preChatTime, EChatCellType.time);
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
        const text = this.edbText.string;
        if (!text) {
            return;
        }

        const model: ChatTextModel = {
            userId: 0,
            time: Date.now(),
            text: text
        };
        ChatModelManager.add(this.models, model);
        this.tableView.reloadData();
        this.edbText.string = '';

        this.scheduleOnce(() => {
            this.tableView.scrollToIndex(this.models.length - 1, 0.3);
        });
    }

    // MARK: UKTableViewDataSrouce
    cellAtIndex(index: number) {
        const model = this.models[index];

        if (model['text']) {
            const cell = this.tableView.dequeueReusableCell(EChatCellType.text);
            const chatCell = cell.getComponent(ChatUserTextCell);
            chatCell.render(<ChatTextModel>model);
            return cell;
        }

        const cell = this.tableView.dequeueReusableCell(EChatCellType.time);
        const timeCell = cell.getComponent(ChatTimeCell);
        timeCell.render(model);
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
