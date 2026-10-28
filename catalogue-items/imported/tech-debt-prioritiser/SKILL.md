---
name: code-refactoring-tech-debt
description: "Identify technical debt from actual code and change history, estimate its impact, and prioritize bounded improvements with explicit assumptions."
risk: safe
source: community
date_added: "2026-02-27"
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Compatibility and maintenance

Primary editorial path for this compatibility group. The full instructions and support files remain local so existing installations
continue to work offline. This is one shared procedure, not an additional capability.
Preserve the callable ID when an existing manifest or client configuration uses it.
Modified in AAS on 2026-09-05; original metadata and license notices are retained.

# Technical Debt Analysis and Remediation

You are a technical debt expert specializing in identifying, quantifying, and prioritizing technical debt in software projects. Analyze the codebase to uncover debt, assess its impact, and create actionable remediation plans.

## Use this skill when

- Working on technical debt analysis and remediation tasks or workflows
- Needing guidance, best practices, or checklists for technical debt analysis and remediation

## Do not use this skill when

- The task is unrelated to technical debt analysis and remediation
- You need a different domain or tool outside this scope

## Context
The user needs a comprehensive technical debt analysis to understand what's slowing down development, increasing bugs, and creating maintenance challenges. Focus on practical, measurable improvements with clear ROI.

## Requirements
The SonarQube, Codecov and Dependabot tools named in the Prevention section are optional. They need their own accounts and may cost money. The analysis works without them.

Inspect the current repository, hotspots and real change/incident history. The numbers,
thresholds, staffing and timelines below are hypothetical planning examples, not
measurements, promised returns or mandatory quality gates. Report missing cost/usage
inputs as unknown; never fill them with fabricated telemetry. Review-only scope does
not authorize broad refactors, policy changes or deployment.

## Instructions

### 1. Technical Debt Inventory

Conduct a thorough scan for all types of technical debt:

**Code Debt**
- **Duplicated Code**
  - Exact duplicates (copy-paste)
  - Similar logic patterns
  - Repeated business rules
  - Quantify: Lines duplicated, locations
  
- **Complex Code**
  - High cyclomatic complexity (>10)
  - Deeply nested conditionals (>3 levels)
  - Long methods (>50 lines)
  - God classes (>500 lines, >20 methods)
  - Quantify: Complexity scores, hotspots

- **Poor Structure**
  - Circular dependencies
  - Inappropriate intimacy between classes
  - Feature envy (methods using other class data)
  - Shotgun surgery patterns
  - Quantify: Coupling metrics, change frequency

**Architecture Debt**
- **Design Flaws**
  - Missing abstractions
  - Leaky abstractions
  - Violated architectural boundaries
  - Monolithic components
  - Quantify: Component size, dependency violations

- **Technology Debt**
  - Outdated frameworks/libraries
  - Deprecated API usage
  - Legacy patterns (e.g., callbacks vs promises)
  - Unsupported dependencies
  - Quantify: Version lag, security vulnerabilities

**Testing Debt**
- **Coverage Gaps**
  - Untested code paths
  - Missing edge cases
  - No integration tests
  - Lack of performance tests
  - Quantify: Coverage %, critical paths untested

- **Test Quality**
  - Brittle tests (environment-dependent)
  - Slow test suites
  - Flaky tests
  - No test documentation
  - Quantify: Test runtime, failure rate

**Documentation Debt**
- **Missing Documentation**
  - No API documentation
  - Undocumented complex logic
  - Missing architecture diagrams
  - No onboarding guides
  - Quantify: Undocumented public APIs

**Infrastructure Debt**
- **Deployment Issues**
  - Manual deployment steps
  - No rollback procedures
  - Missing monitoring
  - No performance baselines
  - Quantify: Deployment time, failure rate

### 2. Impact Assessment

Calculate the real cost of each debt item. Every number in the examples below is a bracketed placeholder. Fill each one only with a number measured from the user's own history and cost, and write "unknown" where there is no data.

