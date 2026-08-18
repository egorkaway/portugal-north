/** Keep in sync with `src/lib/hotelVoteAliases.ts`. */
export const hotelVoteAliasGroups = [
  {
    stationName: "Vila Nova de Cerveira",
    canonicalName: "HI Vila Nova de Cerveira - Pousada de Juventude",
    aliases: [
      "Pousada de Juventude Vila Nova de Cerveira",
      "Pousada de Juventude de Vila Nova de Cerveira",
      "Pousada de Vila Nova de Cerveira",
    ],
  },
];

export function foldHotelName(name) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function namesInGroup(group) {
  return [group.canonicalName, ...group.aliases];
}

export function canonicalHotelName(stationName, hotelName) {
  const folded = foldHotelName(hotelName);
  if (!folded) return hotelName;

  for (const group of hotelVoteAliasGroups) {
    if (group.stationName !== stationName) continue;
    if (namesInGroup(group).some((name) => foldHotelName(name) === folded)) {
      return group.canonicalName;
    }
  }
  return hotelName;
}
