import { client } from "../../index.js";
import { log } from "../../source/logger.js";
import { collectionSlash } from "../../handler/commandSlash.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { MessageFlags } from "discord.js";
import settings from "../../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.channel?.type === 'DM') {
      return await interaction.reply({
        content: `${settings.emojis.alerts.error} **erro:** \`Voce não pode executar comando por aqui!\``,
        flags: MessageFlags.Ephemeral
      });
    }

    try {
      const commandName = interaction.commandName;
      const command = collectionSlash.get(commandName);
      if (command) {
        await command(interaction);
      } else {
        log.error(`❌ | Command "${commandName}" not found.`);
      }
    } catch (err) {
      log.error(`❌ | Command execution failed: ${err.message}`);
    }
  }

  else if (interaction.isButton()) {
    try {
      const buttonName = interaction.customId;
      const directories = [
        path.join(__dirname, "buttons"),
        path.join(__dirname, "../channelPrivate"),
        path.join(__dirname, "../outraPasta")
      ];

      let buttonExecuter = null;
      for (const dir of directories) {
        const buttonPath = path.join(dir, `${buttonName}.js`);
        try {
          buttonExecuter = await import(`file://${buttonPath}`);
        } catch {
          continue;
        }

        if (buttonExecuter && typeof buttonExecuter.execute === "function") {
          await buttonExecuter.execute(interaction);
          break;
        }
      }

      if (!buttonExecuter) {
        log.error(
          `⚠️ | Button file not found in any directory or missing 'execute' function: "${buttonName}.js"`
        );
      }
    } catch (error) {
      log.error(
        `❌ | Error executing button "${interaction.customId}": ${error.message}`
      );
    }
  }

  // 🟪 Menus suspensos
  else if (interaction.isAnySelectMenu()) {
    try {
      const selectPath = path.join(__dirname, "../channelSelecteds", `${interaction.customId}.js`);
      const selectExecuter = await import(`file://${selectPath}`);
      await selectExecuter.execute(interaction);
    } catch (err) {
      console.error(`❌ | Erro ao executar o select menu: ${err.message}`);
    }
  }

  // 🔴 Modais
  else if (interaction.isModalSubmit()) {
    try {
      const modalId = interaction.customId;
      const modalPath = path.join(__dirname, "../modal/", `${modalId}.js`);

      if (!fs.existsSync(modalPath)) {
        return await interaction.reply({
          content: `${settings.emojis.alerts.error} **erro:** \`Esse modal nao foi encontrado!\``,
          flags: MessageFlags.Ephemeral
        });
      }

      const modalHandler = await import(`file://${modalPath}`);
      await modalHandler.execute(interaction);

    } catch (error) {
      console.error("❌ Erro ao processar o modal:", error);
      await interaction.reply({
        content: `${settings.emojis.alerts.error} **erro:** \`Não foi possivel executar esse modal!\``,
        flags: MessageFlags.Ephemeral
      });
    }
  }
});
