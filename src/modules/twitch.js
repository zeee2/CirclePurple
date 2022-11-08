import settings from "../../settings.js"
import osuv2 from "./osuv2.js"
import osuirc from "./osuirc.js"

// regex from https://github.com/Fanyatsu/osu-requests-bot/blob/8f0eff8031924e0929b412749b8cb4a6059c4c7b/main.py#L31-L41
const osu_beatmap_patterns = {
    "beatmap_official": /https?:\/\/osu.ppy.sh\/beatmapsets\/[0-9]+\#(osu|taiko|fruits|mania)\/([0-9]+)/,
    "beatmap_old": /https?:\/\/(osu|old).ppy.sh\/b\/([0-9]+)/,
    "beatmap_alternate": /https?:\/\/osu.ppy.sh\/beatmaps\/([0-9]+)/,
    "beatmap_old_alternate": /https?:\/\/(osu|old).ppy.sh\/p\/beatmap\?b=([0-9]+)/,
    "beatmapset_official": /https?:\/\/osu.ppy.sh\/beatmapsets\/([0-9]+)/,
    "beatmapset_old": /https?:\/\/(osu|old).ppy.sh\/s\/([0-9]+)/,
    "beatmapset_old_alternate": /https?:\/\/(osu|old).ppy.sh\/p\/beatmap\?s=([0-9]+)/,
}

const osu_profile_pattern = /https?:\/\/(osu|old).ppy.sh\/(u|users)\/([^\s]+)/
let user_cooldown = 0

export default {
    on_message: async (twitch_client, osuirc_client) => {
        twitch_client.on("message", async (channel, tags, message, self) => {
            if (self) return

            let is_cooldown = false
            let current_time = Math.floor(new Date().getTime() / 1000)
            let next_request = (user_cooldown != undefined ? user_cooldown : current_time) + settings.osuirc_cooldown
            current_time < next_request ? is_cooldown = true : is_cooldown = false
            user_cooldown = current_time

            for (let pattern in osu_beatmap_patterns) {
                const matches = message.match(osu_beatmap_patterns[pattern])
                if (matches) {
                    if (pattern.includes("beatmap_")) {
                        const beatmap = await osuv2.get_beatmap_info(matches[matches.length - 1])
                        if (!beatmap) return
                        twitch_client.say(channel, `[${beatmap.status}] ${beatmap.artist} - ${beatmap.title} [${beatmap.version}] | ${beatmap.bpm}BPM ${beatmap.difficulty_rating}★ `)
                        is_cooldown ? null : await osuirc.send(osuirc_client, settings.channels[channel.replace("#", "")], `[${beatmap.status}] [https://osu.ppy.sh/b/${beatmap.id} ${beatmap.artist} - ${beatmap.title} [${beatmap.version}]] | ${beatmap.bpm}BPM ${beatmap.difficulty_rating}★ | [https://api.nerinyan.moe/d/${beatmap.id} NeriNyan]`)
                        break
                    } else {
                        const beatmapsets = await osuv2.get_beatmapsets_info(matches[matches.length - 1])
                        if (!beatmapsets) return
                        twitch_client.say(channel, `[${beatmapsets.status}] ${beatmapsets.artist} - ${beatmapsets.title} | mapped by ${beatmapsets.creator} | ${beatmapsets.beatmaps} beatmap(s)`)
                        is_cooldown ? null : await osuirc.send(osuirc_client, settings.channels[channel.replace("#", "")], `[${beatmapsets.status}] [https://osu.ppy.sh/s/${beatmapsets.id} ${beatmapsets.artist} - ${beatmapsets.title}] | mapped by ${beatmapsets.creator} | ${beatmapsets.beatmaps} beatmap(s) | [https://api.nerinyan.moe/d/${beatmapsets.id} NeriNyan]`)
                        break
                    }
                }
            }
            const profile_matches = message.match(osu_profile_pattern)
            if (profile_matches) {
                const user = await osuv2.get_user_info(profile_matches[profile_matches.length - 1])
                if (!user) return
                return twitch_client.say(channel, `${user.username} - #${user.rank} (${user.country_code}: #${user.country_rank}) ${user.pp}pp`)
            }
        })
    }
}