export interface FairRunde {
    id: string;
    eventName: string;
    teilnehmer: number[];
    currency: string;
}

export interface Person {
    id: string;
    name: string;
    farbAvatar?: string;
}

export interface Ausgabe {
    id: string;
    beschreibung: string;
    betrag: number;
    bezahltVon: string;
}

export interface FairRundeState {
  gruppenName: string;
  teilnahmer: Person[];
  ausgaben: Ausgabe[];
  rundenHistorie: { id: string; name: string }[]; 
}