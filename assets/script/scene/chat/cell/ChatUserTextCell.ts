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
}
