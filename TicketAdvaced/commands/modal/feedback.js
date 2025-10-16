import { log } from "../../source/logger.js";
import settings from "../../config.js";
import { EmbedBuilder, MessageFlags } from 'discord.js';

export async function execute(interaction) {
    if (!interaction.isModalSubmit() || !interaction.customId.startsWith('feedback')) {
        return interaction.reply({
            content: `${settings.emojis.alerts.warn} **aviso:** \`Ocorreu um erro ao processar seu feedback. tente novamente.\``,
            flags: MessageFlags.Ephemeral
        });
    }

    try {
        await interaction.deferReply({ ephemeral: true });

        const description = interaction.fields.getTextInputValue('description_feed');

        const feedbackChannel = await interaction.client.channels.fetch(settings.logs.feedback)
            .catch(() => null);

        if (!feedbackChannel) {
            return await interaction.editReply({
                content: `${settings.emojis.alerts.warn} **aviso:** \`Não foi possível encontrar o canal de feedback.\``,
            });
        }

        const feedbackEmbed = new EmbedBuilder()
            .setFields(
                {
                    name: `Comentario`,
                    value: description?.trim() ? `> ${description}` : `> Feedback Não informado!`,
                    inline: true
                },
                {
                    name: `Feedback feito por`,
                    value: `${interaction.user}`,
                    inline: true
                }
            )
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Todos os feedbacks aqui são reais e refletem a experiência dos clientes na loja` })
            .setTimestamp()

        const sentMessage = await feedbackChannel.send({ embeds: [feedbackEmbed] });
        await sentMessage.react('✅');

        await interaction.editReply({
            content: `${settings.emojis.alerts.success} **sucesso:** \`agradecemos pela contribuição!\``
        });

        await interaction.message.delete();

    } catch (err) {
        log.error(err);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: `${settings.emojis.alerts.warn} **aviso:** \`Não foi possível enviar seu feedback no momento. tente novamente mais tarde.\``,
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
