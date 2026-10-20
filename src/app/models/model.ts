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
    mailAdresse?: string;
}

export interface Ausgabe {
    id: string;
    beschreibung: string;
    betrag: number;
    bezahltVon: string;
}