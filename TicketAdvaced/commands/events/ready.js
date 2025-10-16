import { client } from "../../index.js";
import { log } from '../../source/logger.js';
import { ActivityType } from "discord.js";

client.once("ready", async (self) => {
  log.success(`✅ | [${self.user.displayName}]: Online`);

  const activities = [
    { name: `discord.gg/cordcloud`, type: ActivityType.Streaming }
  ];

  let i = 0;
  setInterval(() => {
    client.user.setPresence({
      activities: [activities[i]],
      status: 'idle',
    });
    i = (i + 1) % activities.length;
  }, 5000);
});

