import { log } from "../../source/logger.js";
import settings from "../../config.js";
import { ActionRowBuilder, EmbedBuilder, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export async function execute(interaction) {
    if (!interaction.isButton() || interaction.customId !== 'button_private_manage') {
        return;
    }

    try {
        const member = interaction.member;
        const roleSupport = member.roles.cache.has(settings.roles.support);

        if (!roleSupport) {
            await interaction.reply({
                content: `${settings.emojis.alerts.warn} **aviso:** \`Botão indisponivel\``,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const channelPrivateSelect = new StringSelectMenuBuilder()
            .setCustomId('select_private_admin')
            .setPlaceholder('Selecione uma opção!')
            .addOptions([
                new StringSelectMenuOptionBuilder()
                    .setLabel('Criar canal de voz')
                    .setValue('select_create_channel')
                    .setDescription('Gerar um canal de voz nesse ticket!')
                    .setEmoji({
                        id: `1388242305525223516`
                    }),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Adicionar membro')
                    .setValue('select_add_member')
                    .setDescription('Adiciona um membro ao ticket atual!')
                    .setEmoji({
                        id: `1386906538500817026`
                    }),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Remover Membro')
                    .setValue('select_remove_member')
                    .setDescription('Remove o membro do ticket atual!')
                    .setEmoji({
                        id: `1388242309383983228`
                    }),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Notificar Membro')
                    .setValue('select_markup_member')
                    .setDescription('Notifica o membro no ticket e no privado')
                    .setEmoji({
                        id: `1386907889108516895`
                    }),
            ]);

        const newEmbed = new EmbedBuilder()
            .setTitle('Painel de Gestao dos tickets')
            .setFooter({ text: settings.footer })
        const actionRow = new ActionRowBuilder().addComponents(channelPrivateSelect);

        await interaction.reply({
            content: `${settings.emojis.alerts.success} **sucesso:**: \`Painel de Adiministração do ticket, foi exibido com sucesso\``,
            flags: MessageFlags.Ephemeral,
        });

        await interaction.followUp({
            components: [actionRow],
            flags: MessageFlags.Ephemeral,
            embeds: [newEmbed],
        })
    } catch (err) {
        log.error(err);
    }
}
