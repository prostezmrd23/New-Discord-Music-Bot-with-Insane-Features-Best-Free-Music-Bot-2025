import { EmbedBuilder } from "discord.js";
import SpotiPro from "spoti-pro";

const clientId = "e6f84fbec2b44a77bf35a20c5ffa54b8";
const clientSecret = "498f461b962443cfaf9539c610e2ea81";
const spoti = new SpotiPro(clientId, clientSecret);
const limit = 5;
const country = "IN";

export default {
  name: "spotify",
  aliases: ["sp"],
  category: "Music",
  permission: "",
  desc: "🎵 Play songs from Spotify!",
  options: {
    owner: false,
    inVc: true,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },

  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[], ServerData: any, Color: any }}
   */
  run: async ({ client, message, args, ServerData, Color }) => {
    try {
      const prefix = ServerData.prefix;
      const query = args.join(" ");

      if (!query) {
        return message
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(
                  `❌ **Usage:** \`${prefix}spotify <query/url>\``
                ),
            ],
          })
          .then((msg) => setTimeout(() => msg.delete(), 15000));
      }

      const { channel } = message.member.voice;
      let player = await client.kazagumo.createPlayer({
        guildId: message.guild.id,
        textId: message.channel.id,
        voiceId: channel.id,
        deaf: true,
      });

      // Check for YouTube links
      if (
        /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(
          query
        )
      ) {
        const msg = await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(Color)
              .setDescription(
                `🔄 **Resolving YouTube link to Spotify equivalent...**`
              ),
          ],
        });

        const youtubeResult = await client.kazagumo.search(query, {
          requester: message.author,
        });
        if (!youtubeResult.tracks.length)
          return message.reply("❌ **No results found!**");

        const trackName = youtubeResult.tracks[0].title;
        const spotifyResults = await spoti.searchSpotify(
          trackName,
          limit,
          country
        );
        if (!spotifyResults[0])
          return message.reply(
            "❌ **Could not find a matching track on Spotify!**"
          );

        query = spotifyResults[0];
      }

      // Search Spotify
      const spotifyResults = await spoti.searchSpotify(query, limit, country);
      if (!spotifyResults.length) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **No results found on Spotify!**"),
          ],
        });
      }

      const result = await client.kazagumo.search(spotifyResults[0], {
        requester: message.author,
      });
      if (!result.tracks.length) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **No playable tracks found!**"),
          ],
        });
      }

      if (result.type === "PLAYLIST") {
        for (let track of result.tracks) player.queue.add(track);
      } else {
        player.queue.add(result.tracks[0]);
      }

      if (!player.playing && !player.paused) {
        player.play();
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              result.type === "PLAYLIST"
                ? `📜 **Added \`${result.tracks.length}\` tracks from playlist:**\n🎶 **${result.playlist.name}**`
                : `🎧 **Added to queue:**\n[${result.tracks[0].title}](${result.tracks[0].uri})\n👤 **By:** ${result.tracks[0].author}`
            ),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "❌ **An error occurred while searching on Spotify!**"
            ),
        ],
      });
    }
  },
};
