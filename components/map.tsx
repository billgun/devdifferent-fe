"use client";

import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import { CustomMarker } from "./custom-marker";

// Define the property type
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

// Sample property data
const properties: Property[] = [
  {
    id: "1",
    position: { lat: 40.758, lng: -73.9855 },
    price: 5400000,
    image: "/placeholder.svg?height=300&width=400",
    address: "123 Broadway, New York, NY",
    bedrooms: 3,
    bathrooms: 2.5,
  },
  {
    id: "2",
    position: { lat: 40.768, lng: -73.977 },
    price: 4800000,
    image: "/placeholder.svg?height=300&width=400",
    address: "456 Park Avenue, New York, NY",
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: "3",
    position: { lat: 40.753, lng: -73.984 },
    price: 4500000,
    image: "/placeholder.svg?height=300&width=400",
    address: "789 5th Avenue, New York, NY",
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    id: "4",
    position: { lat: 40.743, lng: -73.99 },
    price: 4900000,
    image: "/placeholder.svg?height=300&width=400",
    address: "321 Times Square, New York, NY",
    bedrooms: 3,
    bathrooms: 2,
  },
];

// Define map options type
interface MapOptions {
  disableDefaultUI: boolean;
  clickableIcons: boolean;
  scrollwheel: boolean;
  styles: Array<{
    featureType: string;
    elementType: string;
    stylers: Array<{ visibility: string }>;
  }>;
}

const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = useMemo(() => ({ lat: 40.758, lng: -73.9855 }), []);
  const mapOptions: MapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    []
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <GoogleMap
      zoom={15}
      center={center}
      mapContainerStyle={{
        width: "100%",
        height: "500px",
        borderRadius: "0.5rem",
      }}
      options={mapOptions}
    >
      {properties.map((property) => (
        <CustomMarker key={property.id} property={property} />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
