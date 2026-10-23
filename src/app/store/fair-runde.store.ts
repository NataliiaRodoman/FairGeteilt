import { signalStore, withState, withMethods, withHooks, patchState, withComputed } from "@ngrx/signals";
import { Ausgabe, FairRundeState, Person } from "../models/model";
import { isPlatformBrowser } from "@angular/common";
import { computed, inject, PLATFORM_ID } from "@angular/core";

const initialState: FairRundeState = {
  gruppenName: '',
  teilnahmer: [],
  ausgaben: [],
  rundenHistorie: [] 
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
                abrechnung,
            };
    }),

    withMethods((store) => {
        const saveToLocalStorageHistory = (name: string, teilnahmer: Person[], ausgaben: Ausgabe[]) => {
            if (typeof window === 'undefined') return;

            const currentId = localStorage.getItem('fair_current_id');

            if (!currentId) return;

            const groupState = {gruppenName: name, teilnahmer, ausgaben};

            localStorage.setItem(`fair_group_${currentId}`, JSON.stringify(groupState));

            const historyList = JSON.parse(localStorage.getItem('fair_history_list') ?? '[]');
            const index = historyList.findIndex((g:any) => g.id === currentId);

            if (index !== -1) {
                historyList[index].name = name;
            } else if (name) {
                historyList.push({id : currentId, name});
            }

            localStorage.setItem('fair_history_list', JSON.stringify(historyList));
            patchState(store, { rundenHistorie: historyList});
        };

        return {
            _loadFormStorage(platformId: Object): void {
                if (isPlatformBrowser(platformId)) {
                    const historyList = JSON.parse(localStorage.getItem('fair_history_list') ?? '[]');
                    patchState(store, { rundenHistorie: historyList});

                    const currentId = localStorage.getItem('fair_current_id');
                    if (currentId) {
                        const saved = JSON.parse(localStorage.getItem(`fair_group_${currentId}`) ?? 'null');
                        if (saved) {
                            patchState(store, {
                                gruppenName: saved.gruppenName,
                                teilnahmer: saved.teilnahmer,
                                ausgaben:saved.ausgaben
                            });
                        }
                    }
                };
            },
      
            neueRundeStarten(name: string): boolean {
                const nameTrimmed = name.trim();
                const historyList = JSON.parse(localStorage.getItem('fair_history_list') ?? '[]');
                const nameExistiert = historyList.some((g: any) => g.name.toLowerCase() === nameTrimmed.toLowerCase());
                
                if (nameExistiert) {
                    alert('Eine Gruppe mit diesem Namen existiert bereits!');
                    return false;
                }

                const neueId = crypto.randomUUID();
                localStorage.setItem('fair_current_id', neueId);

                patchState(store, { gruppenName: nameTrimmed, teilnahmer: [], ausgaben: [] });
                saveToLocalStorageHistory(nameTrimmed, [], []);
                return true;
            },

            alteRundeLoeschen(id: string): void {
                if (confirm('Möchtest du diese Runde wirklich löschen?')) {
                    if (typeof window === 'undefined') return;
                    
                    localStorage.removeItem(`fair_group_${id}`);

                    const historyList = JSON.parse(localStorage.getItem('fair_history_list') ?? '[]');
                    const updatedHistory = historyList.filter((g: any) => g.id !== id);
                   
                    localStorage.setItem('fair_history_list', JSON.stringify(updatedHistory));
                    patchState(store, { rundenHistorie: updatedHistory });
                    
                    const currentActiveId = localStorage.getItem('fair_current_id');
                    
                    if (currentActiveId === id) {
                        localStorage.removeItem('fair_current_id');
                        patchState(store, { gruppenName: '', teilnahmer: [], ausgaben: [] });
                    }
                }
            },

            alteRundeLaden(id: string): void {
                localStorage.setItem('fair_current_id', id);
                const saved = JSON.parse(localStorage.getItem(`fair_group_${id}`) ?? 'null');
                if (saved) {
                    patchState(store, { 
                        gruppenName: saved.gruppenName, 
                        teilnahmer: saved.teilnahmer, 
                        ausgaben: saved.ausgaben 
                    });
                }
            },

            updateGruppenName(name: string): void{
                patchState(store, {gruppenName: name});
                saveToLocalStorageHistory(name, store.teilnahmer(), store.ausgaben());
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
                saveToLocalStorageHistory(store.gruppenName(), updated, store.ausgaben());
            },

            entfernenById(key: 'teilnahmer' | 'ausgaben', id: string): void {
                const currentArray = store[key]() as any[];
                const updated = currentArray.filter(item => item.id !== id);
                
                patchState(store, { [key]: updated });

                const nextTeilnehmer = key === 'teilnahmer' ? updated : store.teilnahmer();
                const nextAusgaben = key === 'ausgaben' ? updated : store.ausgaben();
                saveToLocalStorageHistory(store.gruppenName(), nextTeilnehmer, nextAusgaben);
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
                saveToLocalStorageHistory(store.gruppenName(), store.teilnahmer(), updated);
            },


            rundeZuruecksetzen(): void {
                patchState(store, { gruppenName: '', teilnahmer: [], ausgaben: [] });
                localStorage.removeItem('fair_current_id');
            }
        };
    }),

    withHooks({
        onInit(store){
            const platformId = inject(PLATFORM_ID);
            store._loadFormStorage(platformId);
        }
    })
);
