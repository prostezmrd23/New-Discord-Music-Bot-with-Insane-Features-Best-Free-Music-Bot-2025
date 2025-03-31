import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "disconnect",
  aliases: ["dc", "leave"],
  category: "Music",
  permission: "",
  desc: "🔌 Disconnects the bot from the voice channel!",
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
  run: async ({ client, message }) => {
    try {
      const player = client.kazagumo.players.get(message.guild.id);
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("🚫 **No active player found!**")
              .setColor("#FF0000"),
          ],
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("🔌 Disconnect Player")
        .setDescription("Are you sure you want to **disconnect the bot**?")
        .setColor("#FFA500")
        .setFooter({
          text: `Requested by ${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm_disconnect")
          .setLabel("✅ Yes, Disconnect")
          .setStyle(4),
        new ButtonBuilder()
          .setCustomId("cancel_disconnect")
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
        if (i.customId === "confirm_disconnect") {
          player.queue.clear();
          player.skip();

          const disconnectEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription("👋 **Disconnecting...**");

          await msg.edit({ embeds: [disconnectEmbed], components: [] });

          setTimeout(() => {
            player.destroy();
            message.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("#FF0000")
                  .setDescription(
                    "🔌 **Bot has disconnected from the voice channel!**"
                  ),
              ],
            });
          }, 3000);
        } else {
          await msg.edit({
            content: "❌ **Disconnect canceled!**",
            embeds: [],
            components: [],
          });
        }
      });

      collector.on("end", () => {
        msg.edit({ components: [] }).catch(() => {});
      });
    } catch (err) {
      console.error(err);
      message.channel.send("⚠️ **An error occurred while disconnecting!**");
    }
  },
};
