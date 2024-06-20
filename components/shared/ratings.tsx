import React from "react";
import { RatingStar, YellowStar } from "@/public/svg";

const Ratings = ({ rating }: { rating: number }) => {
  const renderRatingLogos = () => {
    switch (rating) {
      case 1:
        return (
          <div className="flex gap-1">
            <YellowStar />
            <RatingStar />
            <RatingStar />
            <RatingStar />
            <RatingStar />
          </div>
        );
      case 2:
        return (
          <div className="flex gap-1">
            <YellowStar />
            <YellowStar />
            <RatingStar />
            <RatingStar />
            <RatingStar />
          </div>
        );
      case 3:
        return (
          <div className="flex gap-1">
            <YellowStar />
            <YellowStar />
            <YellowStar />
            <RatingStar />
            <RatingStar />
          </div>
        );
      case 4:
        return (
          <div className="flex gap-1">
            <YellowStar />
            <YellowStar />
            <YellowStar />
            <YellowStar />
            <RatingStar />
          </div>
        );
      case 5:
        return (
          <div className="flex gap-1">
            <YellowStar />
            <YellowStar />
            <YellowStar />
            <YellowStar />
            <YellowStar />
          </div>
        );
      default:
        return (
          <div className="flex gap-1">
            <RatingStar />
            <RatingStar />
            <RatingStar />
            <RatingStar />
            <RatingStar />
          </div>
        );
    }
  };

  return <div>{renderRatingLogos()}</div>;
};

export default Ratings;
