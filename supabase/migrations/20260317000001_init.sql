-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  siren text,
  secteur text,
  taille_salaries int,
  plan text NOT NULL DEFAULT 'gratuit'
    CHECK (plan IN ('gratuit', 'starter', 'pro', 'expert')),
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations ON DELETE SET NULL,
  role text NOT NULL DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'member')),
  nom text,
  prenom text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Systemes IA
CREATE TABLE IF NOT EXISTS systemes_ia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  nom text NOT NULL,
  fournisseur text,
  usage text,
  departement text,
  niveau_risque text NOT NULL DEFAULT 'risque_minimal'
    CHECK (niveau_risque IN ('interdit', 'haut_risque', 'risque_limite', 'risque_minimal')),
  statut_conformite text NOT NULL DEFAULT 'non_evalue'
    CHECK (statut_conformite IN ('conforme', 'en_cours', 'non_conforme', 'non_evalue')),
  decisions_autonomes boolean NOT NULL DEFAULT false,
  responsable_id uuid REFERENCES profiles ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Checklist items
CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  systeme_id uuid REFERENCES systemes_ia ON DELETE CASCADE,
  obligation_code text NOT NULL,
  statut text NOT NULL DEFAULT 'non_evalue'
    CHECK (statut IN ('conforme', 'en_cours', 'non_conforme', 'non_evalue')),
  notes text,
  completed_at timestamptz,
  completed_by uuid REFERENCES profiles ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- AI Literacy completions
CREATE TABLE IF NOT EXISTS ai_literacy_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  module_id text NOT NULL,
  completed_at timestamptz,
  score int CHECK (score BETWEEN 0 AND 100),
  attestation_path text,
  UNIQUE (profile_id, module_id)
);

-- Documents generés
CREATE TABLE IF NOT EXISTS documents_generes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  type text NOT NULL,
  nom text NOT NULL,
  storage_path text NOT NULL,
  created_by uuid REFERENCES profiles ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Stripe webhook events (idempotence)
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE systemes_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_literacy_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_generes ENABLE ROW LEVEL SECURITY;

-- Policies profiles
CREATE POLICY "profiles: lecture propre" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: update propre" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles: insert propre" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Helper function: get org_id du user courant
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS uuid LANGUAGE sql SECURITY DEFINER AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid()
$$;

-- Policies organizations
CREATE POLICY "organizations: membres peuvent lire" ON organizations
  FOR SELECT USING (id = get_user_org_id());
CREATE POLICY "organizations: owner peut modifier" ON organizations
  FOR UPDATE USING (id = get_user_org_id());

-- Policies systemes_ia
CREATE POLICY "systemes_ia: org members read" ON systemes_ia
  FOR SELECT USING (organization_id = get_user_org_id());
CREATE POLICY "systemes_ia: org members insert" ON systemes_ia
  FOR INSERT WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "systemes_ia: org members update" ON systemes_ia
  FOR UPDATE USING (organization_id = get_user_org_id());
CREATE POLICY "systemes_ia: org members delete" ON systemes_ia
  FOR DELETE USING (organization_id = get_user_org_id());

-- Policies checklist_items
CREATE POLICY "checklist_items: org members read" ON checklist_items
  FOR SELECT USING (organization_id = get_user_org_id());
CREATE POLICY "checklist_items: org members write" ON checklist_items
  FOR ALL USING (organization_id = get_user_org_id());

-- Policies ai_literacy
CREATE POLICY "ai_literacy: org members read" ON ai_literacy_completions
  FOR SELECT USING (organization_id = get_user_org_id());
CREATE POLICY "ai_literacy: insert propre" ON ai_literacy_completions
  FOR INSERT WITH CHECK (organization_id = get_user_org_id() AND profile_id = auth.uid());

-- Policies documents
CREATE POLICY "documents: org members read" ON documents_generes
  FOR SELECT USING (organization_id = get_user_org_id());
CREATE POLICY "documents: org members insert" ON documents_generes
  FOR INSERT WITH CHECK (organization_id = get_user_org_id());

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_systemes_ia_updated_at BEFORE UPDATE ON systemes_ia FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_checklist_updated_at BEFORE UPDATE ON checklist_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
