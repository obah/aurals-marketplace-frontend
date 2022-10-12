/**
 * CONSIDER adding search, filter, genre features
 */
import { useMoralisQuery } from "react-moralis";
import { Button } from "web3uikit";
import CollectionBox from "../components/CollectionBox";

export default function Home() {
    const { data: listedCollections, isFetching: fetchingListedCollections } = useMoralisQuery(
        "ActiveCollection",
        (query) => query.limit(20).descending("finalTokenId")
    );
    console.log(listedCollections);

    return (
        <div>
            <div>
                <h1>Marketplace</h1>
            </div>
            <div>
                <h1>Latest collections</h1>
                <div className="flex flex-wrap">
                    {fetchingListedCollections ? (
                        <div>Loading....</div>
                    ) : (
                        listedCollections.map((nft) => {
                            console.log(nft.attributes);
                            const {
                                startingPrice,
                                collectionName,
                                collectionSize,
                                creatorName,
                                finalTokenId,
                                nftAddress,
                            } = nft.attributes;
                            return (
                                <div>
                                    <CollectionBox
                                        startingPrice={startingPrice}
                                        collectionName={collectionName}
                                        collectionSize={collectionSize}
                                        creatorName={creatorName}
                                        finalTokenId={finalTokenId}
                                        nftAddress={nftAddress}
                                        key={`${nftAddress}${creatorName}`}
                                    />
                                    <Button
                                        color="blue"
                                        onClick={function noRefCheck() {}}
                                        size="regular"
                                        text="BUY"
                                        theme="colored"
                                        type="button"
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