**Development Velocity Impact**
```
Debt Item: [name of the debt item]
Locations: [number of files]
Time Impact: 
- [hours] per bug fix
- [hours] per feature change
- Monthly impact: [hours, or unknown]
Annual Cost: [hours per year] × [your hourly cost] = [annual cost]
```

**Quality Impact**
```
Debt Item: [name of the debt item]
Bug Rate: [bugs per month, from your tracker]
Average Bug Cost:
- Investigation: [hours]
- Fix: [hours]
- Testing: [hours]
- Deployment: [hours]
Monthly Cost: [bugs per month] × [hours per bug] × [your hourly cost]
Annual Cost: [monthly cost] × 12
```

**Risk Assessment**
- **Critical**: Security vulnerabilities, data loss risk
- **High**: Performance degradation, frequent outages
- **Medium**: Developer frustration, slow feature delivery
- **Low**: Code style issues, minor inefficiencies

### 3. Debt Metrics Dashboard

Create measurable KPIs:

**Code Quality Metrics** (layout only: fill each value from a real measurement, or write unknown)
```yaml
Metrics:
  cyclomatic_complexity:
    current: [measured value]
    target: [your target]
    files_above_threshold: [count]
    
  code_duplication:
    percentage: [measured %]
    target: [your target]
    duplication_hotspots:
      - [folder]: [lines]
      
  test_coverage:
    unit: [measured %]
    integration: [measured %]
    e2e: [measured %]
    target: [your targets]
    
  dependency_health:
    outdated_major: [count]
    outdated_minor: [count]
    security_vulnerabilities: [count]
    deprecated_apis: [count]
```

**Trend Analysis**
```python
debt_trends = {
    "[QUARTER 1]": {"score": "[SCORE]", "items": "[COUNT]"},
    "[QUARTER 2]": {"score": "[SCORE]", "items": "[COUNT]"},
    "[QUARTER 3]": {"score": "[SCORE]", "items": "[COUNT]"},
    "growth_rate": "[calculated from the values above, or unknown]"
}  # Only chart a trend if the user has past scores. Otherwise write unknown.
```

### 4. Prioritized Remediation Plan

Create an actionable roadmap based on ROI:

**Quick Wins (High Value, Low Effort)**
Week 1-2:
```
1. [Quick win from the user's own inventory]
   Effort: [hours]
   Savings: [hours per month, or unknown]
   Net time ROI: ([savings] - [effort]) / [effort], only if both are known

2. [Next quick win]
   Effort: [hours]
   Savings: [hours per month, or unknown]

3. [Next quick win]
   Effort: [hours]
   Savings: [hours per month, or unknown]
```

**Medium-Term Improvements (Month 1-3)**
```
1. [Example item: split a very large class into focused parts]
   - Add tests first
   - Create clear interfaces
   Effort: [hours]
   Savings: [hours per month, or unknown]
   ROI: [only from known effort and savings]

2. [Example item: upgrade an outdated framework]
   - Update patterns that changed
   - Fix breaking changes
   Effort: [hours]
   Benefits: measure compatibility and actual performance; no assumed uplift
   ROI: [only from known effort and savings]
```

**Long-Term Initiatives (Quarter 2-4)**
```
1. Implement Domain-Driven Design
   - Define bounded contexts
   - Create domain models
   - Establish clear boundaries
   Effort: [hours]
   Benefits: assess actual coupling after a scoped change
   ROI: [only from known effort and savings]

2. Comprehensive Test Suite
   - Unit: [target coverage]
   - Integration: [target coverage]
   - E2E: Critical paths
   Effort: [hours]
   Benefits: measure escaped defects; no guaranteed reduction
   ROI: [only from known effort and savings]
```

### 5. Implementation Strategy

