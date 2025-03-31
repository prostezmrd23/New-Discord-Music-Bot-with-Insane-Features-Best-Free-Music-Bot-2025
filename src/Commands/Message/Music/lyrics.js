import { EmbedBuilder } from "discord.js";
import axios from "axios";

const apiKey = "7c5b72c7a6be8a06413ff8025ca26207";

export default {
  name: "lyrics",
  category: "Music",
  permission: "",
  desc: "📜 Fetch lyrics of the currently playing song!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    try {
      if (!player || !player.queue.current) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **No song is currently playing!**"),
          ],
        });
      }

      const songName = player.queue.current.title || "Unknown Song";
      const authorName = player.queue.current.author || "Unknown Artist";
      const formattedSong = encodeURIComponent(songName);
      const formattedAuthor = encodeURIComponent(authorName);

      const response = await axios.get(
        `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${formattedSong}&q_artist=${formattedAuthor}&apikey=${apiKey}`
      );

      const data = response.data;

      if (!data.message.body || !data.message.body.lyrics) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(`❌ **Lyrics not found for** \`${songName}\``),
          ],
        });
      }

      let lyrics = data.message.body.lyrics.lyrics_body;

      // Musixmatch truncates lyrics, so we remove extra text if it appears
      lyrics = lyrics
        .replace(/(\*\*\*\* This Lyrics is NOT for Commercial use.*)/gi, "")
        .trim();

      // If lyrics are too long, cut them
      if (lyrics.length > 2000) {
        lyrics =
          lyrics.slice(0, 1950) + "\n\n**...Lyrics too long to display!**";
      }

      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setTitle(`📜 Lyrics for: **${songName}**`)
        .setDescription(
          `🎤 **Artist:** ${authorName}\n\n\`\`\`fix\n${lyrics}\`\`\``
        )
        .setFooter({ text: "Powered by Musixmatch 🎶" });

      await message.channel.sendTyping();
      await message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("⚠️ **An error occurred while fetching lyrics!**"),
        ],
      });
    }
  },
};
