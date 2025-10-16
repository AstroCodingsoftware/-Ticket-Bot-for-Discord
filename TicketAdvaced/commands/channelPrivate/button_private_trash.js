import settings from "../../config.js";
import { MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";

export async function execute(interaction) {
    if (!interaction.isButton() || interaction.customId !== 'button_private_trash') return;

    const member = interaction.member;
    const hasSupportRole = member.roles.cache.has(settings.roles.support);

    if (!hasSupportRole) {
        await interaction.reply({
            content: `${settings.emojis.alerts.warn} **aviso:** \`Apenas o suporte pode deletar seu ticket!\``,
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    const newModal = new ModalBuilder()
        .setCustomId('modal_options')
        .setTitle('Porque está deletando este ticket?');

    const input1 = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Motivo!')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false); 

    newModal.addComponents(
        new ActionRowBuilder().addComponents(input1)
    );
    await interaction.showModal(newModal);
}
