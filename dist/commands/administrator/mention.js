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
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
const Permissions_1 = require("./../../structures/Permissions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Mention extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            if (yield perms.checkAdmin(message))
                return;
            const mentionEmbed = embeds.createEmbed();
            const prefix = yield SQLQuery_1.SQLQuery.fetchPrefix(message);
            const input = Functions_1.Functions.combineArgs(args, 1);
            const role = message.guild.roles.find((r) => r.name.toLowerCase().includes(input.toLowerCase().trim()));
            if (!role) {
                message.channel.send(mentionEmbed
                    .setDescription("Could not find that role!"));
                return;
            }
            yield role.setMentionable(true);
            yield message.channel.send(`<@&${role.id}>`);
            yield role.setMentionable(false);
            if (message.content.startsWith(prefix[0]))
                yield message.delete();
        });
    }
}
exports.default = Mention;
//# sourceMappingURL=mention.js.map