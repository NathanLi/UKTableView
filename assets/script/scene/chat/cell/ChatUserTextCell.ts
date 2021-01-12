import { ChatTextModel } from "../model/ChatModel";
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

    onLoad() {
        this.lblTextLeft.node.parent.on('size-changed', this.onTextSizeChanged, this);
        this.lblTextRight.node.parent.on('size-changed', this.onTextSizeChanged, this);
    }

    render(model: ChatTextModel) {
        this.isLeft = model.userId > 0;

        const same = this.lblText.string == model.text;
        if (same) {
            this.onTextSizeChanged();
            return;
        }

        this.lblText.string = model.text;
    }

    private onTextSizeChanged() {
        let minHeight = 100;
        let height = this.lblText.node.height + 60;
        let nodeHeight = Math.max(minHeight, height);

        this.node.height = nodeHeight;
    }
}
