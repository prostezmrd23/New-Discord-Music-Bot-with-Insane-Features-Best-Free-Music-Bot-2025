import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "clear",
  aliases: ["clq", "cl"],
  category: "Music",
  permission: "",
  desc: "🗑️ Clears The Queue!",
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

      if (!player.queue.length) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("🎵 **The queue is already empty!**"),
          ],
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("🗑️ Clear Queue")
        .setDescription("Are you sure you want to **clear the queue**?")
        .setColor("#FFA500")
        .setFooter({
          text: `Requested by ${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm_clear")
          .setLabel("✅ Yes, Clear")
          .setStyle(4),
        new ButtonBuilder()
          .setCustomId("cancel_clear")
          .setLabel("❌ Cancel")
          .setStyle(2)
      );

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "confirm_clear") {
          player.queue.clear();

          const successEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription("✅ **Successfully cleared the queue!**");

          await msg.edit({ embeds: [successEmbed], components: [] });
        } else {
          await msg.edit({
            content: "❌ **Queue clear canceled!**",
            embeds: [],
            components: [],
          });
        }
      });

      collector.on("end", () => {
        msg.edit({ components: [] }).catch(() => {});
      });
    } catch (error) {
      console.error(error);
      message.channel.send({
        content: "⚠️ **An error occurred while clearing the queue!**",
      });
    }
  },
};
