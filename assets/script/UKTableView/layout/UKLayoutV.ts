import UKTableViewCell from "../cell/UKTableViewCell";
import { uk } from "../util/uk";
import { ESideType } from "./IUKLayout";
import { UKLayout } from "./UKLayout";

export class UKLayoutV extends UKLayout {
    protected isTopToBottom = true;

    sideProperName = ESideType.height;
    
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
        let nextTop = top - this.paddingTop;
        let startIndex = this.isTopToBottom ? 0 : count - 1;
        let endIndex = this.isTopToBottom ? count - 1 : 0;
        let sign = this.isTopToBottom ? 1 : -1;

        for (let index = 0; index < count - 1; ++index) {
            


        }

        for (let index = count - 1; index >= 0; --index) {
            const curTop = nextTop;
            const side = this.sizeAtIndex(index);
            const curBottom = curTop - side;

            if (showedIndexs.indexOf(index) >= 0) {
                nextTop = curBottom - this.spaceY;
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

            nextTop = curBottom - this.spaceY;
            if (nextTop < visiableBottom) {
                break; 
            }
        }
    }
}