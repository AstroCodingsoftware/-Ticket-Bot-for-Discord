// utils/logTicket.js
import { AttachmentBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export async function gerarLogDoCanal(canal, nomeArquivo = "ticket-log") {
    let mensagens = await canal.messages.fetch({ limit: 100 });
    mensagens = mensagens.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    const conteudo = mensagens.map(msg => {
        const nome = msg.author?.tag || "Desconhecido";
        const data = new Date(msg.createdTimestamp).toLocaleString("pt-BR");
        const texto = msg.content || "[sem conteúdo]";
        return `[${data}] ${nome}: ${texto}`;
    }).join("\n");

    // Garante a pasta
    const pasta = "./logs";
    if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);

    const caminho = path.resolve(`${pasta}/${nomeArquivo}-${canal.id}.txt`);
    fs.writeFileSync(caminho, conteudo);

    return new AttachmentBuilder(caminho, { name: `${nomeArquivo}.txt` });
}
