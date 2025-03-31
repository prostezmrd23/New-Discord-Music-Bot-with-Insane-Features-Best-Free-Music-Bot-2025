import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "loop",
  aliases: ["repeat"],
  category: "Music",
  permission: "",
  desc: "🔄 Toggle loop mode for the track or queue!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player, args: string[] }}
   */
  run: async ({ client, message, args }) => {
    try {
      const player = client.kazagumo.players.get(message.guild.id);
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **No active player found in this server!**"),
          ],
        });
      }

      const loopModes = {
        track: "track",
        t: "track",
        song: "track",
        current: "track",
        queue: "queue",
        q: "queue",
        full: "queue",
        off: "none",
        disable: "none",
        false: "none",
        none: "none",
      };

      if (args[0]) {
        const loopType = loopModes[args[0].toLowerCase()];
        if (!loopType) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(
                  "⚠️ **Invalid loop option!**\n✅ **Valid options:** `track`, `queue`, `off`"
                ),
            ],
          });
        }

        await player.setLoop(loopType);
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                loopType === "none"
                  ? "🚫 **Looping has been disabled!**"
                  : `🔁 **Now looping the** \`${loopType}\`!`
              ),
          ],
        });
      }

      // Interactive buttons for loop selection
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setDescription("🎶 **Select a loop mode below:**");

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("track")
          .setLabel("Track 🔂")
          .setStyle(client.Buttons.grey),
        new ButtonBuilder()
          .setCustomId("queue")
          .setLabel("Queue 🔁")
          .setStyle(client.Buttons.grey),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable 🚫")
          .setStyle(client.Buttons.grey)
      );

      const msg = await message.channel.send({
        embeds: [embed],
        components: [buttons],
      });

      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (i) => {
        const selectedLoop = i.customId;
        await player.setLoop(selectedLoop === "off" ? "none" : selectedLoop);
        embed.setDescription(
          selectedLoop === "off"
            ? "🚫 **Looping is now disabled!**"
            : `🔁 **Now looping the** \`${selectedLoop}\`!`
        );
        i.update({ embeds: [embed], components: [] });
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          embed.setDescription("⏳ **Loop selection timed out!**");
          msg.edit({ embeds: [embed], components: [] });
        }
      });
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "⚠️ **An error occurred while toggling loop mode!**"
            ),
        ],
      });
    }
  },
};
