import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "play",
  aliases: ["p"],
  category: "Music",
  permission: "",
  desc: "🎶 Start playing your favorite songs!",
  options: {
    owner: false,
    inVc: true,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },

  run: async ({ client, message, args, ServerData }) => {
    let prefix = ServerData.prefix;
    const query = args.join(" ");

    if (!query) {
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `❌ **You didn't provide a song!**\nUse **\`${prefix}play <song/url>\`** to continue.`
        );

      return message.reply({ embeds: [embed] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    }

    const { channel } = message.member.voice;

    let player = await client.kazagumo.createPlayer({
      guildId: message.guild.id,
      textId: message.channel.id,
      voiceId: channel.id,
      deaf: true,
    });

    try {
      const msg = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`🔍 **Searching for your song...**`),
        ],
      });

      const result = await client.kazagumo.search(query, {
        requester: message.author,
      });

      if (!result.tracks.length) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setDescription(`❌ **No results found for your query!**`);
        return msg.edit({ embeds: [embed] });
      }

      if (result.type === "PLAYLIST") {
        for (let track of result.tracks) player.queue.add(track);
        const embed = new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `📜 **Added \`${result.tracks.length}\` tracks from playlist:** \`${result.playlist.name}\``
          );
        return msg.edit({ embeds: [embed] });
      } else {
        player.queue.add(result.tracks[0]);
        if (!player.playing && !player.paused) player.play();

        const embed = new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `🎵 **Added to Queue:** [${result.tracks[0].title}](${result.tracks[0].uri})\n👤 **Artist:** ${result.tracks[0].author}`
          );

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("🎧 Listen Now")
            .setURL(result.tracks[0].uri)
            .setStyle(5)
        );

        return msg.edit({ embeds: [embed], components: [row] });
      }
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              `❌ **Something went wrong while fetching the song!**`
            ),
        ],
      });
    }
  },
};
