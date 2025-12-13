const axios = require("axios");

// Dictionnaire de polices stylées ✨
const fonts = {
  a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
  j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
  s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
  A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
  J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
  S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
};

// Fonction pour styliser du texte
function stylize(text) {
  return text
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

module.exports = {
  config: {
    name: "ai",
    aliases: [],
    version: "1.0",
    author: "Kelvin",
    countDown: 3,
    role: 0,
    shortDescription: "Answer to questions 💬",
    longDescription: "Chat with a smart AI powered by GPT-5-mini 🧠",
    category: "AI",
    guide: "ai <your question>"
  },

  onStart: async function ({ api, event, args }) {
    const question = args.join(" ");
    if (!question) {
      return api.sendMessage(
        "💡 | Pose une question, ex: ai Quelle est la capitale du Japon ?",
        event.threadID,
        event.messageID
      );
    }

    const stylizedQuestion = stylize(question);

    try {
      // 🔥 Nouvelle API GPT-5-mini
      const url = `https://api.nekolabs.web.id/text-generation/gpt/5-mini?text=${encodeURIComponent(question)}&sessionId=${event.senderID}`;

      const res = await axios.get(url);
      const data = res.data;

      if (!data.success || !data.result) {
        return api.sendMessage(
          "⚠️ | Impossible d’obtenir une réponse de l’IA.",
          event.threadID,
          event.messageID
        );
      }

      const answer = stylize(data.result);

      const msg = `\n━━━━━━━━━━━━━━\n💬 ${stylizedQuestion}\n\n💡 ${answer}\n━━━━━━━━━━━━━━\n`;

      api.sendMessage(msg, event.threadID, event.messageID);

    } catch (e) {
      console.error(e);
      api.sendMessage("❌ | Une erreur est survenue lors de la requête à l’API.", event.threadID, event.messageID);
    }
  }
};

// Active le mode sans préfixe
const g = require("fca-aryan-nix");
const wrapper = new g.GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
