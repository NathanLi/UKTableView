import UKTableViewCell from "../cell/UKTableViewCell";
import { uk } from "../util/uk";
import { ESideType } from "./IUKLayout";
import { UKLayout } from "./UKLayout";

export class UKLayoutVBottomToTop extends UKLayout {
    sideProperName = ESideType.height;

    initLayout(layout: cc.Layout) {
        this.space = layout.spacingY;
        this.head = layout.paddingBottom;
        this.tail = layout.paddingTop;
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
        let nextTop = top - this.head;
        for (let index = count - 1; index >= 0; --index) {
            const curTop = nextTop;
            const side = this.sizeAtIndex(index);
            const curBottom = curTop - side;

            if (showedIndexs.indexOf(index) >= 0) {
                nextTop = curBottom - this.space;
                continue;
            }

            const isOut = (curBottom > visiableTop) || (curTop < visiableBottom);
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

            nextTop = curBottom - this.space;
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

        const bottom = uk.getContentBottom(content);
        let nextStart = bottom + this.head;
        let layoutCount = 0;
        for (let index = 0; index < count; ++index) {
            const start = nextStart;
            const side = this.sizeAtIndex(index);
            const node = mapNodes[index];

            if (!node) {
                nextStart = start + side + this.space;
                continue;
            }

            uk.setYByBottom(node, start, side);

            nextStart = start + side + this.space;
            layoutCount++;

            if (layoutCount == length) {
                break;
            }
        }
    }


}