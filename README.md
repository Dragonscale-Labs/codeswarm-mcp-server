# @codeswarm/mcp-server

A Node.js MCP (Model Context Protocol) server for CodeSwarm, enabling integration with Cursor and other MCP-compatible tools.

## Installation

Install globally with your preferred package manager:

```sh
pnpm add -g @codeswarm/mcp-server
# or
npm install -g @codeswarm/mcp-server
# or
yarn global add @codeswarm/mcp-server
```

## Usage

Run the MCP server with your API key:

```sh
CODESWARM_API_KEY=YOUR_API_KEY pnpx @codeswarm/mcp-server
```

Or set the environment variable in your shell/profile.

## MCP Config Example (for Cursor)

Add this to your `.cursor/mcp.json` or MCP config:

```json
{
  "mcpServers": {
    "CodeSwarm": {
      "command": "pnpx",
      "args": [
        "@codeswarm/mcp-server"
      ],
      "env": {
        "CODESWARM_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

## Development

Clone the repo and install dependencies:

```sh
pnpm install
```

Build the project:

```sh
pnpm build
```

Run in development mode:

```sh
pnpm dev
```

## License

MIT 