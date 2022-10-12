const { default: Moralis } = require("moralis/types");

Moralis.Cloud.afterSave("ItemOffered", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Looking for confirmed Tx");
    if (confirmed) {
        logger.info("Found Item!");
        const ActiveItem = Moralis.Object.extend("ActiveItem");

        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        query.equalTo("seller", request.object.get("seller"));
        const alreadyListedItem = await query.first();
        if (alreadyListedItem) {
            logger.info(`Deleting already listed item ${request.object.get("objectId")}`);
            await alreadyListedItem.destroy();
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} since it is a listed item getting updated`
            );
        }

        const activeItem = new ActiveItem();
        activeItem.set("marketplaceAddress", request.object.get("address"));
        activeItem.set("nftAddress", request.object.get("nftAddress"));
        activeItem.set("price", request.object.get("price"));
        activeItem.set("tokenId", request.object.get("tokenId"));
        activeItem.set("seller", request.object.get("seller"));
        activeItem.set("collectionName", request.object.get("collectionName"));
        activeItem.set("creatorName", request.object.get("creatorName"));
        activeItem.set("creatorAddress", request.object.get("creatorAddress"));
        activeItem.set("itemClass", request.object.get("itemClass"));
        activeItem.set("resale", request.object.get("resale"));
        logger.info(
            `Adding info: ${request.object.get("address")}. TokenId: ${request.object.get(
                "tokenId"
            )}`
        );
        logger.info("Saving...");
        await activeItem.save();
    }
});

Moralis.Cloud.afterSave("CollectionListed", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Looking for confirmed Tx");
    if (confirmed) {
        logger.info("Found Collection!");
        const ActiveCollection = Moralis.Object.extend("ActiveCollection");

        const query = new Moralis.Query(ActiveCollection);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("creatorName", request.object.get("creatorName"));
        query.equalTo("collectionName", request.object.get("collectionName"));
        const alreadyListedCollection = await query.first();
        if (alreadyListedCollection) {
            logger.info(`Deleting already listed item ${request.object.get("objectId")}`);
            await alreadyListedCollection.destroy();
            logger.info(
                `Deleted collection ${request.object.get(
                    "collectionName"
                )} at address ${request.object.get(
                    "address"
                )} since it is a listed item getting updated`
            );
        }

        const activeCollection = new ActiveCollection();
        activeCollection.set("marketplaceAddress", request.object.get("address"));
        activeCollection.set("nftAddress", request.object.get("nftAddress"));
        activeCollection.set("creatorName", request.object.get("creatorName"));
        activeCollection.set("collectionName", request.object.get("collectionName"));
        activeCollection.set("collectionSize", request.object.get("collectionSize"));
        activeCollection.set("creatorName", request.object.get("creatorName"));
        activeCollection.set("commonSize", request.object.get("commonSize"));
        activeCollection.set("rareSize", request.object.get("rareSize"));
        activeCollection.set("superRareSize", request.object.get("superRareSize"));
        activeCollection.set("finalTokenId", request.object.get("finalTokenId"));
        activeCollection.set("startingPrice", request.object.get("startingPrice"));
        logger.info(
            `Adding info: ${request.object.get("address")}. Collection Name: ${request.object.get(
                "collectionName"
            )}`
        );
        logger.info("Saving...");
        await activeCollection.save();
    }
});

Moralis.Cloud.afterSave("ItemRemoved", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info(`Marketplace | Object: ${request.object}`);
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | Query: ${query}`);
        const removedItem = await query.first();
        logger.info(`Marketplace | RemovedItem: ${removedItem}`);
        if (removedItem) {
            logger.info(
                `Deleting item ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )} since it was removed`
            );
            await removedItem.destroy();
        } else {
            logger.info(
                `No item found with ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")}`
            );
        }

        //this bit is to remove collection
        const query2 = new Moralis.Query(ActiveItem);
        query2.equalTo("marketplaceAddress", request.object.get("address"));
        query2.equalTo("nftAddress", request.object.get("nftAddress"));
        query2.equalTo("collectionName", request.object.get("collectionName"));
        query2.equalTo("creatorName", request.object.get("creatorName"));
        logger.info(`Marketplace | Query: ${query2}`);
        const removedCollection = await query2.first();
        logger.info(`Marketplace | RemovedCollection: ${removedCollection}`);

        const ActiveCollection = Moralis.Object.extend("ActiveCollection");
        const query3 = new Moralis.Query(ActiveCollection);
        query3.equalTo("marketplaceAddress", request.object.get("address"));
        query3.equalTo("nftAddress", request.object.get("nftAddress"));
        query3.equalTo("collectionName", request.object.get("collectionName"));
        query3.equalTo("creatorName", request.object.get("creatorName"));
        logger.info(`Marketplace collection | Query: ${query3}`);

        const collectionItem = await query3.first();
        if (collectionItem) {
            if (!removedCollection) {
                await collectionItem.destroy();
            } else {
                logger.info(
                    `collection ${request.object.get(
                        "collectionName"
                    )} by creator ${request.object.get("creatorName")} still exists in activeItem`
                );
            }
        } else {
            logger.info(
                `No ccollection with ${request.object.get(
                    "collectionName"
                )} by creator ${request.object.get("creatorName")} exist in activeItem`
            );
        }
    }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info(`Marketplace | Object: ${request.object}`);
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | Query: ${query}`);
        const boughtItem = await query.first();
        logger.info(`Marketplace | BoughtItem: ${boughtItem}`);
        if (boughtItem) {
            logger.info(
                `Deleting item ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )} since it was bought`
            );
            await boughtItem.destroy();
        } else {
            logger.info(
                `No item found with ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")}`
            );
        }

        //this bit is to remove collection
        const query2 = new Moralis.Query(ActiveItem);
        query2.equalTo("marketplaceAddress", request.object.get("address"));
        query2.equalTo("nftAddress", request.object.get("nftAddress"));
        query2.equalTo("collectionName", request.object.get("collectionName"));
        query2.equalTo("creatorName", request.object.get("creatorName"));
        logger.info(`Marketplace | Query: ${query2}`);
        const boughtCollection = await query2.first();
        logger.info(`Marketplace | BoughtCollection: ${boughtCollection}`);

        const ActiveCollection = Moralis.Object.extend("ActiveCollection");
        const query3 = new Moralis.Query(ActiveCollection);
        query3.equalTo("marketplaceAddress", request.object.get("address"));
        query3.equalTo("nftAddress", request.object.get("nftAddress"));
        query3.equalTo("collectionName", request.object.get("collectionName"));
        query3.equalTo("creatorName", request.object.get("creatorName"));
        logger.info(`Marketplace collection | Query: ${query3}`);

        const collectionItem = await query3.first();
        if (collectionItem) {
            if (!boughtCollection) {
                await collectionItem.destroy();
            } else {
                logger.info(
                    `collection ${request.object.get(
                        "collectionName"
                    )} by creator ${request.object.get("creatorName")} still exists in activeItem`
                );
            }
        } else {
            logger.info(
                `No ccollection with ${request.object.get(
                    "collectionName"
                )} by creator ${request.object.get("creatorName")} exist in activeItem`
            );
        }
    }
});

/**
 * WORKAROUND
 * 1. Use activeCollection for display of collections
 * 2. Use activeItem(with collectionName attr.) to keep track collection items still available
 * 3. No need of collectionFinished??
 *
 * 4. To remove a collection when its finished, query both itemBought and itemRemoed for using collectionName, creator and if query is not found, remove it from activeCollection
 *      --> itemBought and itemRemoved will remove the items from activeItem
 *
 * 5. Creator is used in activeCollection, while seller is used in the rest
 *
 * 2A. To keep track of items collection left in a collection, we might query it here (6)
 *              or in the frontend (7)
 * 6. Query activeItem using collectionName, creator and return the total number of items found
 */
