import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "ping",
  aliases: ["latency"],
  category: "Utility",
  permission: "",
  desc: "📡 Check the bot's latency and Discord API response time!",
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

  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message }) => {
    const messages = [
      "⚡ Faster than lightning!",
      "🚀 Speed level: Over 9000!",
      "⚙️ Optimized for maximum efficiency!",
      "📡 Scanning the network...",
      "🌐 Checking connection stability...",
      "🛰️ Establishing a stable connection...",
      "🔍 Searching for latency fluctuations...",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const msg = await message.channel.send({
      content: "⏳ Pinging the bot...",
    });

    const botLatency = msg.createdTimestamp - message.createdTimestamp;
    const shardPing =
      message.guild.shard.ping < 0 ? "N/A" : message.guild.shard.ping;

    const pingEmbed = new EmbedBuilder()
      .setColor("#5865F2") // Discord Blurple Color
      .setTitle("📡 Bot Latency & API Status")
      .setDescription(
        `🟢 **Bot Latency:** \`${botLatency}ms\`\n` +
          `🟠 **Shard Ping:** \`${shardPing}ms\`\n` +
          `🛠️ **WebSocket Ping:** \`${client.ws.ping}ms\`\n\n` +
          `💬 *${randomMessage}*`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("shard_ping")
        .setLabel("🌐 Shard Ping")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("latency")
        .setLabel("⚡ Bot Latency")
        .setStyle(ButtonStyle.Primary)
    );

    await msg.edit({
      content: "✅ **Ping Results:**",
      embeds: [pingEmbed],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 60000, // 1 minute
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "shard_ping") {
        await interaction.deferUpdate();

        const shardEmbed = new EmbedBuilder()
          .setColor("#FFAA00") // Yellow for shard
          .setTitle("🌐 Shard Ping")
          .setDescription(
            `🟠 **Current Shard Ping:** \`${shardPing}ms\`\n` +
              `🔄 *Updating latency stats...*`
          )
          .setThumbnail(client.user.displayAvatarURL());

        await msg.edit({
          embeds: [shardEmbed],
        });
      } else if (interaction.customId === "latency") {
        await interaction.deferUpdate();

        const latencyEmbed = new EmbedBuilder()
          .setColor("#00FF7F") // Green for latency
          .setTitle("⚡ Bot Latency")
          .setDescription(
            `🟢 **Message Latency:** \`${botLatency}ms\`\n` +
              `🔵 **WebSocket Ping:** \`${client.ws.ping}ms\``
          )
          .setThumbnail(client.user.displayAvatarURL());

        await msg.edit({
          embeds: [latencyEmbed],
        });
      }
    });

    collector.on("end", () => {
      msg.edit({ components: [] });
    });
  },
};
