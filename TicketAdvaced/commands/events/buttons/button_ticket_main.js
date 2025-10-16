import {
    StringSelectMenuBuilder,
    ActionRowBuilder,
    StringSelectMenuOptionBuilder,
    MessageFlags,
    EmbedBuilder,
} from "discord.js";
import { log } from "../../../source/logger.js";
import settings from "../../../config.js";

export async function execute(interaction) {
    if (!interaction.isButton() || interaction.customId !== "button_ticket_main") {
        await interaction.return({ content: `${settings.emojis.alerts.error} **erro:**, \`não foi possivel abrir o atendimento na a workify group.\``,});
    }
    try {
        const newEmbed = new EmbedBuilder()
            .setFields(
                {
                name: `🇧🇷  informação essencial`,
                value: `> Ao abrir seu ticket, trate exclusivamente do assunto selecionado.
> Seja direto e forneça detalhes relevantes.
> Sempre que possível, anexe imagens, vídeos ou arquivos.
> Isso nos ajuda a resolver seu caso com mais agilidade.
> Quanto mais claro for o seu pedido, mais rápido conseguiremos te ajudar.`,
            },
            {
                name: `🇺🇸  essential information`, value: `> When opening your ticket, stick strictly to the selected topic.
> Be clear and provide relevant details, avoiding unnecessary information.
> Whenever possible, attach images, videos, or files to help clarify your request.
> This helps us resolve your issue faster.
> The clearer your request, the faster we can assist you.`
            }
        )
            .setFooter({text: `🔒 Atendimento 100% confidencial e seguro.`})
            .setImage(settings.tickets_images.embedSelectOpition);

        const newSelect = new StringSelectMenuBuilder()
            .setCustomId("select_menu")
            .setPlaceholder("Escolha uma das categoria | Choose a category")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue("designs")
                    .setLabel("Solicitar Orçamento | Request a Quote")
                    .setEmoji({
                        id: `1386911929196482631`
                    })
                    .setDescription("ʟᴏɢᴏs • ʙᴀɴɴᴇʀs • ᴀʀᴛᴇs ɢʀᴀ́ғɪᴄᴀs ᴇ ᴍᴜɪᴛᴏ ᴍᴀɪs!"),

                new StringSelectMenuOptionBuilder()
                    .setValue("developments")
                    .setLabel("Solicitar Orçamento | Request a Quote")
                    .setEmoji({
                        id: `1386912504172642325`
                    })
                    .setDescription("ʙᴏᴛs • sɪᴛᴇs ᴘʀᴏғɪssɪᴏɴᴀɪs • sɪsᴛᴇᴍᴀs ᴇxᴄʟᴜsɪᴠᴏs ᴇᴛᴄ."),

                new StringSelectMenuOptionBuilder()
                    .setValue("partners")
                    .setLabel("Parcerias | Partnerships")
                    .setEmoji({
                        id: `1386913517931724840`
                    })
                    .setDescription("ᴅᴇsɪɢɴ • ᴍᴏᴅᴇʟᴀɢᴇᴍ3ᴅ • ᴇᴅɪᴛᴏʀᴇs ᴅᴇ ᴠɪᴅᴇᴏ ᴇᴛᴄ."),
                new StringSelectMenuOptionBuilder()
                    .setValue("help")
                    .setLabel("Ajude-me | help-me")
                    .setEmoji({
                        id: `1386915201882001479`
                    })
                    .setDescription("ᴅᴜᴠɪᴅᴀs • ᴄᴏᴍᴘʀᴀs • ᴄᴏᴅɪɢᴏs • ᴘᴀʀᴄᴇʀɪᴀs • ᴘʀᴇᴊᴇᴛᴏs ᴇᴛᴄ"),
            );

        const actionRow = new ActionRowBuilder().addComponents(newSelect);

        await interaction.reply({
            embeds: [newEmbed],
            components: [actionRow],
            flags: MessageFlags.Ephemeral,
        });
    } catch (err) {
        log.error(err);
    }
}
