import {Collection, Message, MessageEmbed, MessageReaction, TextChannel, User} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const procBlock = new Collection()

export default class Embed extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Creates a custom embed and sends it.",
            help:
            `
            \`embed\` - Open the embed creator
            `,
            examples:
            `
            \`=>embed\`
            `,
            aliases: ["embeds", "customembed", "richembed", "messageembed"],
            random: "none",
            cooldown: 3
        })
    }

    public getProcBlock = () => {
        let id = ""
        if (this.message.guild) {
            id = this.message.guild.id
        } else {
            id = this.message.author.id
        }
        if (procBlock.has(id)) {
            return true
        } else {
            return false
        }
    }

    public setProcBlock = (remove?: boolean) => {
        let id = ""
        if (this.message.guild) {
            id = this.message.guild.id
        } else {
            id = this.message.author.id
        }
        if (remove) {
            procBlock.delete(id)
        } else {
            procBlock.set(id, true)
        }
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        if (message.guild && !(message.channel as TextChannel).permissionsFor(message.guild?.me!)?.has("MANAGE_MESSAGES")) {
            return message.reply(`The bot needs the permission **Manage Messages** in order to use this command. ${this.discord.getEmoji("kannaFacepalm")}`)
        }

        const infoEmbed = embeds.createEmbed()
        let embed = new MessageEmbed()
        embed.setColor(infoEmbed.color ?? "")

        infoEmbed
        .setAuthor("embed creator", "https://www.churchtrac.com/articles/apple/uploads/2017/09/Antu_insert-image.svg_-846x846.png")
        .setTitle(`**Custom Embed** ${discord.getEmoji("RaphiSmile")}`)
        .setDescription(
            `_Edit this embed by clicking on the reactions._\n` +
            `${discord.getEmoji("info")} - Displays this menu\n` +
            `${discord.getEmoji("title")} - Sets the title of the embed\n` +
            `${discord.getEmoji("description")} - Sets the description (main text) of the embed\n` +
            `${discord.getEmoji("image")} - Set the image of the embed\n` +
            `${discord.getEmoji("thumbnail")} - Sets the thumbnail of the embed\n` +
            `${discord.getEmoji("author")} - Sets the author text\n` +
            `${discord.getEmoji("authorImage")} - Sets the author image\n` +
            `${discord.getEmoji("footer")} - Sets the footer text\n` +
            `${discord.getEmoji("footerImage")} - Sets the footer image\n` +
            `${discord.getEmoji("color")} - Sets the color of the embed\n` +
            `${discord.getEmoji("timestamp")} - Sets the timestamp\n` +
            `${discord.getEmoji("url")} - Sets the url of the embed\n` +
            `${discord.getEmoji("json")} - Creates an embed from JSON data\n` +
            `${discord.getEmoji("done")} - Sends the embed\n` +
            `${discord.getEmoji("xcancel")} - Quits the embed creator\n`
        )

        const reactions = ["info", "title", "description", "image", "thumbnail", "author", "authorImage", "footer", "footerImage", "color", "timestamp", "url", "json", "done", "xcancel"]

        const msg = await message.channel.send(infoEmbed)
        for (let i = 0; i < reactions.length; i++) await msg.react(discord.getEmoji(reactions[i]))

        const infoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("info") && user.bot === false
        const titleCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("title") && user.bot === false
        const descriptionCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("description") && user.bot === false
        const imageCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("image") && user.bot === false
        const thumbnailCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("thumbnail") && user.bot === false
        const authorCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("author") && user.bot === false
        const authorImageCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("authorImage") && user.bot === false
        const footerCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("footer") && user.bot === false
        const footerImageCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("footerImage") && user.bot === false
        const colorCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("color") && user.bot === false
        const timestampCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("timestamp") && user.bot === false
        const urlCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("url") && user.bot === false
        const jsonCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("json") && user.bot === false
        const doneCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("done") && user.bot === false
        const cancelCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("xcancel") && user.bot === false
        const info = msg.createReactionCollector(infoCheck)
        const title = msg.createReactionCollector(titleCheck)
        const description = msg.createReactionCollector(descriptionCheck)
        const image = msg.createReactionCollector(imageCheck)
        const thumbnail = msg.createReactionCollector(thumbnailCheck)
        const author = msg.createReactionCollector(authorCheck)
        const authorImage = msg.createReactionCollector(authorImageCheck)
        const footer = msg.createReactionCollector(footerCheck)
        const footerImage = msg.createReactionCollector(footerImageCheck)
        const color = msg.createReactionCollector(colorCheck)
        const timestamp = msg.createReactionCollector(timestampCheck)
        const json = msg.createReactionCollector(jsonCheck)
        const url = msg.createReactionCollector(urlCheck)
        const done = msg.createReactionCollector(doneCheck)
        const cancel = msg.createReactionCollector(cancelCheck)
        let onInfo = true

        info.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (onInfo) {
                msg.edit(embed)
                onInfo = false
            } else {
                msg.edit(infoEmbed)
                onInfo = true
            }
        })

        let content = ""
        const getContent = async (response: Message) => {
            content = response.content
            if (response.attachments.size) content = response.attachments.first()!.url
            await response.delete()
        }

        title.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the title of this embed.`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            if (content.length > 256) {
                const rep2 = await this.message.channel.send(`<@${user.id}>, The title cannot exceed 256 characters.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            embed.setTitle(content)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        description.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the description of this embed.`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            if (content.length > 2048) {
                const rep2 = await this.message.channel.send(`<@${user.id}>, The description cannot exceed 2048 characters.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            embed.setDescription(content)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        image.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Post an image for this embed (png, jpg, gif). Type \`me\` for your profile pic, and \`guild\` for the guild icon.`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            if (content === "me") content = user.displayAvatarURL({format: "png", dynamic: true})
            if (content === "guild") content = this.message.guild?.iconURL({format: "png", dynamic: true}) ?? ""
            if (!/.(png|jpg|gif)/gi.test(content)) {
                const rep2 = await this.message.channel.send(`<@${user.id}>, This image is invalid.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            embed.setImage(content)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        thumbnail.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Post a thumbnail for this embed (png, jpg, gif). Type \`me\` for your profile pic, and \`guild\` for the guild icon.`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            if (content === "me") content = user.displayAvatarURL({format: "png", dynamic: true})
            if (content === "guild") content = this.message.guild?.iconURL({format: "png", dynamic: true}) ?? ""
            if (!/.(png|jpg|gif)/gi.test(content)) {
                const rep2 = await this.message.channel.send(`<@${user.id}>, This thumbnail is invalid.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            embed.setThumbnail(content)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        author.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the author of this embed.`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            if (content.length > 256) {
                const rep2 = await this.message.channel.send(`<@${user.id}>, The author text cannot exceed 256 characters.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            embed.setAuthor(content)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        authorImage.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Post an author image for this embed (png, jpg, gif). Type \`me\` for your profile pic, and \`guild\` for the guild icon.`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            if (content === "me") content = user.displayAvatarURL({format: "png", dynamic: true})
            if (content === "guild") content = this.message.guild?.iconURL({format: "png", dynamic: true}) ?? ""
            if (!/.(png|jpg|gif)/gi.test(content)) {
                const rep2 = await this.message.channel.send(`<@${user.id}>, This image is invalid.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            embed.setAuthor(embed.author?.name, content)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        footer.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the footer of this embed.`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            if (content.length > 2048) {
                const rep2 = await this.message.channel.send(`<@${user.id}>, The footer cannot exceed 2048 characters.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            embed.setFooter(content)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        footerImage.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Post a footer image for this embed (png, jpg, gif). Type \`me\` for your profile pic, and \`guild\` for the guild icon.`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            if (content === "me") content = user.displayAvatarURL({format: "png", dynamic: true})
            if (content === "guild") content = this.message.guild?.iconURL({format: "png", dynamic: true}) ?? ""
            if (!/.(png|jpg|gif)/gi.test(content)) {
                const rep2 = await this.message.channel.send(`<@${user.id}>, This image is invalid.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            embed.setFooter(embed.footer?.text, content)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        color.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Set the color of this embed (hex or named color).`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            embed.setColor(content.toUpperCase())
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        timestamp.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Set the timestamp of this embed (type \`now\` for the time now).`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            const date = content === "now" ? Date.now() : new Date(content)
            embed.setTimestamp(date)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        url.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the url of this embed.`)
            await embeds.createPrompt(getContent, true)
            rep.delete()
            if (!/http/gi.test(content)) {
                const rep2 = await this.message.channel.send(`<@${user.id}>, This is not a valid url.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            embed.setURL(content)
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        json.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            if (this.getProcBlock()) {
                const proc = await this.message.channel.send(`<@${user.id}>, Please finish editing the current field before editing another one.`)
                return proc.delete({timeout: 3000})
            }
            this.setProcBlock()
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the json data for this embed. The current embed will be replaced.`)
            await embeds.createPrompt(getContent, true)
            try {
                embed = new MessageEmbed(JSON.parse(content))
            } catch {
                const rep2 = await message.channel.send(`<@${user.id}>, This json data is invalid.`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                return
            }
            rep.delete()
            msg.edit(embed)
            onInfo = false
            this.setProcBlock(true)
        })

        done.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            await msg.delete()
            await message.channel.send(embed)
        })

        cancel.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            await msg.delete()
            await message.channel.send(`<@${user.id}>, Quit the embed creator! ${discord.getEmoji("aquaCry")}`)
        })
    }
}
