/**
 * Short editorial blurbs for station pages.
 * Add in batches of five, starting with the busiest stops in departure stats.
 *
 * Style: spell out Alfa Pendular and Intercidades — do not use AP/IC abbreviations.
 *
 * Batch 1: Lisboa Oriente, Agualva - Cacém, Portela de Sintra, Queluz - Belas, Porto-Campanhã
 * Batch 2: Santa Cruz - Damaia, Braco de Prata, Monte Abraão, Entrecampos, Ermesinde
 * Batch 3: Benfica, Merces, Amadora, Vila Franca de Xira, Roma - Areeiro
 * Batch 4: Massama - Barcarena, Algueirão - Mem Martins, Reboleira, Campolide, Contumil
 * Batch 5: Sete Rios, Águas Santas - Palmilheira, Alcantara - Mar, Sacavem, Vila Nova de Gaia-Devesas
 * Batch 6: Parede, Belém, Oeiras, Cruz Quebrada, Granja
 * Batch 7: Valadares, Espinho, Carcavelos, Moscavide, Paço de Arcos
 * Batch 8: Rio Tinto, Monte Estoril, Santa Iria, Santo Amaro, São Bento (Porto)
 * Batch 9: Algés, Rio de Mouro, Alverca, Bobadela, Estoril
 * Batch 10: Aveiro, Coimbra-B, Povoa, Alhandra, Caxias
 * Batch 11: Nine, Famalicão, Trofa, General Torres, Sintra
 * Batch 12: Esmoriz, Pinhal Novo, Palmela, Entroncamento, Barreiro-A
 * Batch 13: Paredes, Lousado, Lavradio, Lisboa Santa Apolónia, Penafiel
 * Batch 14: Suzão, São Romão, Azambuja, Caíde, São Frutuoso
 * Batch 15: Ovar, Alfarelos, Couto de Cambeses, Santarém, Travagem
 */
