const {ccclass, property, menu} = cc._decorator;

const SIZE_CHANGED = 'size-changed';
@ccclass
export default class UKTableViewCell extends cc.Component {
    @property
    identifier: string = 'default';

    __index: number;
    __sizeChangedCB?: (cell: UKTableViewCell) => void;

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

    private onSizeChanged() {
        if (!this.node.parent) {
            return;
        }

        this.__sizeChangedCB && this.__sizeChangedCB(this);
    }
}
