// One definition for each of the six kinds on the home page. The home tiles, How it works
// and help text all read from here, so a kind is described the same way everywhere.
export type GlossaryKind = "prompt" | "skill" | "workflow" | "agent" | "mind" | "specialist";
export const KIND_GLOSSARY: { id: GlossaryKind; name: string; plural: string; tile: string; define: string; anchor: string }[] = [
  { id: "prompt", name: "Prompt", plural: "Prompts", tile: "Paste into a chat", define: "One message. You paste it into your AI and get one result.", anchor: "/how-it-works#prompt" },
  { id: "skill", name: "Skill", plural: "Skills", tile: "Same steps every time", define: "Saved instructions for a job you do again, with steps and checks.", anchor: "/how-it-works#skill" },
  { id: "workflow", name: "Workflow", plural: "Workflows", tile: "Several steps in order", define: "Several skills in order. Each one hands its work to the next.", anchor: "/how-it-works#workflow" },
  { id: "agent", name: "Agent", plural: "Agents", tile: "Does the steps for you", define: "An AI that works through the steps on its own, using tools.", anchor: "/how-it-works#agent" },
  { id: "mind", name: "Mind", plural: "Minds", tile: "An expert's way of thinking", define: "How a well-known expert thinks, so your AI can look at a problem their way.", anchor: "/how-it-works#council" },
  { id: "specialist", name: "Specialist", plural: "Specialists", tile: "Hire one for a whole job", define: "A ready-made AI role, like a bookkeeper or designer, with its own tested methods.", anchor: "/roles" },
];
export const kindLine = (id: GlossaryKind) => KIND_GLOSSARY.find(k => k.id === id)!.tile;
