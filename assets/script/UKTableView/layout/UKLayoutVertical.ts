import UKTableViewCell from "../cell/UKTableViewCell";
import { uk } from "../util/uk";
import { ESideType } from "./IUKLayout";
import { UKLayout } from "./UKLayout";

export class UKLayoutVertical extends UKLayout {
    protected isTopToBottom = true;
    sideProperName = ESideType.height;
    
    constructor(isTopToBottom: boolean) {
        super();
        this.isTopToBottom = isTopToBottom;
    }

    doLayout(scroll: cc.ScrollView, count: number): void {
        const content = scroll.content;
        
        const [visiableTop, visiableBottom] = uk.getVisiableVertical(scroll);
        if ((this._lastLayoutOffset !== undefined) && Math.abs(visiableTop - this._lastLayoutOffset) < Math.max(this.minDiff, 0.1)) {
            return;
        }
        
        this._lastLayoutOffset = visiableTop;
        
        const cells = this.getChildCells(content);
        this.doCycleCell(cells, visiableTop, visiableBottom);
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
        let nextTop = uk.getContentTop(content) - this.paddingTop;
        let [startIndex, sign] = this.getIteratorAugs(count);

        for (let index = startIndex, times = 0; times < count; ++times, index += sign) {
            const top = nextTop;
            const side = this.sizeAtIndex(index);
            const node = mapNodes[index];

            nextTop = top - side - this.spaceY;

            if (!node) {
                continue;
            }

            node[this.sideProperName] = side;  // TODO: 应该在 insert cell 时实现
            uk.setYByTop(node, top, side);

            if ((++layoutCount) == length) {
                break;
            }
        }
    }

    getPaddingCount() {
        return this.paddingTop + this.paddingBottom;
    }

    getSpace() {
        return this.spaceY;
    }

    getOffsetOfIndex(scroll: cc.ScrollView, eleIndex: number, eleCount: number) {
        let [startIndex, sign] = this.getIteratorAugs(eleCount);
        let top = 0 + this.paddingTop;
        let toIndex = eleIndex;

        for (let index = startIndex, times = 0; times < eleCount; ++times, index += sign) {
            if (index == toIndex) {
                break;
            }

            top = top + this.sizeAtIndex(index) + this.spaceY;
        }

        let y = top;
        return cc.v2(scroll.getScrollOffset().x, y);
    }

    private doCycleCell(cells: UKTableViewCell[], visiableTop: number, visiableBottom: number) {
        cells.forEach(cell => {
            const child = cell.node;
            const bottom = uk.getBottom(child);
            const top = bottom + child.height;
            const isOut = (top < (visiableBottom - 1)) || (bottom > (visiableTop + 1));
            if (isOut) {
                this.recyleCell(cell);
            }
        });
    }

    private doFillCell(scroll: cc.ScrollView, showedCells: UKTableViewCell[], eleCount: number) {
        const [visiableTop, visiableBottom] = uk.getVisiableVertical(scroll);
        const content = scroll.content;

        let showedIndexs = showedCells.map(c => c.__index);
        let nextTop = uk.getContentTop(content) - this.paddingTop;
        let [startIndex, sign] = this.getIteratorAugs(eleCount);
        for (let index = startIndex, times = 0; times < eleCount; ++times, index += sign) {
            const curTop = nextTop;
            const side = this.sizeAtIndex(index);
            const curBottom = curTop - side;

            nextTop = curBottom - this.spaceY;
            if (showedIndexs.indexOf(index) >= 0) {
                continue;
            }

            const isOut = (curBottom >= visiableTop) || (curTop <= visiableBottom);
            const visiable = !isOut;
            if (visiable) { 
                const cell = this.cellAtIndex(index);
                const node = cell.node;

                uk.setHight(node, side);
                uk.setYByTop(node, curTop, side);
                content.addChild(node);

                cell.__show(index);
                cc.log(`doFillCell.__show(${index})`);
            }

            if (nextTop < visiableBottom) {
                break; 
            }
        }
    }

    private getIteratorAugs(count: number) {
        let startIndex = 0;
        let sign = 1;
        if (!this.isTopToBottom) {
            startIndex = count - 1;
            sign = -1;
        }

        return [startIndex, sign];
    }

}