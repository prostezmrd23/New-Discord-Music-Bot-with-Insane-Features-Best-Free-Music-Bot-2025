import {
  WebhookClient,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "discord.js";

const webhookURL =
  "https://discord.com/api/webhooks/1359867080953958410/9OwJhIbr9tHWMX-MEaOhwAvN_9L-C8PfK_S_XQott2pt33GCTxgDNLl7M7uWIrUYWofw";
const hook = new WebhookClient({ url: webhookURL });

export default async (client, guild) => {
  try {
    await client.guilds.fetch({ cache: true });

    const guildCount = await client.cluster.broadcastEval(
      (c) => c.guilds.cache.size
    );
    const channelCount = await client.cluster.broadcastEval(
      (c) => c.channels.cache.size
    );
    const userCount = await client.cluster.broadcastEval(
      (c) => c.users.cache.size
    );

    const joinedEmbed = new EmbedBuilder()
      .setColor("#FFD700") // Gold for premium feel
      .setTitle("✅ Joined a New Server!")
      .setDescription(
        `🎉 **${guild.name}** \n👥 **Members:** ${guild.memberCount}`
      )
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .setFooter({
        text: `Total Servers: ${guildCount.reduce((a, b) => a + b, 0)}`,
      });

    await hook.send({
      content: "**📢 Server Joined! <@&1299394763933618239>**",
      embeds: [joinedEmbed],
    });

    // Sending welcome message in the server
    const welcomeEmbed = new EmbedBuilder()
      .setColor("#00FF00") // Green for welcome feel
      .setAuthor({
        name: "Thanks for Adding The Extremez!",
        iconURL: guild.iconURL({ dynamic: true }),
        url: "https://discord.gg/cGJ4r9Ye4q",
      })
      .setTitle("🎶 The Extremez - Your Ultimate Music Bot!")
      .setURL("https://discord.gg/cGJ4r9Ye4q")
      .setDescription(
        `🔥 **Hey! I'm TheExtremez, a top-tier music bot with premium features like 24/7 playback & autoplay - all for free!**\n\n` +
          "🚀 **Experience the best music commands and seamless performance!**\n\n" +
          "**[🎵 Invite Me](https://discord.com/oauth2/authorize?client_id=" +
          client.user.id +
          "&permissions=37088600&scope=bot%20applications.commands) • [💬 Support Server](https://discord.gg/cGJ4r9Ye4q)**"
      )
      .setThumbnail(
        client.user.displayAvatarURL({ dynamic: true, size: 1024 })
      );

    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("playerselect")
        .setLabel("🎚️ Select Player")
        .setStyle(2) // Grey button style
        .setEmoji("🎵")
    );

    // Find a suitable channel to send the embed
    const targetChannel = guild.channels.cache.find(
      (channel) =>
        [
          "logs",
          "log",
          "setup",
          "bot",
          "bot-logs",
          "music",
          "music-logs",
          "music-req",
          "chat",
          "general",
        ].some((name) => channel.name.includes(name)) && channel.isTextBased()
    );

    if (targetChannel) {
      await targetChannel.send({
        embeds: [welcomeEmbed],
        components: [actionRow],
      });
    }
  } catch (error) {
    console.error("Error in guildCreate event:", error);
  }
};
