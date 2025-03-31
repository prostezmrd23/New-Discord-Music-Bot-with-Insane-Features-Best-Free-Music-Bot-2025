import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "invite",
  aliases: ["add", "inv"],
  category: "Utility",
  permission: "",
  desc: "🔗 Get the invite link for TheExtremez!",
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
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=37088600&scope=bot%20applications.commands`;
    const supportLink = "https://discord.gg/VcRh6wmMYM";
    const voteLink = "https://top.gg/bot";

    const inviteEmbed = new EmbedBuilder()
      .setColor("#5865F2") // Discord Blurple Color
      .setTitle("🔗 Invite TheExtremez to Your Server!")
      .setDescription(
        `**Thank you for choosing TheExtremez!** 🎶\n` +
          `Click the button below to invite me and enjoy the best music experience! 🚀\n\n` +
          `🌟 **More Links:**\n` +
          `> 🛠️ **[Support Server](${supportLink})** - Get help & updates!\n` +
          `> ⭐ **[Vote for Me](${voteLink})** - Show your support!`
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: `Powered by TheExtremez 🎵`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("🚀 Invite Me")
        .setURL(inviteLink),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("🛠️ Support Server")
        .setURL(supportLink),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("⭐ Vote")
        .setURL(voteLink)
    );

    return message.channel.send({
      embeds: [inviteEmbed],
      components: [buttons],
    });
  },
};
