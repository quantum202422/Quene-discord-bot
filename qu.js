const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  
});
client.on('error', console.error);

client.once('ready', () => {
  botUserId = client.user.id; // Store bot's user ID when ready
  console.log(`Logged in as ${client.user.tag} (${botUserId})`);
});



const queues = new Map();

client.on('voiceStateUpdate', (oldState, newState) => {
  const member = newState.member;

  if (newState.channelId !== oldState.channelId) {
    const targetVoiceChannelIds = [
      '1193541483614183554',
      '1193541532540735578',
    ];

    if (targetVoiceChannelIds.includes(newState.channelId)) {
      const queue = getOrCreateQueue(newState.channelId);
      if (!queue.includes(member)) {
        queue.push(member);
        updateQueue(queue);
      }
    } else if (targetVoiceChannelIds.includes(oldState.channelId)) {
      const queue = getOrCreateQueue(oldState.channelId);
      resetNickname(member);
      const index = queue.indexOf(member);
      if (index !== -1) {
        queue.splice(index, 1);
        updateQueue(queue); 
      }
    }
  }
});

function getOrCreateQueue(channelId) {
  if (!queues.has(channelId)) {
    queues.set(channelId, []);
  }
  return queues.get(channelId);
}

function updateQueue(queue) {
  queue.sort((a, b) => a.joinedAt - b.joinedAt);

  queue.forEach((member, index) => {
    setNickname(member, index + 1);
  });
}

function setNickname(member, position) {
  member.setNickname(`[${position}] ${member.user.username}`)
    .catch(console.error);
}

function resetNickname(member) {
  member.setNickname(null)
    .catch(console.error);
}

client.login("");
