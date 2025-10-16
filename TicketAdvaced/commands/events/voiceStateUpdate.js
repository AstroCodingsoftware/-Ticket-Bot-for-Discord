import settings from "../../config.js";
import { log } from "../../source/logger.js";

export default {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const leftChannel = oldState.channel;
        if (!leftChannel || leftChannel.type !== 2) return;

        const todasCategorias = Object.values(settings.ticketsCategories);

        if (!todasCategorias.includes(leftChannel.parentId)) return;

        if (leftChannel.members.size === 0) {
            setTimeout(async () => {
                if (leftChannel.members.size === 0) {
                    try {
                        await leftChannel.delete();
                        log.warn(`🟡 | Canal de voz deletado pelo bot: (${leftChannel.name})`);
                    } catch (err) {
                        log.error(`❌ Erro ao deletar canal de voz: ${err}`);
                    }
                }
            }, 5_000);
        }
    }
};
