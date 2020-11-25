const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class Test extends cc.Component {

    onLoad() {
    }

    clickTestVertical() {
        cc.director.loadScene('TestVertical');
    }

    clickTestHorizontal() {
        // TODO:
    }

    clickTestChat() {
        // TODO:
    }
}
