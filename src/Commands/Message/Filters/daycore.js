import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "daycore",
  category: "Filters",
  permission: "",
  desc: "Toggles the Daycore filter for dreamy, slow-motion music! 🌙",
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
      // Buttons for toggling filter
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("on")
          .setLabel("Enable Daycore")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🌙"),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable Filter")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("❌")
      );

      // Initial embed
      const embed = new EmbedBuilder()
        .setTitle("🎶 **Audio Filters - Daycore Mode**")
        .setDescription(
          "🌙 **Enter the world of dreamy, slowed-down music!**\n🔊 Click **Enable Daycore** for a smooth, chill experience."
        )
        .setColor("#4B0082")
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/1176868443207774309.png"
        )
        .setFooter({
          text: "Click a button to toggle the filter!",
          iconURL: message.author.displayAvatarURL(),
        });

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      // Button collector
      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 20000, // Expires in 20 sec
      });

      collector.on("collect", async (i) => {
        if (i.customId === "on") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            equalizer: Array(14)
              .fill({ band: 0, gain: 0 })
              .map((_, i) => ({
                band: i,
                gain: i >= 8 ? -0.25 : 0, // Deep bass effect
              })),
            timescale: {
              pitch: 0.63,
              rate: 1.05,
            },
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "🌙 **Daycore Mode Enabled!** Enjoy the slow, dreamy vibes! 🎵"
            )
            .setColor("#8A2BE2");

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            equalizer: Array(14).fill({ band: 0, gain: 0 }),
            timescale: {
              pitch: 1,
              rate: 1,
            },
          };
          player.send(data);

          const disabledEmbed = new EmbedBuilder()
            .setDescription("❌ **Filter Disabled!** Back to normal. 🎵")
            .setColor("#FFFFFF");

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
                "⏳ **Time Expired!** You didn’t select an option in time. Run the command again."
              ),
            ],
          })
          .catch(() => {});
      });
    } catch (e) {
      console.error(e);
      message.channel.send({
        content:
          "⚠️ | **An error occurred while applying the Daycore filter!**",
      });
    }
  },
};
