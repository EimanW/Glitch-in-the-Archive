export interface HistoricalEvent {
  id: string;
  title: string;
  era: string;
  region: string;
  year: number;
  year_event: string;
  person: string;
  person_role: string;
  location: string;
  number: number;
  number_unit: string;
  number_desc: string;
  outcome: string;
  detail: string;
  false_person: string;
  false_location: string;
  false_outcome: string;
}

export type FactField = 'year' | 'person' | 'location' | 'number' | 'outcome' | 'detail';

export interface Sentence {
  text: string;
  field: FactField | 'flavor';
}

export interface CaseDocument {
  voice: string;
  sentences: Sentence[];
}

export interface DailyCase {
  dayIndex: number;
  caseNumber: number;
  dateISO: string;
  event: HistoricalEvent;
  documents: CaseDocument[];
  liarDoc: number;
  lieSentence: number; // index within liar doc sentences
  corruptedField: FactField;
  falseValueText: string;
  trueValueText: string;
  difficulty: number; // 0 easiest .. 6 hardest
}