**Incremental Refactoring**
```python
# Phase 1: Add facade over legacy code
class PaymentFacade:
    def __init__(self):
        self.legacy_processor = LegacyPaymentProcessor()
    
    def process_payment(self, order):
        # New clean interface
        return self.legacy_processor.doPayment(order.to_legacy())

# Phase 2: Implement new service alongside
class PaymentService:
    def process_payment(self, order):
        # Clean implementation
        pass

# Phase 3: Gradual migration
class PaymentFacade:
    def __init__(self):
        self.new_service = PaymentService()
        self.legacy = LegacyPaymentProcessor()
        
    def process_payment(self, order):
        if feature_flag("use_new_payment"):
            return self.new_service.process_payment(order)
        return self.legacy.doPayment(order.to_legacy())
```

**Team Allocation**
```yaml
Debt_Reduction_Team:
  dedicated_time: "20% sprint capacity"
  
  roles:
    - tech_lead: "Architecture decisions"
    - senior_dev: "Complex refactoring"  
    - dev: "Testing and documentation"
    
  sprint_goals:
    - sprint_1: "Quick wins completed"
    - sprint_2: "God class refactoring started"
    - sprint_3: "Test coverage >60%"
```

### 6. Prevention Strategy

Implement gates to prevent new debt:

**Automated Quality Gates**
```yaml
pre_commit_hooks:
  - complexity_check: "max 10"
  - duplication_check: "max 5%"
  - test_coverage: "min 80% for new code"
  
ci_pipeline:
  - dependency_audit: "no high vulnerabilities"
  - performance_test: "no regression >10%"
  - architecture_check: "no new violations"
  
code_review:
  - requires_two_approvals: true
  - must_include_tests: true
  - documentation_required: true
```

**Debt Budget**
```python
debt_budget = {
    "allowed_monthly_increase": "2%",
    "mandatory_reduction": "5% per quarter",
    "tracking": {
        "complexity": "sonarqube",
        "dependencies": "dependabot",
        "coverage": "codecov"
    }
}
```

### 7. Communication Plan

**Stakeholder Reports**
```markdown
## Executive Summary
- Current debt score: [measured score and how it was worked out]
- Monthly velocity loss: [measured value or "unknown"]
- Bug rate increase: [measured value or "unknown"]
- Recommended investment: [hours]
- Expected ROI: [from the user's own numbers, or "unknown"]

## Key Risks
1. [Risk found in the code, with the file and evidence]
2. [Risk found in the code, with the file and evidence]
3. [Risk found in the code, with the file and evidence]

## Proposed Actions
1. Immediate: Security patches (this week)
2. Short-term: Core refactoring (1 month)
3. Long-term: Architecture modernization (6 months)
```

**Developer Documentation**
```markdown
## Refactoring Guide
1. Always maintain backward compatibility
2. Write tests before refactoring
3. Use feature flags for gradual rollout
4. Document architectural decisions
5. Measure impact with metrics

## Code Standards
- Complexity limit: [your limit]
- Method length: [your limit]
- Class length: [your limit]
- Test coverage: [your target]
- Documentation: All public APIs
```

### 8. Success Metrics

Track progress with clear KPIs:

**Monthly Metrics**
- Debt score reduction: [your target]
- New bug rate: [your target]
- Deployment frequency: [your target]
- Lead time: [your target]
- Test coverage: [your target]

**Quarterly Reviews**
- Architecture health score
- Developer satisfaction survey
- Performance benchmarks
- Security audit results
- Cost savings achieved

## Output Format

1. **Debt Inventory**: Comprehensive list categorized by type with metrics
2. **Impact Analysis**: Cost calculations and risk assessments
3. **Prioritized Roadmap**: Quarter-by-quarter plan with clear deliverables
4. **Quick Wins**: Immediate actions for this sprint
5. **Implementation Guide**: Step-by-step refactoring strategies
6. **Prevention Plan**: Processes to avoid accumulating new debt
7. **ROI Projections**: Expected returns on debt reduction investment

Focus on delivering measurable improvements that directly impact development velocity, system reliability, and team morale.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code maintenance reviewer](https://useaiblocks.com/skills/monthly-tech-debt-keeper).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
