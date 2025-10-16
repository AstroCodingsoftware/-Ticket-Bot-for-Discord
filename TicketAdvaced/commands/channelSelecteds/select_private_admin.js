import {
    MessageFlags,
    ChannelType,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder
} from 'discord.js';

import { log } from "../../source/logger.js";
import settings from "../../config.js";

export async function execute(interaction) {
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'select_private_admin') {
        return interaction.reply({
            content: `${settings.emojis.alerts.error} **erro:** \`Não foi possivel criar seu canal de atendimento. Contate um suporte para auxilia-lo\``,
            flags: MessageFlags.Ephemeral
        });
    }

    const selectedOption = interaction.values[0];

    switch (selectedOption) {

        case 'select_create_channel': {
            const supportUser = interaction.member;
            const guild = interaction.guild;
            const channelTopic = interaction.channel.topic;
            const userId = channelTopic?.split("Ticket de ")[1]?.trim();

            if (!userId) {
                return interaction.reply({
                    content: `${settings.emojis.alerts.warn} **aviso:** \`Não foi possivel indentificar o dono do ticket!\``,
                    flags: MessageFlags.Ephemeral
                });
            }

            try {
                const voiceChannel = await guild.channels.create({
                    name: `📞 canal de voz | channel voice`,
                    type: ChannelType.GuildVoice,
                    parent: interaction.channel.parentId,
                    permissionOverwrites: [
                        {
                            id: userId,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.Connect,
                                PermissionsBitField.Flags.Speak,
                                PermissionsBitField.Flags.Stream,
                                PermissionsBitField.Flags.UseVAD,
                            ],
                        },
                        {
                            id: supportUser.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.Connect,
                                PermissionsBitField.Flags.Speak,
                                PermissionsBitField.Flags.Stream,
                                PermissionsBitField.Flags.UseVAD,
                            ],
                        },
                        {
                            id: guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                await interaction.reply({
                    content: `${settings.emojis.alerts.warn} **aviso: \`Vá para o canal de voz! / Go to the voice channel!\` ${voiceChannel}`,
                });

            } catch (error) {
                log.error(error);
                await interaction.reply({
                    content: `${settings.emojis.alerts.error} **erro:** \`Não foi possivel criar o canal de voz. Contate o suporte do bot\``,
                    flags: MessageFlags.Ephemeral
                });
            }
            break;
        }

        case 'select_add_member': {
            const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = await import('discord.js');

            const modal = new ModalBuilder()
                .setCustomId('modal_add_member')
                .setTitle('adicionar membro ao ticket');

            const userInput = new TextInputBuilder()
                .setCustomId('input_member_id')
                .setLabel('insira o ID')
                .setPlaceholder('Ex: ID: 1364372799312224006')
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            modal.addComponents(new ActionRowBuilder().addComponents(userInput));

            await interaction.showModal(modal);
            break;
        }

        case 'select_remove_member': {
            const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = await import('discord.js');

            const modal = new ModalBuilder()
                .setCustomId('modal_remove_member')
                .setTitle('ʀᴇᴍᴏᴠᴇʀ ᴍᴇᴍʙʀᴏ ᴅᴏ ᴛɪᴄᴋᴇᴛ');

            const userInput = new TextInputBuilder()
                .setCustomId('input_remove_member_id')
                .setLabel('ɪɴsɪʀᴀ ᴏ ɪᴅ')
                .setPlaceholder('ᴜsᴜᴀʀɪᴏ ɪᴅ')
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            modal.addComponents(new ActionRowBuilder().addComponents(userInput));

            await interaction.showModal(modal);
            break;
        }

        case 'select_markup_member': {
            const channelTopic = interaction.channel.topic;
            const userId = channelTopic?.split("Ticket de ")[1]?.trim();

            if (!userId) {
                return interaction.reply({
                    content: `${settings.emojis.alerts.error}  **erro:** \`Não foi possivel indentificar o propriestario deste ticket!\``,
                    flags: MessageFlags.Ephemeral
                });
            }

            try {
                const embed = new EmbedBuilder()
                    .setTitle(`Notificação WorkiFy Group`)
                    .setDescription(`${interaction.user} Esta esperando voce no ticket!`)
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setFooter({text: settings.footer})
                const button = new ButtonBuilder()
                    .setLabel('Retornar ao ticket | Return to ticket')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`);

                const row = new ActionRowBuilder().addComponents(button);

                await interaction.guild.members.fetch(userId).then(member => {
                    member.send({
                        embeds: [embed],
                        components: [row]
                    });
                });

                await interaction.reply({
                    content: `${settings.emojis.alerts.warn} <@${userId}> Estamos aguardando voce retonar ao ticket!`
                });

            } catch (error) {
                log.error(error);
                await interaction.reply({
                    content: `${settings.emojis.alerts.error} **erro:** \`Falha ao notificar <@${userId}>\``,
                    flags: MessageFlags.Ephemeral
                });
            }
            break;
        }

        default:
            break;
    }
}