/** English station summaries. Spell out Alfa Pendular and Intercidades — no AP/IC. */
export const stationSummariesEn: Record<string, string> = {
  "Lisboa Oriente":
    "Lisbon's eastern hub in Parque das Nações, beside the Tagus and the airport. Alfa Pendular and Intercidades trains to Porto, the north, and the Algarve meet busy suburban services here — ideal if you're staying riverside or need a fast cross-country connection. The Calatrava station hall is worth a glance even on a tight transfer.",
  "Agualva - Cacém":
    "One of the busiest stops on the Sintra suburban line, west of Lisbon between Cacém and the outer suburbs. Frequent urban trains run to Rossio and Sintra, and a few Intercidades services call here without crossing the city centre. Useful for cheaper lodging west of Lisbon while keeping a direct CP link.",
  "Portela de Sintra":
    "Gateway stop on the Sintra line at the edge of the hills, before the climb into Sintra town. Near-constant urban trains link central Lisbon with the palaces and forest walks — expect heavier crowds on weekends and sunny days. A practical base if you want nature day trips without driving the winding hill road.",
  "Queluz - Belas":
    "High-frequency commuter halt between Amadora and Cacém on the Sintra line. Trains reach Rossio in well under half an hour, making Belas and western Amadora workable for budget stays outside the tourist core. Monte Abraão, one stop away, is the usual rail access for Queluz National Palace.",
  "Porto-Campanhã":
    "Porto's main intercity station and the northern hub for Alfa Pendular and Intercidades. Trains head south to Lisbon, north to Braga and Guimarães, east into the Douro, and across the border to Vigo; urban services link São Bento in the historic centre. Stay nearby for long-distance departures — metro and buses reach the Ribeira in minutes.",
  "Santa Cruz - Damaia":
    "One of the Lisbon area's busiest commuter stops, where the Sintra line cuts through Damaia and the western edge of Amadora. Urban trains run constantly towards Rossio and Sintra — a practical choice if you want lower hotel prices west of the centre while keeping a frequent rail link. Expect standing room at peak hours.",
  "Braco de Prata":
    "Eastern Lisbon stop where the Linha de Cintura meets the Linha do Norte corridor through the city. Constant urban and regional trains link the north–south main line with the belt line around central Lisbon. Handy for connections without passing through Rossio or Santa Apolónia.",
  "Monte Abraão":
    "Sintra-line halt best known as the rail access for Queluz National Palace — the palace gardens are a short walk from the platforms. Frequent urban trains run to Rossio and Sintra, with Queluz-Belas one stop towards Lisbon. Quieter than central Sintra but still well connected for palace visits and suburban stays.",
  Entrecampos:
    "Major Lisbon hub on the Cintura belt line, beside Campo Grande and the city's hospital district. Alfa Pendular and Intercidades services cross here alongside dense urban traffic — useful for long-distance tickets without trekking to Oriente or Santa Apolónia. Metro and buses fan out across the northern inner city.",
  Ermesinde:
    "Busy stop on the Porto suburban network where the Minho and Douro corridors meet, east of the city centre. Intercidades and regional trains call here alongside frequent urban services towards Campanhã and the upper Douro. A workable base for cheaper stays in the Valongo–Ermesinde belt with quick links into Porto.",
  Benfica:
    "Inner-western Lisbon junction where the Sintra line meets the Cintura belt. Urban trains run constantly towards Rossio, Sintra, and the ring line around the city centre — a practical stop if you are staying near Benfica, Laranjeiras, or the university belt. Less touristy than downtown with quick hops to Entrecampos or Sete Rios.",
  Merces:
    "Sintra-line halt on the climb towards Sintra town, between Cacém and the hills. Frequent urban trains link central Lisbon with the palaces and forest walks one stop beyond Portela de Sintra. A quieter suburban base than the town centre itself, with steady commuter traffic on weekdays.",
  Amadora:
    "Main rail stop for Amadora, one of Lisbon's largest suburbs west of the centre. The Sintra line runs through here with very frequent urban trains to Rossio and the western corridor. Useful for budget accommodation with a direct suburban link — the municipal centre and bus network are a short walk from the platforms.",
  "Vila Franca de Xira":
    "Tagus-side town on the Linha do Norte between Lisbon and Santarém, known for bull-running traditions and riverside walks. Intercidades and regional trains call here alongside urban services towards Santa Apolónia and the northern commuter belt. A lower-cost base with a direct long-distance link to Lisbon and Porto.",
  "Roma - Areeiro":
    "Cintura-line stop between Areeiro and Entrecampos, handy for the Roma–Areeiro office and hospital district east of central Lisbon. Dense urban trains circle the inner city on the belt line, with easy changes for Sintra-line services at Benfica or long-distance trains at Entrecampos. Well placed for metro connections at Areeiro.",
  "Massama - Barcarena":
    "Sintra-line stop serving the Barcarena and Massamá suburbs north-west of Amadora. Very frequent urban trains run to Rossio and Sintra — one of the busier halts on the western commuter corridor. Practical for lower-cost stays between Amadora and Queluz with a direct link to central Lisbon.",
  "Algueirão - Mem Martins":
    "Suburban halt on the Sintra line between Mem Martins and the climb towards Sintra town. Constant urban trains connect Lisbon with the hills and palace country; expect heavier use on weekends when visitors head to Sintra. A residential base with straightforward rail access to both city and forest walks.",
  Reboleira:
    "Major Sintra-line interchange in Amadora, where suburban trains meet the Amadora metro terminus. One of the busiest stops west of Lisbon, with constant urban services to Rossio and Sintra plus easy metro transfers across the capital. Useful if you are staying in Amadora and want both CP and metro on one site.",
  Campolide:
    "Sintra-line stop just north of central Lisbon, between Sete Rios and Benfica. Frequent urban trains link the inner west of the city with Rossio and the Sintra corridor — handy for Praça de Espanha, the zoo, and bus connections at Sete Rios. A quieter alternative to Rossio for boarding westbound suburban trains.",
  Contumil:
    "Northern Porto junction where the Minho and Norte main lines meet, just east of Campanhã. Urban and regional trains pass through constantly, linking São Bento, the airport corridor, and services north towards Braga. A useful stop if you are staying in the eastern Porto suburbs and want a fast hop to the city centre.",
  "Sete Rios":
    "Major Lisbon interchange on the Cintura belt beside Praça de Espanha and the zoo. Intercidades services and dense urban trains link the Sintra corridor, the ring line, and long-distance tickets without crossing downtown. One of the capital's main bus hubs sits above the platforms — handy for metro, coaches, and suburban rail in one stop.",
  "Águas Santas - Palmilheira":
    "Busy halt on the Minho line in Porto's eastern suburbs, serving Águas Santas and Palmilheira. Frequent urban and regional trains run towards Campanhã, Braga, and the Douro corridor. A practical base for lower-cost stays east of the city with a direct suburban link into central Porto.",
  "Alcantara - Mar":
    "Riverfront stop where the Cintura belt meets the Cascais line, steps from LX Factory and the Tagus embankment. Urban trains run constantly towards Belém, Cascais, and the ring around central Lisbon — ideal for riverside stays west of downtown. Expect weekend crowds near the cultural district and marina walks.",
  Sacavem:
    "Eastern Lisbon halt on the Linha do Norte between Santa Apolónia and the airport corridor. Urban and regional trains link the northern main line with the eastern suburbs — useful for budget lodging east of the centre with a direct CP link towards Oriente. Quieter than Parque das Nações but still well connected on the Norte corridor.",
  "Vila Nova de Gaia-Devesas":
    "Gaia's main long-distance stop south of the Douro, with Alfa Pendular and Intercidades services beside busy urban trains. Trains head south to Lisbon and north along the coast; the historic centre and wine lodges are a short metro or bus hop across the river. Stay nearby for intercity departures without trekking through Porto-Campanhã.",
  Parede:
    "Coastal halt on the Cascais line between Carcavelos and Oeiras, popular with beachgoers and commuters. Very frequent urban trains link central Lisbon with the Estoril coast in under half an hour. A practical base for sand and surf west of the capital with a direct suburban link.",
  "Belém":
    "Iconic Cascais-line stop beside the monuments and museums of Belém — urban trains run constantly towards Cais do Sodré and Cascais. One of Lisbon's top visitor districts, so expect heavier crowds on sunny afternoons. Handy for waterfront walks, pastéis de nata, and quick hops downtown without driving.",
  Oeiras:
    "Cascais-line halt serving Oeiras and the western Tagus shore between Cruz Quebrada and Algés. Dense urban trains link Lisbon with the Estoril coast and office parks along the river. Useful for business stays or lower-cost lodging west of the centre with a frequent rail link.",
  "Cruz Quebrada":
    "Suburban stop on the Cascais line between Algés and Paço de Arcos, with constant urban trains towards Cais do Sodré and Cascais. A quieter alternative to beachfront Carcavelos while keeping the Estoril corridor within easy reach. Handy for riverside walks and quick commutes into central Lisbon.",
  Granja:
    "Norte-line halt on the southern bank of the Douro between Valadares and Espinho. Urban and regional trains link Porto's southern suburbs with Aveiro and Lisbon-bound Intercidades services. A lower-cost coastal base with straightforward rail access north into Porto and south along the Minho corridor.",
  Valadares:
    "Northern Porto halt on the Minho line between Contumil and Granja, serving the Valadares suburb along the Douro south bank. Urban and regional trains run towards Campanhã and Guimarães with a quieter suburban feel than central stations. Practical for lower-cost stays south of the river with a direct link into Porto.",
  Espinho:
    "Busy coastal stop on the Norte main line between Granja and Porto, popular with beach visitors and Aveiro-bound travellers. Intercidades and urban services call here alongside regional trains along the northern corridor. A lively seaside base with frequent links north to Porto and south towards Lisbon.",
  Carcavelos:
    "Southern halt on the Cascais line west of Lisbon, a short walk from Carcavelos beach and surf schools. Frequent urban trains run to Cais do Sodré and the Estoril coast — one of the line's busiest summer stops. Ideal for beach days while keeping central Lisbon within easy reach by rail.",
  Moscavide:
    "Eastern halt on the Linha do Norte beside Moscavide and the approach to Lisboa Oriente. Urban and regional trains link the airport corridor with Santa Apolónia and the northern commuter belt — useful if you are staying near Parque das Nações or need a quick hop to Oriente without the hub crowds.",
  "Paço de Arcos":
    "Cascais-line suburb between Cruz Quebrada and Oeiras, with very frequent urban trains to Cais do Sodré and the Estoril coast. Quieter than neighbouring Algés or Oeiras centre but well connected for riverside walks and office-park commutes. A practical residential base west of Lisbon with a direct suburban link.",
  "Rio Tinto":
    "Eastern halt on the Minho line in Gondomar, between Campanhã and Valongo. Frequent urban and regional trains run towards Porto, Braga, and the upper Minho — a practical suburb for lower-cost stays east of the city with a direct suburban link into Campanhã.",
  "Monte Estoril":
    "Coastal halt on the Cascais line between Estoril and Cascais, above the casino belt and cliff-top walks. Frequent urban trains link central Lisbon with the Atlantic shore in about forty minutes — a quieter residential base than central Estoril with the same rail connection.",
  "Santa Iria":
    "Norte-line halt east of Lisbon in the Tagus corridor, between Sacavém and Alverca. Urban and regional trains run constantly towards Santa Apolónia and the northern commuter belt — useful for budget lodging along the eastern approach to the capital.",
  "Santo Amaro":
    "Cascais-line stop between Paço de Arcos and Oeiras on the western Tagus shore. Constant urban trains run to Cais do Sodré and the Estoril coast — handy for office-park commutes and lower-cost stays between Algés and the river mouth.",
  "São Bento (Porto)":
    "Porto's showpiece terminus in the historic centre, with azulejo-lined halls and urban trains to Campanhã plus Intercidades services north and south. The Ribeira, Sé cathedral, and wine lodges across the Douro are within walking distance — the natural rail gateway for exploring downtown Porto on foot.",
  Algés:
    "Cascais-line halt west of central Lisbon, between Cruz Quebrada and Caxias on the Tagus estuary. Very frequent urban trains reach Cais do Sodré in under twenty-five minutes — popular for marina walks, riverfront dining, and a quick suburban hop from the capital.",
  "Rio de Mouro":
    "Sintra-line halt between Queluz-Belas and the hills, serving the Rio de Mouro suburb. Frequent urban trains run to Rossio and Sintra — a residential stop with steady commuter traffic and straightforward access to the palace belt without staying in central Sintra.",
  Alverca:
    "Norte-line halt in the eastern Tagus corridor between Santa Iria and Póvoa, beside the old aviation town of Alverca. Urban and regional trains link Lisbon with the northern main line — practical for budget stays east of the centre with a direct CP corridor link.",
  Bobadela:
    "Eastern Lisbon halt on the Linha do Norte between Sacavém and Moscavide, in a dense commuter district. Urban and regional trains run constantly on the approach to Santa Apolónia — a lower-cost base east of downtown with frequent links towards Oriente and the airport corridor.",
  Estoril:
    "Classic Cascais-line resort stop beside the casino, promenade, and Atlantic beaches. Urban trains run constantly to Cais do Sodré and Monte Estoril — one of the coast's most popular halts for seaside weekends while keeping central Lisbon within easy reach by rail.",
  Aveiro:
    "Major Norte-line city stop in the Venice of Portugal, with Alfa Pendular and Intercidades trains besides busy urban services. The canals, moliceiro boats, and salted-cod heritage are a short walk from the platforms — a natural hub for exploring central Portugal's Atlantic coast.",
  "Coimbra-B":
    "Principal intercity station for Coimbra on the Linha do Norte, with Alfa Pendular and Intercidades connections to Lisbon and Porto. Urban trains link the university city across the river — stay nearby for long-distance departures; the historic hilltop campus is a bus or taxi hop from the platforms.",
  Povoa:
    "Norte-line halt east of Lisbon serving Póvoa de Santa Iria on the Tagus shore. Urban and regional trains run between Santa Iria and Alhandra on the northern approach to the capital — a practical suburb for commuter stays with a direct link towards Santa Apolónia.",
  Alhandra:
    "Tagus-side halt on the Linha do Norte between Alverca and Vila Franca de Xira, in the lower Tejo valley. Urban and regional trains call here on the Lisbon–Porto corridor — useful for riverside walks and lower-cost lodging north-east of the capital with intercity connections.",
  Caxias:
    "Cascais-line halt between Algés and Cruz Quebrada, serving the Caxias waterfront suburb. Frequent urban trains link the Tagus shore with Cais do Sodré and the Estoril coast — a residential base west of Lisbon with marina walks and quick hops to Belém.",
  Nine:
    "Busy Minho-line junction north of Porto between Famalicão and Trofa, with Alfa Pendular and Intercidades trains on the Porto–Braga corridor. Urban and regional services link the surrounding industrial belt with Campanhã and Guimarães — a practical stop if you are exploring the Ave park or staying in Vila Nova de Famalicão with a fast long-distance link.",
  "Famalicão":
    "Major Minho-line city stop in the Ave valley, with Alfa Pendular and Intercidades services besides dense urban trains. The textile heritage town and riverside walks are a short bus hop from the platforms — a useful base north of Porto with direct links to Braga, Guimarães, and Lisbon-bound intercity trains.",
  Trofa:
    "Minho-line halt between Porto and Braga in the Trofa suburb, with Intercidades and regional trains on the northern main corridor. Frequent urban services run towards Campanhã and Famalicão — a lower-cost base in the Porto metropolitan belt with straightforward rail access into the city.",
  "General Torres":
    "Norte-line suburban halt in Vila Nova de Gaia between São Pedro da Cova and Sandim, on the southern approach to Porto. Urban and regional trains pass through on the coastal corridor — practical for residential stays south of the Douro with quick links to Campanhã and the airport line.",
  Sintra:
    "Terminus of the Sintra line at the foot of the hills, gateway to the palaces, Moorish castle, and forest walks. Urban trains run constantly to Rossio in central Lisbon — expect heavy crowds on weekends and holidays when visitors flood the historic town. Stay nearby if you want the full Sintra experience without driving the winding hill roads.",
  Esmoriz:
    "Coastal halt on the Linha do Norte between Espinho and Ovar, popular with beach commuters south of Porto. Urban and regional trains run on the Lisbon–Porto corridor — a low-key seaside base with straightforward links north to Porto and south along the Aveiro coast.",
  "Pinhal Novo":
    "Major junction on the Linha do Sul where the Alentejo branch meets the Lisbon–Faro main line, with Alfa Pendular and Intercidades services. Urban and regional trains link the south-bank suburbs with Setúbal and the Algarve — handy for cross-country tickets without crossing into Lisbon centre.",
  Palmela:
    "Stop on the Linha do Sul in the castle town south-east of Lisbon, between Pinhal Novo and Setúbal. Urban and regional trains serve the Sado estuary corridor — practical for wine-country visits and lower-cost stays on the south bank with a direct rail link to the capital.",
  Entroncamento:
    "One of Portugal's busiest rail junctions where the Linha do Norte meets the Beira Baixa towards Castelo Branco. Alfa Pendular and Intercidades trains cross here on the Lisbon–Porto axis — a practical overnight or early-morning stop with long-distance connections in every direction.",
  "Barreiro-A":
    "Terminal halt on the south-bank Sado line across the Tagus from Lisbon. Urban and regional trains link Barreiro with Setúbal and the Alentejo corridor — useful for commuters from the south bank or ferry-plus-train combinations into the capital.",
  Paredes:
    "Douro-line stop between Penafiel and Caíde in the Porto eastern suburbs. Intercidades and regional trains run towards Campanhã and the upper Douro — a residential base with quick suburban access into Porto and the Amarante corridor.",
  Lousado:
    "Stop on the Guimarães line east of Famalicão in the Ave industrial belt. Urban and regional trains link Campanhã with Guimarães — practical for factory-belt lodging with a direct suburban connection into Porto and the Minho.",
  Lavradio:
    "South-bank halt on the Sado and Sudoeste lines between Barreiro and Pinhal Novo. Urban and regional trains serve the Tagus south-shore commuter belt — a lower-cost base across the river with frequent links towards Setúbal and the Alentejo.",
  "Lisboa Santa Apolónia":
    "Lisbon's historic riverside terminus beside Alfama, with Alfa Pendular and Intercidades departures plus dense urban services. The azulejo hall opens onto the Tagus — ideal for northbound long-distance trains without crossing to Oriente.",
  Penafiel:
    "Douro-line town stop east of Porto with Intercidades and regional services towards Peso da Régua. Urban trains connect Campanhã with the wine country — a practical base for Douro valley day trips without staying in central Porto.",
  "Suzão":
    "Douro-line halt between Penafiel and Lousada in the eastern Porto suburbs. Urban and regional trains run towards Campanhã and Marco de Canaveses — a quiet commuter stop with straightforward links into the Porto network.",
  "São Romão":
    "Minho-line halt between Trofa and Santo Tirso in the Porto northern belt. Urban and regional trains link Campanhã with Braga and the upper Minho — practical for suburban stays north-east of Porto with frequent commuter services.",
  Azambuja:
    "Tagus-side halt on the Linha do Norte east of Lisbon, famous for bull-running festivals. Urban and regional trains link Santa Apolónia with the Ribatejo corridor — a lower-cost base with direct routes north to Porto and south-east towards Entroncamento.",
  "Caíde":
    "Douro-line junction stop north-east of Porto where the main Douro corridor branches. Intercidades and urban trains connect Campanhã with Marco de Canaveses and Amarante — useful for changing towards Guimarães or the upper Douro.",
  "São Frutuoso":
    "Minho-line suburban halt between Trofa and São Romão near Maia. Urban and regional trains run towards Campanhã and Braga — a residential stop in the Porto northern commuter belt with steady weekday traffic.",
  Ovar:
    "Coastal city stop on the Linha do Norte between Aveiro and Espinho, with Intercidades and regional services. Urban trains link the Aveiro–Porto corridor — popular for beach days and lagoon-side walks with direct links to both cities.",
  Alfarelos:
    "Junction halt on the Linha do Norte where the Ramal de Alfarelos branches toward Figueira da Foz. Intercidades and regional trains call on the Lisbon–Coimbra–Porto axis — handy for changing towards the Atlantic coast or the university city.",
  "Couto de Cambeses":
    "Stop on the Braga line north-west of Braga in the Cávado valley. Regional and urban trains link Nine and Famalicão with Braga — a quieter suburban halt for exploring the Minho hills without staying in the city centre.",
  "Santarém":
    "Ribatejo city on the Linha do Norte with Alfa Pendular and Intercidades services between Lisbon and Porto. Gothic churches and Tagus-side walks are a short walk from the station — a useful overnight break on the main corridor.",
  Travagem:
    "Minho-line halt between Santo Tirso and Ermesinde in the Porto eastern suburbs. Urban and regional trains run towards Campanhã and Valongo — a low-profile commuter stop with frequent links into the Porto network.",
};
