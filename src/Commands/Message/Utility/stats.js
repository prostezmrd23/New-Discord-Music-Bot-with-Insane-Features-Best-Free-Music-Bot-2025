import { ButtonBuilder, ActionRowBuilder, EmbedBuilder } from "discord.js";
import os from "os";
import fs from "fs";

const packageJSON = JSON.parse(fs.readFileSync("./package.json", "utf8"));

export default {
  name: "stats",
  aliases: ["st"],
  category: "Utility",
  desc: "📊 Check bot & system statistics!",
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

  run: async ({ client, message }) => {
    const totalUsers = client.guilds.cache.reduce(
      (acc, guild) => acc + (guild.memberCount || 0),
      0
    );
    const totalShards = client.cluster?.info?.TOTAL_SHARDS || "N/A";
    const clusterId = client.cluster?.id || "N/A";
    const cachedUsers = client.users.cache.size;
    const guildCount = client.guilds.cache.size;
    const channelCount = client.channels.cache.size;
    const uptime = Math.floor(client.uptime / 1000);

    // Dependencies
    const djsVersion = packageJSON.dependencies["discord.js"];
    const nodeVersion = process.version;
    const mongooseVersion = packageJSON.dependencies["mongoose"];
    const hybridVersion = packageJSON.dependencies["discord-hybrid-sharding"];

    // System Stats
    const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2);
    const freeMemory = (os.freemem() / 1024 / 1024).toFixed(2);
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
      2
    );
    const cpuUsage = (process.cpuUsage().system / 1024 / 1024).toFixed(2);
    const cpuCores = os.cpus().length;
    const cpuModel = os.cpus()[0].model;
    const cpuSpeed = os.cpus()[0].speed;

    // Buttons for Interaction
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("bot")
        .setLabel("🤖 Bot Stats")
        .setStyle("Secondary")
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("system")
        .setLabel("🖥️ System Stats")
        .setStyle("Secondary")
        .setDisabled(false),
      new ButtonBuilder()
        .setCustomId("dev")
        .setLabel("👨‍💻 Dev Info")
        .setStyle("Secondary")
        .setDisabled(false)
    );

    // Bot Stats Embed
    const botEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username}'s Stats 📊`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `> 🤖 **Bot Tag:** \`${client.user.tag}\`\n` +
          `> 🌍 **Servers:** \`${guildCount}\`\n` +
          `> 👥 **Users:** \`${totalUsers}\` (Cached: \`${cachedUsers}\`)\n` +
          `> 📡 **Channels:** \`${channelCount}\`\n` +
          `> 🛠️ **Commands:** \`${client.messageCommands.size}\`\n` +
          `> 🔗 **Shards:** \`${totalShards}\` | 🏷 **Cluster:** \`${clusterId}\`\n` +
          `> 🏗 **Discord.js:** \`${djsVersion}\`\n` +
          `> ⏳ **Uptime:** <t:${Math.floor(Date.now() / 1000 - uptime)}:R>`
      )
      .setColor("#2F3136")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL(),
      });

    // Send Initial Message
    const msg = await message.channel.send({
      embeds: [botEmbed],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();

      if (i.customId === "system") {
        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("bot")
            .setLabel("🤖 Bot Stats")
            .setStyle("Secondary")
            .setDisabled(false),
          new ButtonBuilder()
            .setCustomId("system")
            .setLabel("🖥️ System Stats")
            .setStyle("Secondary")
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("dev")
            .setLabel("👨‍💻 Dev Info")
            .setStyle("Secondary")
            .setDisabled(false)
        );

        const systemEmbed = new EmbedBuilder()
          .setAuthor({
            name: `${client.user.username}'s System Stats ⚙️`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(
            `> 🖥 **Total RAM:** \`${totalMemory} MB\`\n` +
              `> 🚀 **RAM Usage:** \`${memoryUsage} MB\`\n` +
              `> 📉 **Free Memory:** \`${freeMemory} MB\`\n` +
              `> 🔧 **CPU Model:** \`${cpuModel}\`\n` +
              `> 💻 **CPU Usage:** \`${cpuUsage}%\`\n` +
              `> ⚙️ **CPU Cores:** \`${cpuCores / 2}\`\n` +
              `> ⚡ **CPU Speed:** \`${cpuSpeed} MHz\``
          )
          .setColor("#2F3136")
          .setThumbnail(
            client.user.displayAvatarURL({ dynamic: true, size: 2048 })
          )
          .setFooter({
            text: `Requested by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL(),
          });

        await msg.edit({ embeds: [systemEmbed], components: [row1] });
      }

      if (i.customId === "dev") {
        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("bot")
            .setLabel("🤖 Bot Stats")
            .setStyle("Secondary")
            .setDisabled(false),
          new ButtonBuilder()
            .setCustomId("system")
            .setLabel("🖥️ System Stats")
            .setStyle("Secondary")
            .setDisabled(false),
          new ButtonBuilder()
            .setCustomId("dev")
            .setLabel("👨‍💻 Dev Info")
            .setStyle("Secondary")
            .setDisabled(true)
        );

        const devEmbed = new EmbedBuilder()
          .setAuthor({
            name: "👨‍💻 Developer Information",
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(
            "📢 **Developers:**\n" +
              "🔹 **Owner:** [The Extremez](https://discord.com/users/984409270344908872)\n" +
              "🔹 **Contributors:** [! Alone💔](https://discord.com/users/984409270344908872)"
          )
          .setColor("#2F3136")
          .setThumbnail(
            client.user.displayAvatarURL({ dynamic: true, size: 2048 })
          )
          .setFooter({
            text: `Requested by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL(),
          });

        await msg.edit({ embeds: [devEmbed], components: [row2] });
      }

      if (i.customId === "bot") {
        await msg.edit({ embeds: [botEmbed], components: [row] });
      }
    });
  },
};
