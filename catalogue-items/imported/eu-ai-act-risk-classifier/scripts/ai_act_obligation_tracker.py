#!/usr/bin/env python3
"""ai_act_obligation_tracker.py — EU AI Act per-role obligation matrix.

Stdlib-only. For each AI system, give your role (provider, deployer, importer
or distributor), the system's risk class, and the features that trigger
Article 50. The tracker keeps two things apart, the same way
ai_system_risk_classifier.py does:

1. Risk-class duties. High-risk only: providers (Articles 6(4), 9-17, 22, 43,
   47-49, 72, 73), deployers (Article 26, Article 27, Article 86), importers
   (Article 23) and distributors (Article 24).
2. Duties on top of the risk class, at any class, high-risk included
   (Article 50(6)): Article 50 transparency and Article 4 AI literacy.
   Each Article 50 paragraph binds one role only:
     50(1) tell people they are talking to an AI ............ provider
     50(2) machine-readable marking of synthetic content .... provider
     50(3) notice of emotion recognition / biometric
           categorisation ................................... deployer
     50(4) disclose deepfakes and AI text published on
           matters of public interest ....................... deployer

Application dates. The AI Act as amended by the Digital Omnibus on AI
(Regulation (EU) 2026/1744), checked against the European Commission's AI Act
Service Desk (consolidated text as at 27 July 2026):
  2025-02-02  Article 4 AI literacy; Article 5 prohibitions   Article 113(a)
  2025-08-02  GPAI model duties, Articles 53-55               Article 113(b)
  2026-08-02  Article 50 transparency; Article 86             Article 113, general date
  2026-12-02  new Article 5(1)(ba) and (bb) prohibitions      Article 113(a)
              Article 50(2) for systems already on the market
              before 2026-08-02                               Article 111(4)
  2027-08-02  GPAI models on the market before 2025-08-02     Article 111(3)
  2027-12-02  high-risk duties, Annex III systems             Article 113(c)(i)
  2028-08-02  high-risk duties, Annex I systems               Article 113(c)(ii)
Sources:
  https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-113
  https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-111
  https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50
  https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-26
  https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act
The Act can change again. Check the Service Desk before you rely on a date.

Input schema (JSON):
{
  "organization": "Example Ltd",
  "establishment": "eu",                     # eu | non_eu
  "systems": [
    {
      "name": "HR assistant chatbot",
      "role": "provider",                    # provider | deployer | importer | distributor
      "risk_class": "high_risk",             # prohibited | high_risk | limited_risk | minimal_risk
      "high_risk_route": "annex_iii",        # annex_iii | annex_i (high_risk only)
      "annex_iii_point_2": false,            # critical infrastructure (no Art. 27/86, national registration)
      "article_6_3_carveout_applies": false, # Annex III system you judged not high-risk (Art. 6(4))
      "interacts_with_natural_persons_directly": true,                # Art. 50(1)
      "generates_synthetic_content": false,                           # Art. 50(2)
      "uses_emotion_recognition_or_biometric_categorisation": false,  # Art. 50(3)
      "deploys_deepfakes_or_public_interest_text": false,             # Art. 50(4)
      "on_market_before_2026_08_02": false,  # Art. 111(4) extra time for Art. 50(2)
      "public_authority": false,             # deployer: Art. 26(8), Art. 27
      "provides_public_services": false,     # deployer: Art. 27
      "annex_iii_point_5b_or_5c": false,     # deployer: credit scoring / life and health insurance (Art. 27)
      "decides_about_people": true,          # deployer: Art. 26(11), Art. 86
      "classification": {}                   # optional: one entry of "systems" from
                                             # ai_system_risk_classifier.py --output json
    }
  ],
  "provides_gpai_model": false,              # Articles 53-55 bind GPAI MODEL PROVIDERS only
  "gpai_systemic_risk": false,
  "gpai_on_market_before_2025_08_02": false
}
If "classification" is given, the tracker takes the risk class, the high-risk
route and the Article 50 paragraphs from it. Your own flags are added on top.

Usage:
    python ai_act_obligation_tracker.py                       # embedded sample
    python ai_act_obligation_tracker.py path/to/roles.json
    python ai_act_obligation_tracker.py roles.json --output json
    # Chain from the classifier: same role for every classified system
    python ai_system_risk_classifier.py systems.json --output json > classified.json
    python ai_act_obligation_tracker.py --classified classified.json --role provider
"""

