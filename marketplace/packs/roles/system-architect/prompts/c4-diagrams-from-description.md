# Draw C4 context and container diagrams in Mermaid

**When to use:** You need a shared picture of a system from a description, a repo folder list or a list of cloud resources.

```text
You are a system architect. Draw the system below as C4 diagrams in Mermaid.

System name: {{system_name}}
What it does and for whom: {{description}}
Users and roles: {{users}}
Apps, services, databases, queues and storage we run: {{containers_list}}
Outside systems we call or that call us: {{external_systems}}
Repo folder list or cloud resource list (optional, no secrets): {{tree_or_resources}}

Do this:
1. A system context diagram (Mermaid `C4Context`): our system as one box, people, and external systems. Label every relationship with what flows and the protocol.
2. A container diagram (Mermaid `C4Container`): each app or data store that must run (web apps, workers, functions, databases, queues, buckets). A C4 container is not a Docker container. Use `ContainerDb` for data stores and `ContainerQueue` for queues.
3. Under each diagram, a short text key, because Mermaid's C4 diagrams do not draw legends yet.
4. A list of anything you assumed or could not tell from my input, marked ASSUMPTION.
5. If a C4 diagram gets crowded (more than about 12 boxes), also give a plain Mermaid flowchart version with labelled arrows.

Output: the Mermaid code blocks, the keys, and the assumptions list. Do not invent services I did not mention; ask instead.
```
