import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import { Form, useNotification, Upload } from "web3uikit";
import { ethers } from "ethers";
import nftAbi from "../constants/NFT.json";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
//import nftNetworkMapping from "../constants/nftNetworkMapping.json";
//import nftMarketplaceNetworkMapping from "../constants/nftMarketplaceNetworkMapping.json";
import { handleTokenUris } from "../../../BACKEND/utils/resolveTokenUriFrontend";

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis();
    //const chainString = chainId ? parseInt(chainId).toString() : "31337"
    //const marketplaceAddress = nftMarketplaceNetworkMapping[chainString].NftMarketplace[0];
    //const nftAddress = nftNetworkMapping[chainString].NFT[0];
    const marketplaceAddress = "0x6a3ce765470d922215CC4d1fE1aa663bc35FeB2f";
    const nftAddress = "0x6664dd3B229D1179387b0E329D06D69F34aD7a0d";
    const { runContractFunction } = useWeb3Contract();
    const dispatch = useNotification();
    const [selectedImage, setSelectedImage] = useState(null);

    let currentTokenIdCount;

    const commonClass = "common";
    const rareClass = "rare";
    const superRareClass = "superRare";

    async function getTokenIds(data) {
        const tokenIdSize = data.data[1].inputResult;
        const tokenIdArray = [];
        for (i = 0; i <= tokenIdSize; i++) {
            tokenIdArray[i] = currentTokenIdCount + 1;
        }
        currentTokenIdCount += tokenIdSize;
        return tokenIdArray;
    }

    function uploadImage(e) {
        setSelectedImage(e.target.files[0]);
    }

    async function getCommonTokenURI(data) {
        const artistNameInput = data.data[0].inputResult; //should be the name of the account owner
        const workNameInput = data.data[1].inputResult;
        const imageLocation = selectedImage;
        const classTypeInput = commonClass;

        const commonTokenURI = await handleTokenUris(
            artistNameInput,
            workNameInput,
            classTypeInput,
            imageLocation
        );

        return commonTokenURI;
    }

    async function getRareTokenURI(data) {
        const artistNameInput = data.data[0].inputResult; //should be the name of the account owner
        const workNameInput = data.data[1].inputResult;
        const imageLocation = selectedImage;
        const classTypeInput = rareClass;

        const rareTokenURI = await handleTokenUris(
            artistNameInput,
            workNameInput,
            classTypeInput,
            imageLocation
        );

        return rareTokenURI;
    }

    async function getSuperRareTokenURI(data) {
        const artistNameInput = data.data[0].inputResult; //should be the name of the account owner
        const workNameInput = data.data[1].inputResult;
        const imageLocation = selectedImage;
        const classTypeInput = superRareClass;

        const superRareTokenURI = await handleTokenUris(
            artistNameInput,
            workNameInput,
            classTypeInput,
            imageLocation
        );

        return superRareTokenURI;
    }

    async function mintNFTs(data) {
        console.log("Minting common NFT collection...");
        const collectionSize = data.data[2].inputResult;
        const commonTokenURI = await getCommonTokenURI();
        const rareTokenURI = await getRareTokenURI();
        const superRareTokenURI = await getSuperRareTokenURI();
        const mintCommonOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "mintCollection",
            params: {
                commonTokenURI: commonTokenURI,
                rareTokenURI: rareTokenURI,
                superRareTokenURI: superRareTokenURI,
                collectionSize: collectionSize,
            },
        };

        await runContractFunction({
            params: mintCommonOptions,
            onSuccess: () => approveAndList(),
            onError: (error) => console.log(error),
        });
    }

    async function approveAndList(data) {
        console.log("Approving NFT...");
        const commonPrice = ethers.utils.parseEther(data.data[3].inputResult, "ether").toString();
        const rarePrice = ethers.utils.parseEther(data.data[4].inputResult, "ether").toString();
        const superRarePrice = ethers.utils
            .parseEther(data.data[5].inputResult, "ether")
            .toString();
        const tokenIds = await getTokenIds();
        const collectionSize = data.data[2].inputResult;
        for (i = 0; i < collectionSize; i++) {
            const approveOptions = {
                abi: nftAbi,
                contractAddress: nftAddress,
                functionName: "Approve",
                params: {
                    to: marketplaceAddress,
                    tokenId: tokenIds[i],
                },
            };

            await runContractFunction({
                params: approveOptions,
                onSuccess: () =>
                    handleApproveSuccess(
                        commonPrice,
                        rarePrice,
                        superRarePrice,
                        collectionSize,
                        nftAddress
                    ),
                onError: (error) => {
                    console.log(error);
                },
            });
        }
    }

    async function handleApproveSuccess(
        commonPrice,
        rarePrice,
        superRarePrice,
        collectionSize,
        nftAddress
    ) {
        console.log("Listing NFT...");
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "makeCollection",
            params: {
                nftAddress: nftAddress,
                commonPrice: commonPrice,
                rarePrice: rarePrice,
                superRarePrice: superRarePrice,
                collectionSize: collectionSize,
            },
        };

        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => console.log(error),
        });
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        });
    }

    //useEffect(() => {}, [account, isWeb3Enabled, chainId]);

    return (
        <div className={styles.container}>
            <Form
                onSubmit={mintNFTs}
                data={[
                    {
                        name: "Artist Name",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "artistName",
                    },
                    {
                        name: "Name of the Collection",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "collectionName",
                    },
                    {
                        name: "Collection Size",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "collectionSize",
                    },
                    {
                        name: "Common Class Price(in MATIC)",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "commonPrice",
                    },
                    {
                        name: "Rare Class Price(in MATIC)",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "rarePrice",
                    },
                    {
                        name: "SuperRare Class Price(in MATIC)",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "superRarePrice",
                    },
                ]}
                title="Mint and Sell your NFT collection!"
                id="Main Form"
            />

            <div>
                <Upload onChange={uploadImage} theme="withIcon" />
            </div>
        </div>
    );
}
