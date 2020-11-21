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
        const top = uk.getContentTop(content);

        const [visiableTop, visiableBottom] = uk.getVisiableVertical(scroll);
        if ((this._lastLayoutOffset !== undefined) && Math.abs(visiableTop - this._lastLayoutOffset) < Math.max(this.minDiff, 0.1)) {
            return;
        }

        this._lastLayoutOffset = visiableTop;
        const children = content.children.slice();
        const showedIndexs: number[] = [];

        // 回收
        children.forEach(child => {
            const cell = child.getComponent(UKTableViewCell);
            const bottom = uk.getBottom(child);
            const top = bottom + child.height;
            const isOut = (top < (visiableBottom - 1)) || (bottom > (visiableTop + 1));
            if (isOut) {
                this.recyleCell(cell);
            }
            
            showedIndexs.push(cell.__index);
        });


        // 添加
        let startIndex = 0;
        let sign = 1;
        if (!this.isTopToBottom) {
            startIndex = count - 1;
            sign = -1;
        }
        
        let nextTop = top - this.paddingTop;
        for (let index = startIndex, times = 0; times < count; ++times, index += sign) {
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

                cell.__index = index;

                node.height = side;
                uk.setYByTop(node, curTop, side);

                content.addChild(node);

                cell.__show();
            }

            if (nextTop < visiableBottom) {
                break; 
            }
        }
    }

    fixPositions(scroll: cc.ScrollView, count: number): void {
        if (scroll.content.childrenCount <= 0) {
            return;
        }

        this._lastLayoutOffset = undefined;

        const content = scroll.content;
        const children = content.children;
        const length = children.length;
        
        const mapNodes: {[index: number]: cc.Node} = {};
        children.forEach(node => {
            const cell = node.getComponent(UKTableViewCell);
            const index = cell.__index;
            mapNodes[index] = node;
        });

        
        let startIndex = 0;
        let sign = 1;
        if (!this.isTopToBottom) {
            startIndex = count - 1;
            sign = -1;
        }
        
        let layoutCount = 0;
        let nextTop = uk.getContentTop(content) - this.paddingTop;
        for (let index = startIndex, times = 0; times < count; ++times, index += sign) {
            const top = nextTop;
            const side = this.sizeAtIndex(index);
            const node = mapNodes[index];

            nextTop = top - side - this.spaceY;

            if (!node) {
                continue;
            }

            uk.setYByTop(node, top, side);

            layoutCount++;
            if (layoutCount == length) {
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
}