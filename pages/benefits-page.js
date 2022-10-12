/**
 * PAGE PURPOSE: To give access on the perks and benefits of NFT to the NFT owner
 * @dev: Use page gating here to generate page components based on NFT owned
 * PAGE LAYOUT:
 * 1. Overview of the artist/album/song represented by the nft
 * 2A. A slider showing the various benefits???
 *              OR
 * 2B. A list of the benefits/perks
 * --benefits/perks include discounts on merch and ticket sales, access to exclusive merch, music files
 * FUNCTIONALITY
 * A lot of work is needed here sha. Basically this page is made up of dynamic content
 * The content to show here will be fetched based on the NFT the user clicks.
 * Possible solutions - store all possible content here in a database and then query OR
 *         Have the NFTs work on other pages where the benefits can be accessed i.e
 *         have a shop page where merchs, tickets etc are sold then discounts are applied based on the nft in the user wallet
 *
 * -------------> PAGE STILL UNDERGOING REVIEW <----------------
 */

export default function Home() {
    return (
        <div>
            <div>
                This is the subsite. Clicking on a NFT the owned by the user from the dashboard
                page leads here. This page has 2 sections;
            </div>
            <div>1. An overiew of the artist/album/song represented by the nft</div>
            <div>2. A slider showing the various utilities the NFT gives access to.</div>
        </div>
    );
}
