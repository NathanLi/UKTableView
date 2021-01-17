import UKTableViewCell from "../../../UKTableView/cell/UKTableViewCell";
import { ChatTextModel } from "../model/ChatModel";
import ChatUserCell from "./ChatUserCell";

const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class ChatUserTextCell extends ChatUserCell {
    @property(cc.Label)
    private lblTextLeft: cc.Label = null;

    @property(cc.Label)
    private lblTextRight: cc.Label = null;

    private maxTextWidth = 400;

    get lblText() {
        return this.isLeft ? this.lblTextLeft : this.lblTextRight;
    }

    onLoad() {
    }

    render(model: ChatTextModel) {
        this.isLeft = model.userId > 0;

        this.lblText.string = model.text;
        
        this.updateTextNodeSize();
        this.onTextSizeChanged();
    }

    click() {
        cc.log(this.getComponent(UKTableViewCell).index, this.node.height);
    }

    private updateTextNodeSize() {
        const label = this.lblText;
        label.overflow = cc.Label.Overflow.NONE;
        this.forceUpdateTextSize(label);

        if (label.node.width > this.maxTextWidth) {
            label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            label.node.width = this.maxTextWidth;
            this.forceUpdateTextSize(label);
        }
    }

    private forceUpdateTextSize(label: cc.Label) {
        // @ts-ignore
        label._updateNodeSize(true);
        cc.log(`${label.string} ：[${label.node.getContentSize()}]`);

        // 1.x _updateNodeSize
        // 2.0 _updateRenderData
        // 2.2 _forceUpdateRenderData
    }

    private onTextSizeChanged() {
        let minHeight = 100;
        let height = this.lblText.node.height + 60;
        let nodeHeight = Math.max(minHeight, height);

        this.node.height = nodeHeight;
    }
}
