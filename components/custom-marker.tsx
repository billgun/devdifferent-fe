"use client";

import type React from "react";
import { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import Image from "next/image";

interface Property {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  price: number;
  image: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
}

interface CustomMarkerProps {
  property: Property;
}

// Properly type the Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        Point: new (x: number, y: number) => { x: number; y: number };
        MarkerLabel: {
          text: string;
          color: string;
          fontSize: string;
          fontWeight: string;
        };
      };
    };
  }
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({ property }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format price to display in millions with one decimal place
  const formatPrice = (price: number): string => {
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  return (
    <Marker
      position={property.position}
      onClick={() => setIsHovered(true)}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      icon={{
        path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
        fillColor: "#000000",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 1,
      }}
      label={{
        text: formatPrice(property.price),
        color: "#000000",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {isHovered && (
        <InfoWindow onCloseClick={() => setIsHovered(false)}>
          <div className="min-w-xs">
            <div className="relative w-full h-32 rounded-t-lg overflow-hidden">
              <Image
                src={property.image || "/placeholder.svg"}
                alt={`Property at ${property.address || "location"}`}
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="absolute bottom-0 left-0 bg-black/70 text-white px-3 py-1 rounded-tr-lg">
                {formatPrice(property.price)}
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};
