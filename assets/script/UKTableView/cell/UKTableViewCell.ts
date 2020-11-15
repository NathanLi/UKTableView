const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class UKTableViewCell extends cc.Component {
    @property
    identifier: string;

    /** 内部使用 */
    __index: number;

    __show() {
        this.getComponent(cc.Label).string = `index = ${this.__index}, y = ${this.node.y}, height = ${this.node.height}`;
    }
}
