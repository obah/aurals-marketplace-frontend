import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftAbi from "../constants/NFT.json";
import Image from "next/image";
import { Card } from "web3uikit";
import { ethers } from "ethers";

export default function CollectionBox({
    startingPrice,
    collectionName,
    collectionSize,
    creatorName,
    finalTokenId,
    nftAddress,
}) {
    const [imageURI, setImageURI] = useState("");
    const { isWeb3Enabled } = useMoralis();

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "getTokenURI",
        params: {
            tokenId: finalTokenId,
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
        isWeb3Enabled ? updateUI() : updateUI(); //outsmarting the react
    }, [isWeb3Enabled]);

    const handleCardClick = () => {
        //make this open item page
    };

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <Card onClick={handleCardClick}>
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height={"200"}
                                        width={"200"}
                                    />
                                    <div className="italic text-sm">{creatorName}</div>
                                    <div className="italic text-sm">{collectionName}</div>
                                    <div>
                                        <div>{collectionSize} NFTs</div>
                                        <div className="font-bold">
                                            {ethers.utils.formatUnits(startingPrice, "ether")}{" "}
                                            MATIC
                                        </div>
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
