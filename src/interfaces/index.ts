interface SearchItemRequest {
  className?: string;
  baseItem?: string;
  implicitStatText?: string;
  explicitStatText?: string;
  requiredLevel?: number;
}

interface EsPoeItem {
  name: string;
  className: string;
  baseItem: string;
  implicitStatText: string;
  explicitStatText: string;
  dropLevel: number;
  dropLevelMaximum: number;
  requiredDexterity: number
  requiredIntelligence: number;
  requiredLevel: number;
  requiredLevelBase: number;
  requiredStrength: number;
}

interface EsSearchResult {
  success: boolean;
  result: EsPoeItem[];
  error?: string;
}

export {
  EsPoeItem,
  EsSearchResult,
  SearchItemRequest,
};
