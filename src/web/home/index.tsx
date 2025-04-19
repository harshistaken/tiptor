import { HomeHeroSection } from "./home-hero-section";
import { HomeNavbar } from "./home-navbar";

export default function HomePage() {
    return (
        <div className="w-full h-full bg-background text-foreground">
            <HomeNavbar />
            <HomeHeroSection />
        </div>
    );
}
