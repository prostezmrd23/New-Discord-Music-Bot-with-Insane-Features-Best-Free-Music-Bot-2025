import { EmbedBuilder } from "discord.js";

export default {
  name: "resume",
  aliases: ["unpause", "continue", "wapis"],
  category: "Music",
  permission: "",
  desc: "▶️ Resumes the music playback!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    if (!player) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **No active player found in this server!**"),
        ],
      });
    }

    if (!player.paused) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setDescription("⚠️ **The player is already playing!**"),
        ],
      });
    }

    const currentTrack = player.queue.current;
    player.pause(false);

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#32CD32")
          .setAuthor({
            name: "▶️ Resumed Playback!",
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `🎶 **Now Playing:**\n\n**[${currentTrack.title}](${currentTrack.uri})**\n🎤 **Artist:** ${currentTrack.author}\n👤 **Requested by:** ${currentTrack.requester}`
          )
          .setFooter({ text: `Enjoy the music! 🎧` }),
      ],
    });
  },
};
