// TypeScript kann den Typ einer Variable automatisch aus dem zugewiesenen Wert ableiten — das nennt sich "Type Inference".
// Hier erkennt TypeScript: myNumber ist eine 'number', weil wir 13 zuweisen.
let myNumber = 13;

// Diese Zeile wäre ein Fehler! TypeScript erlaubt es nicht, einer number-Variable
// einen string zuzuweisen — das ist einer der Hauptvorteile von TypeScript.
// myNumber = "Hello"
//
// TypeScript leitet auch hier den Typ ab: myString ist automatisch ein 'string'.
let myString = 'Hallo, Welt';

// Genauso: myBool bekommt automatisch den Typ 'boolean'.
let myBool = true;

// 'const' bedeutet, der Wert kann nie neu zugewiesen werden.
// TypeScript merkt sich hier sogar den genauen Wert 42 als "literal type" — noch präziser als nur 'number'.
const myFavNumber = 42;

// Explizite Typisierung: Wir sagen TypeScript direkt, welchen Typ myVal haben soll — auch ohne sofortigen Wert.
// Die Variable ist zunächst 'undefined', bekommt aber garantiert später einen string.
let myVal: string;

if (true) {
  myVal = 'Test';
}

console.log(myVal, myNumber, myBool, myString, myFavNumber);

// Explizite Typisierung bei Funktionsparametern: 'name' muss ein string sein.
// TypeScript prüft das beim Aufruf — falsche Typen führen sofort zu einem Fehler.
function greet(name: string) {
  return `Hello, ${name}`;
}

console.log(greet('Behzad'));
// Diese Aufrufe würden Fehler erzeugen — TypeScript lässt keine number oder ein Objekt als 'name' zu:
// console.log(greet(42));
// console.log(greet({ test: 32 }));

// Pfeilfunktion mit explizitem Parametertyp — funktioniert genauso wie bei normalen Funktionen.
// TypeScript inferiert hier `void` als Rückgabetyp, da die Funktion nur einen Side-Effekt auslöst.
const myPrint = (content: string) => console.log(content);

myPrint('123');

// Das '?' hinter 'userId' macht den Parameter optional — er kann übergeben werden, muss aber nicht.
// Ohne '?' würde TypeScript einen Fehler werfen, wenn man den Parameter weglässt.
function logMessage(message: string, userId?: number) {
  console.log(`${message} ${userId ? 'from:' + userId : ''}`);
}

logMessage('Dies ist eine Nachricht', 2);
logMessage('Das ist eine andere Nachricht!'); // Funktioniert, weil userId optional ist

// Expliziter Rückgabetyp mit ': string' nach den Parametern.
// TypeScript prüft, ob der Rückgabewert auch wirklich ein string ist.
// Das auskommentierte 'return a + b' wäre ein Fehler, da es eine number zurückgibt!
const add = (a: number, b: number): string => {
  // return a + b;   // ❌ Fehler: gibt number zurück, nicht string
  return (a + b).toString(); // ✅ .toString() konvertiert das Ergebnis in einen string
};

// Gleiches Prinzip bei normaler Funktionsdeklaration: Rückgabetyp explizit angegeben.
function multiply(a: number, b: number): string {
  return (a * b).toString();
}
