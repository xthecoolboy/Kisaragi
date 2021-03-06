import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"

export default class Stockings extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts pictures of anime girls wearing stockings.",
            help:
            `
            \`stockings\` - Sends pictures of anime girls in stockings.
            `,
            examples:
            `
            \`=>stockings\`
            `,
            aliases: ["leggings", "tights"],
            random: "none",
            cooldown: 10,
            nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const pixiv = new PixivApi(discord, message)
        const perms = new Permission(discord, message)

        if (args[1] === "lewd") {
            if (!perms.checkBotDev()) return
            if (!perms.checkNSFW()) return
            const pixivArray = await pixiv.animeEndpoint("stockings/lewd", 10)
            return embeds.createReactionEmbed(pixivArray, true, true)
        }
        const pixivArray = await pixiv.animeEndpoint("stockings", 10)
        return embeds.createReactionEmbed(pixivArray, true, true)
    }
}
