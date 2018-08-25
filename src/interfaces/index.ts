interface EsSearchResult {
  success: boolean;
  result: object;
  error?: string;
}

interface BaseResponse {
  success: boolean;
}

interface FormResponse extends BaseResponse {
  classNames: string[];
  baseTypes: string[];
}

interface SearchResponse extends BaseResponse {
  data: object;
}

interface PoeNinjaMappings {
  itemType: string;
  hasCurrencyDetails: boolean;
}

interface PoeNinjaWithCurrencyDetailsResponse {
  lines: PoeNinjaLines[];
  currencyDetails: PoeNinjaCurrencyDetails[];
}

interface PoeNinjaLines {
  currencyTypeName: string;
  pay?: CurrencyInformation;
  receive?: CurrencyInformation;
  paySparkLine?: Sparkline;
  receiveSparkLine?: Sparkline;
  chaosEquivalent: number;
}

interface Sparkline {
  data: number[];
  totalChange: number;
}

interface CurrencyInformation {
  id: number;
  league_id: number;
  pay_currency_id: number;
  get_currency_id: number;
  sample_time_utc: string
  count: number;
  value: number;
  data_point_count: number;
  includes_secondary: boolean;
}

interface PoeNinjaCurrencyDetails {
  id: string;
  icon: string;
  name: string;
  poeTradeId: number;
}

interface PoeNinjaDefaultLines {
  name?: string;
  currencyTypeName?: string;
  mapTier: number;
  levelRequired: number;
  baseType: string;
  stackSize: number;
  prophecyText?: string;
  id: number;
  icon: string;
  sparkline?: Sparkline;
  chaosValue: number;
  exaltedValue: number;
  implicitModifiers: ModifierType[];
  explicitModifiers: ModifierType[];
  flavourText: string;
  corrupted: boolean;
  gemLevel: number;
  gemQuality: number;
  itemType: string;
  links?: number;
  artFilename?: string;
}

interface ModifierType {
  text: string;
  optional: boolean;
}

interface PoeNinjaResponse {
  lines: PoeNinjaDefaultLines[];
}

interface PoeNinjaEsItem {
  name: string;
}

interface PoeNinjaLineEsItem extends PoeNinjaEsItem {
  pay: number;
  paySparkline: number[];
  receive: number;
  receiveSparkline: number[];
}

interface PoeNinjaCurrencyEsItem extends PoeNinjaEsItem {
  imageUrl: string;
}

interface PoeDefaultEsItem extends PoeNinjaEsItem {
  imageUrl: string;
  sparkLine: number[];
  chaosValue: number;
  exaltedValue: number;
}

interface EsItem {
  id?: string; // We use the name as the primary key.
  source: string;
}

interface PoeNinjaItem extends EsItem {
  imageUrl?: string;
  name?: string;
  poeTradeId?: number;
  mapTier?: number;
  levelRequired?: number;
  baseType?: string;
  stackSize?: number;
  prophecyText?: string;
  sparkline?: number[];
  implicit?: string[];
  explicit?: string[];
  flavourText?: string;
  corrupted?: boolean;
  gemLevel?: number;
  gemQuality?: number;
  itemType?: string;
  pay?: number;
  receive?: number;
  isCurrency: boolean;
  paySparkline?: number[];
  receiveSparkline?: number[];
  chaosValue?: number;
  exaltedValue?: number;
  links?: number;
  artFilename?: string;
  meta?: PoeNinjaMeta;
}

interface PoeNinjaMeta {
  mapTierString: string | null;
}

interface Etl {
  process(): void;
}

export {
  Etl,
  EsSearchResult,
  FormResponse,
  SearchResponse,
  PoeNinjaResponse,
  PoeNinjaCurrencyDetails,
  CurrencyInformation,
  Sparkline,
  PoeNinjaLines,
  PoeNinjaWithCurrencyDetailsResponse,
  PoeNinjaMappings,
  PoeNinjaLineEsItem,
  PoeNinjaItem,
  PoeNinjaEsItem,
  PoeNinjaCurrencyEsItem,
  PoeDefaultEsItem,
  EsItem,
};
