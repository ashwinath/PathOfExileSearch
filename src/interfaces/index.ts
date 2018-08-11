interface SearchItemRequest {
  name?: string;
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
  dropLevel: number;
  dropLevelMaximum: number;
  requiredDexterity: number
  requiredIntelligence: number;
  requiredLevel: number;
  requiredLevelBase: number;
  requiredStrength: number;
  mods: string[];
  id: string;
}

interface EsSearchResult {
  success: boolean;
  result: EsPoeItem[];
  error?: string;
}

interface BaseResponse {
  success: boolean;
}

interface FormResponse extends BaseResponse {
  classNames: string[];
  baseItems: string[];
}

interface SearchResponse extends BaseResponse {
  data: EsPoeItem[];
}

export {
  EsPoeItem,
  EsSearchResult,
  SearchItemRequest,
  FormResponse,
  SearchResponse,
};
