const axios = require("axios");

// 🎨 Polices stylées
const fonts = {
  a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
  j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
  s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
  A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
  J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
  S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
};

const stylize = (text) =>
  text.split("").map(c => fonts[c] || c).join("");

module.exports = {
  config: {
    name: "ai",
    aliases: [],
    version: "2.0",
    author: "Kelvin",
    countDown: 3,
    role: 0,
    shortDescription: "💬 AI Gemini 2.5",
    longDescription: "Discute avec une IA Gemini rapide et stylée ✨",
    category: "AI",
    guide: "ai <ta question> (optionnel : reply à une image)"
  },

  onStart: async function ({ api, event, args }) {
    const question = args.join(" ");
    if (!question) {
      return api.sendMessage(
        "💡 | Pose une question.\n📸 Tu peux aussi répondre à une image.",
        event.threadID,
        event.messageID
      );
    }

    // 📸 Image en reply (optionnelle)
    let imageUrl = "";
    if (
      event.messageReply &&
      event.messageReply.attachments &&
      event.messageReply.attachments[0]?.type === "photo"
    ) {
      imageUrl = event.messageReply.attachments[0].url;
    }

    try {
      const apiUrl =
        "https://api.nekolabs.web.id/text-generation/gemini/2.5-flash-lite/v2" +
        `?text=${encodeURIComponent(question)}` +
        `&sessionId=${event.senderID}` +
        (imageUrl ? `&imageUrl=${encodeURIComponent(imageUrl)}` : "");

      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data.success || !data.result) {
        return api.sendMessage(
          "⚠️ | L’IA n’a pas répondu.",
          event.threadID,
          event.messageID
        );
      }

      const msg = `
━━━━━━━━━━━━━━
💬 ${stylize(question)}

🤖 ${stylize(data.result)}
━━━━━━━━━━━━━━
`;

      api.sendMessage(msg, event.threadID, event.messageID);

    } catch (err) {
      console.error("[AI ERROR]", err);
      api.sendMessage(
        "❌ | Erreur lors de la requête Gemini.",
        event.threadID,
        event.messageID
      );
    }
  }
};

// 🔓 No-prefix
const g = require("fca-aryan-nix");
const wrapper = new g.GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
