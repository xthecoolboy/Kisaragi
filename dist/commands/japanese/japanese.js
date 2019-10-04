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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const translate = __importStar(require("@vitalets/google-translate-api"));
const Command_1 = require("../../structures/Command");
const Functions_1 = require("./../../structures/Functions");
class Japanese extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const translateText = Functions_1.Functions.combineArgs(args, 1);
            const result = yield translate(translateText, { to: "ja" });
            if (result.from.language.iso === "ja") {
                const newResult = yield translate(translateText, { to: "en" });
                yield message.channel.send(`**Translated Text** ${discord.getEmoji("kannaCurious")}`);
                message.channel.send(newResult.text);
                return;
            }
            yield message.channel.send(`**Translated Text** ${discord.getEmoji("kannaCurious")}`);
            message.channel.send(result.text);
        });
    }
}
exports.default = Japanese;
//# sourceMappingURL=japanese.js.map