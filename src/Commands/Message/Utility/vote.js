import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "vote",
  category: "Utility",
  permission: "",
  desc: "🗳 Vote for TheExtremez & show your support!",
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
    const embed = new EmbedBuilder()
      .setColor("#FFD700") // Gold color for premium look
      .setTitle("🌟 Support Us by Voting! 🌟")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setDescription(
        "🔥 **Love using TheExtremez?** Show your support by voting! Your vote helps us grow and bring more awesome features! 🎉\n\n" +
          "❤️ **Thank you for supporting us!** Click the button below to vote now. 🗳"
      )
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(5) // Link button
        .setLabel("🔗 Vote Now")
        .setURL("https://top.gg/bot/YOUR_BOT_ID/vote"),

      new ButtonBuilder()
        .setStyle(5)
        .setLabel("🔎 Check Vote Status")
        .setURL("https://top.gg/bot/YOUR_BOT_ID")
    );

    await message.reply({ embeds: [embed], components: [buttons] });
  },
};