import argparse
import json
import re
import sys
from typing import Any, Dict, List, Optional, Set


SAMPLE: Dict[str, Any] = {
    "organization": "Example organisation (sample)",
    "establishment": "non_eu",
    "systems": [
        {
            "name": "HR assistant chatbot that screens applicants",
            "role": "provider",
            "risk_class": "high_risk",
            "high_risk_route": "annex_iii",
            "interacts_with_natural_persons_directly": True,
        },
        {
            "name": "Customer support chatbot (bought in)",
            "role": "deployer",
            "risk_class": "limited_risk",
            "interacts_with_natural_persons_directly": True,
        },
    ],
    "provides_gpai_model": False,
    "gpai_systemic_risk": False,
}


SERVICE_DESK = "https://ai-act-service-desk.ec.europa.eu/en/ai-act/"

# phase key -> (date, legal basis for the date)
PHASES: Dict[str, tuple] = {
    "art4_ai_literacy": ("2025-02-02", "Article 113(a)"),
    "art5_prohibitions": ("2025-02-02", "Article 113(a)"),
    "gpai_models": ("2025-08-02", "Article 113(b)"),
    "general_application": ("2026-08-02", "Article 113, general date"),
    "art5_new_prohibitions": ("2026-12-02", "Article 113(a)"),
    "art50_2_existing_systems": ("2026-12-02", "Article 111(4)"),
    "gpai_existing_models": ("2027-08-02", "Article 111(3)"),
    "high_risk_annex_iii": ("2027-12-02", "Article 113(c)(i)"),
    "high_risk_annex_i": ("2028-08-02", "Article 113(c)(ii)"),
}


# ---- Risk-class duties (high-risk only) -------------------------------------

PROVIDER_HIGH_RISK = [
    "Article 9 — Set up a risk management system for the whole lifecycle",
    "Article 10 — Data governance: quality of training, validation and test data; examine for bias",
    "Article 11 — Draw up technical documentation (Annex IV) and keep it current",
    "Article 12 — Build in automatic event logging",
    "Article 13 — Give deployers clear instructions for use",
    "Article 14 — Design the system so people can oversee it",
    "Article 15 — Accuracy, robustness and cybersecurity",
    "Article 16 — General provider duties, including your name and contact address on the system or its packaging",
    "Article 17 — Quality management system",
    "Article 43 — Conformity assessment before placing on the market",
    "Article 47 — Draw up and sign the EU declaration of conformity",
    "Article 48 — Affix the CE marking",
    "Article 72 — Post-market monitoring system",
    "Article 73 — Report serious incidents: at the latest 15 days after you become aware; 2 days for a widespread infringement or an Article 3(49)(b) incident; 10 days if a person dies",
]

PROVIDER_REGISTER_EU = "Article 49(1) — Register yourself and the system in the EU database (Article 71) before placing it on the market"
PROVIDER_REGISTER_NATIONAL = "Article 49(5) — Annex III point 2 (critical infrastructure) system: register at national level, not in the EU database"
PROVIDER_CARVEOUT = "Article 6(4) — You judged this Annex III system not high-risk: document that assessment before placing it on the market, and register under Article 49(2)"

DEPLOYER_HIGH_RISK = [
    "Article 26(1) — Take technical and organisational measures to use the system according to the provider's instructions for use",
    "Article 26(2) — Assign human oversight to people with the competence, training, authority and support they need",
    "Article 26(4) — Where you control the input data, make sure it is relevant and sufficiently representative",
    "Article 26(5) — Monitor operation; inform the provider; if the system presents an Article 79(1) risk, alert the provider or distributor and the market surveillance authority and suspend use; report serious incidents",
    "Article 26(6) — Keep the logs under your control for at least six months, unless other law says otherwise",
    "Article 26(7) — If you use it at the workplace: inform workers' representatives and affected workers before you start",
    "Article 26(9) — Where applicable, use the provider's Article 13 information for your GDPR data protection impact assessment",
    "Article 26(12) — Cooperate with the competent authorities",
]

