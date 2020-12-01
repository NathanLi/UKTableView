const {ccclass, property, menu} = cc._decorator;

const SIZE_CHANGED = 'size-changed';
@ccclass
export default class UKTableViewCell extends cc.Component {
    @property
    identifier: string = 'default';

    private __index: number;
    __sizeChangedCB?: (cell: UKTableViewCell) => void;

    get index() {
        return this.__index;
    }

    set index(index: number) {
        this.__index = index;
    }

    onLoad() {
        this.node.on(SIZE_CHANGED, this.onSizeChanged, this);
    }

    onDestroy() {
        this.__sizeChangedCB = undefined;
    }

    __show(atIndex: number) {
        this.__index = atIndex;
        cc.log(`show(${atIndex})`);
    }

    __fixIndex(index: number) {
        this.index = index;
    }

    private onSizeChanged() {
        if (!this.node.parent) {
            return;
        }

        this.__sizeChangedCB && this.__sizeChangedCB(this);
    }
}
