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

    static getTop(node: cc.Node): number {
        return node.y + (1 - node.anchorY) * node.height;
    }

    static getBottom(node: cc.Node): number {
        return node.y - node.anchorY * node.height;
    }

    static getContentTop(node: cc.Node): number {
        const height = node.height;
        return (1 - node.anchorY) * height;
    }

    static getContentBottom(node: cc.Node): number {
        const height = node.height;
        return -1 * node.anchorY * height;
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
}