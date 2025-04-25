"use client";

import type React from "react";
import { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import Image from "next/image";
import { UserMarker } from "@/lib/markers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateMarker, deleteMarker } from "@/lib/markers";
import { markerUpdateSchema } from "@/lib/markerSchema";

interface CustomMarkerProps {
  marker: UserMarker;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  marker,
  onDelete,
  onUpdate,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState(marker.price);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number): string => {
    return `$${price}`;
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    const parsed = markerUpdateSchema.safeParse({ price: newPrice });

    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      await updateMarker(marker.id, { price: parsed.data.price });
      setIsEditing(false);
      onUpdate?.();
    } catch (err) {
      console.error("Failed to update price", err);
      setError("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMarker(marker.id);
      onDelete?.();
    } catch (err) {
      console.error("Failed to delete marker", err);
    }
  };

  return (
    <Marker
      position={{ lat: marker.lat, lng: marker.lng }}
      onClick={() => setIsHovered(true)}
      icon={{
        path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
        fillColor: "#000000",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 1,
      }}
      label={{
        text: formatPrice(marker.price),
        color: "#000000",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {isHovered && (
        <InfoWindow onCloseClick={() => setIsHovered(false)}>
          <div className="min-w-xs max-w-sm space-y-2">
            <div className="relative w-full h-32 rounded-t-lg overflow-hidden">
              <Image
                src={marker.image_url || "/placeholder.svg"}
                alt={`Marker ${marker.id}`}
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="absolute bottom-0 left-0 bg-black/70 text-white px-3 py-1 rounded-tr-lg">
                {formatPrice(marker.price)}
              </div>
            </div>

            <div className="px-2 space-y-2">
              {isEditing ? (
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                />
              ) : (
                <div className="text-lg font-semibold">
                  Price: {formatPrice(marker.price)}
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-2">
                {isEditing ? (
                  <Button size="sm" onClick={handleUpdate} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}

                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};
