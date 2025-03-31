import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "bassboost",
  aliases: ["bb"],
  category: "Filters",
  permission: "",
  desc: "Enhance the bass for a deep, powerful sound experience!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player, args: string[] }} ctx
   */
  run: async ({ client, message, player, args }) => {
    try {
      if (!args[0]) {
        // Buttons for enabling/disabling bass boost
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("on")
            .setLabel("Enable Bass Boost")
            .setStyle(ButtonStyle.Success)
            .setEmoji("🎚️"),
          new ButtonBuilder()
            .setCustomId("off")
            .setLabel("Reset Bass")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("❌")
        );

        const embed = new EmbedBuilder()
          .setTitle("🔊 **Audio Filters - Bass Boost**")
          .setDescription(
            "🔥 **Boost your bass for a deep and powerful sound!**\n\n🎵 Use this filter to enhance the lower frequencies and make your music hit harder."
          )
          .setColor(client.settings.COLOR)
          .setThumbnail(
            "https://cdn.discordapp.com/emojis/1176868443207774309.png"
          )
          .setFooter({
            text: "Click a button to toggle Bass Boost!",
            iconURL: message.author.displayAvatarURL(),
          });

        const msg = await message.channel.send({
          embeds: [embed],
          components: [row],
        });

        // Collector for button interactions
        const filter = (i) => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({
          filter,
          time: 20000, // 20 seconds timeout
        });

        collector.on("collect", async (i) => {
          if (i.customId === "on") {
            const data = {
              op: "filters",
              guildId: message.guild.id,
              equalizer: [
                { band: 0, gain: 0.3 },
                { band: 1, gain: 0.25 },
                { band: 2, gain: 0.2 },
                { band: 3, gain: 0.15 },
                { band: 4, gain: 0.1 },
                { band: 5, gain: 0 },
                { band: 6, gain: -0.1 },
                { band: 7, gain: -0.15 },
                { band: 8, gain: -0.2 },
                { band: 9, gain: -0.25 },
                { band: 10, gain: -0.3 },
                { band: 11, gain: -0.35 },
                { band: 12, gain: -0.4 },
                { band: 13, gain: -0.45 },
              ],
            };
            player.send(data);

            const enabledEmbed = new EmbedBuilder()
              .setDescription(
                "✅ **Bass Boost Enabled!** Enjoy the deep, powerful sound. 🎶"
              )
              .setColor(client.settings.SUCCESS_COLOR);

            await i.update({ embeds: [enabledEmbed], components: [] });
          } else if (i.customId === "off") {
            const data = {
              op: "filters",
              guildId: message.guild.id,
              equalizer: Array(14).fill({ band: 0, gain: 0 }), // Resets all bands
            };
            player.send(data);

            const disabledEmbed = new EmbedBuilder()
              .setDescription(
                "❌ **Bass Boost Reset!** Back to normal sound. 🔄"
              )
              .setColor(client.settings.ERROR_COLOR);

            await i.update({ embeds: [disabledEmbed], components: [] });
          }
          msg.delete().catch(() => {});
        });

        collector.on("end", () => {
          msg
            .edit({
              components: [],
              embeds: [
                embed.setDescription(
                  "⏳ **Time Expired!** You didn't select an option in time. Run the command again."
                ),
              ],
            })
            .catch(() => {});
        });
      } else {
        // If user provides a custom level
        const level = parseInt(args[0]);
        if (isNaN(level)) {
          return message.channel.send({
            content:
              "❌ | **Invalid number!** Please enter a valid number between **0 and 10**.",
          });
        }

        if (level < 0 || level > 10) {
          return message.channel.send({
            content: "❌ | **Level must be between 0 and 10!**",
          });
        }

        const data = {
          op: "filters",
          guildId: message.guild.id,
          equalizer: [
            { band: 0, gain: level / 10 },
            { band: 1, gain: level / 10 },
            { band: 2, gain: level / 10 },
            { band: 3, gain: level / 10 },
            { band: 4, gain: level / 10 },
            { band: 5, gain: level / 10 },
            { band: 6, gain: level / 10 },
            { band: 7, gain: 0 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0 },
            { band: 11, gain: 0 },
            { band: 12, gain: 0 },
            { band: 13, gain: 0 },
          ],
        };

        player.send(data);
        const embed = new EmbedBuilder()
          .setDescription(`✅ | **Bass Boost Level Set To ${level}** 🎵`)
          .setColor(client.settings.COLOR);

        message.channel.send({ embeds: [embed] });
      }
    } catch (e) {
      console.error(e);
      message.channel.send({
        content:
          "⚠️ | **An error occurred while applying the Bass Boost filter!**",
      });
    }
  },
};
