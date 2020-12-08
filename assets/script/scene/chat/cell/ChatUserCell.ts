const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class ChatUserCell extends cc.Component {
    @property(cc.Node)
    private ndLeft: cc.Node = null;

    @property(cc.Node)
    private ndRight: cc.Node = null;

    @property(cc.Node)
    private ndLeftContent: cc.Node = null;

    @property(cc.Node)
    private ndRightContent: cc.Node = null;

    private _isLeft: boolean = false;

    protected get ndContent() {
        return this._isLeft ? this.ndLeftContent : this.ndRightContent;
    }

    set isLeft(isLeft: boolean) {
        this._isLeft = isLeft;
        this.ndLeft.active = isLeft;
        this.ndRight.active = !this.ndLeft.active;
    }

    get isLeft() {
        return this._isLeft;
    }


}
