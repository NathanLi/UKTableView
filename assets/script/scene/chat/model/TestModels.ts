import { IChatModel } from "./ChatModel";

export const TestChatModels: IChatModel[] = [
    {
        time: Date.now() - 60 * 60 * 1000 - 10
    },
    {
        userId: 1,
        time: Date.now() - 60 * 60 * 1000,
        text: 'hello, how are you'
    },
    {
        userId: 0,
        time: Date.now() - 60 * 60 * 1000 + 20,
        text: `I'm Andy`
    },
    {
        userId: 1,
        time: Date.now() - 60 * 60 * 1000 + 30,
        text: `锦瑟无端五十弦，一弦一柱思华年。\n庄生晓梦迷蝴蝶，望帝春心托杜鹃。\n沧海月明珠有泪，蓝田日暖玉生烟。\n此情可待成追忆，只是当时已惘然。`,
    },
    {
        userId: 0,
        time: Date.now() - 60 * 60 * 1000 + 40,
        text: 'I am fine',
    },
    {
        userId: 0,
        time: Date.now() - 60 * 60 * 1000 + 50,
        text: `床前明月光，疑是地上霜。\n举头望明月，低头思故乡。`,
    },
    {
        userId: 1,
        time: Date.now() - 60 * 60 * 1000 + 60,
        text: `床前明月光，疑是地上霜。\n举头望明月，低头思故乡。`,
    },
    {
        userId: 0,
        time: Date.now() - 60 * 60 * 1000 + 70,
        text: `床前明月光，疑是地上霜。\n举头望明月，低头思故乡。`,
    },
    {
        userId: 1,
        time: Date.now() - 60 * 60 * 1000 + 80,
        text: `床前明月光，疑是地上霜。\n举头望明月，低头思故乡。`,
    },
    {
        userId: 0,
        time: Date.now() - 60 * 60 * 1000 + 90,
        text: `床前明月光，疑是地上霜。\n举头望明月，低头思故乡。`,
    },
];