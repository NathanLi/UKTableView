import UKTableViewCell from "../cell/UKTableViewCell";
import { ESideType, IUKLayout } from "./IUKLayout";

export class UKLayout implements IUKLayout {
    protected _lastLayoutOffset: number = undefined;

    paddingTop: number = 0;
    paddingBottom: number = 0;
    paddingLeft: number = 0;
    paddingRight: number = 0;
    spaceY: number = 0;
    spaceX: number = 0;

    sideProperName = ESideType.height;
    minDiff = 1;

    sizeAtIndex?: (index: number) => number;
    cellAtIndex?: (index: number) => UKTableViewCell;
    recyleCell?: (cell: UKTableViewCell) => void;

    destory() {
        this.sizeAtIndex = undefined;
        this.cellAtIndex = undefined;
        this.recyleCell = undefined;
    }

    calContentSize(count: number): number {
        if (count <= 0) {
            return 0;
        }

        let size = this.getPaddingCount() + (count - 1) * this.getSpace();
        for (let index = 0; index < count; ++index) {
            size += this.sizeAtIndex(index);
        }

        return size;
    }

    getChildCells(content: cc.Node): UKTableViewCell[] {
        return content.children
            .map(node => node.getComponent(UKTableViewCell))
            .filter(c => c != null);
    }

    doLayout(scollView: cc.ScrollView, count: number): void {
        throw '应该由子类实现';
    }

    fixPositions(scollView: cc.ScrollView, count: number): void {
        throw '应该由子类实现';
    }

    protected getPaddingCount(): number {
        throw '应该由子类实现';
    }

    protected getSpace(): number {
        throw '应该由子类实现';
    }
}