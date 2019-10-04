"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_ugoira_1 = __importDefault(require("node-ugoira"));
const PixivApiClient = __importStar(require("pixiv-api-client"));
const pixivImg = __importStar(require("pixiv-img"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
const Images_1 = require("./../../structures/Images");
const PixivApi_1 = require("./../../structures/PixivApi");
class UgoiraCommand extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const images = new Images_1.Images(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const pixivApi = new PixivApi_1.PixivApi(discord, message);
            const fs = require("fs");
            const pixiv = new PixivApiClient();
            const refreshToken = yield pixivApi.pixivLogin();
            const input = (args[1].toLowerCase() === "r18" || args[1].toLowerCase() === "en") ?
                ((args[2] === "en") ? Functions_1.Functions.combineArgs(args, 3) : Functions_1.Functions.combineArgs(args, 2)) :
                Functions_1.Functions.combineArgs(args, 1);
            const msg1 = yield message.channel.send(`**Fetching Ugoira** ${discord.getEmoji("gabCircle")}`);
            let pixivID;
            if (input.match(/\d+/g) !== null) {
                pixivID = input.match(/\d+/g).join("");
            }
            else {
                if (args[1].toLowerCase() === "r18") {
                    if (args[2].toLowerCase() === "en") {
                        const image = yield pixivApi.getPixivImage(refreshToken, input, true, true, true, true);
                        try {
                            pixivID = image.id;
                        }
                        catch (err) {
                            if (err)
                                pixivApi.pixivErrorEmbed();
                        }
                    }
                    else {
                        const image = yield pixivApi.getPixivImage(refreshToken, input, true, false, true, true);
                        try {
                            pixivID = image.id;
                        }
                        catch (err) {
                            if (err)
                                pixivApi.pixivErrorEmbed();
                        }
                    }
                }
                else if (args[1].toLowerCase() === "en") {
                    const image = yield pixivApi.getPixivImage(refreshToken, input, false, true, true, true);
                    try {
                        pixivID = image.id;
                    }
                    catch (err) {
                        if (err)
                            pixivApi.pixivErrorEmbed();
                    }
                }
                else {
                    const image = yield pixivApi.getPixivImage(refreshToken, input, false, false, true, true);
                    try {
                        pixivID = image.id;
                    }
                    catch (err) {
                        if (err)
                            pixivApi.pixivErrorEmbed();
                    }
                }
            }
            yield pixiv.refreshAccessToken(refreshToken);
            const details = yield pixiv.illustDetail(pixivID);
            const ugoiraInfo = yield pixiv.ugoiraMetaData(pixivID);
            const fileNames = [];
            const frameDelays = [];
            const frameNames = [];
            for (const i in ugoiraInfo.ugoira_metadata.frames) {
                frameDelays.push(ugoiraInfo.ugoira_metadata.frames[i].delay);
                fileNames.push(ugoiraInfo.ugoira_metadata.frames[i].file);
            }
            for (let i = 0; i < fileNames.length; i++) {
                frameNames.push(fileNames[i].slice(0, -4));
            }
            const ugoira = new node_ugoira_1.default(pixivID);
            yield ugoira.initUgoira(refreshToken);
            const file = fs.createWriteStream(`ugoira/${pixivID}/${pixivID}.gif`, (err) => console.log(err));
            msg1.delete({ timeout: 1000 });
            const msg2 = yield message.channel.send(`**Converting Ugoira to Gif. This might take awhile** ${discord.getEmoji("gabCircle")}`);
            yield images.encodeGif(fileNames, `ugoira/${pixivID}/`, file);
            msg2.delete({ timeout: 1000 });
            const msg3 = yield message.channel.send(`**Compressing Gif** ${discord.getEmoji("gabCircle")}`);
            yield images.compressGif([`ugoira/${pixivID}/${pixivID}.gif`]);
            msg3.delete({ timeout: 1000 });
            const ugoiraEmbed = embeds.createEmbed();
            const { Attachment } = require("discord.js");
            const outGif = new Attachment(`../assets/gifs/${pixivID}.gif`);
            const comments = yield pixiv.illustComments(pixivID);
            const cleanText = details.illust.caption.replace(/<\/?[^>]+(>|$)/g, "");
            const authorUrl = yield pixivImg(details.illust.user.profile_image_urls.medium);
            const authorAttachment = new Attachment(authorUrl);
            const commentArray = [];
            for (let i = 0; i <= 5; i++) {
                if (!comments.comments[i])
                    break;
                commentArray.push(comments.comments[i].comment);
            }
            ugoiraEmbed
                .setTitle(`**Pixiv Ugoira** ${discord.getEmoji("kannaSip")}`)
                .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${pixivID}`)
                .setDescription(`${discord.getEmoji("star")}_Title:_ **${details.illust.title}**\n` +
                `${discord.getEmoji("star")}_Artist:_ **${details.illust.user.name}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(details.illust.create_date)}**\n` +
                `${discord.getEmoji("star")}_Views:_ **${details.illust.total_view}**\n` +
                `${discord.getEmoji("star")}_Bookmarks:_ **${details.illust.total_bookmarks}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` +
                `${discord.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n`)
                .attachFiles([outGif.file, authorAttachment])
                .setThumbnail(`attachment://${authorAttachment.file}`)
                .setImage(`attachment://${pixivID}.gif`);
            message.channel.send(ugoiraEmbed);
        });
    }
}
exports.default = UgoiraCommand;
//# sourceMappingURL=ugoira.js.map