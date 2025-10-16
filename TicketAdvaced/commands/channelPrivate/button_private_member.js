import { log } from "../../source/logger.js";
import settings from "../../config.js";
import {
    ActionRowBuilder,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from "discord.js";

export async function execute(interaction) {
    if (!interaction.isButton || interaction.customId !== 'button_private_member') {
        return interaction.reply({
            content: `${settings.emojis.alerts.error} **erro:** \`Não foi possivem continuar com a execução deste botão!\``,
            flags: MessageFlags.Ephemeral
        });
    }

    try {
        const channelPrivateSelect = new StringSelectMenuBuilder()
            .setCustomId('select_private_member')
            .setPlaceholder('Selecione uma opção')
            .addOptions([
                new StringSelectMenuOptionBuilder()
                    .setLabel('Chamar um Suporte')
                    .setValue('select_solicity_support')
                    .setDescription('Chame a equipe para prestar atendimento a voce')
                    .setEmoji({
                        id: `1386907889108516895`
                    }),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Sair do ticket atual')
                    .setValue('select_exit_member')
                    .setDescription('Encerre sua participação neste ticket.')
                    .setEmoji({
                        id: `1386909622841114714`
                    }),
            ]);

        const newEmbed = new EmbedBuilder()
            .setTitle(`Painel do Cliente`)
            .setFooter({text: settings.footer})
        const actionRow = new ActionRowBuilder().addComponents(channelPrivateSelect);

        await interaction.reply({
            content: `${settings.emojis.alerts.success} **sucesso:** \`Painel foi exibido para voce\``,
            flags: MessageFlags.Ephemeral,
        });

        await interaction.followUp({
            flags: MessageFlags.Ephemeral,
            components: [actionRow],
            embeds: [newEmbed]
        })
    } catch (err) {
        log.error(err);
    }
}
