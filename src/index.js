import settings from "../settings.js"
import twitch from "./modules/twitch.js"
import bancho from "bancho.js"
import { Client } from "tmi.js"

const osuirc_client = new bancho.BanchoClient({
    username: settings.osuirc_username,
    password: settings.osuirc_password,
})

const twitch_client = new Client({
    options: { debug: false },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: settings.ttv_username,
        password: settings.ttv_token
    },
    channels: Object.keys(settings.channels)
})

await osuirc_client.connect()
console.log(`osu!irc connected as ${osuirc_client.getSelf().ircUsername}`)
//await osuirc.send(osuirc_client, "HDDTHR", `{message.author.name} | [${beatmap.status}] [https://osu.ppy.sh/b/${beatmap.id} ${beatmap.artist} - ${beatmap.title} [${beatmap.version}]] | ${beatmap.bpm}BPM ${beatmap.difficulty_rating}★ `)
await twitch_client.connect()
console.log(`Twitch connected as ${twitch_client.getUsername()}`)
await twitch.on_message(twitch_client, osuirc_client)