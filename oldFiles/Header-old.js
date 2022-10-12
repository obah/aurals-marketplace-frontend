import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Header2() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">AURALS</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link href="/collection-page">
                    <a className="mr-4 p-6">Marketplace</a>
                </Link>
                <Link href="/dashboard">
                    <a className="mr-4 p-6">Dashboard</a>
                </Link>
                <Link href="/blogposts">
                    <a className="mr-4 p-6">Blog</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    );
}
