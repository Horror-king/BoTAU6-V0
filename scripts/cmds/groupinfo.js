const request = require("request");

module.exports = {
  config: {
    name: "groupinfo",
    version: "1.2",
    author: "Rahman Leon",
    shortDescription: "Get Group Information 📊",
    longDescription: "Retrieve information about this group, including its name, ID, member demographics, administrators, and total messages.",
    category: "Group Chat",
    aliases: ["groupstats", "ginfo", "boxinfo", "infobox", "groupinfo", "infogc", "infogroup", "getgroupinfo", "showgroup"],
    guide: {
      en: "{p}groupinfo"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // Retrieve thread information
      let threadInfo = await api.getThreadInfo(event.threadID);

      if (!threadInfo) {
        throw new Error("Failed to retrieve thread information");
      }

      // Extract relevant information
      let threadMem = threadInfo.participantIDs.length;
      let { maleMembers, femaleMembers } = countGenderMembers(threadInfo.userInfo);
      let adminList = await getAdminList(api, threadInfo.adminIDs);
      let totalMessages = threadInfo.messageCount;

      // Create and send the message
      const message = createGroupInfoMessage(threadInfo, event.threadID, threadMem, maleMembers, femaleMembers, adminList, totalMessages);
      return api.sendMessage(message, event.threadID);
    } catch (error) {
      // Handle errors
      console.error("Error at command 'groupinfo':", error);
      api.sendMessage("An error occurred while retrieving group information. Please try again later.", event.threadID);
    }
  }
};

// Helper functions (you can define these outside of the main module)
function countGenderMembers(userInfo) {
  let maleMembers = 0;
  let femaleMembers = 0;

  for (let z in userInfo) {
    const gender = userInfo[z].gender;
    if (gender === "MALE") {
      maleMembers++;
    } else if (gender === "FEMALE") {
      femaleMembers++;
    }
  }

  return { maleMembers, femaleMembers };
}

async function getAdminList(api, adminIDs) {
  let adminList = [];

  for (let adminID of adminIDs) {
    const userInfo = await api.getUserInfo(adminID.id);
    if (userInfo && userInfo[adminID.id]) {
      const adminName = userInfo[adminID.id].name;
      adminList.push(adminName);
    }
  }

  return adminList;
}

function createGroupInfoMessage(threadInfo, threadID, threadMem, maleMembers, femaleMembers, adminList, totalMessages) {
  return `
🌟 **Group Name:** ${threadInfo.threadName}
🆔 **Group ID:** ${threadID}
👥 **Total Members:** ${threadMem}
♂ **Male Members:** ${maleMembers}
♀ **Female Members:** ${femaleMembers}
👮 **Total Admins:** ${adminList.length}
👮 **Admins:** ${adminList.join(", ")}
📬 **Total Messages:** ${totalMessages}
`;
}
