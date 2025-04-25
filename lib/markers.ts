// lib/fetchMarkers.ts

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
  // Get the session from Supabase
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  // Get the session which contains the access token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Session:", session);

  if (!session) {
    throw new Error("Not authenticated");
  }

  // Include the access token in the Authorization header
  const res = await fetch("http://localhost:3001/api/markers", {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch markers");
  }

  const data: UserMarker[] = await res.json();
  return data;
}

// Insert new marker function
export async function insertMarker(
  newMarker: Omit<UserMarker, "id" | "created_at">
): Promise<UserMarker> {
  // Get the session from Supabase
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  // Get the session which contains the access token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Session:", session);

  if (!session) {
    throw new Error("Not authenticated");
  }

  // Send new marker data to the backend API to insert the marker
  const res = await fetch("http://localhost:3001/api/markers", {
    method: "POST", // Use POST to insert new data
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(newMarker),
  });

  if (!res.ok) {
    throw new Error("Failed to insert marker");
  }

  const data: UserMarker = await res.json();
  return data;
}
