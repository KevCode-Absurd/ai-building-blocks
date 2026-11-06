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

let HOUSE: Persona[] = ([g1, g2, g3, g4, g5, g6, g7, g8] as unknown[][]).flat() as Persona[];

export function housePersonas(): Persona[] { return HOUSE; }

/** Tests only. */
export function setPersonasForTests(list: Persona[]): void { HOUSE = list; }
