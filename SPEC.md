# SPEC.md — Spécifications fonctionnelles AI Act Compliance SaaS

## Vision produit

Permettre à n'importe quelle PME française de se mettre en conformité avec l'AI Act sans avoir besoin d'un avocat ou d'un consultant. Comme TurboTax pour la fiscalité, mais pour la conformité IA.

---

## 1. Authentification

- Email + mot de passe (Supabase Auth)
- OAuth Google (pour les PME qui utilisent Google Workspace)
- Invitation par email (pour les comptes multi-utilisateurs)
- Onboarding guidé en 3 étapes après inscription : secteur d'activité → taille entreprise → premier inventaire IA

---

## 2. Module — Quiz d'éligibilité (GRATUIT, sans compte)

### Objectif
Porte d'entrée virale. L'utilisateur répond à 5 questions et reçoit un rapport personnalisé.

### Questions
1. Combien de salariés dans votre entreprise ?
2. Utilisez-vous des outils IA pour le recrutement ou l'évaluation de salariés ?
3. Utilisez-vous des outils de scoring client (crédit, assurance, solvabilité) ?
4. Avez-vous un chatbot ou assistant IA en contact avec vos clients ?
5. Utilisez-vous des outils de reconnaissance biométrique ou de vidéosurveillance intelligente ?

### Résultat
- Niveau de risque global : Faible / Modéré / Élevé
- Obligations applicables avec deadlines
- CTA : "Créer mon compte gratuit pour obtenir mon plan d'action"

### Technique
- Page publique `/quiz`
- Pas de base de données pour les réponses anonymes
- Email optionnel pour recevoir le rapport → lead nurturing

---

## 3. Module — Registre des systèmes IA (CORE)

### Objectif
Inventaire de tous les outils IA utilisés dans l'entreprise, avec classification automatique.

### Données par système IA

```typescript
type SystemeIA = {
  id: string;
  nom: string;                    // ex: "Salesforce Einstein"
  fournisseur: string;            // ex: "Salesforce"
  usage: string;                  // description libre
  departement: string;            // RH, Finance, Marketing, Support...
  donnees_traitees: string[];     // ["données personnelles", "données financières"...]
  decisions_autonomes: boolean;   // prend des décisions sans validation humaine ?
  niveau_risque: NiveauRisque;    // auto-calculé
  statut_conformite: Statut;      // conforme / en cours / non conforme / non évalué
  responsable_id: string;         // utilisateur responsable
  date_ajout: Date;
  date_derniere_evaluation: Date | null;
  notes: string | null;
};

type NiveauRisque = 'interdit' | 'haut_risque' | 'risque_limite' | 'risque_minimal';
type Statut = 'conforme' | 'en_cours' | 'non_conforme' | 'non_evalue';
```

### Classification automatique
Algorithme déterministe basé sur les réponses de l'utilisateur :
- Tri de CV / scoring RH → haut risque
- Scoring crédit / assurance → haut risque
- Biométrie → haut risque
- Chatbot client (pas décisionnel) → risque limité (obligation de transparence)
- Outil interne de productivité → risque minimal
- Système de notation sociale → interdit

### UI
- Table avec filtres (département, niveau de risque, statut)
- Bouton "Ajouter un système" → formulaire guidé
- Suggestions automatiques : liste des 50 outils IA les plus utilisés en France avec pre-fill

---

## 4. Module — Checklist de conformité

### Structure
Pour chaque obligation AI Act, une checklist avec statut par système IA.

**Obligations couvertes :**

| Obligation | Deadline | Qui est concerné |
|---|---|---|
| AI Literacy (formation salariés) | Déjà obligatoire (fév. 2025) | Tous les déployeurs |
| Inventaire systèmes IA | Août 2026 | Tous les déployeurs |
| Supervision humaine documentée | Août 2026 | Déployeurs haut risque |
| Notice d'information aux personnes | Août 2026 | Déployeurs haut risque |
| Rétention logs 6 mois | Août 2026 | Déployeurs haut risque |
| FRIA (évaluation impact droits fondamentaux) | Août 2026 | Certains déployeurs |
| Procédure signalement incidents | Août 2026 | Déployeurs haut risque |

### UI
- Barre de progression globale (% de conformité)
- Indicateur couleur par obligation : vert / orange / rouge
- Alertes proactives : "Il reste 120 jours avant la deadline du 2 août 2026"
- Chaque item cliquable → explication détaillée + action recommandée + lien vers doc à générer

---

## 5. Module — Générateur de documents

### Documents générables

1. **Politique d'utilisation de l'IA** (document interne)
   - Champs : nom entreprise, secteur, liste des systèmes IA, règles d'utilisation, responsables
   - Output : PDF + DOCX

2. **Notice d'information salariés** (obligation légale)
   - Informe les salariés qu'ils sont soumis à des décisions assistées par IA
   - Personnalisée par département et système IA

3. **Attestation AI Literacy**
   - Certifie qu'un salarié a reçu la formation AI Literacy obligatoire
   - Signable électroniquement

