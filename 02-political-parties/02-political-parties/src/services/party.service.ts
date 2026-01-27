import { PartiesStore } from "../store/parties.store";
import type { PoliticalParty } from "../types";
import { generateUUID } from "../utils/generate-uuid";


class PartyService {
    private readonly partiesStore: PartiesStore;
    
    constructor() {
        this.partiesStore = new PartiesStore();
    }

    getAll(): PoliticalParty[] {
        return this.partiesStore.getAll();
    }

    add(name: string, color: string, borderColor: string): PoliticalParty {
        const newParty: PoliticalParty = {
            id: generateUUID(),
            name: name,
            color: color,
            borderColor: borderColor,
            votes: 0,
        };
        this.partiesStore.add(newParty);
        return newParty;
    }

    update(id:string, updates: Partial<PoliticalParty>): PoliticalParty | null {
        const party = this.partiesStore.findById(id);
        if (!party) {
            return null;
        }
        const updatedParty = { ...party, ...updates, id: party.id };
        this.partiesStore.update(updatedParty);
        return updatedParty;
    }

    delete(id: string): boolean {
        return this.partiesStore.remove(id);
    }

    incrementVotes(id: string): PoliticalParty | null {
        const party = this.partiesStore.findById(id);
        if (!party) {
            return null;
        }
        const updatedParty = { ...party, votes: party.votes + 1 };
        this.partiesStore.update(updatedParty);
        return updatedParty;
    }

    decrementVotes(id: string): PoliticalParty | null {
        const party = this.partiesStore.findById(id);
        if (!party) {
            return null;
        }
        const updatedParty = { ...party, votes: Math.max(0, party.votes - 1) };
        this.partiesStore.update(updatedParty);
        return updatedParty;
    }

}

export const partyService = new PartyService();