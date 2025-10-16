import { MessageFlags } from "discord.js";
import settings from "../../config.js"

export async function execute(interaction) {
    if (!interaction.isModalSubmit() || interaction.customId !== 'modal_add_member') return;

    const canal = interaction.channel;
    const guild = interaction.guild;
    const input = interaction.fields.getTextInputValue('input_member_id');

    const userId = input.replace(/\D/g, '');
    const member = await guild.members.fetch(userId).catch(() => null);

    if (!member) {
        return interaction.reply({
            content: `${settings.emojis.alerts.error} **erro:** \`Membro não encontrado\``,
            flags: MessageFlags.Ephemeral
        });
    }
    await canal.permissionOverwrites.edit(member.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
        AttachFiles: true
    });
    return interaction.reply({
        content: `${settings.emojis.alerts.warn}**aviso:** ${member}, \`Seja Bem-Vindo(a), Voce foi adicionado(a) a este ticket!\``,
    });
}