4. **Rapport de conformité**
   - Export PDF du dashboard complet
   - Pour présentation au COMEX, auditeurs, ou autorités

### Technique
- Génération PDF via templates HTML + Puppeteer (même pattern que Tarvio)
- Stockage dans bucket Supabase Storage `documents-aiact` (privé)
- Signed URLs pour le téléchargement

---

## 6. Module — AI Literacy (formation)

### Objectif
Permettre à l'entreprise de former ses salariés et garder une trace des attestations.

### Contenu
- 3 micro-modules obligatoires (15 min chacun) :
  1. "Qu'est-ce que l'AI Act et pourquoi ça me concerne ?"
  2. "Comment utiliser l'IA de manière responsable au travail ?"
  3. "Que faire si je détecte un problème avec un système IA ?"

### Fonctionnalités
- Invitation des salariés par email
- Suivi de progression par salarié
- Attestation auto-générée à la complétion
- Dashboard RH : qui a complété, qui est en retard

### Technique
- Micro-modules en React (pas de LMS externe)
- Table `ai_literacy_completions` avec `user_id`, `module_id`, `completed_at`, `score`
- Attestation PDF générée et stockée

---

## 7. Dashboard principal

### Métriques
- Score de conformité global (0-100%)
- Nombre de systèmes IA inventoriés
- Obligations complétées / en cours / en retard
- Prochaine deadline critique
- Salariés formés AI Literacy (X/Y)

### Alertes
- Deadline < 30 jours → rouge
- Deadline < 90 jours → orange
- Obligation critique non démarrée → notification email hebdo

---

## 8. Plans et abonnements

| Plan | Prix | Limites |
|---|---|---|
| Gratuit | 0€ | Quiz + rapport diagnostic uniquement |
| Starter | 99€/mois | 5 systèmes IA, registre, checklist, 1 utilisateur |
| Pro | 299€/mois | Illimité, générateur docs, AI Literacy, 5 utilisateurs |
| Expert | 599€/mois | Multi-entités, rapport audit, 20 utilisateurs, support prioritaire |

---

## 9. Roadmap

### MVP (semaines 1-8)
- [ ] Auth + onboarding
- [ ] Quiz d'éligibilité public
- [ ] Registre systèmes IA (CRUD)
- [ ] Checklist conformité
- [ ] Générateur politique IA interne
- [ ] Dashboard basique
- [ ] Stripe (Starter + Pro)
- [ ] Landing page + blog SEO

### V1.1 (semaines 9-14)
- [ ] Module AI Literacy complet
- [ ] Attestations PDF
- [ ] Notifications email (deadlines)
- [ ] Export rapport PDF
- [ ] Plan Expert + multi-entités

### V2 (mois 4-6)
- [ ] White-label pour cabinets conseil / DPO
- [ ] API pour intégrations RH (Workday, BambooHR)
- [ ] Module NIS2 (cross-sell)
- [ ] Veille réglementaire automatisée

---

## 10. Modèle de données (simplifié)

```sql
-- Entreprises
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  siren text,
  secteur text,
  taille_salaries int,
  plan text DEFAULT 'gratuit',
  created_at timestamptz DEFAULT now()
);

-- Profils utilisateurs
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  organization_id uuid REFERENCES organizations,
  role text DEFAULT 'member', -- 'owner' | 'admin' | 'member'
  nom text,
  prenom text,
  created_at timestamptz DEFAULT now()
);

-- Systèmes IA inventoriés
CREATE TABLE systemes_ia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations NOT NULL,
  nom text NOT NULL,
  fournisseur text,
  usage text,
  departement text,
  niveau_risque text NOT NULL,
  statut_conformite text DEFAULT 'non_evalue',
  decisions_autonomes boolean DEFAULT false,
  responsable_id uuid REFERENCES profiles,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Checklist conformité
CREATE TABLE checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations NOT NULL,
  systeme_id uuid REFERENCES systemes_ia,
  obligation_code text NOT NULL, -- 'ai_literacy' | 'inventaire' | 'supervision_humaine'...
  statut text DEFAULT 'non_evalue',
  notes text,
  completed_at timestamptz,
  completed_by uuid REFERENCES profiles,
  created_at timestamptz DEFAULT now()
);

-- Formations AI Literacy
CREATE TABLE ai_literacy_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations NOT NULL,
  user_id uuid REFERENCES profiles NOT NULL,
  module_id text NOT NULL,
  completed_at timestamptz,
  score int,
  attestation_url text
);

-- Documents générés
CREATE TABLE documents_generes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations NOT NULL,
  type text NOT NULL, -- 'politique_ia' | 'notice_salaries' | 'rapport_conformite'
  nom text NOT NULL,
  storage_path text NOT NULL,
  created_by uuid REFERENCES profiles,
  created_at timestamptz DEFAULT now()
);
```

---

## 11. Autorités de contrôle en France

- **CNIL** — données personnelles + IA
- **DGCCRF** — pratiques commerciales
- **ARCOM** — communication audiovisuelle

Désignation formelle encore en cours fin 2025 — surveiller l'évolution.

---

*Dernière mise à jour : 2026-03-17*
