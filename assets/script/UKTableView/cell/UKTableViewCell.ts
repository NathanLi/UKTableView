const {ccclass, property, menu} = cc._decorator;

export interface ICellSizeChangedInfo {
    cell: UKTableViewCell,
    size: cc.Size,
}

@ccclass
export default class UKTableViewCell extends cc.Component {
    @property
    identifier: string = 'default';

    private __index: number = 0;

    __isUsing: boolean = false;

    get index() {
        return this.__index;
    }

    set index(index: number) {
        this.__index = index;
    }

    onPrepareForReuse?: () => void;
    onToUse?: () => void;

    static EventSizeChanged = 'UKTableViewCell-SizeChanged';
    static EventDidAddToParent = 'UKTableViewCell-EventDidAddToParent';

    onLoad() {
        this.node.on('size-changed', this.onSizeChanged, this);
    }

    onDestroy() {
        this.onPrepareForReuse = null;
        this.onToUse = null;
    }

    __fixIndex(index: number) {
        this.index = index;
    }

    /**
     * 将被使用
     */
    __toUse(): void {
        this.__isUsing = true;
        this.onToUse && this.onToUse();
    }

    /**
     * 回收后准备重用
     */
    __prepareForReuse(): void {
        this.__isUsing = false;
        this.onPrepareForReuse && this.onPrepareForReuse();
    }

    __addWithParent(parent: cc.Node): void {
        parent.addChild(this.node);
        
        this.node.emit(UKTableViewCell.EventDidAddToParent, {
            cell: this
        });
    }

    private onSizeChanged() {
        if (!this.__isUsing) {
            return;
        }

        if (!this.node.parent) {
            return;
        }

        const size = this.node.getContentSize(true);
        this.node.emit(UKTableViewCell.EventSizeChanged, {
            cell: this,
            size: size,
        });
    }
}
