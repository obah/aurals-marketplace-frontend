const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddresses = require("./constants/nftMarketplaceNetworkMapping.json");
let chainId = process.env.chainId;
let moralisChainId = chainId;
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]; //confirm this

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.masterKey;

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey });
    console.log(`Working with contract address ${contractAddress}`);

    let itemOfferedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemOffered(address, uint256, uint256, address, string, string, address, string, bool)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "collectionName",
                    type: "string",
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "creatorName",
                    type: "string",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "creatorAddress",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "itemClass",
                    type: "string",
                },
                {
                    indexed: false,
                    internalType: "bool",
                    name: "resale",
                    type: "bool",
                },
            ],
            name: "ItemOffered",
            type: "event",
        },
        tableName: "ItemOffered",
    };

    let itemBoughtOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemBought(address, uint256, uint256, address, address, string)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "collectionName",
                    type: "string",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        tableName: "ItemBought",
    };

    let itemRemovedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemRemoved(address, address, uint256, string)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "collectionName",
                    type: "string",
                },
            ],
            name: "ItemRemoved",
            type: "event",
        },
        tableName: "ItemRemoved",
    };

    let collectionListedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "CollectionListed(string, address, uint256, string, address, uint256, uint256, uint256, uint256, uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "string",
                    name: "creatorName",
                    type: "string",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "collectionSize",
                    type: "uint256",
                },
                {
                    indexed: true,
                    internalType: "string", //confirm this from moralis docs
                    name: "collectionName",
                    type: "string",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "creatorName",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "commonSize",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "rareSize",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "superRareSize",
                    type: "uint256",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "finalTokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "startingPrice",
                    type: "uint256",
                },
            ],
            name: "CollectionListed",
            type: "event",
        },
        tableName: "CollectionListed",
    };

    const offeredResponse = await Moralis.Cloud.run("watchContractEvent", itemOfferedOptions, {
        useMasterKey: true,
    });

    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
        useMasterKey: true,
    });

    const removedResponse = await Moralis.Cloud.run("watchContractEvent", itemRemovedOptions, {
        useMasterKey: true,
    });

    const collectionResponse = await Moralis.Cloud.run(
        "watchContractEvent",
        collectionListedOptions,
        {
            useMasterKey: true,
        }
    );
    //this bit is just to be sure it works
    if (
        offeredResponse.success &&
        boughtResponse.success &&
        removedResponse.success &&
        collectionResponse.success
    ) {
        console.log("Success: Database updated with watching events");
    } else {
        console.log("Something went wrong...");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
