/**
 * PAGE PURPOSE: Different for artist and fans.
 *  --For artists: Allow them to mint and list NFTs, upload merch, tickets etc, set perks & prices, show earnings
 *  --For fans: Show them their Aurals NFTs(replaces my-nft page), allows them to resell NFT, show earnings
 * PAGE LAYOUT:
 * @dev: Make a slider or button to choose which to show..either artist or fan dashboard
 * A. FOR ARTIST:
 * 1. Button/Card to mint and list new collection
 * 2. Button/Card to upload products(merch and tickets) and set other perk features
 * 3. Show earnings / transactions report
 * B. FOR FAN:
 * 1. Cards showing owned Aurals NFTs owned the user
 * --Onclick on cards, open benefits page
 * 2. Button below each card or in card to sell NFT
 * 3. Show earnings / transactions report
 * FUNCTIONALITY
 * First, a "pre-page" or popup asking to pick type of dashboard(web3uikit can do this) to view and returns a content
 * Content 1: Requires smart contract. Link form to mint and list NFT(PROBABLY separate both, let them mint and list whenever they want - approach 2)
 * on approach 2, store minted nfts in a separate entry in the db and query.
 * Also, off chain feature: form to allow artists upload products(tickets, merch, music files etc) and store in a db
 * On-chain feature: get amount earned from smart contract and return it here.
 * Content 2: Requires smart contract.
 * Return aurals NFT in user wallet and return here(my-nft does this already), display with card(web3uikit), onclick go to benefits page
 * On-chain feature: add resell NFT...it on card in my-nft
 * On-chain feature: get amount earned from smart contract and return it here.
 */

import Link from "next/link";

export default function Home() {
    return (
        <div>
            <div>There are 2 dashboard pages, 1 for artists and another for normal users.</div>
            <div>
                For the artist dashboard, this is where they can mint and list new NFTs, add new
                merch, show tickets and other perks. They also get a report of all their earnings
                here
            </div>
            <div>
                <Link href="/sell-nft-collection">Click here to go to mint and list page</Link>
            </div>
            <div>
                For the normal user dashboard, all the NFTs in the user's address will show here
                and clicking on them will open the subsite. Also, they can choose to resell their
                NFTs from this dashboard and they also see a report of their earnings here.
            </div>
            <div>
                <Link href="/benefits-page">Click here to go the subsite(benefits page)</Link>
            </div>
        </div>
    );
}
