---
name: crewai-multi-agent
description: Multi-agent orchestration framework for autonomous AI collaboration. Use when building teams of specialized agents working together on complex tasks, when you need role-based agent collaboration with memory, or for production workflows requiring sequential/hierarchical execution. Built without LangChain dependencies for lean, fast execution.
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [Agents, CrewAI, Multi-Agent, Orchestration, Collaboration, Role-Based, Autonomous, Workflows, Memory, Production]
dependencies: [crewai>=1.2.0, crewai-tools>=1.2.0]
---

# CrewAI - Multi-Agent Orchestration Framework

Build teams of autonomous AI agents that collaborate to solve complex tasks.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use CrewAI

**Use CrewAI when:**
- Building multi-agent systems with specialized roles
- Need autonomous collaboration between agents
- Want role-based task delegation (researcher, writer, analyst)
- Require sequential or hierarchical process execution
- Building production workflows with memory and observability
- Need simpler setup than LangChain/LangGraph

**Key features:**
- **Standalone**: No LangChain dependencies, lean footprint
- **Role-based**: Agents have roles, goals, and backstories
- **Dual paradigm**: Crews (autonomous) + Flows (event-driven)
- **50+ tools**: Web scraping, search, databases, AI services
- **Memory**: Short-term, long-term, and entity memory
- **Production-ready**: Tracing, enterprise features

**Use alternatives instead:**
- **LangChain**: General-purpose LLM apps, RAG pipelines
- **LangGraph**: Complex stateful workflows with cycles
- **AutoGen**: Microsoft ecosystem, multi-agent conversations
- **LlamaIndex**: Document Q&A, knowledge retrieval

## Quick start

### Installation

```bash
# Core framework
pip install crewai

# With 50+ built-in tools
pip install 'crewai[tools]'
```

### Create project with CLI

```bash
# Create new crew project
crewai create crew my_project
cd my_project

# Install dependencies
crewai install

# Run the crew
crewai run
```

### Simple crew (code-only)

```python
from crewai import Agent, Task, Crew, Process

# 1. Define agents
researcher = Agent(
    role="Senior Research Analyst",
    goal="Discover cutting-edge developments in AI",
    backstory="You are an expert analyst with a keen eye for emerging trends.",
    verbose=True
)

writer = Agent(
    role="Technical Writer",
    goal="Create clear, engaging content about technical topics",
    backstory="You excel at explaining complex concepts to general audiences.",
    verbose=True
)

# 2. Define tasks
research_task = Task(
    description="Research the latest developments in {topic}. Find 5 key trends.",
    expected_output="A detailed report with 5 bullet points on key trends.",
    agent=researcher
)

write_task = Task(
    description="Write a blog post based on the research findings.",
    expected_output="A 500-word blog post in markdown format.",
    agent=writer,
    context=[research_task]  # Uses research output
)

# 3. Create and run crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,  # Tasks run in order
    verbose=True
)

# 4. Execute
result = crew.kickoff(inputs={"topic": "AI Agents"})
print(result.raw)
```

## Core concepts

### Agents - Autonomous workers

```python
from crewai import Agent

agent = Agent(
    role="Data Scientist",                    # Job title/role
    goal="Analyze data to find insights",     # What they aim to achieve
    backstory="PhD in statistics...",         # Background context
    llm="gpt-4o",                             # LLM to use
    tools=[],                                 # Tools available
    memory=True,                              # Enable memory
    verbose=True,                             # Show reasoning
    allow_delegation=True,                    # Can delegate to others
    max_iter=15,                              # Max reasoning iterations
    max_rpm=10                                # Rate limit
)
```

### Tasks - Units of work

```python
from crewai import Task

task = Task(
    description="Analyze the sales data for Q4 2024. {context}",
    expected_output="A summary report with key metrics and trends.",
    agent=analyst,                            # Assigned agent
    context=[previous_task],                  # Input from other tasks
    output_file="report.md",                  # Save to file
    async_execution=False,                    # Run synchronously
    human_input=False                         # No human approval needed
)
```

### Crews - Teams of agents

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer, editor],      # Team members
    tasks=[research, write, edit],            # Tasks to complete
    process=Process.sequential,               # Or Process.hierarchical
    verbose=True,
    memory=True,                              # Enable crew memory
    cache=True,                               # Cache tool results
    max_rpm=10,                               # Rate limit
    share_crew=False                          # Opt-in telemetry
)

# Execute with inputs
result = crew.kickoff(inputs={"topic": "AI trends"})

