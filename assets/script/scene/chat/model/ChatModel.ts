export type IChatModel = ChatTextModel | ChatTimeModel;

export interface ChatTextModel {
    userId: number;
    time: number;

    /** 聊天的文本 */
    text: string;
}

export interface ChatTimeModel {
    time: number;
}

export class ChatModelManager {
    static add(models: IChatModel[], model: ChatTextModel): void {
        if (!models.length) {
            models.push(model);
            return;
        }

        if (this.shouldInTimeModel(models[models.length - 1], model)) {
            models.push({time: Date.now()});
        }
        
        models.push(model);
    }

    static shouldInTimeModel(m1: IChatModel, m2: IChatModel): boolean {
        return Math.abs(m1.time - m2.time) > 5 * 60 * 1000;
    }

    static format(time: number): string {
        const date = new Date(time);
        return date.toLocaleString();
    }
}