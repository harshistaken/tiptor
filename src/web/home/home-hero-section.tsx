import { GithubIcon } from "lucide-react";
import { Link } from "react-router";

export function HomeHeroSection() {
    return (
        <section className="py-28 sm:py-56 px-4 flex flex-col gap-6 font-inter max-w-6xl mx-auto text-center">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl tracking-tight leading-normal">
                <span>The modern </span>
                <span className="bg-foreground/90 text-background px-4 ring-2 ring-offset-2 ring-foreground rounded-full whitespace-nowrap">
                    Text editor
                </span>
                <span> for web apps.</span>
            </h1>
            <p className="text-xl xs:text-2xl sm:text-3xl tracking-tight text-muted-foreground max-w-xl mx-auto leading-snug">
                A high-quality, customizable editor built with{" "}
                <Link
                    to="https://tiptap.dev/"
                    target="_blank"
                    className="hover:text-foreground text-foreground/80"
                >
                    Tiptap
                </Link>
                . Feature-rich editing with full control and style.
            </p>

            <div className="flex flex-col items-center xs:flex-row justify-center gap-4 mt-4">
                <Link
                    to="#editor"
                    className="inline-flex items-center justify-center gap-2  h-10 px-6 rounded-full font-light transition-colors  bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                >
                    Get Started
                </Link>
                <Link
                    to="https://github.com/harshwasthere/tiptor.git"
                    target="_blank"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 transition-colors font-light border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 "
                >
                    <GithubIcon className="size-4" />
                    <span>Star on GitHub</span>
                </Link>
            </div>
        </section>
    );
}
