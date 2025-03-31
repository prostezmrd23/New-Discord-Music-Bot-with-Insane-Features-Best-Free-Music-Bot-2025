import { EmbedBuilder } from "discord.js";

export default {
  name: "seek",
  aliases: [],
  category: "Music",
  permission: "",
  desc: "⏩ Seek to a specific time in the current track!",
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: true,
      active: true,
    },
    premium: false,
    vote: false,
  },

  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args }) => {
    try {
      const player = client.kazagumo.players.get(message.guild.id);
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setAuthor({
                name: "❌ No Active Player Found!",
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setDescription("There is no active player in this server."),
          ],
        });
      }

      const track = player.queue.current;
      if (!track) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **There is no track playing right now!**"),
          ],
        });
      }

      if (!args[0]) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⏱️ **Usage:** `seek <time>`\n📌 **Example:** `seek 1:30` (1 minute 30 seconds)"
              ),
          ],
        });
      }

      if (!/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/.test(args[0])) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⚠️ **Invalid time format!**\n✅ **Valid formats:** `mm:ss` or `hh:mm:ss`"
              ),
          ],
        });
      }

      const ms =
        args[0]
          .split(":")
          .map(Number)
          .reduce((acc, time) => acc * 60 + time, 0) * 1000;

      if (ms > track.length) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⏳ **The provided time exceeds the track duration!**"
              ),
          ],
        });
      }

      player.seek(ms);

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `⏩ **Seeked to:** \`${args[0]}\`\n🎵 **Track:** [${track.title}](${track.uri})`
            ),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **An error occurred while seeking!**"),
        ],
      });
    }
  },
};
