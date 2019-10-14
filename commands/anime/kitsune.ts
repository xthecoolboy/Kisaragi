import {Message} from "discord.js"
import nekoClient, {NekoRequestResults} from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Kitsune extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Post a picture of a fox girl.",
            help:
            `
            \`kitsune\` - Gets a random sfw image.
            \`kitsune ecchi\` - Gets a random ecchi image.
            \`kitsune lewd\` - Gets a random nsfw image.
            `,
            examples:
            `
            \`=>kitsune\`
            \`=>kitsune ecchi\`
            \`=>kitsune lewd\`
            `,
            aliases: ["k", "foxgirl"],
            cooldown: 10,
            image: "../assets/help images/anime/kitsune.png"
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const neko = new nekoClient()

        let image: NekoRequestResults
        let title: string
        if (args[1] === "lewd") {
            if (!perms.checkNSFW()) return
            image = await neko.nsfw.kitsune()
            title = "Lewd Kitsune"
        } else if (args[1] === "ecchi") {
            image = await neko.nsfw.eroKitsune()
            title = "Ecchi Kitsune"
        } else {
            image = await neko.sfw.foxGirl()
            title = "Kitsune"
        }

        const nekoEmbed = embeds.createEmbed()
        nekoEmbed
        .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
        .setURL(image.url)
        .setTitle(`**${title}** ${discord.getEmoji("madokaLewd")}`)
        .setImage(image.url)
        message.channel.send(nekoEmbed)
    }
}
