// lib/fetchMarkers.ts

import { createClient } from "@/utils/supabase/client";

export interface UserMarker {
  id: number;
  user_id: string;
  lat: number;
  lng: number;
  price: number;
  image_url: string;
  created_at: string;
}

export async function fetchUserMarkers(): Promise<UserMarker[]> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/markers`,
    {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch markers");
  }

  const data: UserMarker[] = await res.json();
  return data;
}

export async function insertMarker(
  newMarker: Omit<UserMarker, "id" | "created_at" | "user_id">
): Promise<UserMarker> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/markers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(newMarker),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to insert marker");
  }

  const data: UserMarker = await res.json();
  return data;
}

// 🔄 Update existing marker
export async function updateMarker(
  id: number,
  updatedData: Partial<Omit<UserMarker, "id" | "user_id" | "created_at">>
): Promise<UserMarker> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/markers/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update marker");
  }

  const data: UserMarker = await res.json();
  return data;
}

// ❌ Delete marker
export async function deleteMarker(id: number): Promise<void> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/markers/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete marker");
  }

  return;
}