DEPLOYER_INFORM_PEOPLE = "Article 26(11) — Tell the people the system makes or helps make decisions about that they are subject to a high-risk AI system"
DEPLOYER_PUBLIC_AUTHORITY = "Article 26(8) and Article 49(3) — Public authority: register your use in the EU database; do not use a system that is not registered there"
DEPLOYER_FRIA = "Article 27 — Do a fundamental rights impact assessment before first use"
DEPLOYER_EXPLANATION = "Article 86 — On request, give an affected person a clear explanation of the system's role in a decision about them"

IMPORTER_HIGH_RISK = [
    "Article 23(1) — Before placing it on the market, check the conformity assessment, technical documentation, CE marking, declaration of conformity and authorised representative",
    "Article 23(3) — Put your name and contact address on the system, its packaging or its documentation",
]

DISTRIBUTOR_HIGH_RISK = [
    "Article 24(1) — Before making it available, check the CE marking, the declaration of conformity and the instructions for use",
]

NON_EU_PROVIDER_HIGH_RISK = "Article 22 — Non-EU provider of a high-risk system: appoint an authorised representative established in the EU, by written mandate, before making the system available"

# ---- Duties on top of the risk class ----------------------------------------

ARTICLE_50 = {
    1: ("provider", "Article 50(1) — Design the system so people are told they are interacting with an AI system, unless that is obvious"),
    2: ("provider", "Article 50(2) — Mark synthetic audio, image, video or text output in a machine-readable format so it is detectable as AI-generated"),
    3: ("deployer", "Article 50(3) — Tell people exposed to the emotion recognition or biometric categorisation system that it is operating"),
    4: ("deployer", "Article 50(4) — Disclose that deepfake image, audio or video, and AI-generated text published to inform the public on matters of public interest, is AI-generated or manipulated"),
}
ARTICLE_50_FLAGS = {
    1: "interacts_with_natural_persons_directly",
    2: "generates_synthetic_content",
    3: "uses_emotion_recognition_or_biometric_categorisation",
    4: "deploys_deepfakes_or_public_interest_text",
}

ARTICLE_4 = "Article 4 — Take measures to support AI literacy of your staff and others operating or using AI systems for you (no specific level is required of any individual)"
ARTICLE_5 = "Article 5 — Do not place on the market, put into service or use any prohibited AI practice"
ARTICLE_5_NEW = "Article 5(1)(ba) and (bb) — New prohibitions: AI systems that generate non-consensual intimate imagery of identifiable people, or child sexual abuse material"

GPAI_ALL = [
    "Article 53(1)(a) — Technical documentation of the model (Annex XI)",
    "Article 53(1)(b) — Information for downstream providers who integrate the model (Annex XII)",
    "Article 53(1)(c) — Policy to comply with EU copyright law",
    "Article 53(1)(d) — Publish a sufficiently detailed summary of the content used for training",
]
GPAI_NON_EU = "Article 54 — Non-EU GPAI model provider: appoint an authorised representative established in the EU"
GPAI_SYSTEMIC_RISK = [
    "Article 55 — Model evaluations, including adversarial testing",
    "Article 55 — Assess and mitigate systemic risks",
    "Article 55 — Track and report serious incidents to the AI Office",
    "Article 55 — Cybersecurity protection for the model and its physical infrastructure",
]


def _ob(role: str, system: str, text: str, phase: str, note: Optional[str] = None) -> Dict[str, Any]:
    date, basis = PHASES[phase]
    out = {"role": role, "system": system, "obligation": text,
           "deadline_phase": phase, "deadline_date": date, "date_basis": basis}
    if note:
        out["note"] = note
    return out


