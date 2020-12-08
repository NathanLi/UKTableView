import UKTableView from "../UKTableView/UKTableView";

const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class Chat extends cc.Component {
    @property(UKTableView)
    private tableView: UKTableView = null;

    @property(cc.EditBox)
    private edbText: cc.EditBox = null;

    @property(cc.Prefab)
    private preChatText: cc.Prefab = null;

    clickBack() {
        cc.director.loadScene('Test');
    }

    onTextEditEnd() {

    }
}
