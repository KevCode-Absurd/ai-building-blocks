---
name: langchain
description: Framework for building LLM-powered applications with agents, chains, and RAG. Supports multiple providers (OpenAI, Anthropic, Google), 500+ integrations, ReAct agents, tool calling, memory management, and vector store retrieval. Use for building chatbots, question-answering systems, autonomous agents, or RAG applications. Best for rapid prototyping and production deployments.
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [Agents, LangChain, RAG, Tool Calling, ReAct, Memory Management, Vector Stores, LLM Applications, Chatbots, Production]
dependencies: [langchain, langchain-core, langchain-openai, langchain-anthropic]
---

# LangChain - Build LLM Applications with Agents & RAG

The most popular framework for building LLM-powered applications.

## When to use LangChain

**Use LangChain when:**
- Building agents with tool calling and reasoning (ReAct pattern)
- Implementing RAG (retrieval-augmented generation) pipelines
- Need to swap LLM providers easily (OpenAI, Anthropic, Google)
- Creating chatbots with conversation memory
- Rapid prototyping of LLM applications
- Production deployments with LangSmith observability

**Metrics** (the author's rough figures, with no source or date; do not repeat them as fact):
- 119,000+ GitHub stars
- 272,000+ repositories use LangChain
- 500+ integrations (models, vector stores, tools)
- 3,800+ contributors

**Use alternatives instead**:
- **LlamaIndex**: RAG-focused, better for document Q&A
- **LangGraph**: Complex stateful workflows, more control
- **Haystack**: Production search pipelines
- **Semantic Kernel**: Microsoft ecosystem

## Quick start

**Version check:** AI Blocks replaced the removed calls (LLMChain, ConversationBufferMemory, RetrievalQA, ConversationalRetrievalChain, langchain_core.pydantic_v1, the plain-string agent prompt and the URL passed to loader.load) with current patterns. The code has not been run here. Test each example against the current LangChain docs before you rely on it, and run it once in a test folder before you point it at real documents.

**Keys:** each provider reads its own environment variable, for example ANTHROPIC_API_KEY, OPENAI_API_KEY or GOOGLE_API_KEY. Never paste a key into the code or into a chat. The weather and search functions below are placeholders. They return a marker, not real data, and you must replace them with a real lookup.

### Installation

```bash
# Core library (Python 3.10+)
pip install -U langchain

# With OpenAI
pip install langchain-openai

# With Anthropic
pip install langchain-anthropic

# Common extras
pip install langchain-community  # 500+ integrations
pip install langchain-chroma     # Vector store
```

### Basic LLM usage

```python
from langchain_anthropic import ChatAnthropic

# Initialize model
llm = ChatAnthropic(model="claude-sonnet-4-5-20250929")

# Simple completion
response = llm.invoke("Explain quantum computing in 2 sentences")
print(response.content)
```

### Create an agent (ReAct pattern)

```python
from langchain.agents import create_agent
from langchain_anthropic import ChatAnthropic

# Define tools
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    return f"[PLACEHOLDER: replace with a real weather lookup for {city}]"

def search_web(query: str) -> str:
    """Search the web for information."""
    return f"[PLACEHOLDER: replace with a real search for: {query}]"

# Create agent (<10 lines!)
agent = create_agent(
    model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
    tools=[get_weather, search_web],
    system_prompt="You are a helpful assistant. Use tools when needed."
)

# Run agent
result = agent.invoke({"messages": [{"role": "user", "content": "What's the weather in Paris?"}]})
print(result["messages"][-1].content)
```

## Core concepts

### 1. Models - LLM abstraction

```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI

# Swap providers easily
llm = ChatOpenAI(model="gpt-4o")
llm = ChatAnthropic(model="claude-sonnet-4-5-20250929")
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp")

# Streaming
for chunk in llm.stream("Write a poem"):
    print(chunk.content, end="", flush=True)
```

### 2. Chains - Sequential operations

```python
from langchain_core.prompts import PromptTemplate

# Define prompt template
prompt = PromptTemplate.from_template("Write a 3-sentence summary about {topic}")

# Create chain: pipe the prompt into the model
chain = prompt | llm

# Run chain
result = chain.invoke({"topic": "machine learning"})
print(result.content)
```

### 3. Agents - Tool-using reasoning

**ReAct (Reasoning + Acting) pattern:**

```python
from langchain.agents import create_agent

# Define custom tool. Never call eval() on text a model gives you: it can run any code.
# This parser only allows plain arithmetic.
import ast, operator

_OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
        ast.Div: operator.truediv, ast.Pow: operator.pow, ast.USub: operator.neg}

def safe_calc(expression: str) -> float:
    def walk(node):
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return node.value
        if isinstance(node, ast.BinOp) and type(node.op) in _OPS:
            return _OPS[type(node.op)](walk(node.left), walk(node.right))
        if isinstance(node, ast.UnaryOp) and type(node.op) in _OPS:
            return _OPS[type(node.op)](walk(node.operand))
        raise ValueError("Only plain arithmetic is allowed")
    return walk(ast.parse(expression, mode="eval").body)

def calculator(expression: str) -> str:
    """Do plain arithmetic, for example 25 * 17 + 142."""
    return str(safe_calc(expression))

# Create agent with tools (search_web is the placeholder defined above)
agent = create_agent(
    model=llm,
    tools=[calculator, search_web],
    system_prompt="Answer questions using available tools"
)

# Run with reasoning
result = agent.invoke({"messages": [{"role": "user", "content": "What is 25 * 17 + 142?"}]})
print(result["messages"][-1].content)
```

### 4. Memory - Conversation history

```python
# Keep the chat history yourself and send all of it with each call
history = []

def chat(user_text):
    history.append({"role": "user", "content": user_text})
    reply = llm.invoke(history)
    history.append({"role": "assistant", "content": reply.content})
    return reply.content

# Multi-turn conversation
chat("Hi, I'm Alice")
print(chat("What's my name?"))  # Remembers "Alice"
```

## RAG (Retrieval-Augmented Generation)

### Basic RAG pipeline

```python
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate

# 1. Load documents
loader = WebBaseLoader("https://docs.python.org/3/tutorial/")
docs = loader.load()

# 2. Split into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
splits = text_splitter.split_documents(docs)

# 3. Create embeddings and vector store
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=OpenAIEmbeddings()
)

# 4. Create retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# 5. Create the answer prompt
prompt = ChatPromptTemplate.from_template(
    "Answer using only this context. If the answer is not in it, say so.\n\n{context}\n\nQuestion: {question}"
)

# 6. Query
question = "What are Python decorators?"
found = retriever.invoke(question)
context = "\n\n".join(d.page_content for d in found)
answer = (prompt | llm).invoke({"context": context, "question": question})
print(answer.content)
print("Sources:", [d.metadata.get("source") for d in found])
```

### Conversational RAG with memory

```python
# RAG with conversation memory: keep the history yourself, as in the memory example
rag_history = []

def ask(question):
    found = retriever.invoke(question)
    context = "\n\n".join(d.page_content for d in found)
    rag_history.append({"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"})
    reply = llm.invoke(rag_history)
    rag_history.append({"role": "assistant", "content": reply.content})
    return reply.content

# Multi-turn RAG
ask("What is Python used for?")
ask("Can you elaborate on web development?")  # Remembers context
```

## Advanced agent patterns

### Structured output

```python
from pydantic import BaseModel, Field

# Define schema
class WeatherReport(BaseModel):
    city: str = Field(description="City name")
    temperature: float = Field(description="Temperature in Fahrenheit")
    condition: str = Field(description="Weather condition")

# Get structured response
structured_llm = llm.with_structured_output(WeatherReport)
result = structured_llm.invoke("What's the weather in SF? It's 65F and sunny")
print(result.city, result.temperature, result.condition)
```

### Parallel tool execution

```python
from langchain.agents import create_agent

# The model can ask for independent tool calls in one step
agent = create_agent(
    model=llm,
    tools=[get_weather, search_web, calculator]
)

# This will call get_weather("Paris") and get_weather("London") in parallel
result = agent.invoke({
    "messages": [{"role": "user", "content": "Compare weather in Paris and London"}]
})
```

### Streaming agent execution

```python
# Stream agent steps
for step in agent.stream(
    {"messages": [{"role": "user", "content": "Research AI trends"}]},
    stream_mode="values",
):
    step["messages"][-1].pretty_print()
```

## Common patterns

### Multi-document QA

```python
from langchain_community.document_loaders import WebBaseLoader

# Load multiple documents (one loader per address)
urls = ["https://docs.python.org", "https://numpy.org/doc/"]
docs = [d for url in urls for d in WebBaseLoader(url).load()]

# QA with source citations: label each piece with its source
context = "\n\n".join(f"[{d.metadata.get('source')}] {d.page_content[:2000]}" for d in docs)
answer = llm.invoke(
    "Answer using only the sources below. Name the source in brackets after each claim.\n\n"
    f"{context}\n\nQuestion: How to use numpy arrays?"
)
print(answer.content)  # Includes source citations
```

### Custom tools with error handling

```python
from langchain.tools import tool

@tool
def risky_operation(query: str) -> str:
    """Perform a risky operation that might fail."""
    try:
        # Your operation here
        result = perform_operation(query)
        return f"Success: {result}"
    except Exception as e:
        return f"Error: {str(e)}"

# Agent handles errors gracefully
agent = create_agent(model=llm, tools=[risky_operation])
```

### LangSmith observability

```python
import os

# Enable tracing
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "<YOUR LANGSMITH KEY: set it in your environment, do not type it here>"
os.environ["LANGCHAIN_PROJECT"] = "my-project"

# All chains/agents automatically traced
agent = create_agent(model=llm, tools=[calculator])
result = agent.invoke({"messages": [{"role": "user", "content": "Calculate 123 * 456"}]})

# View traces at smith.langchain.com
```

## Vector stores

### Chroma (local)

```python
from langchain_chroma import Chroma

vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=OpenAIEmbeddings(),
    persist_directory="./chroma_db"
)
```

### Pinecone (cloud)

```python
from langchain_pinecone import PineconeVectorStore

vectorstore = PineconeVectorStore.from_documents(
    documents=docs,
    embedding=OpenAIEmbeddings(),
    index_name="my-index"
)
```

### FAISS (similarity search)

```python
from langchain_community.vectorstores import FAISS

vectorstore = FAISS.from_documents(docs, OpenAIEmbeddings())
vectorstore.save_local("faiss_index")

# Load later
vectorstore = FAISS.load_local("faiss_index", OpenAIEmbeddings())
```

## Document loaders

```python
# Web pages
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://example.com")

# PDFs
from langchain_community.document_loaders import PyPDFLoader
loader = PyPDFLoader("paper.pdf")

# GitHub
from langchain_community.document_loaders import GithubFileLoader
loader = GithubFileLoader(repo="user/repo", file_filter=lambda x: x.endswith(".py"))

# CSV
from langchain_community.document_loaders import CSVLoader
loader = CSVLoader("data.csv")
```

## Text splitters

```python
# Recursive (recommended for general text)
from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""]
)

# Code-aware
from langchain.text_splitter import PythonCodeTextSplitter
splitter = PythonCodeTextSplitter(chunk_size=500)

# Semantic (by meaning)
from langchain_experimental.text_splitter import SemanticChunker
splitter = SemanticChunker(OpenAIEmbeddings())
```

## Best practices

1. **Start simple** - Use `create_agent()` for most cases
2. **Enable streaming** - Better UX for long responses
3. **Add error handling** - Tools can fail, handle gracefully
4. **Use LangSmith** - Essential for debugging agents
5. **Optimize chunk size** - 500-1000 chars for RAG
6. **Version prompts** - Track changes in production
7. **Cache embeddings** - Expensive, cache when possible
8. **Monitor costs** - Track token usage with LangSmith

## Performance benchmarks

These times are rough guesses with no source. Measure your own setup.

| Operation | Latency | Notes |
|-----------|---------|-------|
| Simple LLM call | ~1-2s | Depends on provider |
| Agent with 1 tool | ~3-5s | ReAct reasoning overhead |
| RAG retrieval | ~0.5-1s | Vector search + LLM |
| Embedding 1000 docs | ~10-30s | Depends on model |

## LangChain vs LangGraph

| Feature | LangChain | LangGraph |
|---------|-----------|-----------|
| **Best for** | Quick agents, RAG | Complex workflows |
| **Abstraction level** | High | Low |
| **Code to start** | <10 lines | ~30 lines |
| **Control** | Simple | Full control |
| **Stateful workflows** | Limited | Native |
| **Cyclic graphs** | No | Yes |
| **Human-in-loop** | Basic | Advanced |

**Use LangGraph when:**
- Need stateful workflows with cycles
- Require fine-grained control
- Building multi-agent systems
- Production apps with complex logic

## References

- **[Agents Guide](references/agents.md)** - ReAct, tool calling, streaming
- **[RAG Guide](references/rag.md)** - Document loaders, retrievers, QA chains
- **[Integration Guide](references/integration.md)** - Vector stores, LangSmith, deployment

## Resources

- **GitHub**: https://github.com/langchain-ai/langchain ⭐ 119,000+
- **Docs**: https://docs.langchain.com
- **API Reference**: https://reference.langchain.com/python
- **LangSmith**: https://smith.langchain.com (observability)
- **Version**: 0.3+ (stable)
- **License**: MIT