def _from_classification(entry: Dict[str, Any]) -> Dict[str, Any]:
    """Merge a classifier result (risk class, route, Article 50 paragraphs) with the entry's own fields."""
    c = entry.get("classification") or {}
    merged = dict(entry)
    risk = entry.get("risk_class") or entry.get("systems_tier") or c.get("tier") or "minimal_risk"
    merged["risk_class"] = risk
    citation = c.get("primary_citation", "") or ""
    if not merged.get("high_risk_route") and risk == "high_risk":
        merged["high_risk_route"] = "annex_i" if citation.startswith("Article 6(1)") else "annex_iii"
    if "Annex III §2" in citation:
        merged.setdefault("annex_iii_point_2", True)
    if "Article 6(3)" in citation and risk != "high_risk":
        merged.setdefault("article_6_3_carveout_applies", True)
    if not merged.get("name") and c.get("name"):
        merged["name"] = c["name"]
    paras: Set[int] = set()
    for d in c.get("transparency_duties", []) or []:
        m = re.search(r"Article 50\((\d)\)", d)
        if m:
            paras.add(int(m.group(1)))
    for p, flag in ARTICLE_50_FLAGS.items():
        if entry.get(flag):
            paras.add(p)
    merged["_article_50_paragraphs"] = sorted(paras)
    merged["_prohibited_new"] = bool(re.search(r"5\(1\)\(b[ab]\)", citation))
    return merged


def _system_obligations(entry: Dict[str, Any], establishment: str, notes: List[str]) -> List[Dict[str, Any]]:
    s = _from_classification(entry)
    role = s.get("role", "provider")
    name = s.get("name", "<unnamed>")
    risk = s["risk_class"]
    out: List[Dict[str, Any]] = []

    if risk == "prohibited":
        phase = "art5_new_prohibitions" if s["_prohibited_new"] else "art5_prohibitions"
        out.append(_ob(role, name, "Article 5 — Prohibited practice: stop. It cannot be placed on the market, put into service or used.", phase))
        notes.append(f"{name}: prohibited, so no other duties are listed. Take legal advice now.")
        return out

    # 1. Risk-class duties (high-risk only)
    if risk == "high_risk":
        route = s.get("high_risk_route") or "annex_iii"
        if route not in ("annex_iii", "annex_i"):
            route = "annex_iii"
        phase = "high_risk_annex_i" if route == "annex_i" else "high_risk_annex_iii"
        point2 = bool(s.get("annex_iii_point_2"))
        if role == "provider":
            out += [_ob(role, name, t, phase) for t in PROVIDER_HIGH_RISK]
            if route == "annex_iii":
                out.append(_ob(role, name, PROVIDER_REGISTER_NATIONAL if point2 else PROVIDER_REGISTER_EU, phase))
            if establishment == "non_eu":
                out.append(_ob(role, name, NON_EU_PROVIDER_HIGH_RISK, phase))
        elif role == "deployer":
            out += [_ob(role, name, t, phase) for t in DEPLOYER_HIGH_RISK]
            if route == "annex_iii" and s.get("decides_about_people", True):
                out.append(_ob(role, name, DEPLOYER_INFORM_PEOPLE, phase))
                if not point2:
                    out.append(_ob(role, name, DEPLOYER_EXPLANATION, "general_application",
                                   note="Article 86 sits outside Chapter III, so Article 113's general date applies; it covers Annex III high-risk systems, whose Chapter III rules apply from 2027-12-02. Confirm the date with counsel."))
            if s.get("public_authority") or s.get("public_sector"):
                if route == "annex_iii" and not point2:
                    out.append(_ob(role, name, DEPLOYER_PUBLIC_AUTHORITY, phase))
            fria = s.get("public_authority") or s.get("public_sector") or s.get("provides_public_services") or s.get("annex_iii_point_5b_or_5c")
            if route == "annex_iii" and not point2 and fria:
                out.append(_ob(role, name, DEPLOYER_FRIA, phase))
        elif role == "importer":
            out += [_ob(role, name, t, phase) for t in IMPORTER_HIGH_RISK]
        elif role == "distributor":
            out += [_ob(role, name, t, phase) for t in DISTRIBUTOR_HIGH_RISK]
    elif role == "provider" and s.get("article_6_3_carveout_applies"):
        out.append(_ob(role, name, PROVIDER_CARVEOUT, "high_risk_annex_iii"))

    # 2. Duties on top of the risk class: Article 50, each paragraph to its own role
    for p in s["_article_50_paragraphs"]:
        duty_role, text = ARTICLE_50[p]
        if duty_role == role:
            phase = "general_application"
            if p == 2 and s.get("on_market_before_2026_08_02"):
                phase = "art50_2_existing_systems"
            out.append(_ob(role, name, text, phase))
        elif role in ("provider", "deployer"):
            notes.append(f"{name}: Article 50({p}) applies to this system but binds the {duty_role}, not you as {role}. "
                         f"If you also act as {duty_role}, add a second entry with that role.")
    if role == "deployer" and risk == "high_risk":
        notes.append(f"{name}: Article 50(6) — Article 50 duties do not affect the high-risk duties; both lists apply.")
    return out


