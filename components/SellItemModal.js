import { useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftAbi from "../constants/NFT.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

export default function SellItemModal({
    nftAddress,
    tokenId,
    isVisibible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const [priceToSellItem, setPriceToSellItem] = useState(0)

    async function approveAndList() {
        console.log("Approving NFT...")
        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress, //if it doesnt get it in other script, declare it here, same as other variables
            functionName: "Approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleApproveSuccess(nftAddress, tokenId) {
        console.log("Listing NFT...")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "makeItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: ethers.utils.parseEther(priceToSellItem || "0"),
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT listing on Marketplace",
            title: "NFT Listed",
            position: "topR",
        })
        onClose && onClose()
        setPriceToSellItem("0")
    }

    return (
        <Modal
            isVisible={isVisibible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                approveAndList()
            }}
        >
            <Input
                label="Enter price you want to sell this NFT(in ETH)"
                name="Selling price"
                type="number"
                onChange={(event) => {
                    setPriceToSellItem(event.target.value)
                }}
                onOk={() => {}}
            />
        </Modal>
    )
}
