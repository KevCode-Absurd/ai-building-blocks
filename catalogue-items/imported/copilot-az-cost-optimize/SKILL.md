---
name: az-cost-optimize
description: 'Analyze Azure resources used in the app (IaC files and/or resources in a target rg) and optimize costs - creating GitHub issues for identified optimizations.'
---

# Azure Cost Optimize

This workflow analyzes Infrastructure-as-Code (IaC) files and Azure resources to generate cost optimization recommendations. It creates individual GitHub issues for each optimization opportunity plus one EPIC issue to coordinate implementation, enabling efficient tracking and execution of cost savings initiatives.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Azure price estimate researcher](https://useaiblocks.com/skills/copilot-azure-pricing). Bring your question, a plan (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Prerequisites
- Azure MCP server configured and authenticated
- GitHub MCP server configured and authenticated  
- Target GitHub repository identified
- Azure resources deployed, and IaC files for them (Step 2 stops if there are none)
- Prefer Azure MCP tools (`azmcp-*`) over direct Azure CLI when available

## Workflow Steps

### Step 1: Get Azure Best Practices
**Action**: Retrieve cost optimization best practices before analysis
**Tools**: Azure MCP best practices tool
**Process**:
1. **Load Best Practices**:
   - Execute `azmcp-bestpractices-get` to get some of the latest Azure optimization guidelines. This may not cover all scenarios but provides a foundation.
   - Use these practices to inform subsequent analysis and recommendations as much as possible
   - Reference best practices in optimization recommendations, either from the MCP tool output or general Azure documentation

### Step 2: Discover Azure Infrastructure
**Action**: Dynamically discover and analyze Azure resources and configurations
**Tools**: Azure MCP tools + Azure CLI fallback + Local file system access
**Process**:
1. **Resource Discovery**:
   - Execute `azmcp-subscription-list` to find available subscriptions
   - Execute `azmcp-group-list --subscription <subscription-id>` to find resource groups
   - Get a list of all resources in the relevant group(s):
     - Use `az resource list --subscription <id> --resource-group <name>`
   - For each resource type, use MCP tools first if possible, then CLI fallback:
     - `azmcp-cosmos-account-list --subscription <id>` - Cosmos DB accounts
     - `azmcp-storage-account-list --subscription <id>` - Storage accounts  
     - `azmcp-monitor-workspace-list --subscription <id>` - Log Analytics workspaces
     - `azmcp-keyvault-key-list` - Key Vaults
     - `az webapp list` - Web Apps (fallback - no MCP tool available)
     - `az appservice plan list` - App Service Plans (fallback)
     - `az functionapp list` - Function Apps (fallback)
     - `az sql server list` - SQL Servers (fallback)
     - `az redis list` - Redis Cache (fallback)
     - ... and so on for other resource types

2. **IaC Detection**:
   - Use `file_search` to scan for IaC files: "**/*.bicep", "**/*.tf", "**/main.json", "**/*template*.json"
   - Parse resource definitions to understand intended configurations
   - Compare against discovered resources to identify discrepancies
   - Note presence of IaC files for implementation recommendations later on
   - Do NOT use any other file from the repository, only IaC files. Using other files is NOT allowed as it is not a source of truth.
   - If you do not find IaC files, then STOP and report no IaC files found to the user.

3. **Configuration Analysis**:
   - Extract current SKUs, tiers, and settings for each resource
   - Identify resource relationships and dependencies
   - Map resource utilization patterns where available

### Step 3: Collect Usage Metrics & Validate Current Costs
**Action**: Gather utilization data AND verify actual resource costs
**Tools**: Azure MCP monitoring tools + Azure CLI
**Process**:
1. **Find Monitoring Sources**:
   - Use `azmcp-monitor-workspace-list --subscription <id>` to find Log Analytics workspaces
   - Use `azmcp-monitor-table-list --subscription <id> --workspace <name> --table-type "CustomLog"` to discover available data

2. **Execute Usage Queries**:
   - Use `azmcp-monitor-log-query` with these predefined queries:
     - Query: "recent" for recent activity patterns
     - Query: "errors" for error-level logs indicating issues
   - For custom analysis, use KQL queries:
   ```kql
   // CPU utilization for App Services
   AzureMetrics
   | where ResourceProvider == "MICROSOFT.WEB"
   | where MetricName == "CpuPercentage"
   | where TimeGenerated > ago(7d)
   | summarize avg(Average) by Resource, bin(TimeGenerated, 1h)
   
   // Cosmos DB RU consumption  
   AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.DOCUMENTDB"
   | where TimeGenerated > ago(7d)
   | summarize avg(RequestCharge) by Resource
   
   // Storage account access patterns
   StorageBlobLogs
   | where TimeGenerated > ago(7d)
   | summarize RequestCount=count() by AccountName, bin(TimeGenerated, 1d)
   ```

3. **Calculate Baseline Metrics**:
   - CPU/Memory utilization averages
   - Database throughput patterns
   - Storage access frequency
   - Function execution rates

4. **VALIDATE CURRENT COSTS**: 
   - Using the SKU/tier configurations discovered in Step 2
   - Look up current Azure pricing in the Azure Pricing Calculator (azure.microsoft.com/pricing/calculator/), in a Cost Management export the user provides, or with `az billing` commands. Name the source and date for each figure
   - Any cost or saving figure without a named source must be marked "estimate, unverified" in the summary and in every issue. Never present it as fact
   - Document: Resource → Current SKU → Estimated monthly cost
   - Calculate realistic current monthly total before proceeding to recommendations

### Step 4: Generate Cost Optimization Recommendations
**Action**: Analyze resources to identify optimization opportunities
**Tools**: Local analysis using collected data
**Process**:
1. **Apply Optimization Patterns** based on resource types found:
   
   **Compute Optimizations**:
   - App Service Plans: Right-size based on CPU/memory usage
   - Function Apps: Premium → Consumption plan for low usage
   - Virtual Machines: Scale down oversized instances
   
   **Database Optimizations**:
   - Cosmos DB: 
     - Provisioned → Serverless for variable workloads
     - Right-size RU/s based on actual usage
   - SQL Database: Right-size service tiers based on DTU usage
   
   **Storage Optimizations**:
   - Implement lifecycle policies (Hot → Cool → Archive)
   - Consolidate redundant storage accounts
   - Right-size storage tiers based on access patterns
   
   **Infrastructure Optimizations**:
   - Remove unused/redundant resources
   - Implement auto-scaling where beneficial
   - Schedule non-production environments

2. **Calculate Evidence-Based Savings**: 
   - Current validated cost → Target cost = Savings
   - Document pricing source for both current and target configurations

3. **Calculate Priority Score** for each recommendation. Score Value and Risk from 1 to 10. Value: 1 = a small saving that barely matters, 5 = a noticeable saving, 10 = a large share of the bill. Risk: 1 = easy to undo with no user impact, 5 = some chance of a short disruption, 10 = hard to undo or likely to affect users. Write both scores and the days of work in each issue so the score can be reproduced:
   ```
   Priority Score = (Value Score × Monthly Savings) / (Risk Score × Implementation Days)
   
   High Priority: Score > 20
   Medium Priority: Score 5-20
   Low Priority: Score < 5
   ```

4. **Validate Recommendations**:
   - Ensure Azure CLI commands are accurate
   - Verify estimated savings calculations
   - Assess implementation risks and prerequisites
   - Ensure all savings calculations have supporting evidence

### Step 5: User Confirmation
**Action**: Present summary and get approval before creating GitHub issues
**Process**:
1. **Display Optimization Summary**:
   ```
   🎯 Azure Cost Optimization Summary
   
   📊 Analysis Results:
   • Total Resources Analyzed: X
   • Current Monthly Cost: $X 
   • Potential Monthly Savings: $Y 
   • Optimization Opportunities: Z
   • High Priority Items: N
   
   🏆 Recommendations:
   1. [Resource]: [Current SKU] → [Target SKU] = $X/month savings - [Risk Level] | [Implementation Effort]
   2. [Resource]: [Current Config] → [Target Config] = $Y/month savings - [Risk Level] | [Implementation Effort]
   3. [Resource]: [Current Config] → [Target Config] = $Z/month savings - [Risk Level] | [Implementation Effort]
   ... and so on
   
   💡 This will create:
   • Y individual GitHub issues (one per optimization)
   • 1 EPIC issue to coordinate implementation
   
   ❓ Proceed with creating GitHub issues? (y/n)
   ```

2. **Wait for User Confirmation**: Only proceed if user confirms

### Step 6: Create Individual Optimization Issues
**Action**: Create separate GitHub issues for each optimization opportunity. Label them with "cost-optimization" (green color), "azure" (blue color).
**MCP Tools Required**: `create_issue` for each recommendation
**Process**:
1. **Create Individual Issues** using this template:

   **Title Format**: `[COST-OPT] [Resource Type] - [Brief Description] - $X/month savings`
   
   **Body Template**:
   ```markdown
   ## 💰 Cost Optimization: [Brief Title]
   
   **Monthly Savings**: $X | **Risk Level**: [Low/Medium/High] | **Implementation Effort**: X days
   
   ### 📋 Description
   [Clear explanation of the optimization and why it's needed]
   
   ### 🔧 Implementation
   
   **IaC Files Detected**: [Yes/No - based on file_search results]
   
   ```bash
   # Show the IaC modification + deployment
   # File: infrastructure/bicep/modules/app-service.bicep
   # Change: sku.name: 'S3' → 'B2'
   # Before deploying, note the current SKU and settings so the change can be rolled back.
   # Do not run this until the rollback values are written in the Validation Steps below and the user has approved.
   az deployment group create --resource-group [rg] --template-file infrastructure/bicep/main.bicep
   ```
   
   ### 📊 Evidence
   - Current Configuration: [details]
   - Usage Pattern: [evidence from monitoring data]
   - Cost Impact: $X/month → $Y/month
   - Best Practice Alignment: [reference to Azure best practices if applicable]
   
   ### ✅ Validation Steps
   - [ ] Write down the current SKU and settings (rollback values) before any change
   - [ ] Test in non-production environment
   - [ ] Verify no performance degradation
   - [ ] Confirm cost reduction in Azure Cost Management
   - [ ] Update monitoring and alerts if needed
   
   ### ⚠️ Risks & Considerations
   - [Risk 1 and mitigation]
   - [Risk 2 and mitigation]
   
   **Priority Score**: X | **Value**: X/10 | **Risk**: X/10
   ```

### Step 7: Create EPIC Coordinating Issue
**Action**: Create master issue to track all optimization work. Label it with "cost-optimization" (green color), "azure" (blue color), and "epic" (purple color).
**MCP Tools Required**: `create_issue` for EPIC
**Note about mermaid diagrams**: Ensure you verify mermaid syntax is correct and create the diagrams taking accessibility guidelines into account (styling, colors, etc.).
**Process**:
1. **Create EPIC Issue**:

   **Title**: `[EPIC] Azure Cost Optimization Initiative - $X/month potential savings`
   
   **Body Template**:
   ```markdown
   # 🎯 Azure Cost Optimization EPIC
   
   **Total Potential Savings**: $X/month | **Implementation Timeline**: X weeks
   
   ## 📊 Executive Summary
   - **Resources Analyzed**: X
   - **Optimization Opportunities**: Y  
   - **Total Monthly Savings Potential**: $X
   - **High Priority Items**: N
   
   ## 🏗️ Current Architecture Overview
   
   ```mermaid
   graph TB
       subgraph "Resource Group: [name]"
           [Generated architecture diagram showing current resources and costs]
       end
   ```
   
   ## 📋 Implementation Tracking
   
   ### 🚀 High Priority (Implement First)
   - [ ] #[issue-number]: [Title] - $X/month savings
   - [ ] #[issue-number]: [Title] - $X/month savings
   
   ### ⚡ Medium Priority 
   - [ ] #[issue-number]: [Title] - $X/month savings
   - [ ] #[issue-number]: [Title] - $X/month savings
   
   ### 🔄 Low Priority (Nice to Have)
   - [ ] #[issue-number]: [Title] - $X/month savings
   
   ## 📈 Progress Tracking
   - **Completed**: 0 of Y optimizations
   - **Savings Realized**: $0 of $X/month
   - **Implementation Status**: Not Started
   
   ## 🎯 Success Criteria
   - [ ] All high-priority optimizations implemented
   - [ ] >80% of estimated savings realized
   - [ ] No performance degradation observed
   - [ ] Cost monitoring dashboard updated
   
   ## 📝 Notes
   - Review and update this EPIC as issues are completed
   - Monitor actual vs. estimated savings
   - Consider scheduling regular cost optimization reviews
   ```

## Error Handling
- **Unverified figures**: Label any cost or saving without a named pricing source "estimate, unverified" everywhere it appears
- **Cost Validation**: If savings estimates lack supporting evidence or seem inconsistent with Azure pricing, re-verify configurations and pricing sources before proceeding
- **Azure Authentication Failure**: Provide manual Azure CLI setup steps
- **No Resources Found**: Stop and tell the user there is nothing to review
- **GitHub Creation Failure**: Output formatted recommendations to console
- **Insufficient Usage Data**: Note limitations and provide configuration-based recommendations only

## Success Criteria
- ✅ All cost estimates verified against actual resource configurations and Azure pricing
- ✅ Individual issues created for each optimization (trackable and assignable)
- ✅ EPIC issue provides comprehensive coordination and tracking
- ✅ All recommendations include specific, executable Azure CLI commands
- ✅ Priority scoring enables ROI-focused implementation
- ✅ Architecture diagram accurately represents current state
- ✅ User confirmation prevents unwanted issue creation

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Azure architecture reviewer](https://useaiblocks.com/skills/copilot-azure-well-architected-review). It takes the plan.
- The [AWS architecture reviewer](https://useaiblocks.com/skills/copilot-aws-well-architected-review). It takes the plan.
- The [Azure price estimate researcher](https://useaiblocks.com/skills/copilot-azure-pricing). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
