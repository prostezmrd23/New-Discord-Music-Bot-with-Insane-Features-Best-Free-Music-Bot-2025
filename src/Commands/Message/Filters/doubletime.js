import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "doubletime",
  aliases: ["double"],
  category: "Filters",
  permission: "",
  desc: "Toggles the Double Time filter to speed up your music! 🚀",
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
      // Buttons for toggling the filter
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("on")
          .setLabel("Enable Speed 🚀")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable ❌")
          .setStyle(ButtonStyle.Danger)
      );

      // Initial embed
      const embed = new EmbedBuilder()
        .setTitle("🎶 **Audio Filters - Double Time Mode**")
        .setDescription(
          "🚀 **Increase your music speed!** Click **Enable Speed** to boost playback.\n⚡ **Great for fast-paced music and energetic vibes!**"
        )
        .setColor("#FF4500")
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
            timescale: {
              speed: 1.165, // Slightly increased speed
            },
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "🚀 **Double Time Mode Enabled!** Your music is now faster! 🎵"
            )
            .setColor("#FF6347");

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            timescale: {
              speed: 1, // Normal Speed
            },
          };
          player.send(data);

          const disabledEmbed = new EmbedBuilder()
            .setDescription("❌ **Filter Disabled!** Back to normal speed. 🎵")
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
          "⚠️ | **An error occurred while applying the Double Time filter!**",
      });
    }
  },
};