# Access results
print(result.raw)                             # Final output
print(result.tasks_output)                    # All task outputs
print(result.token_usage)                     # Token consumption
```

## Process types

### Sequential (default)

Tasks execute in order, each agent completing their task before the next:

```python
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential  # Task 1 → Task 2 → Task 3
)
```

### Hierarchical

Auto-creates a manager agent that delegates and coordinates:

```python
crew = Crew(
    agents=[researcher, writer, analyst],
    tasks=[research_task, write_task, analyze_task],
    process=Process.hierarchical,  # Manager delegates tasks
    manager_llm="gpt-4o"           # LLM for manager
)
```

## Using tools

### Built-in tools (50+)

```bash
pip install 'crewai[tools]'
```

```python
from crewai_tools import (
    SerperDevTool,           # Web search
    ScrapeWebsiteTool,       # Web scraping
    FileReadTool,            # Read files
    PDFSearchTool,           # Search PDFs
    WebsiteSearchTool,       # Search websites
    CodeDocsSearchTool,      # Search code docs
    YoutubeVideoSearchTool,  # Search YouTube
)

# Assign tools to agent
researcher = Agent(
    role="Researcher",
    goal="Find accurate information",
    backstory="Expert at finding data online.",
    tools=[SerperDevTool(), ScrapeWebsiteTool()]
)
```

### Custom tools

```python
import ast
import operator

from crewai.tools import BaseTool

# AI Blocks note: the original called eval() on the agent's text, which can run
# any code. Never eval text an agent or user supplies. This version parses the
# expression and only allows numbers, brackets and + - * / // % **, with limits
# on length, exponent and result size so a huge power cannot hang the process.
_OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
        ast.Div: operator.truediv, ast.FloorDiv: operator.floordiv, ast.Mod: operator.mod,
        ast.Pow: operator.pow, ast.USub: operator.neg, ast.UAdd: operator.pos}
_LIMIT = 1e300

def safe_calc(expression: str):
    if len(expression) > 200:
        raise ValueError("Expression is too long")

    def check(value):
        if abs(value) > _LIMIT:
            raise ValueError("Number is too large")
        return value

    def walk(node):
        if isinstance(node, ast.Constant) and type(node.value) in (int, float):
            return check(node.value)
        if isinstance(node, ast.BinOp) and type(node.op) in _OPS:
            left, right = walk(node.left), walk(node.right)
            if isinstance(node.op, ast.Pow) and abs(right) > 100:
                raise ValueError("Exponent is too large")
            return check(_OPS[type(node.op)](left, right))
        if isinstance(node, ast.UnaryOp) and type(node.op) in _OPS:
            return check(_OPS[type(node.op)](walk(node.operand)))
        raise ValueError("Only numbers, brackets and + - * / // % ** are allowed")

    return walk(ast.parse(expression, mode="eval").body)

class CalculatorTool(BaseTool):
    name: str = "Calculator"
    description: str = "Performs arithmetic. Input: an expression such as '(3 + 4) * 2'"

    def _run(self, expression: str) -> str:
        try:
            return f"Result: {safe_calc(expression)}"
        except Exception as e:
            return f"Error: {e}"

# Use custom tool
agent = Agent(
    role="Analyst",
    goal="Perform calculations",
    tools=[CalculatorTool()]
)
```

## YAML configuration (recommended)

### Project structure

```
my_project/
├── src/my_project/
│   ├── config/
│   │   ├── agents.yaml    # Agent definitions
│   │   └── tasks.yaml     # Task definitions
│   ├── crew.py            # Crew assembly
│   └── main.py            # Entry point
└── pyproject.toml
```

### agents.yaml

```yaml
researcher:
  role: "{topic} Senior Data Researcher"
  goal: "Uncover cutting-edge developments in {topic}"
  backstory: >
    You're a seasoned researcher with a knack for uncovering
    the latest developments in {topic}. Known for your ability
    to find relevant information and present it clearly.

reporting_analyst:
  role: "Reporting Analyst"
  goal: "Create detailed reports based on research data"
  backstory: >
    You're a meticulous analyst who transforms raw data into
    actionable insights through well-structured reports.
```

### tasks.yaml

```yaml
research_task:
  description: >
    Conduct thorough research about {topic}.
    Find the most relevant information for {year}.
  expected_output: >
    A list with 10 bullet points of the most relevant
    information about {topic}.
  agent: researcher

