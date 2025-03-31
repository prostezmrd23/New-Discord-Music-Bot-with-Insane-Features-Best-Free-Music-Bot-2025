import { EmbedBuilder } from "discord.js";
import reconnectAuto from "../../../Models/reconnect.js";

export default {
  name: "247",
  aliases: ["24/7", "24/7mode", "24/7-mode"],
  category: "Music",
  permission: "",
  desc: "Toggles 24/7 mode for continuous music playback! 🎵",
  options: {
    owner: false,
    inVc: true,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },
  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player, args: string[] }} ctx
   */
  run: async ({ client, message }) => {
    try {
      const guildId = message.guild.id;
      const existingData = await reconnectAuto.findOne({ GuildId: guildId });

      if (existingData) {
        await reconnectAuto.findOneAndDelete({ GuildId: guildId });

        const disabledEmbed = new EmbedBuilder()
          .setTitle("⏹️ 24/7 Mode Disabled")
          .setDescription(
            "🔴 **24/7 Mode is now disabled.** The bot will leave when idle."
          )
          .setColor("#FF0000")
          .setFooter({
            text: `Disabled by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL(),
          });

        return message.channel.send({ embeds: [disabledEmbed] });
      }

      await reconnectAuto.create({
        GuildId: guildId,
        TextId: message.channel.id,
        VoiceId: message.member.voice.channel.id,
      });

      await client.kazagumo.createPlayer({
        guildId: guildId,
        textId: message.channel.id,
        voiceId: message.member.voice.channel.id,
        deaf: true,
      });

      const enabledEmbed = new EmbedBuilder()
        .setTitle("✅ 24/7 Mode Enabled")
        .setDescription(
          "🔵 **24/7 Mode is now active!** The bot will stay in VC even when idle."
        )
        .setColor("#00FF00")
        .setFooter({
          text: `Enabled by ${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        });

      message.channel.send({ embeds: [enabledEmbed] });
    } catch (e) {
      console.error(e);
      message.channel.send({
        content: "⚠️ **An error occurred while toggling 24/7 mode!**",
      });
    }
  },
};
