import UKTableViewCell from "../../../UKTableView/cell/UKTableViewCell";
import { ChatTextModel } from "../model/ChatModel";
import ChatUserCell from "./ChatUserCell";

const {ccclass, property, menu} = cc._decorator;

const SIZE_CHANGED = 'size-changed';

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
        // this.lblTextLeft.node.on(SIZE_CHANGED, this.onTextSizeChanged, this);
        // this.lblTextRight.node.on(SIZE_CHANGED, this.onTextSizeChanged, this);
        this.node.on(UKTableViewCell.EventDidAddToParent, this.updateTextNodeSize, this);
    }

    render(model: ChatTextModel) {
        this.isLeft = model.userId > 0;

        this.lblText.string = model.text;
        
        this.updateTextNodeSize();
    }

    click() {
        cc.log(this.getComponent(UKTableViewCell).index, this.node.y, this.node.height);
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

        this.onTextSizeChanged();
    }

    private forceUpdateTextSize(label: cc.Label) {
        // @ts-ignore
        label._updateNodeSize(true);
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
