import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import settings from "../../../config.js";

export async function execute(interaction) {
    if (!interaction.isButton() || interaction.customId !== 'feedback') {
        return interaction.reply({
            content: `${settings.emojis.alerts.error} **erro:** \`Não foi possivel enviar o feedback\``
        })
    }

    try {

        const modal = new ModalBuilder()
            .setTitle('avaliar | feedback')
            .setCustomId('feedback')

        const input_1 = new TextInputBuilder()
            .setMaxLength(4000)
            .setMinLength(5)
            .setCustomId('description_feed')
            .setLabel('Descreva sua esperiencia')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setPlaceholder('deixe um comentario para nos avaliar, isso e muito importante para nossa credibilidade')

        modal.addComponents(new ActionRowBuilder().addComponents(input_1))

        await interaction.showModal(modal)

    } catch (err) {
        console.log(err);

    }
}