import { MessageFlags, PermissionsBitField } from 'discord.js';
import { log } from '../../source/logger.js';
import settings from '../../config.js';

export async function execute(interaction) {
    if (!interaction.isModalSubmit() || interaction.customId !== 'modal_remove_member') {
        return;
    }

    try {
        const input = interaction.fields.getTextInputValue('input_remove_member_id');

        const userId = input.replace(/[<@!>]/g, '');
        const memberToRemove = await interaction.guild.members.fetch(userId).catch(() => null);

        if (!memberToRemove) {
            return interaction.reply({
                content: `${settings.emojis.alerts.error} **erro:** \`Não foi possivel encontrar esse membro!\``,
                flags: MessageFlags.Ephemeral,
            });
        }

        const channel = interaction.channel;

        if (!channel.permissionsFor(memberToRemove).has(PermissionsBitField.Flags.ViewChannel)) {
            return interaction.reply({
                content: `${settings.emojis.alerts.warn} **aviso:** \`Voce não pode remover esse membro!\``,
                flags: MessageFlags.Ephemeral,
            });
        }

        await channel.permissionOverwrites.edit(memberToRemove.id, {
            ViewChannel: false,
            SendMessages: false,
            Connect: false,
        });

        return interaction.reply({
            content: `${settings.emojis.alerts.success} **sucesso:** \`Voce removeu um membro do ticket!\``,
            flags: MessageFlags.Ephemeral,
        });

    } catch (error) {
        log.error('Erro ao processar o modal de remoção de membro:', error);
        return interaction.reply({
            content: `${settings.emojis.alerts.error} **erro:** \`Ocorreu um erro ao remover este membro!\``,
            flags: MessageFlags.Ephemeral,
        });
    }
}
