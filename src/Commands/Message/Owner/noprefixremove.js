import { EmbedBuilder } from "discord.js";

const prime = ["1299394763933618239"]; // Authorized Users

export default {
  name: "noprefixremove",
  aliases: ["npremov"],
  category: "Owner",
  permission: "Administrator",
  desc: "❌ Removes a user from the No Prefix list!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[] }}
   */
  run: async ({ client, message, args }) => {
    if (!prime.includes(message.author.id)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🚫 Access Denied")
            .setDescription(
              "You **do not** have permission to use this command!"
            ),
        ],
      });
    }

    if (!args[0]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("❌ Missing Argument")
            .setDescription("Please provide a valid **User ID**!"),
        ],
      });
    }

    const userId = args[0];
    let user;

    try {
      user = await client.users.fetch(userId);
    } catch (error) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("❌ Invalid User ID")
            .setDescription(
              "The provided ID does **not** match any Discord user."
            ),
        ],
      });
    }

    const exists = await client.db.get(`noprefix_${userId}`);

    if (!exists) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle("⚠️ Not Found")
            .setDescription(
              `🔹 <@${userId}> is **not** in the No Prefix list!`
            ),
        ],
      });
    }

    await client.db.delete(`noprefix_${userId}`);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#00FF00")
          .setTitle("✅ Successfully Removed")
          .setDescription(
            `🔹 <@${userId}> has been **removed** from the No Prefix list!`
          ),
      ],
    });
  },
};
