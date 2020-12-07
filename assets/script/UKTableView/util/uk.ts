export class uk {
    static setYByBottom(node: cc.Node, bottom: number, height?: number): void {
        if (height === undefined) {
            height = node.height;
        }

        node.y = bottom + node.anchorY * height;
    }

    static setYByTop(node: cc.Node, top: number, height?: number): void {
        if (height === undefined) {
            height = node.height;
        }

        node.y = top - (1 - node.anchorY) * height;
    }

    static setHight(node: cc.Node, height: number): void {
        node.height = height;
    }

    static setWidth(node: cc.Node, width: number): void {
        node.width = width;
    }

    static setXByLeft(node: cc.Node, left: number, width?: number): void {
        if (width === undefined) {
            width = node.width;
        }

        node.x = left + node.anchorX * width;
    }

    static setXByRight(node: cc.Node, right: number, width?: number) {
        if (width === undefined) {
            width = node.width;
        }

        node.x = right - (1 - node.anchorX) * width;
    }

    static getTop(node: cc.Node): number {
        return node.y + (1 - node.anchorY) * node.height;
    }

    static getBottom(node: cc.Node): number {
        return node.y - node.anchorY * node.height;
    }

    static getLeft(node: cc.Node): number {
        return node.x - node.anchorX * node.width;
    }

    static getRight(node: cc.Node): number {
        return node.x + (1 - node.anchorX) * node.width;
    }

    static getContentTop(node: cc.Node): number {
        const height = node.height;
        return (1 - node.anchorY) * height;
    }

    static getContentBottom(node: cc.Node): number {
        const height = node.height;
        return -1 * node.anchorY * height;
    }

    static getContentLeft(node: cc.Node): number {
        return -1 * node.anchorX * node.width;
    }

    static getContentRight(node: cc.Node): number {
        return (1 - node.anchorX) * node.width;
    }

    static getVisiableVertical(scroll: cc.ScrollView): [number, number] {
        const content = scroll.content;
        const top = this.getContentTop(content);
        const scrollHeight = scroll.node.height;

        const offset = scroll.getScrollOffset();
        const visiableTop = Math.min(top - offset.y, top);
        const visiableBottom = visiableTop - scrollHeight;
        
        return [visiableTop, visiableBottom];
    }

    static getVisiableHorizontal(scroll: cc.ScrollView): [number, number] {
        const content = scroll.content;
        const left = this.getContentLeft(content);
        const scrollWidth = scroll.node.width;

        const offset = scroll.getScrollOffset();
        const visiableLeft = Math.max(left - offset.x, left);
        const visiableRight = visiableLeft + scrollWidth;

        return [visiableLeft, visiableRight];
    }
}