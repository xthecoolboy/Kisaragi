import {GuildMember, Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Users extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Lists all users in the guild.",
            help:
            `
            \`users\` - Posts all of the users
            `,
            examples:
            `
            \`=>users\`
            `,
            guildOnly: true,
            aliases: ["members"],
            random: "none",
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const members = message.guild!.members
        const userArray = members.cache.map((m: GuildMember) => `${m.user.username}#${m.user.discriminator}`)
        const idArray = members.cache.map((m: GuildMember) => m.user.id)
        const joinArray = members.cache.map((m: GuildMember) => m.joinedAt)
        const step = 7.0
        const increment = Math.ceil(members.cache.size / step)
        const userEmbedArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            const userEmbed = embeds.createEmbed()
            let description = ""
            for (let j = 0; j < step; j++) {
                const value = (i*step)+j
                if (!userArray[value]) break
                description += `${discord.getEmoji("star")}_User:_ **${userArray[value]}**\n` +
                `${discord.getEmoji("star")}_User ID:_ ${idArray[value]}\n` +
                `${discord.getEmoji("star")}_Join Date:_ ${joinArray[value]}\n`
            }
            userEmbed
            .setAuthor("discord.js", "https://discord.js.org/static/logo-square.png")
            .setTitle(`**${message.guild!.name}'s Members** ${discord.getEmoji("vigneDead")}`)
            .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true}) as string)
            .setDescription(`${discord.getEmoji("star")}_Member Count:_ **${message.guild!.memberCount}**\n` + description)
            userEmbedArray.push(userEmbed)
        }
        embeds.createReactionEmbed(userEmbedArray)
        return
    }
}
