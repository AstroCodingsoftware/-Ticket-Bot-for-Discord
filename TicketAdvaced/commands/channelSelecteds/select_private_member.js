import settings from "../../config.js";
import { log } from "../../source/logger.js";
import { MessageFlags } from "discord.js";

export async function execute(interaction) {
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'select_private_member') {
        return interaction.reply({
            content: `${settings.emojis.alerts.error} **erro:** \`Estamos com problemas interno!\``,
            flags: MessageFlags.Ephemeral
        });
    }

    const selected = interaction.values[0];


    switch (selected) {
        case 'select_solicity_support': {
            const roleMention = `<@&${settings.roles.support}>`;
        
            await interaction.reply({
                content: `${settings.emojis.alerts.info} ${interaction.user}, Aguarde ate que um suporte possa te atender!**`,
                flags: MessageFlags.Ephemeral
            });
        
            await interaction.channel.send({
                content: `> ${settings.emojis.alerts.warn} **aviso:** ${roleMention} \`Nova solicitação de atendimento feito por: \`${interaction.user}`,
            });
            break;
        }
        

        case 'select_exit_member': {
            try {
                await interaction.reply({
                    content: `${settings.emojis.alerts.warn} **aviso:** \`Voce saiu do ticket!\``,
                    flags: MessageFlags.Ephemeral
                });

                await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
                    ViewChannel: false
                });
            } catch (err) {
                log.error(err);
                await interaction.followUp({
                    content: `${settings.emojis.alerts.error} **erro:** \`Não e possivel realizar essa ação no momento!, tente novamente mais tarde\``,
                    flags: MessageFlags.Ephemeral
                });
            }
            break;
        }

        default:
            return interaction.reply({
                content: `${settings.emojis.alerts.error} \`Opção inválida.\``,
                flags: MessageFlags.Ephemeral
            });
    }
}
