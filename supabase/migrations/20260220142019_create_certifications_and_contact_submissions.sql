--
-- Create certifications table and contact_submissions table
--
-- 1. New Tables:
--    - certifications: stores professional certificates (name, issuer, date, credential_id, url, modules, skills)
--    - contact_submissions: persists contact form messages for record-keeping
-- 2. Security:
--    - RLS enabled on both tables
--    - certifications: public read, admin write
--    - contact_submissions: admin read, anon insert (for public contact form)
--

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text NOT NULL,
  issued_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  description text,
  modules text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'planned')),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certifications"
  ON certifications FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert certifications"
  ON certifications FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update certifications"
  ON certifications FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete certifications"
  ON certifications FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON certifications
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
