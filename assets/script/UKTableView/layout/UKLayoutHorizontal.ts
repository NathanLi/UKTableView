import UKTableViewCell from "../cell/UKTableViewCell";
import { uk } from "../util/uk";
import { ESideType } from "./IUKLayout";
import { UKLayout } from "./UKLayout";

export class UKLayoutHorizontal extends UKLayout {
    protected isLeftToRight = true;

    constructor(isLeftToRight: boolean) {
        super();
        this.isLeftToRight = isLeftToRight;
    }

    sideProperName = ESideType.width;
}