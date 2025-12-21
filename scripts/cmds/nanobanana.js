const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "nanobanana",
    aliases: ["nb", "banana"],
    version: "1.2.0",
    author: "Kelvin",
    countDown: 20,
    role: 0,
    shortDescription: "🍌 Générateur d’images Nano Banana",
    longDescription: "🎨 Génère une image IA (texte → image ou image → image)",
    category: "AI-IMAGE",
    guide: {
      fr: "{pn} <prompt>\n📸 Tu peux répondre à une image\nEx: nanobanana anime girl blush"
    }
  },

  onStart: async function ({ message, args, event }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply(
        "❌ | Donne un prompt.\n📌 Exemple : nanobanana anime girl blush\n📸 Tu peux aussi répondre à une image."
      );
    }

    // 📸 Image en reply (optionnelle)
    let imageUrl = null;
    if (
      event.messageReply &&
      event.messageReply.attachments &&
      event.messageReply.attachments[0]?.type === "photo"
    ) {
      imageUrl = event.messageReply.attachments[0].url;
    }

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);
    const imgPath = path.join(cacheDir, `nanobanana_${Date.now()}.png`);

    const waitMsg = await message.reply(
      "🍌 Génération Nano Banana en cours...\n⏳ L’IA dessine ton image 🎨"
    );

    try {
      // 🔥 API Nano Banana v5
      let apiUrl =
        "https://api.nekolabs.web.id/image-generation/nano-banana/v5" +
        `?prompt=${encodeURIComponent(prompt)}`;

      if (imageUrl) {
        apiUrl += `&imageUrl=${encodeURIComponent(imageUrl)}`;
      }

      const res = await axios.get(apiUrl, { timeout: 70000 });

      if (!res.data?.success || !res.data.result) {
        throw new Error("Réponse API invalide");
      }

      // 📥 Télécharger l’image générée
      const imgRes = await axios.get(res.data.result, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(imgPath, imgRes.data);

      await message.reply({
        body:
          "🍌✨ **Nano Banana Result**\n\n" +
          `🖌️ Prompt:\n${prompt}` +
          (imageUrl
            ? "\n\n📸 Mode : Image → Image"
            : "\n\n📝 Mode : Texte → Image"),
        attachment: fs.createReadStream(imgPath)
      });

      fs.unlinkSync(imgPath);
      await message.unsend(waitMsg.messageID);

    } catch (err) {
      console.error("[NanoBanana Error]", err.message);
      await message.unsend(waitMsg.messageID);
      message.reply("❌ | Erreur lors de la génération de l’image Nano Banana.");
    }
  }
};
