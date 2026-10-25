/**
 * BaseAgent
 *
 * Every agent extends this. The contract is deliberately small:
 * - id:           unique string used by the registry and the queue
 * - handleJob:    the worker calls this when a job shows up
 * - setSlackRouter: setter injection so agents can post without importing the router
 */

export interface AgentJob {
  id: string
  agentId: string
  type: string
  payload: Record<string, unknown>
  createdAt: string
}

export interface AgentJobResult {
  ok: boolean
  output?: string
  error?: string
}

export interface SlackPoster {
  postMessage(channel: string, text: string): Promise<void>
}

export abstract class BaseAgent {
  public abstract readonly id: string
  protected slack: SlackPoster | null = null

  setSlackRouter(poster: SlackPoster): void {
    this.slack = poster
  }

  protected async post(channel: string, text: string): Promise<void> {
    if (!this.slack) {
      console.warn(`[${this.id}] slack poster not wired, dropping message:`, text)
      return
    }
    await this.slack.postMessage(channel, text)
  }

  abstract handleJob(job: AgentJob): Promise<AgentJobResult>
}
