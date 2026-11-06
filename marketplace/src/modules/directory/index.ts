// House personas: content files in data/, one per group of areas. This file only loads them.
// A new data file must be imported here too (map-outcomes.mjs and the data test find every personas-*.json on their own).
import type { Persona } from "../../core/types.ts";
import g1 from "./data/personas-marketing-content.json" with { type: "json" };
import g2 from "./data/personas-sales-support-ecommerce.json" with { type: "json" };
import g3 from "./data/personas-research-product.json" with { type: "json" };
import g4 from "./data/personas-finance-people.json" with { type: "json" };
import g5 from "./data/personas-operations-industry.json" with { type: "json" };
import g6 from "./data/personas-added-1.json" with { type: "json" };
import g7 from "./data/personas-added-2.json" with { type: "json" };
import g8 from "./data/personas-added-3.json" with { type: "json" };
import g9 from "./data/personas-added-4.json" with { type: "json" };
import g10 from "./data/personas-added-5.json" with { type: "json" };
import g11 from "./data/personas-added-6.json" with { type: "json" };
import g12 from "./data/personas-added-7.json" with { type: "json" };
import g13 from "./data/personas-added-8.json" with { type: "json" };
import g14 from "./data/personas-added-9.json" with { type: "json" };
import g15 from "./data/personas-added-10.json" with { type: "json" };
import g16 from "./data/personas-added-11.json" with { type: "json" };
// The five Traction growth leads (mega agents), outside the main roster count.
import gMega from "./data/personas-mega.json" with { type: "json" };

let HOUSE: Persona[] = ([g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15, g16, gMega] as unknown[][]).flat() as Persona[];

export function housePersonas(): Persona[] { return HOUSE; }

/** Goes up when the data above is swapped (tests only), so rosters held in memory (service.ts) are read again. */
let dataVersion = 0;
export function houseDataVersion(): number { return dataVersion; }

/** Tests only. */
export function setPersonasForTests(list: Persona[]): void { HOUSE = list; dataVersion++; }
