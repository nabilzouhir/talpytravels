"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

// ─── Auto-status transitions ─────────────────────────────

/**
 * Promotes any `planned` destinations whose `end_date` is in the past to
 * `visited`. Safe to call on every page render — it's a single indexed UPDATE.
 */
export async function autoCompleteFinishedTrips() {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const { error } = await supabase
    .from("destinations")
    .update({ status: "visited" })
    .eq("status", "planned")
    .lt("end_date", today);

  // Silently ignore errors here — this is a best-effort background task and
  // must not break page rendering.
  if (error) {
    console.error("[autoCompleteFinishedTrips]", error.message);
  }
}

// ─── Destinations ────────────────────────────────────────

export async function createDestination(formData: FormData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("destinations")
    .insert({
      name: formData.get("name") as string,
      country: formData.get("country") as string,
      description: (formData.get("description") as string) || null,
      status: formData.get("status") as string,
      start_date: (formData.get("start_date") as string) || null,
      end_date: (formData.get("end_date") as string) || null,
      cover_image_url: (formData.get("cover_image_url") as string) || null,
      budget: formData.get("budget")
        ? parseFloat(formData.get("budget") as string)
        : null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect(`/destinations/${data.id}`);
}

export async function updateDestination(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("destinations")
    .update({
      name: formData.get("name") as string,
      country: formData.get("country") as string,
      description: (formData.get("description") as string) || null,
      status: formData.get("status") as string,
      start_date: (formData.get("start_date") as string) || null,
      end_date: (formData.get("end_date") as string) || null,
      cover_image_url: (formData.get("cover_image_url") as string) || null,
      budget: formData.get("budget")
        ? parseFloat(formData.get("budget") as string)
        : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/destinations/${id}`);
  redirect(`/destinations/${id}`);
}

export async function deleteDestination(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("destinations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/");
}

// ─── Activities ──────────────────────────────────────────

export async function createActivity(formData: FormData) {
  const supabase = createClient();
  const destinationId = formData.get("destination_id") as string;

  const { error } = await supabase.from("activities").insert({
    destination_id: destinationId,
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    notes: (formData.get("notes") as string) || null,
    day_number: formData.get("day_number")
      ? parseInt(formData.get("day_number") as string)
      : null,
    latitude: formData.get("latitude")
      ? parseFloat(formData.get("latitude") as string)
      : null,
    longitude: formData.get("longitude")
      ? parseFloat(formData.get("longitude") as string)
      : null,
    price: formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : null,
    paid_by: (formData.get("paid_by") as string) || null,
    place_name: (formData.get("place_name") as string) || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function updateActivity(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;
  const destinationId = formData.get("destination_id") as string;

  const { error } = await supabase
    .from("activities")
    .update({
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      notes: (formData.get("notes") as string) || null,
      day_number: formData.get("day_number")
        ? parseInt(formData.get("day_number") as string)
        : null,
      latitude: formData.get("latitude")
        ? parseFloat(formData.get("latitude") as string)
        : null,
      longitude: formData.get("longitude")
        ? parseFloat(formData.get("longitude") as string)
        : null,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : null,
      paid_by: (formData.get("paid_by") as string) || null,
      place_name: (formData.get("place_name") as string) || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function toggleActivity(id: string, done: boolean, destinationId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("activities")
    .update({ done })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function updateActivityDay(
  id: string,
  dayNumber: number | null,
  destinationId: string
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("activities")
    .update({ day_number: dayNumber })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function deleteActivity(id: string, destinationId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function reorderActivities(
  orderedIds: string[],
  destinationId: string,
) {
  const supabase = createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("activities").update({ sort_order: index }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error);
  if (firstError?.error) throw new Error(firstError.error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

// ─── Flights ─────────────────────────────────────────────

export async function createFlight(formData: FormData) {
  const supabase = createClient();
  const destinationId = formData.get("destination_id") as string;

  const { error } = await supabase.from("flights").insert({
    destination_id: destinationId,
    airline: (formData.get("airline") as string) || null,
    flight_number: (formData.get("flight_number") as string) || null,
    departure_airport: (formData.get("departure_airport") as string) || null,
    arrival_airport: (formData.get("arrival_airport") as string) || null,
    departure_at: (formData.get("departure_at") as string) || null,
    arrival_at: (formData.get("arrival_at") as string) || null,
    confirmation_code: (formData.get("confirmation_code") as string) || null,
    price: formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : null,
    paid_by: (formData.get("paid_by") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function updateFlight(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;
  const destinationId = formData.get("destination_id") as string;

  const { error } = await supabase
    .from("flights")
    .update({
      airline: (formData.get("airline") as string) || null,
      flight_number: (formData.get("flight_number") as string) || null,
      departure_airport: (formData.get("departure_airport") as string) || null,
      arrival_airport: (formData.get("arrival_airport") as string) || null,
      departure_at: (formData.get("departure_at") as string) || null,
      arrival_at: (formData.get("arrival_at") as string) || null,
      confirmation_code: (formData.get("confirmation_code") as string) || null,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : null,
      paid_by: (formData.get("paid_by") as string) || null,
      notes: (formData.get("notes") as string) || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function deleteFlight(id: string, destinationId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("flights").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

// ─── Attachments ─────────────────────────────────────────

export async function createAttachment(formData: FormData) {
  const supabase = createClient();
  const activityId = formData.get("activity_id") as string;
  const destinationId = formData.get("destination_id") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    throw new Error("Nessun file selezionato");
  }

  const ext = file.name.split(".").pop() || "bin";
  const storagePath = `activity-${activityId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("travel-photos")
    .upload(storagePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { error } = await supabase.from("attachments").insert({
    activity_id: activityId,
    storage_path: storagePath,
    filename: file.name,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function deleteAttachment(
  id: string,
  storagePath: string,
  destinationId: string,
) {
  const supabase = createClient();

  await supabase.storage.from("travel-photos").remove([storagePath]);
  const { error } = await supabase.from("attachments").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

// ─── Diary ───────────────────────────────────────────────

export async function createDiaryEntry(formData: FormData) {
  const supabase = createClient();
  const destinationId = formData.get("destination_id") as string;

  const { error } = await supabase.from("diary_entries").insert({
    destination_id: destinationId,
    title: formData.get("title") as string,
    body: formData.get("body") as string,
    entry_date: formData.get("entry_date") as string,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function updateDiaryEntry(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;
  const destinationId = formData.get("destination_id") as string;

  const { error } = await supabase
    .from("diary_entries")
    .update({
      title: formData.get("title") as string,
      body: formData.get("body") as string,
      entry_date: formData.get("entry_date") as string,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function deleteDiaryEntry(id: string, destinationId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("diary_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

// ─── Photos ──────────────────────────────────────────────

export async function createPhoto(formData: FormData) {
  const supabase = createClient();
  const destinationId = formData.get("destination_id") as string;

  const { error } = await supabase.from("photos").insert({
    destination_id: destinationId,
    diary_entry_id: (formData.get("diary_entry_id") as string) || null,
    storage_path: formData.get("storage_path") as string,
    caption: (formData.get("caption") as string) || null,
    taken_at: (formData.get("taken_at") as string) || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function updatePhoto(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;
  const destinationId = formData.get("destination_id") as string;

  const { error } = await supabase
    .from("photos")
    .update({
      caption: (formData.get("caption") as string) || null,
      taken_at: (formData.get("taken_at") as string) || null,
      diary_entry_id: (formData.get("diary_entry_id") as string) || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}

export async function deletePhoto(id: string, destinationId: string, storagePath: string) {
  const supabase = createClient();

  await supabase.storage.from("travel-photos").remove([storagePath]);
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/destinations/${destinationId}`);
}
