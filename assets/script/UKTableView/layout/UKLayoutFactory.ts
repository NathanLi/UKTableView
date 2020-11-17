import { IUKLayout } from "./IUKLayout";
import { UKLayoutHLeftToRight } from "./UKLayoutHLeftToRight";
import { UKLayoutHRightToLeft } from "./UKLayoutHRightToLeft";
import { UKLayoutVBottomToTop } from "./UKLayoutVBottomToTop";
import { UKLayoutVTopToBottom } from "./UKLayoutVTopToBottom";

export function createUKLayout(layout: cc.Layout): IUKLayout {
    if (!layout || (layout.type == cc.Layout.Type.GRID)) {
        return new UKLayoutVTopToBottom();
    }

    let uklayout: IUKLayout;

    if (layout.type == cc.Layout.Type.HORIZONTAL) {
        if (layout.horizontalDirection == cc.Layout.HorizontalDirection.RIGHT_TO_LEFT) {
            uklayout = new UKLayoutHRightToLeft();
        } else {
            uklayout = new UKLayoutHLeftToRight();
        }
    } else {
        if (layout.verticalDirection == cc.Layout.VerticalDirection.BOTTOM_TO_TOP) {
            uklayout = new UKLayoutVBottomToTop();
        } else {
            uklayout = new UKLayoutVTopToBottom();
        }
    }

    uklayout.initLayout(layout);
    return uklayout;
}