import { EmbedBuilder, PermissionsBitField } from "discord.js";

export default {
  name: "join",
  aliases: ["j"],
  category: "Music",
  permission: "",
  desc: "🎵 Connects the bot to your voice channel!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    try {
      const { guild, member, channel } = message;
      const voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "🚫 **You need to be in a voice channel to use this command!**"
              ),
          ],
        });
      }

      if (player && player.state === "CONNECTED") {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                `✅ **I'm already connected to** <#${player.voiceChannel}>!`
              ),
          ],
        });
      }

      const botPermissions = guild.members.me.permissions;
      if (!botPermissions.has(PermissionsBitField.Flags.ViewChannel)) {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **I don't have permission to view your voice channel!**"
              ),
          ],
        });
      }

      if (!botPermissions.has(PermissionsBitField.Flags.Connect)) {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **I don't have permission to connect to your voice channel!**"
              ),
          ],
        });
      }

      if (!botPermissions.has(PermissionsBitField.Flags.Speak)) {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **I don't have permission to speak in your voice channel!**"
              ),
          ],
        });
      }

      if (!player) {
        player = client.kazagumo.createPlayer({
          guildId: guild.id,
          voiceId: voiceChannel.id,
          textId: channel.id,
          deaf: true,
        });
      }

      return channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription(
              `✅ **Successfully connected to** ${voiceChannel} **and ready to play!** 🎶`
            ),
        ],
      });
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "⚠️ **An error occurred while trying to join the voice channel!**"
            ),
        ],
      });
    }
  },
};
