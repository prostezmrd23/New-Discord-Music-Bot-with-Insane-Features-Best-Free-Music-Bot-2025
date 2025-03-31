import { ActivityType } from "discord.js";
import chalk from "chalk";
import reconnectAuto from "../../Models/reconnect.js";

/**
 * @param {import("../Struct/Client")} client
 */
export default async (client) => {
  try {
    console.log(chalk.blue.bold("\n🚀 Bot is starting up...\n"));

    // Fetch cluster-wide data
    const [totalGuilds, totalChannels, totalUsers] = await Promise.all([
      client.cluster.broadcastEval((c) => c.guilds.cache.size),
      client.cluster.broadcastEval((c) => c.channels.cache.size),
      client.cluster.broadcastEval((c) => c.users.cache.size),
    ]);

    // Aggregate values
    const totalServers = totalGuilds.reduce((acc, val) => acc + val, 0);
    const totalChannelsCount = totalChannels.reduce((acc, val) => acc + val, 0);
    const totalUsersCount = totalUsers.reduce((acc, val) => acc + val, 0);

    console.log(chalk.green.bold("📡 Connected to Discord!"));
    console.log(
      chalk.yellow(`🌍 Total Servers: ${chalk.white.bold(totalServers)}`)
    );
    console.log(
      chalk.magenta(
        `📢 Total Channels: ${chalk.white.bold(totalChannelsCount)}`
      )
    );
    console.log(
      chalk.cyan(`👥 Total Users: ${chalk.white.bold(totalUsersCount)}`)
    );
    console.log(chalk.green.bold(`✅ ${client.user.tag} is Ready! 🚀`));

    // 🎵 Auto Reconnect Feature
    const maindata = await reconnectAuto.find();
    console.log(
      chalk.blue.bold(
        `🔄 Auto Reconnect: ${chalk.white.bold(
          maindata.length
        )} queue(s) found.`
      )
    );

    for (const [index, data] of maindata.entries()) {
      setTimeout(async () => {
        const textChannel = client.channels.cache.get(data.TextId);
        const guild = client.guilds.cache.get(data.GuildId);
        const voiceChannel = client.channels.cache.get(data.VoiceId);

        if (!guild || !textChannel || !voiceChannel) {
          console.log(
            chalk.red(
              `❌ Auto-reconnect failed: Missing Guild/Text/Voice for queue #${
                index + 1
              }`
            )
          );
          return;
        }

        try {
          await client.kazagumo.createPlayer({
            guildId: guild.id,
            textId: textChannel.id,
            voiceId: voiceChannel.id,
            deaf: true,
            shardId: guild.shardId,
          });

          console.log(
            chalk.green(
              `✅ Reconnected Player in: ${guild.name} [#${index + 1}]`
            )
          );
        } catch (error) {
          console.error(
            chalk.red(
              `❌ Failed to create player in ${guild.name}: ${error.message}`
            )
          );
        }
      }, index * 5000);
    }

    console.log(
      chalk.green.bold(
        `🎧 Reconnected to ${maindata.length} guild(s) successfully!`
      )
    );
    console.log(
      chalk.green.bold(`🌟 Cluster #${client.cluster.id} is fully stable! 🚀\n`)
    );

    // 🎭 Dynamic Status Rotation
    const statuses = [
      { name: "🎶 Music & Chill", type: ActivityType.Listening },
      { name: "🔥 TheExtremez", type: ActivityType.Playing },
      { name: "💥 Vibing with tunes!", type: ActivityType.Playing },
      {
        name: "📡 Streaming Now!",
        type: ActivityType.Streaming,
        url: "https://twitch.tv/phv08",
      },
      { name: "💡 -help | Need Assistance?", type: ActivityType.Listening },
    ];

    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      client.user.setActivity(status.name, {
        type: status.type,
        url: status.url,
      });
      client.user.setPresence({
        status: "online", // Options: "idle", "dnd", "online"
      });

      // console.log(
      //   chalk.cyan(
      //     `🎭 Status Updated: ${chalk.white.bold(status.name)} (${chalk.yellow(
      //       status.type
      //     )})`
      //   )
      // );
    }, 10000); // Updates every 10 seconds
  } catch (error) {
    console.error(
      chalk.red.bold("❌ An error occurred in the ready event:"),
      error
    );
  }
};
