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
  poeNinja?: ServerPoeNinjaResponse;
}

interface ServerPoeNinjaResponse {
  chaosValue?: string;
  exaltedValue?: string;
  imageUrl: string;
  name: string;
  sparkLine?: number[];
  receive?: number;
  receiveSparkLine?: number[];
  pay?: number;
  paySparkLine?: number[];
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
  paySparkLine: SparkLine;
  receiveSparkLine: SparkLine;
}

interface SparkLine {
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
  id: number;
  icon: string;
  name: string;
  poeTradeId: number;
}

interface PoeNinjaDefaultLines {
  name?: string;
  currencyTypeName?: string;
  id: number;
  icon: string;
  sparkline?: SparkLine;
  chaosValue: number;
  exaltedValue: number;
}

interface PoeNinjaResponse {
  lines: PoeNinjaDefaultLines[];
}

interface PoeNinjaEsItem {
  name: string;
}

interface PoeNinjaLineEsItem extends PoeNinjaEsItem {
  pay: number;
  paySparkLine: number[];
  receive: number;
  receiveSparkLine: number[];
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

export {
  EsPoeItem,
  EsSearchResult,
  SearchItemRequest,
  FormResponse,
  SearchResponse,
  PoeNinjaResponse,
  PoeNinjaCurrencyDetails,
  CurrencyInformation,
  SparkLine,
  PoeNinjaLines,
  PoeNinjaWithCurrencyDetailsResponse,
  PoeNinjaMappings,
  PoeNinjaLineEsItem,
  PoeNinjaEsItem,
  PoeNinjaCurrencyEsItem,
  PoeDefaultEsItem,
};
