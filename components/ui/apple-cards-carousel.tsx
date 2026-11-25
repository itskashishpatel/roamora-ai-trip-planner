
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
}

type CardData = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  items,
  initialScroll = 0,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkScrollability = () => {
    const element = carouselRef.current;

    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(
      scrollLeft + clientWidth < scrollWidth - 1,
    );
  };

  useEffect(() => {
    const element = carouselRef.current;

    if (!element) return;

    element.scrollLeft = initialScroll;
    checkScrollability();

    window.addEventListener("resize", checkScrollability);

    return () => {
      window.removeEventListener("resize", checkScrollability);
    };
  }, [initialScroll]);

  const scrollCarousel = (direction: "left" | "right") => {
    const element = carouselRef.current;

    if (!element) return;

    element.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const handleCardClose = (index: number) => {
    const element = carouselRef.current;

    if (!element) return;

    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 224 : 384;
    const gap = 16;

    const scrollPosition = (cardWidth + gap) * (index + 1);

    element.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    setCurrentIndex(index);
  };

  return (
    <CarouselContext.Provider
      value={{
        onCardClose: handleCardClose,
        currentIndex,
      }}
    >
      <div className="relative w-full">
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex w-full overflow-x-auto overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:py-20"
        >
          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "mx-auto max-w-7xl",
            )}
          >
            {items.map((item, index) => (
              <motion.div
                key={`card-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                  },
                }}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mr-10 flex justify-end gap-2">
          <button
            type="button"
            aria-label="Scroll carousel left"
            onClick={() => scrollCarousel("left")}
            disabled={!canScrollLeft}
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-6 w-6 text-gray-500" />
          </button>

          <button
            type="button"
            aria-label="Scroll carousel right"
            onClick={() => scrollCarousel("right")}
            disabled={!canScrollRight}
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: CardData;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  useOutsideClick(
    containerRef as React.RefObject<HTMLDivElement>,
    () => {
      if (open) handleClose();
    },
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />

            <motion.div
              ref={containerRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans dark:bg-neutral-900 md:p-10"
            >
              <button
                type="button"
                aria-label="Close card"
                onClick={handleClose}
                className="sticky right-0 top-4 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
              >
                <X className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>

              <motion.p
                layoutId={
                  layout ? `category-${card.title}` : undefined
                }
                className="text-base font-medium text-black dark:text-white"
              >
                {card.category}
              </motion.p>

              <motion.p
                layoutId={
                  layout ? `title-${card.title}` : undefined
                }
                className="mt-4 text-2xl font-semibold text-neutral-700 dark:text-white md:text-5xl"
              >
                {card.title}
              </motion.p>

              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        aria-label={`Open ${card.title}`}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 dark:bg-neutral-900 md:h-[40rem] md:w-96"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />

        <div className="relative z-40 p-8">
          <motion.p
            layoutId={
              layout ? `category-${card.category}` : undefined
            }
            className="text-left font-sans text-sm font-medium text-white md:text-base"
          >
            {card.category}
          </motion.p>

          <motion.p
            layoutId={
              layout ? `title-${card.title}` : undefined
            }
            className="mt-2 max-w-xs text-left font-sans text-xl font-semibold text-white [text-wrap:balance] md:text-3xl"
          >
            {card.title}
          </motion.p>
        </div>

        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          sizes="(max-width: 767px) 224px, 384px"
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  className,
  alt,
  onLoad,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Image
      {...props}
      alt={alt || "Background of a beautiful view"}
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={(event) => {
        setIsLoading(false);
        onLoad?.(event);
      }}
    />
  );
};
