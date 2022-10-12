import { useMoralisQuery } from "react-moralis";
import Link from "next/link";
import { Button } from "web3uikit";
import CollectionBox from "../components/CollectionBox";

export default function Home() {
    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        "ActiveCollection",
        (query) => query.limit(6).descending("finalTokenId")
    );
    console.log(listedNfts);

    return (
        <div>
            <div>
                <h1>
                    Discover a new world of collectible high value NFTs made by your favorite music
                    artists
                </h1>
                <div>
                    <div>
                        {/*fix this button's function */}
                        <Button
                            color="blue"
                            onClick={function noRefCheck() {}}
                            size="large"
                            text="Explore"
                            theme="primary"
                            type="button"
                        />
                    </div>
                    <div>
                        <Button
                            color="blue"
                            onClick={function noRefCheck() {}}
                            size="large"
                            text="I'm an Artist"
                            theme="primary"
                            type="button"
                        />
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div>
                        <div>Latest collections</div>
                        <div>
                            <Link href="/collection-page">
                                <a className="mr-4 p-6">View all</a>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        {fetchingListedNfts ? (
                            <div>Loading....</div>
                        ) : (
                            listedNfts.map((nft) => {
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
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <div>
                <div>
                    {/* justify this to center */}
                    <h2>THE BEST MARKETPLACE MADE FOR MUSIC ARTISTS</h2>
                    <div>
                        On Aurals Marketplace music artists can very easily create, mint and sell
                        their NFT collection at extremely low gas fees. This marketplace also isn`t
                        only for NFTs but several other music products, with a unique perk...the
                        entire commerce process is fully automated. Literally the best source of
                        income for any music artist
                    </div>
                </div>
                <div>
                    {/* justify this to left */}
                    <h2>AURALS NFTS = HIGH VALUE NFTS</h2>
                    <div>
                        Owning an Aurals NFT either by creating it as an artist or buying it as a
                        fan or collector grants you access to various benefits, such as lifetime
                        earnings, free tickets to shows, exclusive merchandise and a lot of other
                        perks and utilities
                    </div>
                </div>
                <div>
                    {/* justify this to right */}
                    <h2>EVEN MORE WHISTLES AND BELLS</h2>
                    <div>
                        We built the Aurals Marketplace to be easily useable for anyone not just
                        web3/nft experts but people also new to the space. We also don`t want to
                        burden our users with excessive gas fees, therefore we built Aurals
                        Marketplace on the polygon network and for ethereum users, they don`t have
                        to worry about excessive gas fees or slow transaction times. This feat is
                        achieved by using zkSync, a L2 ethereum chain
                    </div>
                </div>
            </div>
        </div>
    );
}
