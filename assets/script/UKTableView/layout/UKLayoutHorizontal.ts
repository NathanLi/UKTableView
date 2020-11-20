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
        const contentRight = uk.getContentRight(content);

        const [visiableLeft, visiableRight] = uk.getVisiableHorizontal(scroll);
        if ((this._lastLayoutOffset !== undefined) && Math.abs(visiableLeft - this._lastLayoutOffset) < Math.max(this.minDiff, 0.1)) {
            return;
        }

        this._lastLayoutOffset = visiableLeft;
        const children = content.children.slice();
        const showedIndexs: number[] = [];

        // 回收
        children.forEach(child => {
            const cell = child.getComponent(UKTableViewCell);
            const left = uk.getLeft(child);
            const right = left + child.width;
            const isOut = (right < (visiableLeft - 1)) || (left > (visiableRight + 1));
            if (isOut) {
                this.recyleCell(cell);
            }
            
            showedIndexs.push(cell.__index);
        });

        // 添加(由右往左)
        let startIndex = count - 1;
        let sign = -1;
        if (!this.isLeftToRight) {
            startIndex = 0;
            sign = 1;
        }
        
        let nextRight = contentRight - this.paddingRight;
        for (let index = startIndex, times = 0; times < count; ++times, index += sign) {
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

                cell.__index = index;

                node.width = side;
                uk.setXByRight(node, curRight, side);

                content.addChild(node);

                cell.__show();
            }

            if (nextRight < visiableLeft) {
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

        
        let startIndex = count - 1;
        let sign = -1;
        if (!this.isLeftToRight) {
            startIndex = 0;
            sign = 1;
        }
        
        let layoutCount = 0;
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


}