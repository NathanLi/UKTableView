import { ChatModel } from "../model/ChatModel";
import ChatUserCell from "./ChatUserCell";

const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class ChatUserTextCell extends ChatUserCell {
    @property(cc.Label)
    private lblTextLeft: cc.Label = null;

    @property(cc.Label)
    private lblTextRight: cc.Label = null;

    get lblText() {
        return this.isLeft ? this.lblTextLeft : this.lblTextRight;
    }

    render(model: ChatModel) {
        this.isLeft = model.userId > 0;
        this.lblText.string = model.text;
    }
}
