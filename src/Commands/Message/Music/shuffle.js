import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "shuffle",
  aliases: ["mix"],
  category: "Music",
  permission: "",
  desc: "🔀 Shuffle the current queue!",
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
  run: async ({ client, message }) => {
    try {
      const player = client.kazagumo.players.get(message.guild.id);
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setAuthor({
                name: "❌ No Active Player Found!",
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setDescription("There is no active player in this server."),
          ],
        });
      }

      if (player.queue.length < 3) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⚠️ **Not enough songs in the queue to shuffle!**\n🔢 *At least 3 tracks are required.*"
              ),
          ],
        });
      }

      player.queue.shuffle();

      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setDescription(
          "🎶 **Queue has been shuffled!** 🔀\nEnjoy the fresh mix of your tracks!"
        );

      const shuffleButton = new ButtonBuilder()
        .setCustomId("reshuffle")
        .setLabel("🔁 Shuffle Again")
        .setStyle(1);

      const row = new ActionRowBuilder().addComponents(shuffleButton);

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
        if (i.customId === "reshuffle") {
          player.queue.shuffle();
          await i.update({
            embeds: [
              embed.setDescription(
                "🔁 **Queue reshuffled!** Enjoy the new order!"
              ),
            ],
          });
        }
      });

      collector.on("end", async () => {
        msg.edit({ components: [] }).catch(() => {});
      });
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "❌ **An error occurred while shuffling the queue!**"
            ),
        ],
      });
    }
  },
};
