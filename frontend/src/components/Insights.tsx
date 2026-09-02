import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Heading } from "./Heading";
import { Reveal } from "./Reveal";

const POSTS = [
  {
    title: "How Often Do You Really Need a Cleaning?",
    date: "July 10, 2026",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Whitening at Home vs In the Chair",
    date: "June 22, 2026",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "What to Do If a Filling Breaks After Hours",
    date: "May 8, 2026",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80",
  },
];

export function Insights() {
  return (
    <section className="bg-bg py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <Heading lead="Expert Insights" accent="for Your Smile" align="center" />
        </Reveal>
        <ul className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post, index) => (
            <li key={post.title}>
              <Reveal delay={index * 120}>
                <article className="insight-card group overflow-hidden rounded-[22px] bg-white shadow-soft">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="px-6 pt-5 pb-5">
                    <h3 className="line-clamp-2 min-h-0 text-lg leading-snug font-semibold text-ink sm:min-h-14">{post.title}</h3>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                      <p className="min-w-0 truncate text-xs text-[#707070] sm:text-sm">Insights — {post.date}</p>
                      <a
                        href="#booking"
                        className="press inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-clinic text-white shadow-[0_8px_16px_-8px_#2f6bff]"
                        aria-label={`Read ${post.title}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <a href="#booking" className="btn-primary">
              View All Post
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
