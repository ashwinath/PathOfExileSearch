interface SearchState {
  search: string;
}

interface SearchItemResult {
  success: boolean;
  data: PoeNinjaItem[];
}

interface SearchFormProps {
  onSearchFormChange: ((poeItems: PoeNinjaItem[]) => void);
}

interface MainState {
  poeItems: PoeNinjaItem[];
}

interface SearchItemsResultsProps {
  poeItems: PoeNinjaItem[];
}

interface SearchResultsState {
  poeItems: PoeNinjaItem[];
}

interface EsItem {
  id: string; // We use the name as the primary key.
  source: string;
}

interface PoeNinjaItem extends EsItem {
  imageUrl: string;
  name: string;
  poeTradeId?: number;
  mapTier?: number;
  levelRequired?: number;
  baseType: string;
  stackSize?: number;
  prophecyText?: string;
  sparkline?: number[];
  implicit?: string[];
  explicit?: string[];
  flavourText?: string;
  corrupted?: boolean;
  gemLevel?: number;
  gemQuality?: number;
  itemType: string;
  pay?: number;
  receive?: number;
  isCurrency: boolean;
  paySparkline?: number[];
  receiveSparkline?: number[];
  chaosValue: number;
  exaltedValue: number;
  links?: number;
}

interface NavigationState {
  isOpen: boolean;
}

interface SearchResultListProps {
  searchResultsList: SearchResultListItem[];
}

interface SearchResultListItem {
  id: string;
  name: string;
  imageUrl: string;
  chaosValue: number;
  source: string;
  links?: number;
  exaltedValue: number;
  baseType?: string;
  corrupted?: boolean;
  gemLevel?: number;
  gemQuality?: number;
}

interface MiscInformationProps {
  links?: number;
  gemLevel?: number;
  gemQuality?: number;
  source: string;
}

interface SearchResultDetailsProps {
  item?: PoeNinjaItem;
}

interface SearchResultDetailsState {
  item?: PoeNinjaItem;
}

export {
  SearchResultDetailsProps,
  SearchResultDetailsState,
  NavigationState,
  SearchResultsState,
  SearchItemsResultsProps,
  MainState,
  SearchFormProps,
  SearchItemResult,
  SearchState,
  PoeNinjaItem,
  SearchResultListProps,
  SearchResultListItem,
  MiscInformationProps,
};
