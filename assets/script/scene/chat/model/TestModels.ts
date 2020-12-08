import { ChatModel } from "./ChatModel";

export const testChatModels: ChatModel[] = [
    {
        userId: 1,
        time: Date.now() - 60 * 60 * 1000,
        text: 'hello, how are you'
    },
    {
        userId: 1,
        time: Date.now() - 60 * 60 * 1000 + 20,
        text: `I'm Andy`
    },
    {
        userId: 0,
        time: Date.now() - 60 * 60 * 1000 + 30,
        text: 'I am fine',
    },
    {
        userId: 0,
        time: Date.now() - 60 * 60 * 1000 + 30,
        text: `床前明月光，疑是地上霜。\n举头望明月，低头思故乡。`,
    },
];