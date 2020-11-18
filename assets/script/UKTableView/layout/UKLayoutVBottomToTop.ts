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
        const contentHeight = content.height;
        const scrollHeight = scroll.node.height;
        
        const top = (1 - content.anchorY) * contentHeight;
        const offset = scroll.getScrollOffset();
        
        const visiableStart = Math.min(top - offset.y, top);
        const visiableEnd = visiableStart - scrollHeight;

        if ((this.doLayoutOffset !== undefined) && Math.abs(visiableStart - this.doLayoutOffset) < Math.max(this.minDiff, 0.1)) {
            return;
        }

        this.doLayoutOffset = visiableStart;

        const children = content.children.slice();
        const showedIndexs: number[] = [];

        // 回收
        children.forEach(child => {
            const cell = child.getComponent(UKTableViewCell);
            const end = child.y - child.anchorY * child.height;
            const start = end + child.height;
            const isOut = (start < (visiableEnd - 1)) || (end > (visiableStart + 1));
            if (isOut) {
                this.recyleCell(cell);
            }
            
            showedIndexs.push(cell.__index);
        });

        // 添加
        let nextStart = top - this.head;
        for (let index = count - 1; index >= 0; --index) {
            const start = nextStart;
            const side = this.sizeAtIndex(index);
            const end = start - side;

            if (showedIndexs.indexOf(index) >= 0) {
                nextStart = end - this.space;
                continue;
            }

            const isOut = (end > visiableStart) || (start < visiableEnd);
            const visiable = !isOut;
            if (visiable) {
                const cell = this.cellAtIndex(index);
                cell.__index = index;

                const node = cell.node;

                node.height = side;
                uk.setYByTop(node, start, side);

                content.addChild(node);

                cell.__show();
            }

            nextStart = end - this.space;
            if (nextStart < visiableEnd) {
                break; 
            }
        }
    }

    fixPositions(scroll: cc.ScrollView, count: number): void {
        const content = scroll.content;

        if (content.childrenCount <= 0) {
            return;
        }

        this.doLayoutOffset = undefined;

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