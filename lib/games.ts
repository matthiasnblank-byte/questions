import type { Game, Question } from "./types";

const yn = (id: string, question: string, correct: "yes" | "no"): Question => ({
  id,
  question,
  type: "yes_no",
  options: [
    { id: "yes", label: "Ja" },
    { id: "no", label: "Nein" }
  ],
  correctOptionId: correct,
  timeLimitSeconds: 20
});

const single = (id: string, question: string, labels: string[], correctLabel: string): Question => {
  const options = labels.map((label, index) => ({ id: `${id}-${index + 1}`, label }));
  const correct = options.find((option) => option.label === correctLabel);

  if (!correct) {
    throw new Error(`Missing correct option for ${id}`);
  }

  return {
    id,
    question,
    type: "single_choice",
    options,
    correctOptionId: correct.id,
    timeLimitSeconds: 20
  };
};

export const games: Game[] = [
  {
    id: "general-demo",
    title: "Allgemeinwissen Demo",
    description: "15 kurze Fragen für einen schnellen Funktionstest im Unterricht.",
    questions: [
      yn("g-01", "Ist Berlin die Hauptstadt von Deutschland?", "yes"),
      single("g-02", "Wie viele Bundesländer hat Deutschland?", ["12", "14", "16", "18"], "16"),
      single("g-03", "Welcher Planet ist der Sonne am nächsten?", ["Venus", "Merkur", "Mars", "Jupiter"], "Merkur"),
      yn("g-04", "Ist Wasser bei Normaldruck bei 100 °C siedend?", "yes"),
      single("g-05", "Welche Farbe entsteht aus Blau und Gelb?", ["Rot", "Grün", "Violett", "Orange"], "Grün"),
      single("g-06", "Wie viele Minuten hat eine Stunde?", ["30", "45", "60", "90"], "60"),
      yn("g-07", "Ist die Erde eine Scheibe?", "no"),
      single("g-08", "Welches Land grenzt nicht an Deutschland?", ["Frankreich", "Polen", "Spanien", "Österreich"], "Spanien"),
      single("g-09", "Wie viele Tage hat ein Schaltjahr?", ["364", "365", "366", "367"], "366"),
      yn("g-10", "Ist der Rhein ein Fluss?", "yes"),
      single("g-11", "Was ist H2O?", ["Sauerstoff", "Wasser", "Wasserstoff", "Salz"], "Wasser"),
      single("g-12", "Wie viele Kontinente gibt es üblicherweise im Schulmodell?", ["5", "6", "7", "8"], "7"),
      yn("g-13", "Ist München die Hauptstadt von Bayern?", "yes"),
      single("g-14", "Welches Tier ist ein Säugetier?", ["Hai", "Frosch", "Delfin", "Adler"], "Delfin"),
      single("g-15", "Welche Sprache wird in Brasilien hauptsächlich gesprochen?", ["Spanisch", "Portugiesisch", "Englisch", "Französisch"], "Portugiesisch")
    ]
  },
  {
    id: "accounting-demo",
    title: "Rechnungswesen Demo",
    description: "15 einfache Dummy-Fragen zu Bilanz, GuV und Grundlagen.",
    questions: [
      yn("a-01", "Gehört die Bilanz zum Jahresabschluss?", "yes"),
      single("a-02", "Was zeigt die Aktivseite der Bilanz grundsätzlich?", ["Mittelherkunft", "Mittelverwendung", "Gewinnverteilung", "Steuerlast"], "Mittelverwendung"),
      yn("a-03", "Sind Verbindlichkeiten Fremdkapital?", "yes"),
      single("a-04", "Welche Rechnung ermittelt den Periodenerfolg?", ["GuV", "Inventur", "Kassenbuch", "Anlagenverzeichnis"], "GuV"),
      yn("a-05", "Ist Eigenkapital grundsätzlich auf der Passivseite der Bilanz auszuweisen?", "yes"),
      single("a-06", "Was ist eine Abschreibung?", ["Wertminderung", "Umsatzsteigerung", "Steuerbefreiung", "Gewinnausschüttung"], "Wertminderung"),
      yn("a-07", "Gehört Bargeld zum Umlaufvermögen?", "yes"),
      single("a-08", "Was ist eine Forderung?", ["Anspruch gegen Dritte", "Schuld gegenüber Lieferanten", "Eigenkapitalanteil", "Privatentnahme"], "Anspruch gegen Dritte"),
      yn("a-09", "Ist die Inventur eine mengen- und wertmäßige Bestandsaufnahme?", "yes"),
      single("a-10", "Welche Seite der Bilanz zeigt die Kapitalherkunft?", ["Aktivseite", "Passivseite", "Anhang", "Lagebericht"], "Passivseite"),
      yn("a-11", "Sind Umsatzerlöse typischerweise Erträge?", "yes"),
      single("a-12", "Was mindert den Gewinn?", ["Aufwand", "Ertrag", "Einlage", "Forderung"], "Aufwand"),
      yn("a-13", "Ist eine Maschine typischerweise Anlagevermögen?", "yes"),
      single("a-14", "Was ist Liquidität?", ["Zahlungsfähigkeit", "Rentabilität", "Verschuldungsgrad", "Lagerbestand"], "Zahlungsfähigkeit"),
      yn("a-15", "Sind Lieferantenverbindlichkeiten Schulden gegenüber Lieferanten?", "yes")
    ]
  }
];

export function getGame(gameId: string): Game | undefined {
  return games.find((game) => game.id === gameId);
}
