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

    get lblText() {
        return this.isLeft ? this.lblTextLeft : this.lblTextRight;
    }

    onLoad() {
    }

    render(model: ChatTextModel) {
        this.isLeft = model.userId > 0;

        this.lblText.string = model.text;
        // @ts-ignore
        this.lblText._updateNodeSize(true);
        this.onTextSizeChanged();

        cc.log(`${this.lblText.string} ：[${this.lblText.node.height}]`);

        // 1.x _updateNodeSize
        // 2.0 _updateRenderData
        // 2.2 _forceUpdateRenderData
    }

    click() {
        cc.log(this.getComponent(UKTableViewCell).index, this.node.height);
    }

    private onTextSizeChanged() {
        let minHeight = 100;
        let height = this.lblText.node.height + 60;
        let nodeHeight = Math.max(minHeight, height);

        this.node.height = nodeHeight;
    }
}