reporting_task:
  description: >
    Review the research and create a comprehensive report.
    Focus on key findings and recommendations.
  expected_output: >
    A detailed report in markdown format with executive
    summary, findings, and recommendations.
  agent: reporting_analyst
  output_file: report.md
```

### crew.py

```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool

@CrewBase
class MyProjectCrew:
    """My Project crew"""

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['researcher'],
            tools=[SerperDevTool()],
            verbose=True
        )

    @agent
    def reporting_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['reporting_analyst'],
            verbose=True
        )

    @task
    def research_task(self) -> Task:
        return Task(config=self.tasks_config['research_task'])

    @task
    def reporting_task(self) -> Task:
        return Task(
            config=self.tasks_config['reporting_task'],
            output_file='report.md'
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )
```

### main.py

```python
from my_project.crew import MyProjectCrew

def run():
    inputs = {
        'topic': 'AI Agents',
        'year': 2025
    }
    MyProjectCrew().crew().kickoff(inputs=inputs)

if __name__ == "__main__":
    run()
```

## Flows - Event-driven orchestration

For complex workflows with conditional logic, use Flows:

```python
from crewai.flow.flow import Flow, listen, start, router
from pydantic import BaseModel

class MyState(BaseModel):
    confidence: float = 0.0

class MyFlow(Flow[MyState]):
    @start()
    def gather_data(self):
        return {"data": "collected"}

    @listen(gather_data)
    def analyze(self, data):
        self.state.confidence = 0.85
        return analysis_crew.kickoff(inputs=data)

    @router(analyze)
    def decide(self):
        return "high" if self.state.confidence > 0.8 else "low"

    @listen("high")
    def generate_report(self):
        return report_crew.kickoff()

# Run flow
flow = MyFlow()
result = flow.kickoff()
```

See [Flows Guide](references/flows.md) for complete documentation.

## Memory system

```python
# Enable all memory types
crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    memory=True,           # Enable memory
    embedder={             # Custom embeddings
        "provider": "openai",
        "config": {"model": "text-embedding-3-small"}
    }
)
```

**Memory types:** Short-term (ChromaDB), Long-term (SQLite), Entity (ChromaDB)

## LLM providers

```python
from crewai import LLM

llm = LLM(model="gpt-4o")                              # OpenAI (default)
llm = LLM(model="claude-sonnet-4-5-20250929")                       # Anthropic
llm = LLM(model="ollama/llama3.1", base_url="http://localhost:11434")  # Local
llm = LLM(model="azure/gpt-4o", base_url="https://...")              # Azure

agent = Agent(role="Analyst", goal="Analyze data", llm=llm)
```

## CrewAI vs alternatives

| Feature | CrewAI | LangChain | LangGraph |
|---------|--------|-----------|-----------|
| **Best for** | Multi-agent teams | General LLM apps | Stateful workflows |
| **Learning curve** | Low | Medium | Higher |
| **Agent paradigm** | Role-based | Tool-based | Graph-based |
| **Memory** | Built-in | Plugin-based | Custom |

## Best practices

1. **Clear roles** - Each agent should have a distinct specialty
2. **YAML config** - Better organization for larger projects
3. **Enable memory** - Improves context across tasks
4. **Set max_iter** - Prevent infinite loops (default 15)
5. **Limit tools** - 3-5 tools per agent max
6. **Rate limiting** - Set max_rpm to avoid API limits

## Common issues

**Agent stuck in loop:**
```python
agent = Agent(
    role="...",
    max_iter=10,           # Limit iterations
    max_rpm=5              # Rate limit
)
```

**Task not using context:**
```python
task2 = Task(
    description="...",
    context=[task1],       # Explicitly pass context
    agent=writer
)
```

**Memory errors:**
```python
# Use environment variable for storage
import os
os.environ["CREWAI_STORAGE_DIR"] = "./my_storage"
```

## References

- **[Flows Guide](references/flows.md)** - Event-driven workflows, state management
- **[Tools Guide](references/tools.md)** - Built-in tools, custom tools, MCP
- **[Troubleshooting](references/troubleshooting.md)** - Common issues, debugging

## Resources

- **GitHub**: https://github.com/crewAIInc/crewAI (25k+ stars)
- **Docs**: https://docs.crewai.com
- **Tools**: https://github.com/crewAIInc/crewAI-tools
- **Examples**: https://github.com/crewAIInc/crewAI-examples
- **Version**: 1.2.0+
- **License**: MIT

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Simple code coach](https://useaiblocks.com/skills/simple-code-coach). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
