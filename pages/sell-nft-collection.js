/**
 * PAGE PURPOSE: Allows artists to mint and list their collections
 * PAGE LAYOUT: Form to mint and list collection
 * FUNCTIONALITY: Page already done but consider separating minting and listing..check dashboard.js for documentation
 */
import { Form } from "web3uikit";
import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <div className={styles.container}>
            <Form
                data={[
                    {
                        name: "Artist Name",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "artistName",
                    },
                    {
                        name: "Name of the Collection",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "collectionName",
                    },
                    {
                        name: "Collection Size",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "collectionSize",
                    },
                    {
                        name: "Common Class Price(in MATIC)",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "commonPrice",
                    },
                    {
                        name: "Rare Class Price(in MATIC)",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "rarePrice",
                    },
                    {
                        name: "SuperRare Class Price(in MATIC)",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "superRarePrice",
                    },
                    {
                        name: "Image",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "image",
                    },
                ]}
                title="Mint and Sell your NFT collection!"
                id="Main Form"
            />
        </div>
    );
}
