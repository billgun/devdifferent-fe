"use client";

import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { fetchUserMarkers, insertMarker, UserMarker } from "@/lib/markers";
import { CustomMarker } from "./custom-marker";
import { uploadImage } from "@/lib/uploadImage";

// Define the marker schema using Zod
const markerSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  price: z.string().min(1),
});

const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = useMemo(() => ({ lat: 40.758, lng: -73.9855 }), []);
  const mapOptions = useMemo(
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

  const [markers, setMarkers] = useState<UserMarker[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMarker, setNewMarker] = useState({
    lat: 0,
    lng: 0,
    price: 0,
    image_url: "",
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadMarkers = async () => {
    try {
      const data = await fetchUserMarkers();
      setMarkers(data);
    } catch (err) {
      console.error("Failed to fetch markers", err);
    }
  };

  useEffect(() => {
    loadMarkers();
  }, []);

  // Handle map click event
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const { latLng } = e;
    if (latLng) {
      setNewMarker({
        lat: latLng.lat(),
        lng: latLng.lng(),
        price: 0, // Default price
        image_url: "", // Default empty image URL
      });
      setShowForm(true); // Show form on click
    }
  };

  // Handle form field change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewMarker((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      markerSchema.parse(newMarker); // Validate fields
      setFormErrors([]);

      if (!imageFile) {
        setFormErrors(["Image file is required"]);
        return;
      }

      const uploadedImageUrl = await uploadImage(imageFile);

      const data = await insertMarker({
        ...newMarker,
        price: Number(newMarker.price),
        image_url: uploadedImageUrl,
      });

      setMarkers((prev) => [...prev, data]);
      setShowForm(false);
      setImageFile(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFormErrors(err.errors.map((e) => e.message));
      } else if (err instanceof Error) {
        setFormErrors([err.message]);
      } else {
        setFormErrors(["An unknown error occurred"]);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <GoogleMap
        zoom={15}
        center={center}
        mapContainerStyle={{
          width: "100%",
          height: "500px",
          borderRadius: "0.5rem",
        }}
        onClick={handleMapClick} // Trigger map click
        options={mapOptions}
      >
        {markers.map((marker) => (
          <CustomMarker
            key={marker.id}
            marker={marker}
            onUpdate={loadMarkers}
            onDelete={loadMarkers}
          />
        ))}
      </GoogleMap>

      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="absolute top-10 left-10 bg-white p-6 shadow-lg rounded"
        >
          <h3 className="text-xl mb-4">Add a New Marker</h3>
          {formErrors.length > 0 && (
            <div className="text-red-500 mb-4">
              <ul>
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={newMarker.price}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image_file" className="block text-sm font-medium">
              Image File
            </label>
            <input
              type="file"
              id="image_file"
              name="image_file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="bg-blue-500 text-white">
              Add Marker
            </Button>
            <Button
              type="button"
              className="bg-gray-500 text-white"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MapComponent;
