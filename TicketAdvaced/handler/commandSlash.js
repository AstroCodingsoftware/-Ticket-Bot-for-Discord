import { lstatSync, readdirSync } from "fs";
import { Collection, REST, Routes } from "discord.js";
import { log } from "../source/logger.js";
import { config } from "dotenv";
config();

const aplication = new REST().setToken(process.env.BOT_TOKEN);

const ArraySlashs = [];
export const collectionSlash = new Collection();

async function clientSlashCommand(path) {
  for (const file of readdirSync(path)) {
    if (lstatSync(`${path}/${file}`).isDirectory()) {
      clientSlashCommand(`${path}/${file}`);
    } else {
      if (file.endsWith(".js")) {
        const cmd = await import(`.${path}/${file}`);
        if (cmd.data && cmd.execute) {
          ArraySlashs.push(cmd.data);
          collectionSlash.set(cmd.data.name, cmd.execute);
        }
      }
    }
  }
}

clientSlashCommand(`./commands`);

export async function registerSlashs(ID) {
  try {
    const commands = await aplication.put(Routes.applicationCommands(ID), {
      body: ArraySlashs,
    });
    log.info(`📖 | Comandos registrados [${commands.length}]`);
  } catch (err) {
    log.error(`❌ | SlashsCommand failed:`);
  }
}

export async function loadEvents(path = "./commands/events") {
  for (const i of readdirSync(path)) {
    if (lstatSync(path).isDirectory()) {
      await loadEvents(`${path}/${i}`);
    } else {
      if (i.endsWith(".js")) {
        await import(`.${path}/${i}`);
      }
    }
  }
}
