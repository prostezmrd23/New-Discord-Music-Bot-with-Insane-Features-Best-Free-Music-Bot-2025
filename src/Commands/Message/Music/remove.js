import { EmbedBuilder } from "discord.js";

export default {
  name: "remove",
  aliases: ["rm"],
  category: "Music",
  permission: "",
  desc: "🗑️ Removes a song from the queue!",
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: false,
      active: true,
    },
    premium: false,
    vote: false,
  },

  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[], player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args, player }) => {
    if (!player) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **No active player found in this server!**"),
        ],
      });
    }

    if (!player.queue.length) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setDescription("⚠️ **The queue is currently empty!**"),
        ],
      });
    }

    if (!args[0] || isNaN(args[0])) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#1E90FF")
            .setDescription(
              "🔢 **Please specify a valid track number to remove!**\n\nExample: `!remove 2`"
            ),
        ],
      });
    }

    const trackNumber = parseInt(args[0]);

    if (trackNumber < 1 || trackNumber > player.queue.length) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#DC143C")
            .setDescription(
              `🚫 **Invalid track number!**\nChoose a number between \`1\` and \`${player.queue.length}\`.`
            ),
        ],
      });
    }

    const removedTrack = player.queue[trackNumber - 1];
    player.queue.remove(trackNumber - 1);

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#32CD32")
          .setAuthor({
            name: "✅ Song Removed!",
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `🗑️ **Removed track:**\n\n**[${removedTrack.title}](${removedTrack.uri})**\n🎤 **Artist:** ${removedTrack.author}\n👤 **Requested by:** ${removedTrack.requester}`
          )
          .setFooter({ text: `Total Songs Left: ${player.queue.length}` }),
      ],
    });
  },
};
