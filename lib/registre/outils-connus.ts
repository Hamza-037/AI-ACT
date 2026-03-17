export type OutilConnu = {
  nom: string
  fournisseur: string
  categorie: string
  niveau_risque_indicatif: string
}

export const OUTILS_CONNUS: OutilConnu[] = [
  {
    nom: 'Salesforce Einstein',
    fournisseur: 'Salesforce',
    categorie: 'CRM / Scoring',
    niveau_risque_indicatif: 'haut_risque',
  },
  {
    nom: 'HubSpot AI',
    fournisseur: 'HubSpot',
    categorie: 'CRM / Marketing',
    niveau_risque_indicatif: 'risque_limite',
  },
  {
    nom: 'Microsoft Copilot',
    fournisseur: 'Microsoft',
    categorie: 'Productivité',
    niveau_risque_indicatif: 'risque_limite',
  },
  {
    nom: 'GitHub Copilot',
    fournisseur: 'Microsoft/GitHub',
    categorie: 'Développement',
    niveau_risque_indicatif: 'risque_minimal',
  },
  {
    nom: 'ChatGPT Enterprise',
    fournisseur: 'OpenAI',
    categorie: 'Assistant IA',
    niveau_risque_indicatif: 'risque_limite',
  },
  {
    nom: 'Gemini Workspace',
    fournisseur: 'Google',
    categorie: 'Productivité',
    niveau_risque_indicatif: 'risque_limite',
  },
  {
    nom: 'Workday Recruiting',
    fournisseur: 'Workday',
    categorie: 'RH / Recrutement',
    niveau_risque_indicatif: 'haut_risque',
  },
  {
    nom: 'Eightfold AI',
    fournisseur: 'Eightfold',
    categorie: 'RH / Recrutement',
    niveau_risque_indicatif: 'haut_risque',
  },
  {
    nom: 'Zendesk AI',
    fournisseur: 'Zendesk',
    categorie: 'Support client',
    niveau_risque_indicatif: 'risque_limite',
  },
  {
    nom: 'Intercom Fin',
    fournisseur: 'Intercom',
    categorie: 'Support client',
    niveau_risque_indicatif: 'risque_limite',
  },
  {
    nom: 'Notion AI',
    fournisseur: 'Notion',
    categorie: 'Productivité',
    niveau_risque_indicatif: 'risque_minimal',
  },
  {
    nom: 'Grammarly Business',
    fournisseur: 'Grammarly',
    categorie: 'Rédaction',
    niveau_risque_indicatif: 'risque_minimal',
  },
]
