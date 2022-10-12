//import { ethers } from "ethers"
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import MyNFTBox from "../components/MyNFTBox";
//import nftNetworkMapping from "../constants/nftNetworkMapping.json";
//import nftMarketplaceNetworkMapping from "../constants/nftMarketplaceNetworkMapping.json";

export default function Home() {
    const { isWeb3Enabled, account /*chainId*/ } = useMoralis();
    //const chainString = chainId ? parseInt(chainId).toString() : "31337"
    //const marketplaceAddress = nftMarketplaceNetworkMapping[chainString].NftMarketplace[0];
    //const nftAddress = nftNetworkMapping[chainString].NFT[0];
    const marketplaceAddress = "0x6a3ce765470d922215CC4d1fE1aa663bc35FeB2f";
    const nftAddress = "0x6664dd3B229D1179387b0E329D06D69F34aD7a0d";

    const Web3Api = useMoralisWeb3Api();
    const fetchNFTsForContract = async () => {
        const options = {
            chain: "mumbai",
            token_address: nftAddress,
        };
        const myNFTs = await Web3Api.account.getNFTsForContract(options);
        console.log(myNFTs);
        return myNFTs;
    };

    async function getTokenId() {
        const getToken = await fetchNFTsForContract();
        const tokenId = getToken.myNFTs.result[0].token_id;
        return tokenId;
    }

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">My NFTs</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    <MyNFTBox
                        nftAddress={nftAddress}
                        tokenId={getTokenId}
                        marketplaceAddress={marketplaceAddress}
                    />
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    );
}
