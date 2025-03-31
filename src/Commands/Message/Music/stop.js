import { EmbedBuilder } from "discord.js";

export default {
  name: "stop",
  aliases: ["Stop", "destroy"],
  category: "Music",
  permission: "",
  desc: "⏹️ Stops the music player and clears the queue!",
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
  run: async ({ client, message, player }) => {
    if (!player) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "🚫 **No active player found!**\n💡 *Start playing something first!*"
            ),
        ],
      });
    }

    if (!player.playing) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("🎧 **There's nothing playing right now!**"),
        ],
      });
    }

    player.destroy();

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setTitle("⏹️ **Music Stopped**")
          .setDescription(
            "🎵 **The player has been stopped, and the queue has been cleared!**\n📢 *You can start a new session anytime!*"
          ),
      ],
    });
  },
};
