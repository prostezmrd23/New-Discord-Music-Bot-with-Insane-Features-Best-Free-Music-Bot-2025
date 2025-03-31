import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "china",
  aliases: ["corona"],
  category: "Filters",
  permission: "",
  desc: "Toggles the China filter for a unique sound effect! 🏮",
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
      // Interactive buttons
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("on")
          .setLabel("Enable China Filter")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🏮"),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Reset Filter")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❌")
      );

      // Initial embed
      const embed = new EmbedBuilder()
        .setTitle("🏮 **Audio Filters - China Mode**")
        .setDescription(
          "🎶 **Experience a unique audio effect!**\n🔄 Click **Enable China Filter** to activate, or **Reset Filter** to go back to normal."
        )
        .setColor(client.settings.COLOR)
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
        time: 20000, // Expires in 20 seconds
      });

      collector.on("collect", async (i) => {
        if (i.customId === "on") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            timescale: {
              speed: 0.85,
              pitch: 1.2,
              rate: 1.15,
            },
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "✅ **China Filter Activated!** Enjoy the new sound. 🏮🎶"
            )
            .setColor(client.settings.SUCCESS_COLOR);

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            timescale: {
              speed: 1,
              pitch: 1,
              rate: 1,
            },
          };
          player.send(data);

          const disabledEmbed = new EmbedBuilder()
            .setDescription(
              "❌ **China Filter Disabled!** Back to normal audio. 🔄"
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
                "⏳ **Time Expired!** You didn’t select an option in time. Run the command again."
              ),
            ],
          })
          .catch(() => {});
      });
    } catch (e) {
      console.error(e);
      message.channel.send({
        content: "⚠️ | **An error occurred while applying the China filter!**",
      });
    }
  },
};
