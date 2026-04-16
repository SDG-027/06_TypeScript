// ─── Arrays ───────────────────────────────────────────────────────────────────

// TypeScript kann den Typ eines Arrays automatisch erkennen (Typ-Inferenz).
// Mit der Syntax `string[]` legen wir explizit fest: dieses Array darf nur Strings enthalten.
const myArray: string[] = ['hi', 'Hello', 'bonjour'];

// Mit einer Union `(string | number)[]` erlauben wir sowohl Strings als auch Numbers im Array.
const myNumStrArr: (string | number)[] = ['hi', 'Hello', 'bonjour'];

// Fehler! myArray ist `string[]` – eine Zahl ist hier nicht erlaubt.
myArray.push(42);

// Kein Fehler – myNumStrArr akzeptiert auch Numbers.
myNumStrArr.push(123);

// TypeScript erkennt den Typ automatisch: boolean[]
const boolArr = [true, true, false];

const ananas = 'Ananas';

// `as const` macht das Array zu einem "Readonly Tuple" mit festen Literal-Typen.
// TypeScript merkt sich die genauen Werte (z. B. 'Apfel'), nicht nur den Typ (string).
const fruits = ['Blaubeere', 'Apfel', 'Pfirsich', 'Guave', 'Ananas'] as const;

// Fehler! Ein `as const`-Array ist unveränderlich – keine Zuweisung möglich.
// fruits[1] = 'Mango';

// Array-Destructuring: Wir überspringen die ersten beiden Einträge mit Leerstellen (,),
// und greifen direkt auf den dritten und vierten Wert zu.
// Wegen 'as const' weiß TypeScript auch, dass die Werte "Pfirsich" und "Guave" sind.
const [, , pfirsich, guave] = fruits;

console.log(pfirsich);

// ─── Tupel ────────────────────────────────────────────────────────────────────

// Ein Tupel ist ein Array mit einer festen Anzahl von Elementen und festgelegten Typen
// an jeder Position. Hier: genau zwei Numbers – z. B. Breiten- und Längengrad.
const coordinates: [number, number] = [52, 13];

// useState in React gibt ebenfalls ein Tupel zurück: [Wert, Setter-Funktion]
// const [count, setCount] = useState(1)

// Mit einem Type Alias geben wir dem Tupel-Typ einen wiederverwendbaren Namen.
type Coordinates = [number, number];

const myCoordinates: Coordinates = [50, 10];

// Type Aliases funktionieren auch für primitive Typen – hier nur zur Demonstration.
type myString = string;

// ─── Type Aliases für Objekte ─────────────────────────────────────────────────

// `type Person` beschreibt die Form eines Objekts.
// `readonly` verhindert, dass ein Feld nach der Erstellung verändert werden kann.
// Das `?` bei `location` macht das Feld optional – es muss nicht angegeben werden.
type Person = {
  readonly id: number;
  readonly name: string;
  age: number;
  location?: string;
};

const person: Person = {
  id: 13,
  name: 'Guybrush',
  age: 28,
  location: 'Melee Island',
};

// `location` fehlt hier – das ist erlaubt, weil es mit `?` als optional markiert ist.
const person2: Person = {
  id: 12,
  name: 'Whorf',
  age: 40,
};

// Erlaubt: `age` ist nicht readonly.
person.age = 29;
// Fehler: `treasure` ist nicht Member des Typs Person, darf also nicht zugewiesen werden.
person.treasure = 'Big Whoop';

// Fehler: `name` ist readonly in `Person` – darf nicht überschrieben werden.
person2.name = 'Commander Whorf';

// `as const` auf einem Objekt macht alle Felder automatisch readonly und gibt ihnen Literal-Typen.
// TypeScript merkt sich z. B. `id: 25` statt nur `id: number`.
const person3 = {
  id: 25,
  name: 'Data',
  age: 123,
  positronic: true,
} as const;

const personArr: Person[] = []; // Ein Array von Person(s)

