import { Party } from "../entities/Party";
// getParty를 정의 (타입 지정)
// 여기서 정의한 함수는 sbrepository에 무조건 구현되어야 함

export interface PartyRepository {
    getParty(): Promise<Party[]>;
    getPartyById(partyId: string): Promise<Party>;
    createParty(party: Party): Promise<void>;
}