def gather_obligations(payload: Dict[str, Any]) -> Dict[str, Any]:
    notes: List[str] = []
    establishment = payload.get("establishment", "eu")
    systems = payload.get("systems")
    if systems is None and "roles" in payload:
        systems = payload["roles"]
        notes.append('"roles" is read as "systems"; "systems_tier" as "risk_class". Add the Article 50 flags to each entry, or the transparency duties will be missed.')
    systems = systems or []

    obligations: List[Dict[str, Any]] = []
    obligations.append(_ob("any operator", "all", ARTICLE_5, "art5_prohibitions"))
    obligations.append(_ob("any operator", "all", ARTICLE_5_NEW, "art5_new_prohibitions"))
    roles_present = {e.get("role") for e in systems}
    if roles_present & {"provider", "deployer"} or payload.get("provides_gpai_model"):
        obligations.append(_ob("provider/deployer", "all", ARTICLE_4, "art4_ai_literacy"))

    for entry in systems:
        obligations += _system_obligations(entry, establishment, notes)

    if "deploys_gpai" in payload:
        notes.append('"deploys_gpai" is not read: Articles 53-55 bind providers of GPAI models, not deployers. Set "provides_gpai_model": true only if you provide the model.')
    if payload.get("provides_gpai_model"):
        phase = "gpai_existing_models" if payload.get("gpai_on_market_before_2025_08_02") else "gpai_models"
        obligations += [_ob("GPAI model provider", "GPAI model", t, phase) for t in GPAI_ALL]
        if establishment == "non_eu":
            obligations.append(_ob("GPAI model provider", "GPAI model", GPAI_NON_EU, phase))
        if payload.get("gpai_systemic_risk"):
            obligations += [_ob("GPAI model provider", "GPAI model", t, phase) for t in GPAI_SYSTEMIC_RISK]

    if any(_from_classification(e)["risk_class"] == "high_risk" for e in systems):
        notes.append("Article 111(2): a high-risk system already on the market before its high-risk date is covered only if its design changes significantly after that date; systems for public authorities must comply by 2030-08-02.")
        notes.append("High-risk dates follow the Service Desk timeline (Annex III 2027-12-02, Annex I 2028-08-02). Articles outside Chapter III Sections 1-3 (such as 43-49, 72, 73) rely on the high-risk classification; confirm their dates with counsel.")

    obligations.sort(key=lambda x: (x["deadline_date"], x["system"], x["role"]))
    return {"obligations": obligations, "notes": notes}


