

Event-driven agent triggering. Eliminates cron-only delays by waking agents immediately when proposals are approved, issues assigned, dependencies cleared, or escalations happen.What wakeups doWakeups turn your system from scheduled (cron-based) into event-driven.Instead of waiting for the next heartbeat, agents react immediately to events. The heartbeat keeps the system alive; wakeups make it responsive.Core conceptA wakeup is a signal, not work.If you want execution:- Create an issue (defines the work) - Fire a wakeup (triggers execution now)Wakeup reasons (priority system)- proposal_approved: execute immediately - dependency_cleared: unblock work - assignment: new task available - child_completed: parent can finalize - proposal_rejected: revise or iterate - escalation: urgent interruptThe 5 core patterns1. Monitoring → Execution (Ad fatigue)A monitoring agent detects an issue, creates a task, and wakes another agent.const issue = await createIssue(db, {
  title: 'Pause fatigued ad set: hero_v3',
  assignee_agent_id: 'riley',
  created_by_agent_id: 'mia',
  client_id: 'northwind-skincare',
  priority: 1,
  labels: ['fatigue', 'creative-refresh'],
})

await dispatchForAssignment(wakeupsDb, 'riley', issue.id, 1)Impact: reaction time drops from hours to seconds.2. Human approval → ExecutionApproval triggers immediate execution.await db.from('proposals')
  .update({ status: 'approved', approved_by: userId, approved_at: new Date().toISOString() })
  .eq('id', proposalId)

await dispatchForProposalApproved(wakeupsDb, proposal.agent_id, proposalId)Impact: real-time human → agent loop.3. Rejection → IterationRejected proposals trigger revision.await db.from('proposals')
  .update({
    status: 'rejected',
    rejected_by: userId,
    rejection_reason: feedback,
    rejected_at: new Date().toISOString(),
  })
  .eq('id', proposalId)

await dispatchForProposalRejected(wakeupsDb, proposal.agent_id, proposalId)Impact: keeps iteration tight and fresh.4. Child completed → Parent consolidationParent is triggered when all children are done.async function onIssueCompleted(issueId: string) {
  const issue = await db.getIssue(issueId)
  if (!issue.parent_id) return

  const siblings = await db.getSiblings(issue.parent_id)
  const allDone = siblings.every(s => s.status === 'done' || s.status === 'cancelled')
  if (!allDone) return

  const parent = await db.getIssue(issue.parent_id)
  if (parent.assignee_agent_id) {
    await dispatchForChildCompleted(wakeupsDb, parent.assignee_agent_id, issue.id)
  }
}Impact: prevents stuck parent tasks.5. Dependency cleared → Chain reactionUnblocks dependent work instantly.async function onIssueCompleted(issueId: string) {
  const blocked = await db.getBlockedByThis(issueId)
  for (const b of blocked) {
    if (!b.assignee_agent_id) continue
    await dispatchForDependencyCleared(wakeupsDb, b.assignee_agent_id, b.id)
  }
}Impact: enables cascading execution instead of slow queue draining.Wakeup lifecycleEvent happens → dispatch() → stored as pending → claimed by heartbeat → work executed → marked processedReliability and recoveryIf a worker crashes after claiming a wakeup, it must be reset:UPDATE agent_wakeups
SET status = 'pending', claimed_at = NULL
WHERE status = 'claimed'
  AND claimed_at < NOW() - INTERVAL '30 minutes';This ensures no wakeup is permanently lost.Common mistakesDispatching without dedup leads to event storms.Using wakeups without creating issues results in no execution.Marking wakeups as processed too early can lose work on crashes.Agents triggering wakeups for themselves creates infinite loops. Use issues instead.Key metrics- Wakeups per hour by type - Deduplication rate - Time from created to processed (should be seconds) - Stale pending wakeups (should be near zero)Bottom lineWakeups are what make the system real-time.Without them, everything waits on schedules.With them, agents coordinate instantly and execution flows continuously.They are the coordination layer that turns isolated agents into a system.
