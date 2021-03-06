import {Message, MessageAttachment} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Tint extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Tints the image with a color.",
          help:
          `
          \`tint #hexcolor opacity\` - Tints the last posted image
          \`tint #hexcolor opacity url\` - Tints the linked image
          `,
          examples:
          `
          \`=>tint #ff5ce1 60\`
          `,
          aliases: ["colorize", "photofilter"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        const color = args[1] ? args[1] : "#ff0fd3"
        const opacity = Number(args[2]) ? Number(args[2]) : 20
        if (args[3]) {
            url = args[3]
        } else if (args[2] && Number.isNaN(Number(args[2]))) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        image.color([{apply: "mix", params: [color, opacity]}])
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new MessageAttachment(buffer)
        await message.reply(`Tinted the image with the color **${color}**!`, attachment)
        return
    }
}
