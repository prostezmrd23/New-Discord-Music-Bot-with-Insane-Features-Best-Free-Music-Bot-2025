import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "8d",
  aliases: ["3d"],
  category: "Filters",
  permission: "",
  desc: "Toggle the 8D audio filter for an immersive experience!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player, args: string[] }} ctx
   */
  run: async ({ client, message, player }) => {
    try {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("on")
          .setLabel("Enable 8D")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🎧"),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable 8D")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("⛔")
      );

      const embed = new EmbedBuilder()
        .setTitle("🎵 **Audio Filters - 8D Mode**")
        .setDescription(
          "✨ **Experience music in a new way!**\n\n🔄 8D audio creates a **rotating effect** that moves around your head. Use **headphones** for the best effect!"
        )
        .setColor(client.settings.COLOR)
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/1176868443207774309.png"
        )
        .setFooter({
          text: "Click a button to toggle 8D filter!",
          iconURL: message.author.displayAvatarURL(),
        });

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 20000, // 20 seconds timeout
      });

      collector.on("collect", async (i) => {
        if (i.customId === "on") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            rotation: { rotationHz: 0.103 },
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "✅ **8D Filter Enabled!** Enjoy the immersive audio experience. 🎶"
            )
            .setColor(client.settings.SUCCESS_COLOR);

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            rotation: { rotationHz: 0 },
          };
          player.send(data);

          const disabledEmbed = new EmbedBuilder()
            .setDescription(
              "❌ **8D Filter Disabled!** Back to normal audio playback. 🎵"
            )
            .setColor(client.settings.ERROR_COLOR);

          await i.update({ embeds: [disabledEmbed], components: [] });
        }
        msg.delete().catch(() => {});
      });

      collector.on("end", () => {
        msg
          .edit({
            components: [],
            embeds: [
              embed.setDescription(
                "⏳ **Time Expired!** You didn't select an option in time. Run the command again."
              ),
            ],
          })
          .catch(() => {});
      });
    } catch (e) {
      console.error(e);
      const errorEmbed = new EmbedBuilder()
        .setDescription(
          "⚠️ **An error occurred while toggling the 8D filter.**"
        )
        .setColor(client.settings.ERROR_COLOR);
      message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
