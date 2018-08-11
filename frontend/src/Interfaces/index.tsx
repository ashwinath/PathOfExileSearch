interface SearchState {
  data: FormData
  selectedClassName: string;
  userInput: UserInput;
}

interface UserInput {
  className: string;
  baseItem: string;
  implicitStatText: string;
  explicitStatText: string;
  requiredLevel: string;
}

interface FormData {
  classNames: string[];
  baseItems: string[];
}

interface PoeItem {
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

interface SearchItemResult {
  success: boolean;
  data: PoeItem[];
}

interface SearchFormProps {
  onSearchFormChange: ((poeItems: PoeItem[]) => void);
}

export {
  SearchState,
  UserInput,
  FormData,
  PoeItem,
  SearchItemResult,
  SearchFormProps,
};
