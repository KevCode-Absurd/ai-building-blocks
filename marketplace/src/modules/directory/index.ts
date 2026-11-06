// House personas: content files in data/, one per group of areas. This file only loads them.
import type { Persona } from "../../core/types.ts";
import g1 from "./data/personas-marketing-content.json" with { type: "json" };
import g2 from "./data/personas-sales-support-ecommerce.json" with { type: "json" };
import g3 from "./data/personas-research-product.json" with { type: "json" };
import g4 from "./data/personas-finance-people.json" with { type: "json" };
import g5 from "./data/personas-operations-industry.json" with { type: "json" };

let HOUSE: Persona[] = [g1, g2, g3, g4, g5].flat() as Persona[];

export function housePersonas(): Persona[] { return HOUSE; }

/** Tests only. */
export function setPersonasForTests(list: Persona[]): void { HOUSE = list; }
