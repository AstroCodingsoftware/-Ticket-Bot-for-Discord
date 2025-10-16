import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    PermissionsBitField
} from "discord.js";
import { log } from "../../source/logger.js";
import settings from "../../config.js";

export async function execute(interaction) {
    if (!interaction.isModalSubmit() || interaction.customId !== 'modal_dev') {
        return interaction.reply({
            content: `${settings.emojis.alerts.error} **erro:** \`Não foi possivel criar seu ticket no momento!\``,
            flags: MessageFlags.Ephemeral
        });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        const user = interaction.member;
        const guild = interaction.guild;
        const ticketCategory = settings.ticketsCategories.dev_category;
        const allChannels = await guild.channels.fetch();

        const existingChannel = allChannels.find(
            (channel) =>
                channel.parentId === ticketCategory &&
                channel.topic === `Ticket de ${user.id}`
        );

        if (existingChannel) {
            return interaction.editReply({
                content: `${settings.emojis.alerts.warn} **aviso:** \`Voce já possui um ticket aberto nesta categoria!\``,
            });
        }

        const roleSupport = guild.roles.cache.get(settings.roles.support);
        const title = interaction.fields.getTextInputValue('title_dev');
        const decrible = interaction.fields.getTextInputValue('description_dev');

        const ticketChannels = allChannels.filter(
            (c) =>
                c.parentId === ticketCategory &&
                /^・\d{3,}-/.test(c.name)
        );

        const ticketNumbers = ticketChannels.map((c) => {
            const match = c.name.match(/^・(\d{3,})-/);
            return match ? parseInt(match[1]) : 0;
        });

        const nextTicketNumber = ticketNumbers.length > 0 ? Math.max(...ticketNumbers) + 1 : 1;
        const ticketNumberStr = String(nextTicketNumber).padStart(3, '0');
        const channelName = `・${ticketNumberStr}-${interaction.user.username}`;

        const channel_dev = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: ticketCategory,
            topic: `Ticket de ${user.id}`,
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.AttachFiles,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.UseExternalEmojis,
                        PermissionsBitField.Flags.AddReactions,
                    ]
                },
                {
                    id: roleSupport.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.AttachFiles,
                        PermissionsBitField.Flags.EmbedLinks,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.UseApplicationCommands
                    ]
                },
                {
                    id: guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        });

        const embedReplit = new EmbedBuilder()
            .setDescription(`${settings.emojis.alerts.warn} **aviso:** \`Abrimos seu chamado, para acessar use o botão abaixo\``);

        const buttonAcess = new ButtonBuilder()
            .setLabel('ir para o ticket | go to ticket')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/channels/${interaction.guild.id}/${channel_dev.id}`);

        const actionRowBuilds = new ActionRowBuilder().addComponents(buttonAcess);

        await interaction.editReply({
            embeds: [embedReplit],
            components: [actionRowBuilds],
        });

        const embed_dev = new EmbedBuilder()
            .addFields(
                {
                    name: `🇧🇷  Comunicado de Segurança`,
                    value: `> Todas as interações realizadas neste canal são monitoradas e registradas de forma segura. As informações trocadas são armazenadas com o objetivo de garantir a qualidade do atendimento, a rastreabilidade dos dados e a segurança de ambas as partes.`,
                },
                {
                    name: `🇺🇸  Security Notice`,
                    value: `> All interactions in this channel are securely monitored and recorded. The information exchanged is stored to ensure service quality, data traceability, and the protection of both parties.`,
                },
                {
                    name: `Tipo de Produto`,
                    value: title?.trim() ? `> ${title}` : `> Não informado`,
                    inline: true,
                },
                {
                    name: `Descrição do Produto`,
                    value: decrible?.trim() ? `> ${decrible}` : `> Não informado`,
                    inline: true,
                }
            )
            .setImage(settings.tickets_images.embedDev)
            .setFooter({ text: `🔒 Atendimento 100% confidencial e seguro.` });

        const newButton_1 = new ButtonBuilder()
            .setCustomId('button_private_manage')
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Support Tikcet Manager')
            .setEmoji(`<:icon018:1388242320448688218>`)

        const newButton_3 = new ButtonBuilder()
            .setCustomId('button_private_member')
            .setStyle(ButtonStyle.Secondary)
            .setLabel('access granted')
            .setEmoji(`<:icon019:1386937637402710104>`)

        const newButton_2 = new ButtonBuilder()
            .setCustomId('button_private_trash')
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`<:icon020:1388242324198396034>`)


        const actionRow = new ActionRowBuilder().addComponents(newButton_1, newButton_3, newButton_2);

        const fixed = await channel_dev.send({
            embeds: [embed_dev],
            components: [actionRow]
        });

        await fixed.pin();

    } catch (err) {
        log.error(err);
        try {
            await interaction.editReply({
                content: ` ${settings.emojis.alerts.error} **erro:** \`Não foi possivel criar seu ticket!\``,
            });
        } catch {
            await interaction.followUp({
                content: `${settings.emojis.alerts.error} **erro:** \`Falha no sistema, aguarde até que normalize!\``,
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
