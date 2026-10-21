import { signalStore, withState, withMethods, withHooks, patchState } from "@ngrx/signals";
import { Ausgabe, FairRundeState, Person } from "../models/model";

const initialState: FairRundeState = {
  gruppenName: localStorage.getItem('gruppenName') ?? '',
  teilnahmer: JSON.parse(localStorage.getItem('teilnahmer') ?? '[]'),
  ausgaben: JSON.parse(localStorage.getItem('ausgaben') ?? '[]'),
};

export const FairRundeStore = signalStore(
    { providedIn: 'root' }, 
    withState(initialState),

    withMethods((store) => ({
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

        personEntvernen(id: string): void {
           const updated = store.teilnahmer().filter(p => p.id !== id);
           patchState(store, { teilnahmer: updated });
           localStorage.setItem('teilnahmer', JSON.stringify(updated));
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

        ausgabeEntfernen(id: string): void {
            const updated = store.ausgaben().filter(a => a.id !== id);
            patchState(store, { ausgaben: updated });
            localStorage.setItem('ausgaben', JSON.stringify(updated));
        },

        rundeZuruecksetzen(): void {
            patchState(store, { gruppenName: '', teilnahmer: [], ausgaben: [] });
            localStorage.removeItem('gruppenName');
            localStorage.removeItem('teilnahmer');
            localStorage.removeItem('ausgaben');
        }
  }))
);
