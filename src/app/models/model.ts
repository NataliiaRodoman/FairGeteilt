export interface FairRunde {
    id: number;
    eventName: string;
    teilnehmer: number[];
    currency: string;

}

export interface Person {
    id: number;
    name: string;
    farbAvatar: string;
    mailAdresse: string;
}

export interface Aufgabe {
    id: number;
    beschreibung: string;
    betrag: number;
    bezahltVon: number;
    aufgeteiltAuf: number[];
    date: string;
}