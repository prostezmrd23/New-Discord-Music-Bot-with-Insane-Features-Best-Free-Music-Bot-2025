import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "treblebass",
  aliases: ["highbass"],
  category: "Filters",
  permission: "",
  desc: "Enhance your music with boosted Treble & Bass! 🎵",
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
          .setLabel("Enable 🔊")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable ❌")
          .setStyle(ButtonStyle.Danger)
      );

      // Initial embed
      const embed = new EmbedBuilder()
        .setTitle("🎶 **Treble & Bass Filter**")
        .setDescription(
          "🔊 **Boost your music!** Click **Enable** for a more powerful sound.\n💥 **Enhances bass depth & treble clarity for an immersive experience!**"
        )
        .setColor("#FFA500")
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
            equalizer: [
              { band: 0, gain: 0.6 },
              { band: 1, gain: 0.67 },
              { band: 2, gain: 0.67 },
              { band: 3, gain: 0 },
              { band: 4, gain: -0.5 },
              { band: 5, gain: 0.15 },
              { band: 6, gain: -0.45 },
              { band: 7, gain: 0.23 },
              { band: 8, gain: 0.35 },
              { band: 9, gain: 0.45 },
              { band: 10, gain: 0.55 },
              { band: 11, gain: 0.6 },
              { band: 12, gain: 0.55 },
              { band: 13, gain: 0 },
            ],
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "🔊 **Treble & Bass Enhanced!** Enjoy a richer sound! 🎵"
            )
            .setColor("#00FF00");

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            equalizer: Array(14).fill({ band: 0, gain: 0 }), // Reset
          };

          player.send(data);
          const disabledEmbed = new EmbedBuilder()
            .setDescription("❌ **Filter Disabled!** Back to normal audio. 🎶")
            .setColor("#FF0000");

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
          "⚠️ | **An error occurred while applying the Treble & Bass filter!**",
      });
    }
  },
};
