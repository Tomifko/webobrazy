export interface Obraz {
  id: string;
  nazov: string;
  popis: string | null;
  cena: number;
  url_obrazka: string;
  rozmery: string | null;
  technika: string | null;
  rok: number | null;
  dostupny: boolean;
  created_at: string;
}

export interface ObjednavkaPolozka {
  obraz: Obraz;
  mnozstvo: number;
}