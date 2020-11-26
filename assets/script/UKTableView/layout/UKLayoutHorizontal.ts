import UKTableViewCell from "../cell/UKTableViewCell";
import { uk } from "../util/uk";
import { ESideType } from "./IUKLayout";
import { UKLayout } from "./UKLayout";

export class UKLayoutHorizontal extends UKLayout {
    protected isLeftToRight = true;
    sideProperName = ESideType.width;

    constructor(isLeftToRight: boolean) {
        super();
        this.isLeftToRight = isLeftToRight;
    }

    doLayout(scroll: cc.ScrollView, count: number): void {
        const content = scroll.content;

        const [visiableLeft, visiableRight] = uk.getVisiableHorizontal(scroll);
        if ((this._lastLayoutOffset !== undefined) && Math.abs(visiableLeft - this._lastLayoutOffset) < Math.max(this.minDiff, 0.1)) {
            return;
        }

        this._lastLayoutOffset = visiableLeft;

        const cells = this.getChildCells(content);
        this.doCycleCell(cells, visiableLeft, visiableRight);
        this.doFillCell(scroll, cells, count);
    }

    fixPositions(scroll: cc.ScrollView, count: number): void {
        if (scroll.content.childrenCount <= 0) {
            return;
        }

        this._lastLayoutOffset = undefined;

        const content = scroll.content;
        const cells = this.getChildCells(content);
        
        const mapNodes: {[index: number]: cc.Node} = {};
        cells.forEach(cell => mapNodes[cell.__index] = cell.node);

        const length = cells.length;
        let layoutCount = 0;
        let [startIndex, sign] = this.getIteratorAugs(count);
        let nextRight = uk.getContentRight(content) - this.paddingRight;
        for (let index = startIndex, times = 0; times < count; ++times, index += sign) {
            const right = nextRight;
            const side = this.sizeAtIndex(index);
            const node = mapNodes[index];

            nextRight = right - side - this.spaceX;

            if (!node) {
                continue;
            }

            uk.setXByRight(node, right, side);

            layoutCount++;
            if (layoutCount == length) {
                break;
            }
        }
    }

    getPaddingCount() {
        return this.paddingLeft + this.paddingRight;
    }

    getSpace() {
        return this.spaceX;
    }

    getOffsetOfIndex(scroll: cc.ScrollView, eleIndex: number, eleCount: number) {
        let [startIndex, sign] = this.isLeftToRight ? [0, 1] : [eleCount - 1, -1];
        let left = 0 + this.paddingLeft;
        let toIndex = this.isLeftToRight ? eleIndex : (eleCount - (eleIndex - 1));

        for (let index = startIndex, times = 0; times < eleCount; ++times, index += sign) {
            if (index == toIndex) {
                break;
            }

            left = left + this.sizeAtIndex(index) + this.spaceX;
        }

        let x = left;
        if (!this.isLeftToRight) {
            let side = this.sizeAtIndex(eleIndex);
            x = Math.max(left + side, 0);
        }

        return cc.v2(x, scroll.getScrollOffset().y);
    }

    private doCycleCell(cells: UKTableViewCell[], visiableLeft: number, visiableRight: number) {
        cells.forEach(cell => {
            const child = cell.node;
            const left = uk.getLeft(child);
            const right = left + child.width;
            const isOut = (right < (visiableLeft - 1)) || (left > (visiableRight + 1));
            if (isOut) {
                this.recyleCell(cell);
            }
        });
    }

    private doFillCell(scroll: cc.ScrollView, showedCells: UKTableViewCell[], eleCount: number) {
        const [visiableLeft, visiableRight] = uk.getVisiableHorizontal(scroll);
        const content = scroll.content;

        let showedIndexs = showedCells.map(c => c.__index);
        let nextRight = uk.getContentRight(content) - this.paddingRight;
        let [startIndex, sign] = this.getIteratorAugs(eleCount);
        for (let index = startIndex, times = 0; times < eleCount; ++times, index += sign) {
            const curRight = nextRight;
            const side = this.sizeAtIndex(index);
            const curLeft = curRight - side;

            nextRight = curLeft - this.spaceX;

            if (showedIndexs.indexOf(index) >= 0) {
                continue;
            }

            const isOut = (curLeft >= visiableRight) || (curRight <= visiableLeft);
            const visiable = !isOut;
            if (visiable) { 
                const cell = this.cellAtIndex(index);
                const node = cell.node;

                uk.setWidth(node, side);
                uk.setXByRight(node, curRight, side);

                content.addChild(node);

                cell.__show(index);
            }

            if (nextRight < visiableLeft) {
                break; 
            }
        }
    }

    private getIteratorAugs(count: number) {
        let startIndex = 0;
        let sign = 1;
        if (this.isLeftToRight) {
            startIndex = count - 1;
            sign = -1;
        }

        return [startIndex, sign];
    }
}