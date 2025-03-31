import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
import { inspect } from "util";

export default {
  name: "eval",
  aliases: ["jsk"],
  category: "Owner",
  permission: "Administrator",
  desc: "🔧 Evaluates JavaScript code!",
  options: {
    owner: true,
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[] }}
   */
  run: async ({ client, message, args }) => {
    if (message.author.id !== client.ownerID) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "🚫 **You do not have permission to use this command!**"
            ),
        ],
      });
    }

    const code = args.join(" ");
    if (!code) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **Please provide code to evaluate!**"),
        ],
      });
    }

    try {
      let evaled = await eval(code);
      evaled = inspect(evaled, { depth: 0 });

      // Security Checks
      const sensitiveData = [client.settings.TOKEN, client.settings.MONGO];
      sensitiveData.forEach((data) => {
        if (evaled.includes(data))
          evaled = evaled.replaceAll(data, "🔒 [REDACTED]");
      });

      const responseEmbed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("✅ Evaluation Successful")
        .setDescription(`\`\`\`js\n${evaled.slice(0, 1000)}\n\`\`\``)
        .setFooter({
          text: "Executed by " + message.author.tag,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("delete_eval")
          .setLabel("🗑️ Delete")
          .setStyle(4)
      );

      const msg = await message.channel.send({
        embeds: [responseEmbed],
        components: [row],
      });

      const collector = msg.createMessageComponentCollector({ time: 60000 });

      collector.on("collect", async (interaction) => {
        if (interaction.user.id === message.author.id) {
          await msg.delete();
        }
      });
    } catch (error) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("❌ Evaluation Failed")
            .setDescription(
              `\`\`\`js\n${error.toString().slice(0, 1000)}\n\`\`\``
            ),
        ],
      });
    }
  },
};
