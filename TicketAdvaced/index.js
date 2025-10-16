import { Client, GatewayIntentBits, Partials} from "discord.js";
import { log } from "./source/logger.js";
import { registerSlashs } from "./handler/commandSlash.js";
import voiceStateUpdate from './commands/events/voiceStateUpdate.js';


export const client = new Client({
    intents:[
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessagePolls,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", async (self) => {
    await registerSlashs(self.application.id)
});

process.on('uncaughtException', (err) => {
    log.error('🔥 Erro não tratado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    log.debug('🔥 ignorando erro, bot permanece ligado:', reason);
});

client.on('voiceStateUpdate', (...args) => voiceStateUpdate.execute(...args));
client.login(process.env.BOT_TOKEN)

