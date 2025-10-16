import { ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { log } from "../../source/logger.js";
import settings from "../../config.js";

export async function execute(interaction) {
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'select_menu') {
        return interaction.reply({ content: `${settings.emojis.alerts.error} **erro:** \`Não foi possivel comcluir a ação!\``, flags: MessageFlags.Ephemeral });
    }

    const storeValue = interaction.values[0];

    try {
        switch (storeValue) {
            case 'designs': {
                const modal = new ModalBuilder()
                    .setTitle('Painel de artes')
                    .setCustomId('modal_design');

                const input1 = new TextInputBuilder()
                    .setCustomId('title_design')
                    .setPlaceholder('ex: estou precisando de uma loja pra meu servidor de fivem, loja, etc')
                    .setLabel('Tipo de arte e finalidade')
                    .setMinLength(5)
                    .setMaxLength(100)
                    .setRequired(false)
                    .setStyle(TextInputStyle.Short);

                const input2 = new TextInputBuilder()
                    .setCustomId('description_design')
                    .setLabel('Detalhes da sua arte')
                    .setPlaceholder('ex: cores, fontes, tipografia, etc...')
                    .setMinLength(10)
                    .setMaxLength(500)
                    .setRequired(false)
                    .setStyle(TextInputStyle.Paragraph);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(input1),
                    new ActionRowBuilder().addComponents(input2)
                );
                await interaction.showModal(modal);
                break;
            }

            case 'developments': {
                const modal = new ModalBuilder()
                    .setTitle('Painel desenvolvimentos')
                    .setCustomId('modal_dev');

                const input1 = new TextInputBuilder()
                    .setCustomId('title_dev')
                    .setPlaceholder('ex: bot, sites, aplicações etc.')
                    .setLabel('Tipo de projeto')
                    .setMinLength(5)
                    .setMaxLength(100)
                    .setRequired(false)
                    .setStyle(TextInputStyle.Short);

                const input2 = new TextInputBuilder()
                    .setCustomId('description_dev')
                    .setLabel('detalhes do seu projeto')
                    .setPlaceholder('ex: vai ser um bot de auth para meu servidor ...')
                    .setMinLength(10)
                    .setMaxLength(500)
                    .setRequired(false)
                    .setStyle(TextInputStyle.Paragraph);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(input1),
                    new ActionRowBuilder().addComponents(input2)
                );
                await interaction.showModal(modal);
                break;
            }
            case 'partners': {
                const modal = new ModalBuilder()
                    .setTitle('Painel Parcerias')
                    .setCustomId('modal_partners');

                const input1 = new TextInputBuilder()
                    .setCustomId('title_partners')
                    .setLabel('Tipo de Parceria')
                    .setPlaceholder('ex: designs, modelagem, editores, etc.')
                    .setMinLength(5)
                    .setMaxLength(100)
                    .setRequired(false)
                    .setStyle(TextInputStyle.Short);

                const input2 = new TextInputBuilder()
                    .setCustomId('description_partners')
                    .setLabel('detalhes da sua ideia')
                    .setPlaceholder('ex: pretendo apenas ter para divulgação, ou algo a mais, como troca de serviços e etc.')
                    .setMinLength(10)
                    .setMaxLength(500)
                    .setRequired(false)
                    .setStyle(TextInputStyle.Paragraph);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(input1),
                    new ActionRowBuilder().addComponents(input2)
                );
                await interaction.showModal(modal);
                break;
            }
            case 'help': {
                const modal = new ModalBuilder()
                    .setTitle('Painel Ajuda')
                    .setCustomId('modal_help');

                const input1 = new TextInputBuilder()
                    .setCustomId('title_help')
                    .setPlaceholder('ex: com codigos, ideias, sugestoes, etc.')
                    .setLabel('Tipo de Ajuda')
                    .setMinLength(5)
                    .setMaxLength(100)
                    .setRequired(false)
                    .setStyle(TextInputStyle.Short);

                const input2 = new TextInputBuilder()
                    .setCustomId('description_help')
                    .setLabel('detalhes sua necessidade')
                    .setPlaceholder('ex: Não estou conseguindo startar um bot de tikect que comprei na loja')
                    .setMinLength(10)
                    .setMaxLength(500)
                    .setRequired(false)
                    .setStyle(TextInputStyle.Paragraph);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(input1),
                    new ActionRowBuilder().addComponents(input2)
                );
                await interaction.showModal(modal);
                break;
            }
            default:
                return interaction.reply({ content: `${settings.emojis.alerts.warn} **aviso:** \`opção invalida no menu\``, flags: MessageFlags.Ephemeral });
        }

    } catch (err) {
        log.error(`❌ Erro ao exibir modal: ${err.message}`);
        return interaction.reply({ content: `${settings.emojis.alerts.error} **erro:** \`aconteceu um erro ao abrir modal\``, flags: MessageFlags.Ephemeral });
    }
}
