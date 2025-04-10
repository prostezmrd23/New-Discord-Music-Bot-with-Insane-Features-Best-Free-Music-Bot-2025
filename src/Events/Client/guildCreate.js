import {
  WebhookClient,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "discord.js";

// Replace this with your new webhook URL
const webhookURL = "https://discord.com/api/webhooks/1359883096723292181/ufLNZVeto1q5J_QcWg_VPORefsEURhQVypOIPKuqnk0rSO_6ZOgj1tYHiu0q4uzZ5Gta";
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
      .setColor("#FFD700")
      .setTitle("✅ Joined a New Server!")
      .setDescription(
        `🎉 **${guild.name}** \n👥 **Members:** ${guild.memberCount}`
      )
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .setFooter({
        text: `Total Servers: ${guildCount.reduce((a, b) => a + b, 0)}`,
      });

    // Only try to send webhook if it exists
    if (hook) {
      await hook.send({
        content: "**📢 Server Joined! <@&1299394763933618239>**",
        embeds: [joinedEmbed],
      }).catch(e => console.error("Webhook error:", e));
    }

    // Rest of your code...
    const welcomeEmbed = new EmbedBuilder()
      .setColor("#00FF00")
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
        .setStyle(2)
        .setEmoji("🎵")
    );

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
      }).catch(e => console.error("Failed to send welcome message:", e));
    }
  } catch (error) {
    console.error("Error in guildCreate event:", error);
  }
};
