---
name: go-mcp-server-generator
description: 'Generate a starter Go MCP server project with proper structure, dependencies, and implementation using the official github.com/modelcontextprotocol/go-sdk.'
---

# Go MCP Server Project Generator

Generate a complete starter Model Context Protocol (MCP) server project in Go. It is a starter project that must be built and tested before anyone relies on it.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code or Codex:** They can create the files, run go mod tidy and go test, and fix errors in one pass.
- **Chat AI without file access:** It can write each file for you to copy into a folder, but you run the commands yourself.
<!-- /needs -->

## Before you generate

Ask once for what you do not have. Never invent it.

- Project name (used for the module, folder and server name).
- Go module path. If the person has none, use `github.com/yourusername/<name>` and say it is a placeholder.
- The tools wanted: for each, a name, its inputs and what it returns. If you have a tool set plan, take them from it. If none are given, build two sample tools and label them SAMPLE so they are replaced.
- Where the data comes from (file, database, API). If it needs a key or password, read it from an environment variable. Never write a secret into a file.
- The Go version installed, if known. The template uses 1.23.

This skill needs a Go install and a way to create files and run commands. If the AI cannot run commands, write each file out in full, then give the person the commands to run (below) and ask them to paste any error back.

## Read this first: the templates are untested

The code templates below were written against go-sdk v1.0.0. They have not been compiled by us. The calls most likely to need changes in a newer SDK are `mcp.NewServer`, `mcp.Options` and the capability types, `mcp.AddTool`, `mcp.CallToolRequest` and `mcp.CallToolResult`, and `mcp.StdioTransport`. After generating the files, run `go mod tidy` and `go build ./...`, read any error against the SDK's own documentation, and fix the call. Tell the user the project may need these fixes before it runs.

## Project Requirements

You will create a Go MCP server with:

1. **Project Structure**: Proper Go module layout
2. **Dependencies**: Official MCP SDK and necessary packages
3. **Server Setup**: Configured MCP server with transports
4. **Tools**: At least 2-3 useful tools with typed inputs/outputs
5. **Error Handling**: Proper error handling and context usage
6. **Documentation**: README with setup and usage instructions
7. **Testing**: Basic test structure

## Template Structure

```
myserver/
├── go.mod
├── go.sum
├── main.go
├── tools/
│   ├── tool1.go
│   └── tool2.go
├── resources/            (optional: only if the user wants MCP resources; skip it otherwise)
│   └── resource1.go
├── config/
│   └── config.go
├── README.md
└── main_test.go
```

## go.mod Template

```go
module github.com/yourusername/{{PROJECT_NAME}}

go 1.23

require (
    github.com/modelcontextprotocol/go-sdk v1.0.0
)
```

## main.go Template

```go
package main

import (
    "context"
    "log"
    "os"
    "os/signal"
    "syscall"

    "github.com/modelcontextprotocol/go-sdk/mcp"
    "github.com/yourusername/{{PROJECT_NAME}}/config"
    "github.com/yourusername/{{PROJECT_NAME}}/tools"
)

func main() {
    cfg := config.Load()
    
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    // Handle graceful shutdown
    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)
    go func() {
        <-sigCh
        log.Println("Shutting down...")
        cancel()
    }()

    // Create server
    server := mcp.NewServer(
        &mcp.Implementation{
            Name:    cfg.ServerName,
            Version: cfg.Version,
        },
        &mcp.Options{
            Capabilities: &mcp.ServerCapabilities{
                Tools: &mcp.ToolsCapability{},
                // Only Tools are used in this template. Add Resources or Prompts here only if the user asks for them.
            },
        },
    )

    // Register tools
    tools.RegisterTools(server)

    // Run server
    transport := &mcp.StdioTransport{}
    if err := server.Run(ctx, transport); err != nil {
        log.Fatalf("Server error: %v", err)
    }
}
```

## tools/tool1.go Template

```go
package tools

import (
    "context"
    "fmt"

    "github.com/modelcontextprotocol/go-sdk/mcp"
)

type Tool1Input struct {
    Param1 string `json:"param1" jsonschema:"required,description=First parameter"`
    Param2 int    `json:"param2,omitempty" jsonschema:"description=Optional second parameter"`
}

type Tool1Output struct {
    Result string `json:"result" jsonschema:"description=The result of the operation"`
    Status string `json:"status" jsonschema:"description=Operation status"`
}

func Tool1Handler(ctx context.Context, req *mcp.CallToolRequest, input Tool1Input) (
    *mcp.CallToolResult,
    Tool1Output,
    error,
) {
    // Validate input
    if input.Param1 == "" {
        return nil, Tool1Output{}, fmt.Errorf("param1 is required")
    }

    // Check context
    if ctx.Err() != nil {
        return nil, Tool1Output{}, ctx.Err()
    }

    // Perform operation
    result := fmt.Sprintf("Processed: %s", input.Param1)

    return nil, Tool1Output{
        Result: result,
        Status: "success",
    }, nil
}

func RegisterTool1(server *mcp.Server) {
    mcp.AddTool(server,
        &mcp.Tool{
            Name:        "tool1",
            Description: "Description of what tool1 does",
        },
        Tool1Handler,
    )
}
```

