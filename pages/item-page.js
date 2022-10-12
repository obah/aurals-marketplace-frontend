/**
 * PAGE PURPOSE: Show collection classes, their price and remaining per class in a collection
 * PAGE LAYOUT:
 * 1. 3 Cards each representing a class of that collection - onClick...load buy-item function
 * 2. Total size of class and number of items sold/remaining in that class
 * 3. Section showing other items listed from that collection by fans and their class
 * FUNCTIONALITY: Requires smart contract
 * 1. First query the selectedCollection, then parse it into a query based on itemClass (3 queries...1 per class)
 *      -->return items
 * 3. In the array in the db, keep track of the total number of items and the number of items in that array moved to sold category
 * 4. Return these numbers and use to keep track of inventory on the frontend
 * 5. OnClick of any image, open buy-item function
 * 6. When a normal user lists an NFT that was bought from this collection array, store in a database group too and return those items
 */

import Moralis from "moralis/types";
import { useMoralisQuery } from "react-moralis";
import NFTItemBox from "../components/NFTItemBox";
import NFTResaleBox from "../components/NFTResaleBox";

export default async function Home(_collectionName, _creatorName, _creatorAddress) {
    //to get _collectionName and others, onClick of card store the variables and parse it to these script
    let commonResults = [];
    let rareResults = [];
    let superRareResults = [];
    let resaleItems = [];

    const commonQuery = new Moralis.Query("ActiveItem");
    commonQuery.equalTo("itemClass", "common");
    commonQuery.equalTo("collectionName", _collectionName);
    commonQuery.equalTo("creatorAddress", _creatorAddress);
    commonQuery
        .find()
        .then((results) => {
            commonResults.push(results);
        })
        .catch((error) => {
            console.log(error);
        });
    const commonItem = commonResults[0]; //contains marketplace address, nft address, price, tokenId, seller, collectionName, creatorName, itemClass

    const rareQuery = new Moralis.Query("ActiveItem");
    rareQuery.equalTo("itemClass", "rare");
    rareQuery.equalTo("collectionName", _collectionName);
    rareQuery.equalTo("creatorAddress", _creatorAddress);
    rareQuery
        .find()
        .then((results) => {
            rareResults.push(results);
        })
        .catch((error) => {
            console.log(error);
        });
    const rareItem = rareResults[0];

    const superRareQuery = new Moralis.Query("ActiveItem");
    superRareQuery.equalTo("itemClass", "superRare");
    superRareQuery.equalTo("collectionName", _collectionName);
    superRareQuery.equalTo("creatorAddress", _creatorAddress);
    superRareQuery
        .find()
        .then((results) => {
            superRareResults.push(results);
        })
        .catch((error) => {
            console.log(error);
        });
    const superRareItem = superRareResults[0];
    /**
     * const superRareItem = superRareQuery.first()
     */

    //this is to get collectionSize for current size and total size
    /**
     * query activeCollection for the collectionName - query1
     * query1 returns collectionSize(totalSize) - for each class ;;just do normal query and get them form there - possibly, bring them with _collectionName
     */

    const ActiveItem = Moralis.Object.extend("ActiveItem");
    //get current count of common items
    const commonCounter = new Moralis.Query(ActiveItem);
    commonCounter.equalTo("collectionName", _collectionName);
    commonCounter.equalTo("creatorName", _creatorName);
    commonCounter.equalTo("creatorAddress", _creatorAddress);
    commonCounter.equalTo("itemClass", "common");
    const commonCount = await commonCounter.count();

    //get current count of common items
    const rareCounter = new Moralis.Query(ActiveItem);
    rareCounter.equalTo("collectionName", _collectionName);
    rareCounter.equalTo("creatorName", _creatorName);
    rareCounter.equalTo("creatorAddress", _creatorAddress);
    rareCounter.equalTo("itemClass", "rare");
    const rareCount = await rareCounter.count();

    //get current count of common items
    const superRareCounter = new Moralis.Query(ActiveItem);
    superRareCounter.equalTo("collectionName", _collectionName);
    superRareCounter.equalTo("creatorName", _creatorName);
    superRareCounter.equalTo("creatorAddress", _creatorAddress);
    superRareCounter.equalTo("itemClass", "superRare");
    const superRareCount = await superRareCounter.count();

    //for resale of items in that collection
    const resaleQuery = new Moralis.Query("ActiveItem");
    resaleQuery.equalTo("collectionName", _collectionName);
    resaleQuery.equalTo("creatorName", _creatorName);
    resaleQuery.equalTo("creatorAddress", _creatorAddress);
    resaleQuery.equalTo("resale", "true");
    resaleQuery
        .find()
        .then((results) => {
            resaleItems.push(results);
        })
        .catch((error) => {
            console.log(error);
        });

    //probably merge the arrays together for each responding class so at to fit all in nft.attributes

    return (
        <div>
            <div>
                <h1>
                    {_collectionName}'s NFTs by {_creatorName}
                </h1>
            </div>
            <div className="flex flex-wrap">
                <div>
                    (commonItem.map((nft)) => {
                        const {
                            itemClass,
                            nftAddress,
                            tokenId,
                            price,
                            marketplaceAddress,
                        } = nft.attributes
                    })
                </div>
                <div></div>
                <div></div>
            </div>
            <div>
                <div>
                    <h2>Other reseller's</h2>
                </div>
                <div className="flex flex-wrap"></div>
            </div>
        </div>
    );
}
