import { UKLayout } from "./UKLayout";

export class UKLayoutVBottomToTop extends UKLayout {
    initLayout(layout: cc.Layout) {
        this.space = layout.spacingY;
        this.head = layout.paddingBottom;
        this.tail = layout.paddingTop;
    }
}