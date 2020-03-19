import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Chorus extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies a chorus effect to an audio file.",
            help:
            `
            \`chorus delay? decay? speed? depth?\` - Applies chorus to the audio file with the parameters.
            \`chorus download/dl delay? decay? speed? depth?\` - Applies chorus to an attachment and uploads it.
            `,
            examples:
            `
            \`=>chorus 55 0.3 25 3\`
            \`=>chorus download 50 0.5 30 2\`
            `,
            aliases: [],
            cooldown: 20
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const queue = audio.getQueue() as any
        let setDownload = false
        if (args[1] === "download" || args[1] === "dl") {
            setDownload = true
            args.shift()
        }
        const delay = Number(args[1]) ? Number(args[1]) : 50
        const decay = Number(args[2]) ? Number(args[2]) : 0.3
        const speed = Number(args[3]) ? Number(args[3]) : 2
        const depth = Number(args[4]) ? Number(args[4]) : 2
        const rep = await message.reply("_Adding chorus to the file, please wait..._")
        let file = ""
        if (setDownload) {
            const regex = new RegExp(/.(mp3|wav|flac|ogg|aiff)/)
            const attachment = await discord.fetchLastAttachment(message, false, regex)
            if (!attachment) return message.reply(`Only **mp3**, **wav**, **flac**, **ogg**, and **aiff** files are supported.`)
            file = attachment
        } else {
            const queue = audio.getQueue() as any
            file = queue?.[0].file
        }
        try {
            await audio.chorus(file, delay, decay, speed, depth, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const rep = await message.reply("Added chorus to the file!")
            rep.delete({timeout: 3000})
        }
        return
    }
}