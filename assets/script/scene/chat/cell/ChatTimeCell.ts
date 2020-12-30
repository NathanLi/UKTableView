import { ChatModelManager, ChatTimeModel } from "../model/ChatModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatTimeCell extends cc.Component {
    @property(cc.Label)
    lblTime: cc.Label = null;

    render(model: ChatTimeModel) {
        this.lblTime.string = ChatModelManager.format(model.time);
    }

}
