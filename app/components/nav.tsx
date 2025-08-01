"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref}>
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-zinc-900/500  border-zinc-800 "
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-4 md:p-6 mx-auto">
					<div className="flex justify-between gap-2 md:gap-4 lg:gap-8">
						<Link
							href="/cool-stuff"
							className="duration-200 text-zinc-400 hover:text-zinc-100 text-xs md:text-sm lg:text-base"
						>
							Cool Stuff
						</Link>
						<Link
							href="/vroom"
							className="duration-200 text-zinc-400 hover:text-zinc-100 text-xs md:text-sm lg:text-base"
						>
							Vroom
						</Link>
						<Link
							href="/otf"
							className="duration-200 text-zinc-400 hover:text-zinc-100 text-xs md:text-sm lg:text-base"
						>
							OTF
						</Link>
						<Link
							href="/psychology"
							className="duration-200 text-zinc-400 hover:text-zinc-100 text-xs md:text-sm lg:text-base"
						>
							Psychology
						</Link>
						<Link
							href="/contact"
							className="duration-200 text-zinc-400 hover:text-zinc-100 text-xs md:text-sm lg:text-base"
						>
							Me
						</Link>
						
					</div>

					<Link
						href="/"
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
			</div>
		</header>
	);
};
