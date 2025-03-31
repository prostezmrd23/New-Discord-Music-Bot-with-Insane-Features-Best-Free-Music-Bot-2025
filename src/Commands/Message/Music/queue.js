import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";

export default {
  name: "queue",
  aliases: ["q"],
  category: "Music",
  permission: "",
  desc: "📜 View the current queue!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, emojis, args: string[] }} params
   */
  run: async ({ client, message, emojis, args }) => {
    const player = client.kazagumo.players.get(message.guild.id);
    if (!player) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription("❌ **No active player found for this server!**"),
        ],
      });
    }

    if (!player.queue.length) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription("⚠️ **The queue is currently empty!**"),
        ],
      });
    }

    const songsPerPage = 10;
    const totalPages = Math.ceil(player.queue.length / songsPerPage);
    let page =
      args[0] && !isNaN(args[0])
        ? Math.max(1, Math.min(totalPages, parseInt(args[0])))
        : 1;

    function generateQueueEmbed(pageNum) {
      const start = (pageNum - 1) * songsPerPage;
      const end = start + songsPerPage;
      const tracks = player.queue.slice(start, end);

      return new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setAuthor({
          name: `🎶 Queue for ${message.guild.name}`,
          iconURL:
            message.guild.iconURL({ dynamic: true }) ||
            message.author.displayAvatarURL(),
        })
        .setDescription(
          tracks
            .map(
              (track, index) =>
                `**${start + index + 1}.** [${track.title}](${
                  track.uri
                }) • 🎤 ${track.author} • 👤 Requested by: ${track.requester}`
            )
            .join("\n") || "⚠️ **No songs in queue!**"
        )
        .setFooter({
          text: `Page ${pageNum} of ${totalPages} | Total Songs: ${player.queue.length}`,
        });
    }

    function generateButtons(pageNum) {
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("first")
          .setLabel("⏮️ First")
          .setStyle(2)
          .setDisabled(pageNum === 1),
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("◀️ Previous")
          .setStyle(1)
          .setDisabled(pageNum === 1),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next ▶️")
          .setStyle(1)
          .setDisabled(pageNum === totalPages),
        new ButtonBuilder()
          .setCustomId("last")
          .setLabel("⏭️ Last")
          .setStyle(2)
          .setDisabled(pageNum === totalPages)
      );
    }

    const msg = await message.channel.send({
      embeds: [generateQueueEmbed(page)],
      components: [generateButtons(page)],
    });

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      switch (interaction.customId) {
        case "first":
          page = 1;
          break;
        case "previous":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(totalPages, page + 1);
          break;
        case "last":
          page = totalPages;
          break;
      }

      await interaction.update({
        embeds: [generateQueueEmbed(page)],
        components: [generateButtons(page)],
      });
    });

    collector.on("end", async () => {
      await msg.edit({ components: [] });
    });
  },
};