def analyze(payload: Dict[str, Any]) -> Dict[str, Any]:
    g = gather_obligations(payload)
    obs = g["obligations"]
    by_date: Dict[str, int] = {}
    by_role: Dict[str, int] = {}
    for o in obs:
        by_date[o["deadline_date"]] = by_date.get(o["deadline_date"], 0) + 1
        by_role[o["role"]] = by_role.get(o["role"], 0) + 1
    return {
        "organization": payload.get("organization"),
        "establishment": payload.get("establishment", "eu"),
        "total_obligations": len(obs),
        "by_date": by_date,
        "by_role": by_role,
        "obligations": obs,
        "notes": g["notes"],
        "sources": [SERVICE_DESK + "article-113", SERVICE_DESK + "article-111",
                    SERVICE_DESK + "article-50", SERVICE_DESK + "article-26",
                    SERVICE_DESK + "timeline/timeline-implementation-eu-ai-act"],
    }


def render_text(r: Dict[str, Any], source: str) -> str:
    lines = []
    lines.append("=" * 72)
    lines.append("EU AI ACT — OBLIGATION MATRIX (deadline-sorted)")
    lines.append(f"Source: {source}")
    lines.append("=" * 72)
    lines.append("")
    lines.append(f"Organization: {r['organization']}")
    lines.append(f"Establishment: {r['establishment']}")
    lines.append(f"Total obligations: {r['total_obligations']}")
    lines.append("")
    lines.append("By role:")
    for role, n in sorted(r["by_role"].items()):
        lines.append(f"  {role:22s}  {n}")
    lines.append("")
    lines.append("-" * 72)
    current = None
    for o in r["obligations"]:
        if o["deadline_date"] != current:
            current = o["deadline_date"]
            lines.append(f">> Applies from {current} ({o['date_basis']})")
        lines.append(f"   [{o['role']}] {o['system']}: {o['obligation']}")
        if o.get("note"):
            lines.append(f"      note: {o['note']}")
    if r["notes"]:
        lines.append("")
        lines.append("-" * 72)
        lines.append("NOTES")
        for n in r["notes"]:
            lines.append(f"  - {n}")
    lines.append("")
    lines.append("-" * 72)
    lines.append("Dates: AI Act as amended by Regulation (EU) 2026/1744 (Digital Omnibus on AI).")
    lines.append("Check: " + ", ".join(r["sources"][:2]))
    lines.append("Not legal advice. Take unclear cases to counsel.")
    return "\n".join(lines)


def _payload_from_classified(path: str, role: str, establishment: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        classified = json.load(f)
    return {
        "organization": None,
        "establishment": establishment,
        "systems": [{"name": c.get("name"), "role": role, "classification": c}
                    for c in classified.get("systems", [])],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="EU AI Act per-role obligation matrix with application dates.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("path", nargs="?", help="Path to roles JSON (uses embedded sample if omitted)")
    parser.add_argument("--classified", help="JSON output of ai_system_risk_classifier.py --output json")
    parser.add_argument("--role", choices=("provider", "deployer", "importer", "distributor"),
                        default="provider", help="Your role for every system in --classified")
    parser.add_argument("--establishment", choices=("eu", "non_eu"), default="eu",
                        help="Where you are established (used with --classified)")
    parser.add_argument("--output", choices=("text", "json"), default="text", help="Output format")
    args = parser.parse_args()

    try:
        if args.classified:
            payload = _payload_from_classified(args.classified, args.role, args.establishment)
            source = f"{args.classified} (role: {args.role})"
        elif args.path:
            with open(args.path, "r", encoding="utf-8") as f:
                payload = json.load(f)
            source = args.path
        else:
            payload = SAMPLE
            source = "<embedded sample: non-EU provider of a high-risk chatbot + deployer of a support chatbot>"
    except (IOError, OSError) as e:
        print(f"error: could not read input: {e}", file=sys.stderr)
        return 1
    except json.JSONDecodeError as e:
        print(f"error: invalid JSON: {e}", file=sys.stderr)
        return 1

    result = analyze(payload)
    if args.output == "json":
        print(json.dumps({"source": source, **result}, indent=2, ensure_ascii=False))
    else:
        print(render_text(result, source))
    return 0


if __name__ == "__main__":
    sys.exit(main())
