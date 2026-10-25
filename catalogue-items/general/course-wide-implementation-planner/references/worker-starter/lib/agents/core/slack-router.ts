/**
 * SlackRouter
 *
 * Socket Mode Slack client plus a minimal `!command` dispatcher.
 * Agents get a SlackPoster handle via setSlackRouter(). They never see the
 * Bolt app directly.
 */

import { App, LogLevel } from '@slack/bolt'
import type { SlackPoster } from './base-agent.js'

type CommandHandler = (args: string, channel: string, userId: string) => Promise<void>

export class SlackRouter implements SlackPoster {
  private readonly app: App
  private readonly commands = new Map<string, CommandHandler>()
  private connected = false

  constructor(botToken: string, appToken: string) {
    this.app = new App({
      token: botToken,
      appToken,
      socketMode: true,
      logLevel: LogLevel.WARN,
    })

    this.app.message(/^!(\w+)(?:\s+(.*))?$/s, async ({ message, context }) => {
      if (message.subtype) return
      const match = context.matches as RegExpExecArray | undefined
      if (!match) return
      const [, command, rest] = match
      const handler = this.commands.get(command)
      if (!handler) return
      const anyMsg = message as unknown as { channel: string; user: string }
      await handler(rest ?? '', anyMsg.channel, anyMsg.user)
    })
  }

  registerCommand(name: string, handler: CommandHandler): void {
    this.commands.set(name, handler)
  }

  async connect(): Promise<void> {
    await this.app.start()
    this.connected = true
  }

  async postMessage(channel: string, text: string): Promise<void> {
    await this.app.client.chat.postMessage({ channel, text })
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return
    await this.app.stop()
    this.connected = false
  }
}