personArr.push(person);
// Fehler: Ein String ist kein Person-Objekt.
personArr.push('wort');
// Fehler: Das Objekt hat die falsche Form – `bla` ist kein Feld in `Person`.
personArr.push({ bla: 'test' });

personArr.push(person2);

// Funktioniert dank "Duck Typing": person3 hat alle Pflichtfelder von `Person`
// (id, name, age) – TypeScript akzeptiert es, auch wenn es zusätzliche Felder hat.
personArr.push(person3);

// ─── Unions in Type Aliases ───────────────────────────────────────────────────

type UserSettings = {
  theme: string;
  // Union aus String-Literals: nur diese vier Werte sind erlaubt.
  language: 'de' | 'en' | 'fr' | 'es';
};

// ─── Intersection Types mit `&` ───────────────────────────────────────────────

// DBEntry enthält Felder, die alle Datenbankeinträge gemeinsam haben.
type DBEntry = {
  _id: string;
  __v: string;
  createdAt: string;
};

// `&` kombiniert zwei Typen: `User` hat alle Felder von `DBEntry` UND die eigenen Felder.
// Das ist eine Alternative zur Vererbung – TypeScript nennt das "Intersection".
type User = DBEntry & {
  name: string;
  email: string;
  settings: UserSettings;
};

type Post = DBEntry & {
  body: string;
  title: string;
  slug: string;
};

// TypeScript hilft, Objecte richtig zu tippen. Die Autovervollständigung gibt uns Hinweise auf fehlende Felder.
const user: User = {
  settings: { language: 'en' },
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

// Interfaces funktionieren ähnlich wie Type Aliases für Objekte.
interface DBEntryInterface {
  _id: string;
  __v: string;
  createdAt: string;
}

interface UserSettingsInterface {
  theme: string;
  language: 'de' | 'en' | 'fr' | 'es';
}

// `extends` bei Interfaces entspricht `&` bei Type Aliases: Felder werden "geerbt".
interface UserInterface extends DBEntryInterface {
  settings: UserSettingsInterface;
  username: string;
  email: string;
}

// Interface Merging: Ein Interface kann an mehreren Stellen deklariert werden.
// TypeScript fügt die Felder automatisch zusammen. Das ist bei Type Aliases NICHT möglich.
interface UserSettingsInterface {
  lastDevice: string;
}

// ─── Literal Types & switch ───────────────────────────────────────────────────

// `Quantity` ist ein Union aus drei konkreten Zahlenwerten.
// Nur genau diese drei Werte sind als `Quantity` erlaubt.
type Quantity = 50 | 100 | 150;

const num: Quantity = 150;

function handleQuantity(quant: Quantity) {
  // Da TypeScript weiß, dass `quant` nur 50, 100 oder 150 sein kann,
  // erkennt es alle möglichen Fälle. Der `default`-Zweig ist hier nie erreichbar.
  switch (quant) {
    case 50:
      console.log('low');
      return;
    case 100:
      console.log('medium', quant);
      break;
    case 150:
      console.log('high');
      break;
    default:
      // TypeScript leitet hier den Typ `never` ab – dieser Zweig ist unerreichbar.
      console.log('Wert nie erreichbar', quant);
  }
}

handleQuantity(50);

// ─── Funktionstypen ───────────────────────────────────────────────────────────

// Ein Type Alias für eine Funktion: nimmt zwei Numbers, gibt eine Number zurück.
// Der Pfeil `=>` hier beschreibt den Rückgabetyp, nicht eine Arrow Function.
type Calculation = (a: number, b: number) => number;

// TypeScript kennt die Typen der Parameter bereits aus dem Alias –
// wir müssen sie in der Arrow Function nicht nochmal angeben.
const add: Calculation = (a, b) => a + b;

// Funktion mit gleicher Signatur, aber anderer Operation/Logik
const multiply: Calculation = (num1, num2) => {
  return num1 * num2;
};
