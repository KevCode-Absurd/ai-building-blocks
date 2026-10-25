export type MindUseCase = { id: string; title: string; description: string; slugs: string[]; examples: { slug: string; prompt: string }[] };

/** Curated everyday starting points for the 200 additions; all minds remain available in the full roster. */
export const MIND_USE_CASES: MindUseCase[] = [
  {
    "id": "home-food",
    "title": "Cooking, home & gardening",
    "description": "Meals, clutter, housework and growing things",
    "slugs": [
      "julia-child",
      "jacques-pepin",
      "samin-nosrat",
      "madhur-jaffrey",
      "marcella-hazan",
      "edna-lewis",
      "m-f-k-fisher",
      "harold-mcgee",
      "kenji-lopez-alt",
      "deb-perelman",
      "yotam-ottolenghi",
      "diana-kennedy",
      "alice-waters",
      "james-beard",
      "mary-berry",
      "marie-kondo",
      "dana-k-white",
      "kc-davis",
      "monty-don",
      "ruth-stout"
    ],
    "examples": [
      {
        "slug": "julia-child",
        "prompt": "Help me make my first omelet. Explain the heat, the movements and the signs that it is ready, including how to recover from a mistake."
      },
      {
        "slug": "marie-kondo",
        "prompt": "My wardrobe is overflowing. Walk me through choosing what to keep and finding a home for it, one manageable session at a time."
      }
    ]
  },
  {
    "id": "learning",
    "title": "Studying & learning",
    "description": "Recall, practice, new skills and teaching",
    "slugs": [
      "barbara-oakley",
      "john-dunlosky",
      "henry-roediger",
      "peter-c-brown",
      "pooja-agarwal",
      "benedict-carey",
      "daniel-willingham",
      "stanislas-dehaene",
      "carol-dweck",
      "angela-duckworth",
      "anders-ericsson",
      "scott-young",
      "josh-waitzkin",
      "maria-montessori",
      "john-dewey",
      "paulo-freire",
      "seymour-papert",
      "sugata-mitra",
      "sal-khan",
      "richard-hamming"
    ],
    "examples": [
      {
        "slug": "barbara-oakley",
        "prompt": "I keep getting stuck on the same maths problem. Help me switch approaches and plan a short practice session."
      },
      {
        "slug": "pooja-agarwal",
        "prompt": "Turn these notes into a two-minute recall quiz. Ask me to answer before showing the explanation."
      }
    ]
  },
  {
    "id": "relationships",
    "title": "Relationships & parenting",
    "description": "Boundaries, listening and difficult conversations",
    "slugs": [
      "john-gottman",
      "julie-schwartz-gottman",
      "esther-perel",
      "sue-johnson",
      "marshall-rosenberg",
      "harriet-lerner",
      "virginia-satir",
      "carl-rogers",
      "thomas-gordon",
      "haim-ginott",
      "adele-faber",
      "elaine-mazlish",
      "alfie-kohn",
      "ross-greene",
      "daniel-siegel",
      "tina-payne-bryson",
      "janet-lansbury",
      "becky-kennedy",
      "nedra-glover-tawwab",
      "terrence-real"
    ],
    "examples": [
      {
        "slug": "marshall-rosenberg",
        "prompt": "Help me rewrite this angry message as an observation, a feeling, a need and a clear request, without blaming the other person."
      },
      {
        "slug": "adele-faber",
        "prompt": "My child is upset about a disappointment. Help me acknowledge the feeling and offer choices without dismissing it."
      }
    ]
  },
  {
    "id": "workplace",
    "title": "Work, focus & teams",
    "description": "Task lists, attention, meetings and teamwork",
    "slugs": [
      "david-allen",
      "bj-fogg",
      "julie-morgenstern",
      "laura-vanderkam",
      "oliver-burkeman",
      "greg-mckeown",
      "jake-knapp",
      "john-zeratsky",
      "david-marquet",
      "amy-edmondson",
      "liz-wiseman",
      "michael-bungay-stanier",
      "nancy-kline",
      "patrick-lencioni",
      "susan-scott",
      "kerry-patterson",
      "joseph-grenny",
      "douglas-stone",
      "sheila-heen",
      "roger-fisher"
    ],
    "examples": [
      {
        "slug": "david-allen",
        "prompt": "Turn this messy task list into clear next actions. Separate projects, waiting-for items and things I can do today."
      },
      {
        "slug": "amy-edmondson",
        "prompt": "People on my team stay quiet when something goes wrong. Help me invite concerns in our next meeting and respond constructively."
      }
    ]
  },
  {
    "id": "money-career",
    "title": "Money & career",
    "description": "Household budgets, bills and career experiments",
    "slugs": [
      "ramit-sethi",
      "vicki-robin",
      "jl-collins",
      "carl-richards",
      "john-c-bogle",
      "burton-malkiel",
      "william-bernstein",
      "thomas-j-stanley",
      "jenny-blake",
      "bill-burnett",
      "dave-evans",
      "herminia-ibarra",
      "richard-nelson-bolles",
      "beth-kobliner",
      "helaine-olen",
      "tiffany-aliche",
      "michelle-singletary",
      "joe-dominguez",
      "elizabeth-warren",
      "amelia-warren-tyagi"
    ],
    "examples": [
      {
        "slug": "tiffany-aliche",
        "prompt": "Help me organise these neglected bills into a checklist, identify what information is missing and plan the first calls to make."
      },
      {
        "slug": "herminia-ibarra",
        "prompt": "I want to try a leadership role. Help me design a small experiment, find someone to learn from and reflect on what fits."
      }
    ]
  },
  {
    "id": "health",
    "title": "Wellbeing & movement",
    "description": "Habits, desk-day movement and emotional skills",
    "slugs": [
      "kelly-mcgonigal",
      "judson-brewer",
      "wendy-suzuki",
      "katy-bowman",
      "stuart-mcgill",
      "kelly-starrett",
      "joan-vernikos",
      "gretchen-rubin",
      "sonja-lyubomirsky",
      "kristin-neff",
      "christopher-germer",
      "jon-kabat-zinn",
      "tara-brach",
      "sharon-salzberg",
      "jack-kornfield",
      "pema-chodron",
      "rick-hanson",
      "russ-harris",
      "steven-hayes",
      "susan-david"
    ],
    "examples": [
      {
        "slug": "judson-brewer",
        "prompt": "I keep checking my phone without meaning to. Help me notice the trigger, what I do next and what reward I actually get."
      },
      {
        "slug": "katy-bowman",
        "prompt": "Help me find small, comfortable ways to add movement to a desk day using the space and routines I already have."
      }
    ]
  },
  {
    "id": "design-civic",
    "title": "Homes & communities",
    "description": "Accessible spaces, shared resources and sustainability",
    "slugs": [
      "jane-jacobs",
      "jan-gehl",
      "william-h-whyte",
      "christopher-alexander",
      "stewart-brand",
      "victor-papanek",
      "ronald-mace",
      "patricia-moore",
      "kat-holmes",
      "sara-hendren",
      "sasha-costanza-chock",
      "liz-jackson",
      "kate-raworth",
      "elinor-ostrom",
      "donella-meadows",
      "rachel-carson",
      "wangari-maathai",
      "vandana-shiva",
      "david-holmgren",
      "bill-mollison"
    ],
    "examples": [
      {
        "slug": "ronald-mace",
        "prompt": "Before we renovate this room, help me spot barriers for people with different mobility, reach and vision needs."
      },
      {
        "slug": "elinor-ostrom",
        "prompt": "Our neighbours share a set of tools. Help us agree clear borrowing, maintenance and conflict-resolution rules together."
      }
    ]
  },
  {
    "id": "technology",
    "title": "Software & digital life",
    "description": "Debugging, websites, security and privacy",
    "slugs": [
      "martin-fowler",
      "robert-c-martin",
      "michael-feathers",
      "sandi-metz",
      "julia-evans",
      "kelsey-hightower",
      "brendan-gregg",
      "troy-hunt",
      "bruce-schneier",
      "cory-doctorow",
      "mike-monteiro",
      "ethan-marcotte",
      "rachel-andrew",
      "sara-soueidan",
      "lea-verou",
      "addy-osmani",
      "harry-roberts",
      "nicole-forsgren",
      "charity-majors",
      "mitchell-hashimoto"
    ],
    "examples": [
      {
        "slug": "julia-evans",
        "prompt": "This program works on one computer but fails on another. Help me ask useful questions and test one explanation at a time."
      },
      {
        "slug": "troy-hunt",
        "prompt": "I received a data-breach alert. Help me understand what it says and make an account-security checklist without sharing passwords."
      }
    ]
  },
  {
    "id": "communication",
    "title": "Writing & decisions",
    "description": "Clear messages, presentations, charts and evidence",
    "slugs": [
      "annette-simmons",
      "nancy-duarte",
      "garr-reynolds",
      "cole-nussbaumer-knaflic",
      "edward-tufte",
      "alberto-cairo",
      "hans-rosling",
      "florence-nightingale",
      "david-spiegelhalter",
      "carl-bergstrom",
      "jevin-west",
      "tim-harford",
      "julia-galef",
      "philip-tetlock",
      "gerd-gigerenzer",
      "annie-duke",
      "barbara-minto",
      "roy-peter-clark",
      "ann-patchett",
      "natalie-goldberg"
    ],
    "examples": [
      {
        "slug": "nancy-duarte",
        "prompt": "Turn this project update into a short presentation with a clear audience, a useful contrast and one specific request."
      },
      {
        "slug": "cole-nussbaumer-knaflic",
        "prompt": "Help me explain this household-spending chart. Identify the main point, remove distractions and suggest a clear title."
      }
    ]
  },
  {
    "id": "craft",
    "title": "Creativity & storytelling",
    "description": "Drawing, making, creative practice and stories",
    "slugs": [
      "austin-kleon",
      "kimon-nicolaides",
      "james-gurney",
      "twyla-tharp",
      "betty-edwards",
      "scott-mccloud",
      "lynda-barry",
      "mary-oliver",
      "billy-collins",
      "ira-glass",
      "roman-mars",
      "jad-abumrad",
      "steve-martin",
      "mike-birbiglia",
      "keith-johnstone",
      "viola-spolin",
      "del-close",
      "andrew-loomis",
      "david-hockney",
      "ansel-adams"
    ],
    "examples": [
      {
        "slug": "betty-edwards",
        "prompt": "Help me practise drawing a chair by noticing edges, spaces and proportions. Give me a short exercise I can do today."
      },
      {
        "slug": "ira-glass",
        "prompt": "Help me shape this personal experience into a two-minute story with a sequence of events and a reason it matters."
      }
    ]
  }
];
