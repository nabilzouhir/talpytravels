"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

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
