import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} from "discord.js";

export default {
  name: "prefix",
  aliases: ["pfx"],
  category: "Utility",
  permission: "ManageGuild",
  desc: "🔧 Set a custom prefix for your server!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, ServerData: any, args: string[] }}
   */
  run: async ({ client, message, ServerData, args }) => {
    // Check if the user has ManageGuild permission
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🚫 Insufficient Permissions!")
            .setDescription(
              "You need **Manage Server** permission to change the prefix."
            ),
        ],
      });
    }

    // Display Current Prefix if No Args
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🔧 Server Prefix")
            .setDescription(
              `📌 **Current Prefix:** \`${ServerData.prefix}\`\n\n` +
                "🛠️ **To Change Prefix:**\n" +
                "➤ Use `prefix set <new_prefix>` to change.\n" +
                "➤ Use `prefix reset` to restore default."
            )
            .setFooter({
              text: "Prefix System",
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }

    const subCommand = args[0].toLowerCase();

    // Setting a New Prefix
    if (subCommand === "set") {
      let newPrefix = args.slice(1).join(" ");

      if (!newPrefix) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FFA500")
              .setTitle("❌ Invalid Input")
              .setDescription(
                "Please provide a new prefix. Example: `prefix set !`"
              ),
          ],
        });
      }

      if (newPrefix.length > 5) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF4500")
              .setTitle("⚠️ Prefix Too Long")
              .setDescription("The prefix **must be 5 characters or less**."),
          ],
        });
      }

      if (ServerData.prefix === newPrefix) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#00BFFF")
              .setTitle("✅ Prefix Unchanged")
              .setDescription(
                `\`${newPrefix}\` is already the server's prefix.`
              ),
          ],
        });
      }

      ServerData.prefix = newPrefix;
      await ServerData.save();

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF7F")
            .setTitle("✅ Prefix Updated!")
            .setDescription(`🎉 The new prefix is now: \`${newPrefix}\``),
        ],
      });
    }

    // Resetting to Default Prefix
    if (subCommand === "reset") {
      if (ServerData.prefix === client.settings.prefix) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF69B4")
              .setTitle("ℹ️ No Custom Prefix")
              .setDescription("There is no custom prefix set for this server."),
          ],
        });
      }

      ServerData.prefix = client.settings.prefix;
      await ServerData.save();

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#32CD32")
            .setTitle("🔄 Prefix Reset")
            .setDescription(
              `🔁 Prefix has been reset to: \`${client.settings.prefix}\``
            ),
        ],
      });
    }

    // Invalid Command Handling
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#DC143C")
          .setTitle("❌ Invalid Subcommand")
          .setDescription("Valid options: `set`, `reset`"),
      ],
    });
  },
};
