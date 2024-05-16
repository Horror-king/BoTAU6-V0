module.exports = {
  config: {
    name: "join",
    version: "1.0",
    author: "Vonyx TX",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Tambahkan pengguna ke grup dukungan",
    },
    longDescription: {
      en: "Perintah ini menambahkan pengguna ke grup tempat bot berada",
    },
    category: "owner",
    guide: {
      en: "Untuk menggunakan perintah ini, cukup ketik !join <threadID>.",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    const supportGroupId = args[0];
    if (!supportGroupId) {
      api.sendMessage("Harap berikan ID grup dukungan.", event.threadID);
      return;
    }
    const threadID = event.threadID;
    const userID = event.senderID;
    const threadInfo = await api.getThreadInfo(supportGroupId);
    const participantIDs = threadInfo.participantIDs;
    if (participantIDs.includes(userID)) {
      api.sendMessage(
        "Anda sudah berada di grup ini. Jika Anda tidak menemukannya, silakan periksa permintaan pesan atau kotak spam Anda.",
        threadID
      );
    } else {
      api.addUserToGroup(userID, supportGroupId, (err) => {
        if (err) {
          console.error("Gagal menambahkan pengguna ke grup dukungan:", err);
          api.sendMessage("Saya tidak dapat menambahkan Anda karena id Anda tidak diizinkan meminta pesan atau akun Anda bersifat pribadi. tolong tambahkan saya lalu coba lagi...", threadID);
        } else {
          api.sendMessage(
            "Anda telah ditambahkan ke grup ini. Jika Anda tidak menemukan kotak tersebut di kotak masuk Anda, silakan periksa permintaan pesan atau kotak spam Anda.",
            threadID
          );
        }
      });
    }
  },
}
