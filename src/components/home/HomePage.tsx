import React from 'react';
import { HeroBanner } from './HeroBanner';
import { FeaturedCategories } from './FeaturedCategories';
import { CuratedCollection } from './CuratedCollection';
import { BrandStory } from './BrandStory';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      <HeroBanner />
      <FeaturedCategories />
      <CuratedCollection />
      <BrandStory />
    </div>
  );
};
