import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "volume",
  aliases: ["vol"],
  category: "Music",
  permission: "",
  desc: "🎛️ Adjust the player's volume easily!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[], player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args, player }) => {
    if (!player) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "🚫 **No active player found!**\n💡 *Start playing something first!*"
            ),
        ],
      });
    }

    const currentVolume = player.volume * 100;

    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setTitle("🔊 Volume Control")
        .setDescription(
          `🎵 **Current Volume:** \`${currentVolume}%\`\n📢 *Use the buttons below to adjust!*`
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("volumedown")
          .setLabel("Vol -")
          .setStyle(2)
          .setEmoji("🔉"),
        new ButtonBuilder()
          .setCustomId("volumeup")
          .setLabel("Vol +")
          .setStyle(2)
          .setEmoji("🔊")
      );

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const collector = msg.createMessageComponentCollector({
        filter: (button) => button.user.id === message.author.id,
        time: 30000, // 30 seconds
      });

      collector.on("collect", async (button) => {
        if (!player) return;

        let newVolume = player.volume * 100;
        if (button.customId === "volumedown")
          newVolume = Math.max(0, newVolume - 10);
        if (button.customId === "volumeup")
          newVolume = Math.min(200, newVolume + 10);

        player.setVolume(newVolume / 100);

        embed.setDescription(`🎵 **Current Volume:** \`${newVolume}%\``);
        await button.update({ embeds: [embed], components: [row] });
      });

      return;
    }

    const volume = parseInt(args[0]);
    if (isNaN(volume) || volume < 1 || volume > 200) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "🚫 **Invalid volume!**\n💡 *Enter a number between `1 - 200`*"
            ),
        ],
      });
    }

    if (currentVolume === volume) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`⚠️ **Volume is already set to** \`${volume}%\`!`),
        ],
      });
    }

    player.setVolume(volume / 100);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setTitle("🔊 Volume Updated!")
          .setDescription(`🎶 **New Volume:** \`${volume}%\``),
      ],
    });
  },
};
