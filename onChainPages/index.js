import { useMoralis, useMoralisQuery } from "react-moralis";
import MarketNFTBox from "../components/MarketNFTBox";

export default function Home() {
    const { isWeb3Enabled } = useMoralis();
    //Using MORALIS, we use useMoralisQuery to show the recently listed NFTs
    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId")
    );
    console.log(listedNfts);

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed Collections</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading....</div>
                    ) : (
                        listedNfts.map((nft) => {
                            console.log(nft.attributes);
                            const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                                nft.attributes;
                            return (
                                <div>
                                    <MarketNFTBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                </div>
                            );
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    );
}
