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
const booru_1 = __importDefault(require("booru"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Rule34 extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const rule34 = booru_1.default("rule34");
            const rule34Embed = embeds.createEmbed();
            const axios = require("axios");
            let tags;
            if (!args[1]) {
                tags = ["rating:safe"];
            }
            else if (args[1].toLowerCase() === "r18") {
                tags = Functions_1.Functions.combineArgs(args, 2).split(",");
                tags.push("-rating:safe");
            }
            else {
                tags = Functions_1.Functions.combineArgs(args, 1).split(",");
                tags.push("rating:safe");
            }
            if (!tags.join(" ")) {
                rule34Embed
                    .setAuthor("rule34", "https://cdn.imgbin.com/18/6/2/imgbin-rule-34-internet-mpeg-4-part-14-rule-34-Eg19BPJrNiThRQmqwVpTJsZAw.jpg")
                    .setTitle(`**Rule34 Search** ${discord.getEmoji("gabLewd")}`)
                    .setDescription("No results were found. Underscores are not required, " +
                    "if you want to search multiple terms separate them with a comma. Tags usually start with a last name, try looking up your tag " +
                    "on the rule34 website.\n" + "[rule34 Website](https://rule34.xxx//)");
                message.channel.send(rule34Embed);
                return;
            }
            const tagArray = [];
            for (const i in tags) {
                tagArray.push(tags[i].trim().replace(/ /g, "_"));
            }
            let url;
            if (tags.join("").match(/\d+/g)) {
                const rawUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${tags.join("").match(/\d+/g)}`;
                url = rawUrl.replace(/34,/g, "");
            }
            else {
                const image = yield rule34.search(tagArray, { limit: 1, random: true });
                url = rule34.postView(image[0].id);
            }
            const rawID = url.match(/\d+/g).join("");
            const id = rawID.slice(2);
            const result = yield axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&id=${id}`);
            const img = result.data[0];
            console.log(img);
            rule34Embed
                .setAuthor("rule34", "https://cdn.imgbin.com/18/6/2/imgbin-rule-34-internet-mpeg-4-part-14-rule-34-Eg19BPJrNiThRQmqwVpTJsZAw.jpg")
                .setURL(url)
                .setTitle(`**Rule34 Image** ${discord.getEmoji("gabLewd")}`)
                .setDescription(`${discord.getEmoji("star")}_Score:_ **${img.score}**\n` +
                `${discord.getEmoji("star")}_Uploader:_ **${img.owner}**\n` +
                `${discord.getEmoji("star")}_Tags:_ ${Functions_1.Functions.checkChar(img.tags, 1900, " ")}\n`)
                .setImage(`https://us.rule34.xxx/images/${img.directory}/${img.image}`);
            message.channel.send(rule34Embed);
        });
    }
}
exports.default = Rule34;
//# sourceMappingURL=rule34.js.map