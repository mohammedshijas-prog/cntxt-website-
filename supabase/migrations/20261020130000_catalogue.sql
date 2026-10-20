-- Data catalogue: datasets the team publishes (with samples), and the requests buyers send.

create table public.datasets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  kind text not null default 'labelled' check (kind in ('captured', 'labelled')),
  category text not null default 'Text',
  blurb text not null default '',
  capture text not null default '',
  labels text[] not null default '{}',
  sample_url text,
  sample_name text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index datasets_status_idx on public.datasets (status, sort);

create trigger datasets_touch before update on public.datasets
for each row execute function public.touch_updated_at();

create table public.dataset_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text,
  dataset_ids uuid[] not null default '{}',
  dataset_titles text[] not null default '{}',
  page text,
  status text not null default 'new' check (status in ('new', 'contacted', 'scoping', 'delivered', 'closed')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index dataset_requests_created_idx on public.dataset_requests (created_at desc);

create trigger dataset_requests_touch before update on public.dataset_requests
for each row execute function public.touch_updated_at();

alter table public.datasets enable row level security;
alter table public.dataset_requests enable row level security;

create policy "anyone reads published datasets" on public.datasets
  for select to anon, authenticated using (status = 'published');

create policy "admins read all datasets" on public.datasets
  for select to authenticated using (public.is_admin());

create policy "admins write datasets" on public.datasets
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Requests are inserted by the server with the service key, never by browsers.
create policy "admins read dataset requests" on public.dataset_requests
  for select to authenticated using (public.is_admin());

create policy "admins update dataset requests" on public.dataset_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admins delete dataset requests" on public.dataset_requests
  for delete to authenticated using (public.is_admin());

-- Samples: a public bucket only admins can write to (buyers download them from the catalogue).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'samples',
  'samples',
  true,
  26214400,
  array[
    'image/jpeg', 'image/png', 'image/webp',
    'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4',
    'video/mp4', 'video/webm',
    'application/json', 'text/csv', 'text/plain', 'application/pdf', 'application/zip'
  ]
)
on conflict (id) do nothing;

create policy "admins upload samples" on storage.objects
  for insert to authenticated with check (bucket_id = 'samples' and public.is_admin());

create policy "admins update samples" on storage.objects
  for update to authenticated using (bucket_id = 'samples' and public.is_admin());

create policy "admins delete samples" on storage.objects
  for delete to authenticated using (bucket_id = 'samples' and public.is_admin());

-- The catalogue as it stands on the site today, so nothing disappears on launch.
insert into public.datasets (slug, title, kind, category, blurb, capture, labels, status, sort) values
  ('arabic-conversational-speech', 'Arabic conversational speech', 'captured', 'Audio', 'Recorded conversations across Arabic dialects, transcribed and checked by native Arabic annotators.', 'Recorded conversation', '{}', 'published', 10),
  ('handwritten-arabic-pages', 'Handwritten Arabic pages', 'captured', 'Document', 'Photographs of handwritten Arabic pages, submitted through the KLKT app and accepted only after human review.', 'Phone photograph', '{}', 'published', 20),
  ('first-person-warehouse-video', 'First-person video of warehouse work', 'captured', 'Video', 'Head- and wrist-camera recordings of picking, packing and shelf stocking, made by consenting workers for robotics training.', 'Head and wrist cameras', '{}', 'published', 30),
  ('first-person-service-video', 'First-person video of service work', 'captured', 'Video', 'Hands-free recordings of kitchen work, housekeeping, laundry, cleaning and hospital portering, each confirmed by human review.', 'Head and wrist cameras', '{}', 'published', 40),
  ('transcribed-audio', 'Transcribed audio', 'labelled', 'Audio', 'Audio transcribed, timestamped and split by speaker. Native Arabic annotators cover more than 25 dialects.', '', '{"Transcription","Diarisation"}', 'published', 110),
  ('sentiment-and-entity-labels', 'Sentiment and entity labels', 'labelled', 'Text', 'Text labelled for sentiment and named entities, with human-in-the-loop quality assurance at 98% labelling accuracy.', '', '{"Sentiment","Entities"}', 'published', 120),
  ('content-moderation-labels', 'Content moderation labels', 'labelled', 'Text', 'Text reviewed and labelled against your moderation policy, in Arabic and English, with human quality assurance.', '', '{"Moderation","Policy review"}', 'published', 130),
  ('ranked-model-responses', 'Ranked model responses', 'labelled', 'Text', 'Prompts annotated and model responses ranked by people, for fine-tuning and evaluation.', '', '{"Eval ranking","Prompt annotation"}', 'published', 140),
  ('annotated-images', 'Annotated images', 'labelled', 'Image', 'Images labelled with bounding boxes and segmentation masks, with human-in-the-loop quality assurance at 98% labelling accuracy.', '', '{"Bounding boxes","Segmentation"}', 'published', 150),
  ('action-labelled-video', 'Action-labelled video', 'labelled', 'Video', 'Video labelled frame by frame with the actions it shows, including first-person recordings of real work.', '', '{"Action labels","Frame by frame"}', 'published', 160),
  ('annotated-lidar', 'Annotated LiDAR', 'labelled', '3D', 'LiDAR scans annotated for perception models, with human review before delivery.', '', '{"LiDAR","Human review"}', 'published', 170),
  ('expert-evaluation-sets', 'Expert evaluation sets', 'labelled', 'Evaluation', 'Test sets written and graded by domain experts in fields such as finance, healthcare, logistics and government.', '', '{"Domain experts","Model evaluation"}', 'published', 180)
on conflict (slug) do nothing;
