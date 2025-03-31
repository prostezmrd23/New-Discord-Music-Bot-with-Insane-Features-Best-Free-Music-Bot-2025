import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "autoplay",
  aliases: ["ap"],
  category: "Music",
  permission: "",
  desc: "🎵 Toggle Autoplay Mode for Seamless Music!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }} ctx
   */
  run: async ({ client, message, player }) => {
    try {
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("🚫 **No active music player found!**")
              .setColor("#FF0000"),
          ],
        });
      }

      const isAutoplayEnabled = player.data.get("autoplay");
      const newState = !isAutoplayEnabled;
      player.data.set("autoplay", newState);

      const embed = new EmbedBuilder()
        .setTitle("🎶 Autoplay Mode")
        .setDescription(
          newState
            ? "✅ **Autoplay is now enabled!** The bot will continue playing similar tracks automatically."
            : "❌ **Autoplay is now disabled!** The queue will stop when finished."
        )
        .setColor(newState ? "#00FF00" : "#FF0000")
        .setFooter({
          text: `Toggled by ${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("autoplay_toggle")
          .setLabel(newState ? "Disable" : "Enable")
          .setStyle(newState ? 4 : 3)
      );

      message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error(error);
      message.channel.send({
        content: "⚠️ **An error occurred while toggling Autoplay!**",
      });
    }
  },
};
