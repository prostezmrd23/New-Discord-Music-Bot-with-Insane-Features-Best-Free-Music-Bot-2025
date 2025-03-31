import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "support",
  aliases: ["support", "helpserver"],
  category: "Utility",
  permission: "",
  desc: "🔗 Get the invite link for the Support Server!",
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

  run: async ({ message }) => {
    const inviteLink = "https://discord.com/invite/wQSpcMxRcR";

    const embed = new EmbedBuilder()
      .setTitle("🌟 Need Help? Join Our Support Server!")
      .setDescription(
        "👋 **Hey there!** Need assistance, have questions, or want to hang out with the community?\n\n" +
          "🔗 Click the button below to join our **Support Server**!"
      )
      .setColor("#5865F2")
      .setThumbnail("https://cdn.discordapp.com/icons/your_server_id/icon.png")
      .setFooter({
        text: "We are here to help!",
        iconURL: message.author.displayAvatarURL(),
      });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("💬 Join Support Server")
        .setURL(inviteLink)
        .setStyle("Link")
    );

    return message.reply({ embeds: [embed], components: [button] });
  },
};
