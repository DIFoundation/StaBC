// Supported chain
export enum ChainId {
    baseSepolia = 84532,
    celoSepolia = 11142220
}

// Contract addresses by chainId
interface ContractAddresses {
    [key: number]: {
        stakingToken: string
        stakingContract: string
    }
}

export const CONTRACT_ADDRESSES: ContractAddresses = {
    [ChainId.baseSepolia]: {
        stakingToken: "0x1573Cbbe7fcdeFe94Bbda4854Cac622C02b983EF",
        stakingContract: "0x250C8478F8d292b6C1323054CEFA3bbF5845e439"
    },

    [ChainId.celoSepolia]: {
        stakingToken: "0xa20A783bB0f2A9A8Cf0fB8776ff83757d965391d",
        stakingContract: "0xd52C356EBD736A7d54fA0dF75b3a2794522C6d93"
    }
}

export function getContractAddresses(chainId: number) {
    const address = CONTRACT_ADDRESSES[chainId as ChainId];

    if (!address) {
        throw new Error(`Unsupported chainId: ${chainId}`);
    }

    return address;
}