## tools/registry.go Template

```go
package tools

import "github.com/modelcontextprotocol/go-sdk/mcp"

func RegisterTools(server *mcp.Server) {
    RegisterTool1(server)
    RegisterTool2(server)
    // Register additional tools here
}
```

## config/config.go Template

```go
package config

import "os"

type Config struct {
    ServerName string
    Version    string
    LogLevel   string
}

func Load() *Config {
    return &Config{
        ServerName: getEnv("SERVER_NAME", "{{PROJECT_NAME}}"),
        Version:    getEnv("VERSION", "v1.0.0"),
        LogLevel:   getEnv("LOG_LEVEL", "info"),
    }
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}
```

## main_test.go Template

```go
package main

import (
    "context"
    "testing"

    "github.com/yourusername/{{PROJECT_NAME}}/tools"
)

func TestTool1Handler(t *testing.T) {
    ctx := context.Background()
    input := tools.Tool1Input{
        Param1: "test",
        Param2: 42,
    }

    result, output, err := tools.Tool1Handler(ctx, nil, input)
    if err != nil {
        t.Fatalf("Tool1Handler failed: %v", err)
    }

    if output.Status != "success" {
        t.Errorf("Expected status 'success', got '%s'", output.Status)
    }

    if result != nil {
        t.Error("Expected result to be nil")
    }
}
```

## README.md Template

````markdown
# {{PROJECT_NAME}}

A Model Context Protocol (MCP) server built with Go.

## Description

{{PROJECT_DESCRIPTION}}

## Installation

```bash
go mod download
go build -o {{PROJECT_NAME}}
```

## Usage

Run the server with stdio transport:

```bash
./{{PROJECT_NAME}}
```

## Configuration

Configure via environment variables:

- `SERVER_NAME`: Server name (default: "{{PROJECT_NAME}}")
- `VERSION`: Server version (default: "v1.0.0")
- `LOG_LEVEL`: Logging level (default: "info")

## Available Tools

### tool1
{{TOOL1_DESCRIPTION}}

**Input:**
- `param1` (string, required): First parameter
- `param2` (int, optional): Second parameter

**Output:**
- `result` (string): Operation result
- `status` (string): Status of the operation

## Development

Run tests:

```bash
go test ./...
```

Build:

```bash
go build -o {{PROJECT_NAME}}
```

## License

MIT
````

## Generation Instructions

When generating a Go MCP server:

1. **Initialize Module**: Create `go.mod` with proper module path
2. **Structure**: Follow the template directory structure
3. **Type Safety**: Use structs with JSON schema tags for all inputs/outputs
4. **Error Handling**: Validate inputs, check context, wrap errors
5. **Documentation**: Add clear descriptions and examples
6. **Testing**: Include at least one test per tool
7. **Configuration**: Use environment variables for config
8. **Logging**: Use structured logging (log/slog)
9. **Graceful Shutdown**: Handle signals properly
10. **Transport**: Default to stdio, document alternatives

## Best Practices

- Keep tools focused and single-purpose
- Use descriptive names for types and functions
- Include JSON schema documentation in struct tags
- Always respect context cancellation
- Return descriptive errors
- Keep main.go minimal, logic in packages
- Write tests for tool handlers
- Document all exported functions

## After you generate

1. Run `go mod tidy`, then `go test ./...`, then `go build`. Read the output.
2. The template pins an SDK version in go.mod. If the code does not compile against the version `go mod tidy` picks, change the code to match that version's API, and tell the person what you changed. Do not claim the project works unless the build and tests passed. If you could not run them, say "not built or tested".
3. Finish with a short note: what each tool does, the commands to run, what is still a placeholder, and how to add the server to an MCP client (give the path to the built program). If you are not sure of a client's setting names, say so and point to that client's own docs.

Do not use this skill to change an existing server, or to write a Python or TypeScript server.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [TypeScript MCP server builder](https://useaiblocks.com/skills/copilot-typescript-mcp-server-generator). It takes the codebase.
- The [Python MCP server starter builder](https://useaiblocks.com/skills/copilot-python-mcp-server-generator). It takes the codebase.
- The [API to MCP server builder](https://useaiblocks.com/skills/api-to-mcp-server-builder). It takes the codebase.
- The [MCP package version checker](https://useaiblocks.com/skills/mcp-config-version-checker). It takes the codebase.
- The [MCP attack risk reviewer](https://useaiblocks.com/skills/mcp-attack-defence-reviewer). It takes the codebase.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
