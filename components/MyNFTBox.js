import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftAbi from "../constants/NFT.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import SellItemModal from "./sellItemModal";

export default function MyNFTBox({ nftAddress, tokenId, marketplaceAddress }) {
    const { isWeb3Enabled } = useMoralis();
    const [imageURI, setImageURI] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [tokenArtist, setTokenArtist] = useState("");
    const [tokenWorkTitle, setTokenWorkTitle] = useState("");
    const [tokenClass, setTokenClass] = useState("");
    const [showModal, setShowModal] = useState(false);
    const hideModal = () => setShowModal(false);
    const dispatch = useNotification();

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "getTokenURI",
        params: {
            tokenId: tokenId,
        },
    });

    async function updateUI() {
        const tokenURI = await getTokenURI();
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            const tokenURIResponse = await (await fetch(requestURL)).json();
            const imageURI = tokenURIResponse.image;
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            setImageURI(imageURIURL);
            setTokenName(tokenURIResponse.name);
            setTokenDescription(tokenURIResponse.description);
            setTokenArtist(tokenURIResponse.properties.artist);
            setTokenWorkTitle(tokenURIResponse.properties.work);
            setTokenClass(tokenURIResponse.properties.class);
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    /*on card click, it should open the benefits page...hence, get NFT attributes here
    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: () => openThisPage(),
              });
    };
    */

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>
                                        #{tokenId} {tokenClass} Class
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height={"200"}
                                        width={"200"}
                                    />
                                    <div className="italic text-sm">
                                        {tokenWorkTitle} NFT by {tokenArtist}
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <div>
                            <Button
                                onClick={
                                    <SellItemModal
                                        isVisibible={showModal}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        nftAddress={nftAddress}
                                        onClose={hideModal}
                                    />
                                }
                                text="Sell NFT"
                                type="button"
                            />
                        </div>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
}
