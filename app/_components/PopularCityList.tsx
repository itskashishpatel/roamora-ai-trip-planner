
"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PopularCityList() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="h-full w-full pt-3 pb-2">
      <h2 className="mx-auto mb-2 max-w-7xl px-4 font-sans text-2xl font-bold text-neutral-800 dark:text-neutral-200 md:text-5xl">
        Destinations to Dream About
      </h2>

      <p className="mx-auto mb-1 max-w-7xl px-4 text-neutral-600 dark:text-neutral-400">
       Discover places that match your vibe, spark your curiosity, and make you want to pack your bags.
      </p>

      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = ({
  category,
  description,
  image,
}: {
  category: string;
  description: string;
  image: string;
}) => {
  return (
    <div className="mb-4 rounded-3xl bg-[#F5F5F7] p-6 dark:bg-neutral-800 md:p-14">
      <p className="mx-auto mb-6 max-w-3xl font-sans text-base text-neutral-600 dark:text-neutral-400 md:text-xl">
        <span className="font-bold text-neutral-800 dark:text-neutral-100">
          Discover {category}.
        </span>{" "}
        {description}
      </p>

      <img
        src={image}
        alt={`Travel destination: ${category}`}
        loading="lazy"
        className="mx-auto h-64 w-full rounded-2xl object-cover md:h-400px"
      />
    </div>
  );
};

const data = [
    {
    category: "Jaipur, India",
    title: "The Pink City — Palaces, Forts & Colourful Bazaars",
    src: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Jaipur, India"
        description="Explore Amber Fort and the City Palace, admire Hawa Mahal, shop colourful local markets, and savour authentic Rajasthani cuisine."
        image="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "Goa, India",
    title: "Coastal Days — Beaches, Portuguese Heritage & Seafood",
    src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Goa, India"
        description="Spend slow mornings on sandy beaches, explore Old Goa's heritage, visit colourful markets, and sample local Goan cuisine."
        image="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "Manali, India",
    title: "Mountain Adventure — Snowy Peaks, Valleys & Forest Trails",
    src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Manali, India"
        description="Enjoy Himalayan views, wander through pine forests, explore nearby mountain villages, and discover seasonal outdoor adventures."
        image="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
 {
    category: "Bali, Indonesia",
    title: "Escape to Bali — Temples, Rice Terraces & Tropical Beaches",
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Bali, Indonesia"
        description="Explore lush rice terraces, visit ancient temples, relax on tropical beaches, and discover Bali's vibrant café culture."
        image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "Santorini, Greece",
    title: "Chase Blue Horizons — Whitewashed Villages & Sunset Views",
    src: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Santorini, Greece"
        description="Wander through whitewashed villages, admire blue-domed churches, enjoy seaside dining, and watch sunsets over the Aegean Sea."
        image="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "Kyoto, Japan",
    title: "Find Serenity — Bamboo Forests, Shrines & Traditional Streets",
    src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Kyoto, Japan"
        description="Walk through bamboo groves, explore historic shrines, discover traditional Japanese architecture, and experience peaceful gardens."
        image="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "London, England",
    title: "Classic London — Big Ben, Tower Bridge & Royal Parks",
    src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="London, England"
        description="See Big Ben and Tower Bridge, explore world-class museums, stroll through royal parks, and enjoy London's diverse food scene."
        image="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "Swiss Alps, Switzerland",
    title: "Mountain Escape — Alpine Villages, Lakes & Scenic Railways",
    src: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Swiss Alps, Switzerland"
        description="Discover dramatic mountain scenery, peaceful alpine villages, crystal-clear lakes, scenic train journeys, and hiking trails."
        image="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "Maldives",
    title: "Island Paradise — Turquoise Waters & Overwater Villas",
    src: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Maldives"
        description="Unwind on white-sand beaches, snorkel among colourful marine life, cruise across turquoise lagoons, and enjoy peaceful island sunsets."
        image="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "Istanbul, Türkiye",
    title: "Where Continents Meet — Mosques, Bazaars & Bosphorus Views",
    src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Istanbul, Türkiye"
        description="Visit the Blue Mosque and Hagia Sophia, explore the Grand Bazaar, sample Turkish delicacies, and cruise along the Bosphorus."
        image="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "Marrakech, Morocco",
    title: "A World of Colour — Souks, Courtyards & Desert Landscapes",
    src: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Marrakech, Morocco"
        description="Explore lively souks, admire intricate architecture, relax in peaceful courtyards, and discover Moroccan food and nearby desert landscapes."
        image="https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
  {
    category: "Sydney, Australia",
    title: "Harbour Adventures — Opera House, Bondi Beach & Coastal Walks",
    src: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=85",
    content: (
      <DummyContent
        category="Sydney, Australia"
        description="Admire the Sydney Opera House, walk across the harbour area, relax at Bondi Beach, and explore spectacular coastal trails."
        image="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=85"
      />
    ),
  },
];
