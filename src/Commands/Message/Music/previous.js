import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "previous",
  aliases: ["playprevious", "back", "pichla", "prev"],
  category: "Music",
  permission: "",
  desc: "⏮️ Play the previous song!",
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
        const embed = new EmbedBuilder()
          .setDescription(`❌ **No active player found for this server!**`)
          .setColor(client.settings.COLOR);
        return message.channel.send({ embeds: [embed] });
      }

      if (!player.queue.previous) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(`⚠️ **No previous track found in history!**`),
          ],
        });
      }

      // Move previous track to the front and play it
      player.queue.unshift(player.queue.previous);
      player.skip();

      const track = player.queue.previous;
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `⏮️ **Now Playing the Previous Song:**\n🎵 **[${track.title}](${track.uri})**\n👤 **Artist:** ${track.author}`
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("▶️ Play Now")
          .setCustomId("play_previous")
          .setStyle(1)
      );

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      // Interaction for the play button
      const filter = (button) => button.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (button) => {
        if (button.customId === "play_previous") {
          if (!player.playing) player.play();
          embed.setDescription(
            `▶️ **Resumed Playing:** [${track.title}](${track.uri})`
          );
          button.update({ embeds: [embed], components: [] });
        }
      });
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              `❌ **An error occurred! Please try again later.**`
            ),
        ],
      });
    }
  },
};
