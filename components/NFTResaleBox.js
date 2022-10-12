import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/NFT.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr;

    const separator = "...";
    const separatorLength = separator.length;
    const charsToShow = strLen - separatorLength;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    );
};

export default function NFTResaleBox({
    price,
    marketplaceAddress,
    nftAddress,
    tokenId,
    itemClass,
    creatorName,
    collectionName,
}) {
    const { isWeb3Enabled, account } = useMoralis();
    const [imageURI, setImageURI] = useState("");
    const dispatch = useNotification();

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "getTokenURI",
        params: {
            tokenId: tokenId,
        },
    });

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "purchaseItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    });

    async function updateUI() {
        const tokenURI = await getTokenURI();
        console.log(`The tokenURI is ${tokenURI}`);

        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            const tokenURIResponse = await (await fetch(requestURL)).json();
            const imageURI = tokenURIResponse.image;
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            setImageURI(imageURIURL);
        }
    }

    useEffect(() => {
        isWeb3Enabled ? updateUI() : updateUI();
    }, [isWeb3Enabled]);

    const isOwnedByUser = seller === account || seller === undefined;
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15);

    const handleCardClick = () => {
        buyItem({
            onError: (error) => console.log(error),
            onSuccess: () => handleBuyItemSuccess(),
        });
    };

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "NFT successfully bought! Thank you!",
            title: "Item Bought",
            position: "topR",
        });
    };

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <Card onClick={handleCardClick}>
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>{itemClass}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height={"200"}
                                        width={"200"}
                                    />
                                    <div className="italic text-sm">{creatorName}</div>
                                    <div className="italic text-sm">{collectionName}</div>
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(price, "ether")} MATIC
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
}
