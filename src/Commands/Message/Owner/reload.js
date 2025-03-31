import { EmbedBuilder } from "discord.js";

export default {
  name: "reload",
  aliases: ["rr"],
  category: "Owner",
  desc: "🔄 Reloads a command!",
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
    const cmd = args.length > 0 ? args[0].toLowerCase() : null;

    if (!cmd) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("❌ Missing Command Name")
            .setDescription(
              "Please provide the **command name** you want to reload!"
            ),
        ],
      });
    }

    const command =
      client.messageCommands.get(cmd) ||
      client.messageCommands.find(
        (cmds) => cmds.aliases && cmds.aliases.includes(cmd)
      );

    if (!command) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle("⚠️ Command Not Found")
            .setDescription(
              `There is **no** command or alias named **\`${cmd}\`**!`
            ),
        ],
      });
    }

    try {
      delete require.cache[
        require.resolve(`../${command.category}/${command.name}.js`)
      ];

      const newCommand = (
        await import(`../${command.category}/${command.name}.js`)
      ).default;
      client.messageCommands.set(newCommand.name, newCommand);

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("✅ Command Reloaded")
            .setDescription(
              `🔄 Successfully reloaded **\`${newCommand.name}\`** command!`
            ),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("❌ Reload Error")
            .setDescription(
              `There was an **error** while reloading \`${command.name}\`:\n\`\`\`js\n${error.message}\n\`\`\``
            ),
        ],
      });
    }
  },
};
