import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "uptime",
  aliases: ["up"],
  category: "Utility",
  permission: "",
  desc: "⏳ Check how long the bot has been running!",
  options: {
    owner: false,
    inVc: false,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },

  run: async ({ client, message }) => {
    const uptimeInSeconds = Math.floor(client.uptime / 1000);

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("⏳ Bot Uptime")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setDescription(
        `🚀 **Bot has been running for:** <t:${Math.floor(
          Date.now() / 1000 - uptimeInSeconds
        )}:R>\n\n` +
          "💡 *The bot is running smoothly without any interruptions!*"
      )
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    const refreshButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("refresh_uptime")
        .setLabel("🔄 Refresh")
        .setStyle(2) // Secondary button style
    );

    const msg = await message.channel.send({
      embeds: [embed],
      components: [refreshButton],
    });

    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 30000, // Button active for 30 seconds
    });

    collector.on("collect", async (i) => {
      if (i.customId === "refresh_uptime") {
        await i.deferUpdate();

        const newUptime = Math.floor(client.uptime / 1000);
        const updatedEmbed = new EmbedBuilder()
          .setColor("#5865F2")
          .setTitle("⏳ Bot Uptime")
          .setThumbnail(
            client.user.displayAvatarURL({ dynamic: true, size: 2048 })
          )
          .setDescription(
            `🚀 **Bot has been running for:** <t:${Math.floor(
              Date.now() / 1000 - newUptime
            )}:R>\n\n` +
              "💡 *The bot is running smoothly without any interruptions!*"
          )
          .setFooter({
            text: `Requested by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          });

        await msg.edit({ embeds: [updatedEmbed], components: [refreshButton] });
      }
    });
  },
};
