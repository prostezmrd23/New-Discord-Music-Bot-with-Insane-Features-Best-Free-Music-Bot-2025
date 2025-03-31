import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "grab",
  aliases: ["save"],
  category: "Music",
  permission: "",
  desc: "📥 Saves the currently playing track to your DMs!",
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: true,
      active: true,
    },
    premium: false,
    vote: false,
  },
  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    if (!player || !player.queue.current) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("🚫 **No song is currently playing!**"),
        ],
      });
    }

    const track = player.queue.current;
    const trackTitle =
      track.title.length > 64 ? `${track.title.slice(0, 64)}...` : track.title;

    const embed = new EmbedBuilder()
      .setColor(client.settings.COLOR)
      .setAuthor({
        name: "📥 Song Saved!",
        iconURL: client.settings.icon,
        url: "https://discord.com/invite/wQSpcMxRcR",
      })
      .setThumbnail(track.thumbnail)
      .setDescription(`🎵 **[${trackTitle}](${track.uri})**`)
      .addFields(
        { name: "🎤 Artist", value: `\`${track.author}\``, inline: true },
        {
          name: "▶️ Play it",
          value: `\`${client.settings.prefix}play ${track.uri}\``,
          inline: true,
        }
      )
      .setFooter({
        text: `🎶 From ${message.guild.name}`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      });

    message.member
      .send({ embeds: [embed] })
      .then(() => {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#00FF00")
              .setDescription(
                "📭 **Check your DMs! The song info has been saved.**"
              ),
          ],
        });
      })
      .catch(() => {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **I couldn't DM you! Please enable DMs and try again.**"
              ),
          ],
        });
      });
  },
};
