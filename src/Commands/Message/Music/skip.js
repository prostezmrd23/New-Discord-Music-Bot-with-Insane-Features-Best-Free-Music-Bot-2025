import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "skip",
  aliases: ["s", "next", "agla"],
  category: "Music",
  permission: "",
  desc: "⏭️ Skip the current song!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[], player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args, player }) => {
    try {
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

      if (player.paused) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⚠️ **Cannot skip while the song is paused!**\n▶️ *Resume the track before skipping.*"
              ),
          ],
        });
      }

      if (!args[0]) {
        const skippedTrack = player.queue.current;
        await player.skip();

        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                `⏭️ **Skipped:** [${skippedTrack.title}](${skippedTrack.uri})`
              ),
          ],
        });
      }

      const skipCount = parseInt(args[0]);
      if (isNaN(skipCount) || skipCount <= 0) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **Please provide a valid number of tracks to skip!**"
              ),
          ],
        });
      }

      if (skipCount > player.queue.length) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⚠️ **The queue is not that long!**\n🔢 *Check the queue and try again.*"
              ),
          ],
        });
      }

      player.queue.remove(0, skipCount - 1);
      player.skip();

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`⏭️ **Skipped ${skipCount} songs!**`),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "❌ **An error occurred while skipping the track!**"
            ),
        ],
      });
    }
  },
};
