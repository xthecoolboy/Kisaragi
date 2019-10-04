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
const axios_1 = __importDefault(require("axios"));
const GoogleImages = __importStar(require("google-images"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
const pinArray = [];
class Pinterest extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.pinterestError = (discord, message, embeds) => {
            const pinterestEmbed = embeds.createEmbed();
            pinterestEmbed
                .setAuthor("pinterest", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52e.png")
                .setTitle(`**Pinterest Search** ${discord.getEmoji("aquaUp")}`)
                .setDescription("No results were found. Try searching on the pinterest website: " +
                "[Pinterest Website](https://www.pinterest.com/)");
            message.channel.send(pinterestEmbed);
        };
        this.pinterestPin = (discord, response) => {
            const pinterestEmbed = discord.createEmbed();
            pinterestEmbed
                .setAuthor("pinterest", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52e.png")
                .setTitle(`**Pinterest Search** ${discord.getEmoji("aquaUp")}`)
                .setURL(response.url)
                .setImage(response.image.original.url)
                .setDescription(`${discord.getEmoji("star")}_Creator:_ **${response.creator.url}**\n` +
                `${discord.getEmoji("star")}_Board:_ **${response.board.url}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(response.created_at)}**\n` +
                `${discord.getEmoji("star")}_Saves:_ **${response.counts.saves}**\n` +
                `${discord.getEmoji("star")}_Comments:_ **${response.counts.comments}**\n` +
                `${discord.getEmoji("star")}_Source:_ **${response.link ? response.link : "None"}**\n` +
                `${discord.getEmoji("star")}_Note:_ ${response.note ? response.note : "None"}\n`);
            pinArray.push(pinterestEmbed);
        };
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const accessToken = (process.env.PINTEREST_ACCESS_TOKEN);
            const images = new GoogleImages(process.env.PINTEREST_SEARCH_ID, process.env.GOOGLE_API_KEY);
            if (args[1] === "board") {
                const user = args[2];
                const board = args[3];
                if (!user || !board)
                    return;
                const json = yield axios_1.default.get(`https://api.pinterest.com/v1/boards/${user}/${board}/pins/?access_token=${accessToken}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`);
                const response = json.data;
                for (const i in response) {
                    this.pinterestPin(discord, response[i]);
                }
                if (!pinArray.join("")) {
                    this.pinterestError(discord, message, embeds);
                    return;
                }
                if (pinArray.length === 1) {
                    message.channel.send(pinArray[0]);
                }
                else {
                    embeds.createReactionEmbed(pinArray);
                }
                return;
            }
            if (args[1] === "search") {
                const query = Functions_1.Functions.combineArgs(args, 2);
                const json = yield axios_1.default.get(`https://api.pinterest.com/v1/me/search/pins/?access_token=${accessToken}&query=${query.replace(/ /g, "-")}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`);
                const response = json.data;
                for (const i in response) {
                    this.pinterestPin(discord, response[i]);
                }
                if (!pinArray.join("")) {
                    this.pinterestError(discord, message, embeds);
                    return;
                }
                if (pinArray.length === 1) {
                    message.channel.send(pinArray[0]);
                }
                else {
                    embeds.createReactionEmbed(pinArray);
                }
                return;
            }
            const query = Functions_1.Functions.combineArgs(args, 1);
            const imageResult = yield images.search(query);
            let random = 0;
            let pin;
            for (let i = 0; i < imageResult.length; i++) {
                if (pin)
                    break;
                random = Math.floor(Math.random() * imageResult.length);
                pin = (imageResult[random].parentPage.match(/\d{18}/g));
            }
            if (!pin) {
                this.pinterestError(discord, message, embeds);
                return;
            }
            const json = yield axios_1.default.get(`https://api.pinterest.com/v1/pins/${pin}/?access_token=${accessToken}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`);
            const response = json.data.data;
            const board = response.board.url.slice(25);
            const response2 = yield axios_1.default.get(`https://api.pinterest.com/v1/boards/${board}/pins/?access_token=${accessToken}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`);
            const random2 = Math.floor(Math.random() * response2.data.length);
            this.pinterestPin(discord, response2.data[random2]);
            if (!pinArray.join("")) {
                this.pinterestError(discord, message, embeds);
                return;
            }
            message.channel.send(pinArray[0]);
        });
    }
}
exports.default = Pinterest;
//# sourceMappingURL=pinterest.js.map