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
Object.defineProperty(exports, "__esModule", { value: true });
const twitch_1 = __importDefault(require("twitch"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Twitch extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const twitch = yield twitch_1.default.withCredentials(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_ACCESS_TOKEN);
            if (args[1] === "channel") {
                const term = args[2];
                const result = yield twitch.kraken.search.searchChannels(term, 1, 1);
                const twitchEmbed = embeds.createEmbed();
                twitchEmbed
                    .setAuthor("twitch", "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg")
                    .setTitle(`**Twitch Channel** ${discord.getEmoji("gabSip")}`)
                    .setURL(result[0].url)
                    .setThumbnail(result[0].logo)
                    .setImage(result[0].profileBanner)
                    .setDescription(`${discord.getEmoji("star")}_Name:_ **${result[0].name}**\n` +
                    `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(new Date(result[0].creationDate.getTime()))}**\n` +
                    `${discord.getEmoji("star")}_Views:_ **${result[0].views}**\n` +
                    `${discord.getEmoji("star")}_Followers:_ **${result[0].followers}**\n` +
                    `${discord.getEmoji("star")}_Status:_ **${result[0].status}**\n` +
                    `${discord.getEmoji("star")}_Game:_ **${result[0].game}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${result[0].description}\n`);
                message.channel.send(twitchEmbed);
                return;
            }
            const term = Functions_1.Functions.combineArgs(args, 1);
            const result = yield twitch.kraken.search.searchStreams(term.trim(), 1, 11);
            const twitchArray = [];
            for (let i = 0; i < result.length; i++) {
                const twitchEmbed = embeds.createEmbed();
                twitchEmbed
                    .setAuthor("twitch", "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg")
                    .setTitle(`**Twitch Stream** ${discord.getEmoji("gabSip")}`)
                    .setURL(result[i].channel.url)
                    .setImage(result[i].getPreviewUrl("large"))
                    .setThumbnail(result[i].channel.logo)
                    .setDescription(`${discord.getEmoji("star")}_Title:_ **${result[i].channel.status}**\n` +
                    `${discord.getEmoji("star")}_Channel:_ **${result[i].channel.name}**\n` +
                    `${discord.getEmoji("star")}_Game:_ **${result[i].channel.game}**\n` +
                    `${discord.getEmoji("star")}_Viewers:_ **${result[i].viewers}**\n` +
                    `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(new Date(result[i].startDate.getTime()))}**\n` +
                    `${discord.getEmoji("star")}_FPS:_ **${Math.floor(result[i].averageFPS)}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${result[i].channel.description}\n`);
                twitchArray.push(twitchEmbed);
            }
            embeds.createReactionEmbed(twitchArray);
        });
    }
}
exports.default = Twitch;
//# sourceMappingURL=twitch.js.map