import Link from "next/link";
import { Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Leaderboard() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Trophy className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-display font-bold mb-4">Leaderboard</h1>
                <p className="text-muted-foreground mb-8">Coming soon! Track top claimers and earned points here.</p>
                <Link href="/" className="text-primary hover:underline">
                    Back to Home
                </Link>
            </div>
            <Footer />
        </div>
    );
}
