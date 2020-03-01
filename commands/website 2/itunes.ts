import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Itunes extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches the itunes store for tracks.",
            help:
            `
            \`itunes query\` - Searches itunes with the query.
            `,
            examples:
            `
            \`=>itunes tenpi\`
            `,
            aliases: [],
            cooldown: 15
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        const query = Functions.combineArgs(args, 1).trim()

        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("itunes", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQO8t3qIR99IBrICWL90wj39v_OOEXEWu3fscyh8HCAGIRj9jZi")
            .setTitle(`**Itunes Search** ${discord.getEmoji("RaphiSmile")}`))
        }

        const url = `https://itunes.apple.com/search?country=US&entity=song&explicit=no&lang=en&media=music&term=${query}`
        const response = await axios.get(url).then((r) => r.data)
        const itunesArray: MessageEmbed[] = []
        for (let i = 0; i < response.results.length; i++) {
            const track = response.results[i]
            const minutes = Math.floor(track.trackTimeMillis / 60000)
            const seconds = Math.floor((track.trackTimeMillis % (minutes*60000)) / 1000)
            const itunesEmbed = embeds.createEmbed()
            itunesEmbed
            .setAuthor("itunes", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQO8t3qIR99IBrICWL90wj39v_OOEXEWu3fscyh8HCAGIRj9jZi")
            .setTitle(`**Itunes Search** ${discord.getEmoji("RaphiSmile")}`)
            .setImage(track.artworkUrl100)
            .setURL(track.trackViewUrl)
            .setDescription(
                `${star}_Track:_ **[${track.trackName}](${track.trackViewUrl})**\n` +
                `${star}_Artist:_ **[${track.artistName}](${track.artistViewUrl})**\n` +
                `${star}_Collection:_ **[${track.collectionName}](${track.collectionViewUrl})**\n` +
                `${star}_Genre:_ **${track.primaryGenreName}**\n` +
                `${star}_Release Date:_ **${Functions.formatDate(track.releaseDate)}**\n` +
                `${star}_Price:_ **$${track.trackPrice}**\n` +
                `${star}_Length:_ **${minutes}m ${seconds}s**\n` +
                `[**Preview**](${track.previewUrl})`
            )
            itunesArray.push(itunesEmbed)
        }

        if (!itunesArray[0]) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("itunes", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQO8t3qIR99IBrICWL90wj39v_OOEXEWu3fscyh8HCAGIRj9jZi")
            .setTitle(`**Itunes Search** ${discord.getEmoji("RaphiSmile")}`))
        }

        if (itunesArray.length === 1) {
            message.channel.send(itunesArray[0])
        } else {
            embeds.createReactionEmbed(itunesArray)
        }
        return
    }
}