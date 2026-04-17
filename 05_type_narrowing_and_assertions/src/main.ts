type MessageObj = {
  message: string;
};

// Ein Union Type: value kann entweder ein einfacher string oder ein Objekt mit message-Property sein
function alertUser(value: string | MessageObj) {
  // Type Narrowing mit typeof: TS erkennt durch die Bedingung, welcher Typ im jeweiligen Zweig gilt
  if (typeof value === 'string') {
    // Hier weiß TS sicher: value ist string
    value.split('');
  } else {
    // Hier weiß TS sicher: value ist MessageObj
    value.message.split('');
  }
}

// str ist optional (string | undefined) — das ? macht den Parameter optional
function printLength(str?: string) {
  // Narrowing durch expliziten undefined-Check
  if (str !== undefined) {
    str.split(''); // Hier ist str garantiert string
  }

  // Optional Chaining (?.) als Alternative: ruft split() nur auf, wenn str nicht undefined ist
  str?.split('');
}

// Wenn x und y den gleichen Typ haben könnten (beide string), narrowt TS auf string
function compare(x: string | number, y: string | boolean) {
  if (x === y) {
    // TS erkennt: wenn x === y gilt, muss x string sein (der einzige gemeinsame Typ)
    x.split('');
  }
}

// ─── Discriminated Union ───────────────────────────────────────────────────
// Die 'kind'-Property ist der "Discriminant" — ein eindeutiger Marker pro Typ
type Cat = {
  kind: 'cat'; // Literal Type als eindeutiger Bezeichner
  name: string;
  age: number;
  meow: () => void;
};

type Dog = {
  kind: 'dog';
  name: string;
  age: number;
  bark: (times: number) => void;
  favouritePlace: string;
};

// Pet ist die Union beider Typen
type Pet = Cat | Dog;

// Type Predicate: Funktion gibt an, welcher Typ das Argument hat
function isCat(pet: Pet) {
  // TS inferiert Rückgabe als  pet is Cat (funktioniert nur, wenn wir Rückgabe nicht als boolean explizit typisieren!)
  return pet.kind === 'cat';
}

function makeNoise(pet: Pet) {
  // Narrowing mit 'in'-Operator: prüft, ob die Property 'bark' im Objekt existiert
  if ('bark' in pet) {
    pet.bark(3); // TS weiß hier: pet ist Dog
  }

  // Type predicate in Aktion
  if (isCat(pet)) {
    pet.meow(); // TS weiß: pet is Cat
  }
}

// ─── Error Handling & instanceof ──────────────────────────────────────────
function handleError() {
  try {
    if (Math.random() > 0.5) {
      throw new Error('Test', { cause: 'ALL_WENT_WRONG!' });
    } else {
      throw new TypeError('TypeError');
    }
  } catch (err) {
    // instanceof narrowt den catch-Block: err ist hier guaranteed ein TypeError
    if (err instanceof TypeError) {
      console.log(err.message);
    }

    if (err instanceof Error) {
      console.log(err.cause); // .cause ist die optionale Zusatzinfo aus dem Error-Konstruktor
    }
  }
}

// ─── querySelector & strictNullChecks ─────────────────────────────────────
// TS kennt HTMLElementTagNameMap und inferiert daraus direkt HTMLDialogElement
// Mit strict: true (Default in TS 6) ist der Typ HTMLDialogElement | null
const containerEl = document.querySelector('dialog');

// Ohne Null-Check würde TS hier einen Fehler werfen (Object is possibly 'null')
containerEl!.textContent = 'Hi'; // ! ist die non.null-Assertion - wir teilen TypeScript mit, dass containerEl exisitert
containerEl?.showModal(); // Optional Chaining als sichere Variante

// ─── Type Assertions ──────────────────────────────────────────────────────
type journalEntry = {
  id: string;
  url: string;
  title: string;
};

function getFromLocalStorage(key: string) {
  const localData = localStorage.getItem(key);

  // JSON.parse() gibt 'any' zurück — wir weisen TS an, den Typ als journalEntry[] zu behandeln.
  // Alternative: 'as journalEntry[]' (Type Assertion). Beide Varianten sind gleichwertig.
  // Achtung: TS vertraut uns hier blind — keine Laufzeit-Validierung!
  // const data = JSON.parse(localDataStr) as journalEntry[];
  const data: journalEntry[] = JSON.parse(localData);

  data[0].title.split('');
}

// ─── Fetch & generische Typisierung ───────────────────────────────────────
type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

async function fetchPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  // res.json() gibt Promise<any> zurück — wir geben TS den Hinweis, was wir erwarten
  const data: Post[] = await res.json();

  data.forEach((post) => console.log(post.userId));
}

// ─── Enums ────────────────────────────────────────────────────────────────
// Ein Enum fasst zusammengehörige Konstanten unter einem Namen zusammen
// Ist zugleich TS Type und Laufzeit (JS) Wert.
enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

function moveTo(dir: Direction) {
  // String-Vergleich funktioniert, aber besser Direction.UP statt 'up' verwenden
  if (dir === 'up') console.log('Up');
  // Der bevorzugte Weg: über den Enum-Namen referenzieren
  if (dir === Direction.DOWN) console.log('Down');
}

moveTo(Direction.DOWN);
moveTo(Direction.LEFT);

// ─── Enum-Alternative: const object + keyof typeof ───────────────────────
// 'as const' friert alle Werte ein — TS inferiert Literal Types statt string
const DirectionsMap = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
} as const;

// typeof DirectionsMap gibt den Typ des Objekts zurück
type DirectionsType = typeof DirectionsMap;

// keyof holt alle Keys als Union Type: 'up' | 'down' | 'left' | 'right'
// type Directions = keyof DirectionsType  // ← gleichwertig zur Zeile darunter
type Directions = 'up' | 'down' | 'left' | 'right';

// Diese Funktion akzeptiert nur die vier erlaubten Strings — ohne echten Enum-Typ
function moveTo2(dir: Directions) {
  if (dir === 'down') console.log('moving down');
}

moveTo2('down');
