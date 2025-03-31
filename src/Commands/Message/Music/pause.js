import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "pause",
  aliases: ["freeze", "ruk"],
  category: "Music",
  permission: "",
  desc: "⏸️ Pause the music player with an interactive resume button!",
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: false,
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
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **No song is currently playing!**"),
        ],
      });
    }

    if (player.paused) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("⚠️ **The player is already paused!**"),
        ],
      });
    }

    player.pause(true);

    const embed = new EmbedBuilder()
      .setColor(client.settings.COLOR)
      .setDescription(`⏸️ **Paused** the player.`);

    const resumeButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("resume")
        .setEmoji("▶️") // Resume button emoji
        .setLabel("Resume")
        .setStyle(client.Buttons.grey)
    );

    const msg = await message.channel.send({
      embeds: [embed],
      components: [resumeButton],
    });

    const filter = (i) => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 30000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "resume") {
        if (player.paused) {
          player.pause(false);
          embed.setDescription("▶️ **Resumed** the player.");
        } else {
          embed.setDescription("⚠️ **The player is already playing!**");
        }
        await interaction.update({ embeds: [embed], components: [] });
        collector.stop();
      }
    });

    collector.on("end", async () => {
      if (msg.editable) {
        embed.setFooter({ text: "⏳ Resume button expired!" });
        msg.edit({ components: [] });
      }
    });
  },
};
