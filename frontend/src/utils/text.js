const bad = '\\uFFFD';
const mojibakePattern = new RegExp('[\\u00c3\\u00c2\\u00e2\\u00f0\\uFFFD\\u00ef]', 'g');
const latin1MojibakePattern = new RegExp('[\\u00c3\\u00c2\\u00e2\\u00f0]');

const replacementFixes = [
  [new RegExp(`Cafeter${bad}a`, 'g'), 'Cafetería'],
  [new RegExp(`cafeter${bad}a`, 'g'), 'cafetería'],
  [new RegExp(`Caf${bad}`, 'g'), 'Café'],
  [new RegExp(`caf${bad}`, 'g'), 'café'],
  [new RegExp(`Panader${bad}a`, 'g'), 'Panadería'],
  [new RegExp(`panader${bad}a`, 'g'), 'panadería'],
  [new RegExp(`Direcci${bad}n`, 'g'), 'Dirección'],
  [new RegExp(`direcci${bad}n`, 'g'), 'dirección'],
  [new RegExp(`Tel${bad}fono`, 'g'), 'Teléfono'],
  [new RegExp(`tel${bad}fono`, 'g'), 'teléfono'],
  [new RegExp(`Informaci${bad}n`, 'g'), 'Información'],
  [new RegExp(`informaci${bad}n`, 'g'), 'información'],
  [new RegExp(`Categor${bad}a`, 'g'), 'Categoría'],
  [new RegExp(`categor${bad}a`, 'g'), 'categoría'],
  [new RegExp(`Rese${bad}as`, 'g'), 'Reseñas'],
  [new RegExp(`rese${bad}as`, 'g'), 'reseñas'],
  [new RegExp(`Rese${bad}a`, 'g'), 'Reseña'],
  [new RegExp(`rese${bad}a`, 'g'), 'reseña'],
  [new RegExp(`a${bad}n`, 'g'), 'aún'],
  [new RegExp(`A${bad}n`, 'g'), 'Aún'],
  [new RegExp(`d${bad}as`, 'g'), 'días'],
  [new RegExp(`D${bad}as`, 'g'), 'Días'],
  [new RegExp(`m${bad}vil`, 'g'), 'móvil'],
  [new RegExp(`M${bad}vil`, 'g'), 'Móvil'],
  [new RegExp(`r${bad}pida`, 'g'), 'rápida'],
  [new RegExp(`r${bad}pido`, 'g'), 'rápido'],
  [new RegExp(`b${bad}sico`, 'g'), 'básico'],
  [new RegExp(`B${bad}sico`, 'g'), 'Básico'],
  [new RegExp(`${bad}til`, 'g'), 'útil'],
  [new RegExp(`${bad}tiles`, 'g'), 'útiles'],
  [new RegExp(bad, 'g'), ''],
];

function countMojibake(value) {
  return (value.match(mojibakePattern) || []).length;
}

function repairLatin1Mojibake(value) {
  if (!latin1MojibakePattern.test(value) || typeof TextDecoder === 'undefined') {
    return value;
  }

  const charCodes = Array.from(value, (char) => char.charCodeAt(0));
  if (charCodes.some((code) => code > 255)) {
    return value;
  }

  try {
    const decoded = new TextDecoder('utf-8').decode(Uint8Array.from(charCodes));
    return countMojibake(decoded) < countMojibake(value) ? decoded : value;
  } catch {
    return value;
  }
}

export function cleanText(value) {
  if (typeof value !== 'string') {
    return value;
  }

  let cleaned = repairLatin1Mojibake(value);
  for (const [pattern, replacement] of replacementFixes) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned;
}

export function cleanTextDeep(value) {
  if (typeof value === 'string') {
    return cleanText(value);
  }

  if (Array.isArray(value)) {
    return value.map(cleanTextDeep);
  }

  if (!value || Object.prototype.toString.call(value) !== '[object Object]') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [key, cleanTextDeep(entryValue)])
  );
}
