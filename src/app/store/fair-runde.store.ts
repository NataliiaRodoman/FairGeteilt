import { signalStore, withState, withMethods, withHooks, patchState, withComputed } from "@ngrx/signals";
import { FairRundeState } from "../models/model";
import { isPlatformBrowser } from "@angular/common";
import { computed, inject, PLATFORM_ID } from "@angular/core";

const initialState: FairRundeState = {
  gruppenName: '',
  teilnahmer: [],
  ausgaben: [],
};

export const FairRundeStore = signalStore(
    { providedIn: 'root' }, 

    withState(initialState),

    withComputed((store) => {
        const nameVon = (id: string): string => {
            const person = store.teilnahmer().find((p)=> p.id === id);

            return person ? person.name : 'Unbekannt';
        }

        const gesamt = computed(() => {
            const cent = store.ausgaben().reduce(
                (summe,ausgabe) => summe + Math.round(Number(ausgabe.betrag)*100),
                0,
            );
            return cent / 100;
        });

        const anteilProPerson = computed(() => {
            return store.teilnahmer().length > 0
                ? gesamt() / store.teilnahmer().length
                : 0;
        });

        const abrechnung = computed(() => {
            const anzahl = store.teilnahmer().length;

            if (anzahl < 2 || store.ausgaben().length === 0){
                return [];
            };
            
            const gesamtCent = store.ausgaben().reduce(
                (summe,ausgabe) => summe + Math.round(Number(ausgabe.betrag)*100),
                0,
            );

            const grundAnteil=Math.floor(gesamtCent/anzahl);
            const restCent = gesamtCent % anzahl;
            const salden = new Map<string,number>();

            store.teilnahmer().forEach((person,index) => {
                const anteil = grundAnteil + (index < restCent ? 1:0);

                salden.set(person.id,-anteil);
            })

            for (const ausgabe of store.ausgaben()) {
                const payer = salden.get(ausgabe.bezahltVon);

                if (payer === undefined) continue;
                const betragCent = Math.round(Number(ausgabe.betrag)*100);

                salden.set(ausgabe.bezahltVon, payer + betragCent);
            }

            const schuldner = [...salden.entries()]
                .filter(([,saldo])=> saldo < 0)
                .map(([id,saldo]) =>({id, cent: -saldo}));

            const glaeubiger = [...salden.entries()]
                .filter(([,saldo])=> saldo > 0)
                .map(([id,saldo]) =>({id, cent:  saldo}));

            const ergebnis: { von: string, an:string, bertrag: number}[] = [];
                
            let i=0;
            let j=0;

            while (i < schuldner.length && j < glaeubiger.length) {
                const cent = Math.min(schuldner[i].cent, glaeubiger[j].cent);

                if (cent>0) {
                    ergebnis.push({
                        von: nameVon(schuldner[i].id),
                        an: nameVon(glaeubiger[j].id),
                        bertrag: cent / 100,
                    });
                }

                schuldner[i].cent -= cent;
                glaeubiger[j].cent -= cent;

                if (schuldner[i].cent === 0) i++;
                if (glaeubiger[j].cent === 0) j++;
                }
                return ergebnis;
            });

            return {
                gesamt, 
                anteilProPerson, 
                abrechnung
            };
    }),

    withMethods((store) => ({
        _loadFormStorage(platformId: Object): void {
            if (isPlatformBrowser(platformId)) {
                const gruppenName = localStorage.getItem('gruppenName') ?? '';
                const teilnahmer = JSON.parse(localStorage.getItem('teilnahmer') ?? '[]');
                const ausgaben = JSON.parse(localStorage.getItem('ausgaben') ?? '[]');

                patchState(store, {gruppenName, teilnahmer,ausgaben});
            };
        },

        updateGruppenName(name: string): void{
            patchState(store, {gruppenName: name});
            localStorage.setItem('gruppenName',name);
        },

        personHinzufuegen(name: string): void {
            const current = store.teilnahmer();
            const bereitsVorhanden = current.some(p => p.name.toLowerCase() === name.toLowerCase());

            if (bereitsVorhanden) return;

            const farbIndex = current.length % 5;
            const updated = [
                ...current,
                {
                id: crypto.randomUUID(),
                name,
                farbAvatar: `color-${farbIndex}`
                }
            ];
            
            patchState(store, { teilnahmer: updated });
            localStorage.setItem('teilnahmer', JSON.stringify(updated));
        },

        entfernenById(key: 'teilnahmer' | 'ausgaben', id: string): void {
           const currentArray = store[key]() as any[];
           const updated = currentArray.filter(item => item.id !== id);

           patchState(store, { [key]: updated });
           localStorage.setItem(key, JSON.stringify(updated));
        },

        ausgabeHinzufuegen(beschreibung: string, betrag: number, bezahltVon: string): void {
            const updated = [
                ...store.ausgaben(),
                {
                id: crypto.randomUUID(),
                beschreibung,
                betrag,
                bezahltVon
                }
            ];

            patchState(store, { ausgaben: updated });
            localStorage.setItem('ausgaben', JSON.stringify(updated));
        },

        rundeZuruecksetzen(): void {
            patchState(store, { gruppenName: '', teilnahmer: [], ausgaben: [] });

            localStorage.removeItem('gruppenName');
            localStorage.removeItem('teilnahmer');
            localStorage.removeItem('ausgaben');
        }
    })),

    withHooks({
        onInit(store){
            const platformId = inject(PLATFORM_ID);
            store._loadFormStorage(platformId);
        }
    })
);
