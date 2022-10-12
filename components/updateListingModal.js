//import { useState } from "react/cjs/react.development"
import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { ethers } from "ethers";

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisibible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification();
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);
    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        });
        onClose && onClose();
        setPriceToUpdateListingWith("0");
    };
    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    });

    return (
        <Modal
            isVisible={isVisibible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error);
                    },
                    onSuccess: () => handleUpdateListingSuccess(),
                });
            }}
        >
            <Input
                label="Update listing price in MATIC"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value);
                }}
                onOk={() => {}}
            />
        </Modal>
    );
}
