import settings from "../../config.js";
import { log } from "../../source/logger.js";
import {
  MessageFlags,
  AttachmentBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { channel } from "diagnostics_channel";

export async function execute(interaction) {
  if (!interaction.isModalSubmit() || interaction.customId !== "modal_options") {
    return interaction.reply({
      content: `${settings.emojis.alerts.error} **erro** \`Não foi possivel criar canal privado!\``,
      flags: MessageFlags.Ephemeral,
    });
  }

  const canal = interaction.channel;
  const categoriaId = canal.parentId;
  const categorias = {
    [settings.ticketsCategories.design_category]: settings.logs.design,
    [settings.ticketsCategories.dev_category]: settings.logs.desenvolvimentos,
    [settings.ticketsCategories.partners_category]: settings.logs.partners,
    [settings.ticketsCategories.help_category]: settings.logs.help,
  };

  const logChannelId = categorias[categoriaId];
  const logChannel = interaction.guild.channels.cache.get(logChannelId);

  if (!logChannel) {
    return interaction.reply({
      content: `${settings.emojis.alerts.error} **aviso:** \`Canal de logs não configurado nesta categoria!\``,
      flags: MessageFlags.Ephemeral,
    });
  }

  try {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({
      content: `${settings.emojis.alerts.warn} **aviso:** \`Canal será deletado em 5s... | Log do ticket está sendo Salvas...\``,
    });

    const messages = await canal.messages.fetch({ limit: 100 });
    const sorted = Array.from(messages.values()).reverse();

    let logTexto = `📁 **Logs Ticket** ${canal.name}\n🕒 ${new Date().toLocaleString()}\n\n`;
    const filesToSend = [];

    for (const msg of sorted) {
      const autor = `${msg.author.tag} (${msg.author.id})`;
      const content = msg.content || "[Sem texto]";
      logTexto += `🗨️ ${autor}: ${content}\n`;

      for (const attach of msg.attachments.values()) {
        logTexto += `📎 Arquivo: ${attach.name}\n`;
        const response = await fetch(attach.url);
        const buffer = Buffer.from(await response.arrayBuffer());
        filesToSend.push(new AttachmentBuilder(buffer, { name: attach.name }));
      }

      logTexto += `\n`;
    }

    const logFileName = `ticket-${canal.id}.txt`;
    const logFilePath = path.resolve(`./temp/${logFileName}`);
    fs.mkdirSync("./temp", { recursive: true });
    fs.writeFileSync(logFilePath, logTexto);

    const fileToSend = new AttachmentBuilder(logFilePath);
    const description = `O ticket \`${canal.name}\` foi encerrado por ${interaction.user.tag}`;

    const logEmbed = new EmbedBuilder()
      .setTitle("Aviso: Ticket Encerrado")
      .setDescription(description)
      .setFooter({ text: settings.footer })
      .setTimestamp();

    const mentionSupport = `<@&${settings.roles.support}>`;

    await logChannel.send({
      content: mentionSupport,
      embeds: [logEmbed],
      files: [fileToSend, ...filesToSend],
    });

    fs.unlinkSync(logFilePath);

    const dono = interaction.guild.members.cache.find((m) => {
      const perms = canal.permissionOverwrites.cache.get(m.id);
      return perms && perms.type === 1 && perms.allow.has(PermissionFlagsBits.ViewChannel);
    });

    const describle = interaction.fields.getTextInputValue("description");

    if (dono?.user) {
      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle(`WorkiFy Group | Atendimento finalizado!`)
          .setDescription(`Espero que tenha tido uma boa experiencia em nossa loja, para que possamos melhorar cada vez mais, pedimos para vc deixar seu feedback abaixo!\n`)
          .setFields(
            {
              name: `Responsavel`,
              value: `${interaction.user}`,
              inline: true
            },
            {
              name: `Motivo`,
              value: describle?.trim() ? `> ${describle}` : `> Motivo Não informado`,
              inline: true
            },
            {
              name: `Ticket Name`,
              value: `\`${canal.name}\``,
              inline: true
            },
          )

        const feedbackButton = new ButtonBuilder()
          .setCustomId("feedback")
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Opnião | Feedback")
          .setEmoji(`<:icon023:1388242330506498161>`)

        const row = new ActionRowBuilder().addComponents(feedbackButton);

        await dono.send({ embeds: [dmEmbed], components: [row] });
      } catch (err) {
        console.warn(`⚠️ Falha ao enviar DM para ${dono.user?.tag || dono.id}:`, err.message);
      }
    } else {
      console.warn("⚠️ Não foi possível identificar o dono do ticket.");
    }

    setTimeout(() => canal.delete("Ticket encerrado via botão."), 5000);
  } catch (err) {
    log.error(err);
    const errorMessage = `${settings.emojis.alerts.error} **erro:** \`Não foi possivel salvar logs ou excluir canal de ticket!\``;

    if (!interaction.replied) {
      await interaction.reply({ content: errorMessage, flags: MessageFlags.Ephemeral });
    } else {
      await interaction.followUp({ content: errorMessage, flags: MessageFlags.Ephemeral });
    }
  }
}