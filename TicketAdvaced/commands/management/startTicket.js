import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
  ChannelType
} from "discord.js";
import settings from "../../config.js";

export const data = new SlashCommandBuilder()
  .setName("cord_ticket")
  .setDescription("esse comando e usado para liberar o painel de ticket no canal selecionado");

export async function execute(interaction) {
  if (interaction.channel?.type === ChannelType.DM) {
    return await interaction.reply({
      content: `${settings.emojis.alerts.warn} **aviso:** \`Comando indisponível\``,
      flags: MessageFlags.Ephemeral,
    });
  }

  const member = interaction.member;
  const roles = member.roles.cache.has(settings.roles.support);

  if (!roles) {
    return interaction.reply({
      content: `${settings.emojis.alerts.warn} **aviso:** \`Você não possui permissão para utilizar este comando\``,
      flags: MessageFlags.Ephemeral,
    });
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: 'WorkiFy Group | Central de Suporte Oficial',
      iconURL: 'https://cdn.discordapp.com/attachments/1388175305914712104/1388175403906236646/Logo_CordCloudv1.jpg?ex=68600697&is=685eb517&hm=06f18edee80260bf8c0b8e30ca9567637b778adabcb38e0fe1422c679ab1abdd&'
    })
    .setImage(settings.tickets_images.embedMain)
    .setFooter({ text: `🔒 Atendimento 100% confidencial e seguro.` })
    .setDescription(`Support Center | WorkiFy Group`)
    .addFields(
      {
        name: `🇧🇷  Olá! Precisa de ajuda? Estamos aqui para atender você.`,
        value: `> Se você tem dúvidas, precisa de suporte com nossos serviços, quer tratar sobre parcerias ou qualquer outro assunto comercial, abra um ticket de atendimento clicando no botão abaixo.`
      },
      {
        name: `🇺🇸  Hello! Need assistance? We're here to support you.`,
        value: `> If you have questions, need help with our services, want to discuss partnerships, or any other business-related matter, open a support ticket by clicking the button below.`
      },
      {
        name: 'segunda a sexta',
        value: '`09:00 às 17:00`',
        inline: true
      },
      {
        name: 'sabados',
        value: '`7:00 às 12:00`',
        inline: true
      },
      {
        name: 'Domingos e feriados',
        value: '`09:00 às 12:00`',
        inline: true
      }
    );

  const button = new ButtonBuilder()
    .setCustomId("button_ticket_main")
    .setLabel("solicitar atendimento | request service")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(`<:icon021:1388242327272816680>`)

  const actionRow = new ActionRowBuilder().addComponents(button);

  await interaction.reply({
    content: `${settings.emojis.alerts.success} **sᴜᴄᴇssᴏ**: \`Painel de ticket foi liberado no canal atual!\``,
    flags: MessageFlags.Ephemeral
  });

  await interaction.channel.send({
    embeds: [embed],
    components: [actionRow],
  });
}
