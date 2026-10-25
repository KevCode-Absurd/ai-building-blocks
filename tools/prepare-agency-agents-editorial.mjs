// Reviewed outcome copy for the pinned Agency Agents intake. Run from the repo root.
import fs from 'node:fs';
const rows = JSON.parse(fs.readFileSync('reports/2026-10-25-agency-agents-inventory.json','utf8'));
const copy = `
academic-anthropologist|a cultural research brief grounded in observed practices
academic-geographer|an analysis of how place shapes people and markets
academic-historian|a historical explanation with sources and competing accounts
academic-narratologist|an analysis of narrative structure and meaning|write-and-tell-stories
academic-psychologist|an evidence review of behavior and possible explanations
academic-statistician|a statistical study plan with assumptions and validity checks|track-numbers
design-brand-guardian|a review of brand consistency with proposed fixes|brand-file
design-image-prompt-engineer|image prompts with subject, lighting and composition choices|make-images
design-inclusive-visuals-specialist|an image brief that checks representation and cultural context|make-images
design-persona-walkthrough|a simulated user walkthrough with friction points to test|audit-landing-page
design-ui-designer|an interface design with reusable components and accessibility checks
design-ui-finish-gate-reviewer|an interface review with visual gaps and release checks
design-ux-architect|a page structure and CSS plan developers can implement
design-ux-researcher|a user research plan with findings tied to evidence|understand-customers
design-visual-storyteller|a visual narrative plan with a clear message and sequence
design-whimsy-injector|small playful design ideas with usability checks||Playful design agent
engineering-ai-data-remediation-engineer|a data repair plan with traceable changes and validation|track-numbers
engineering-ai-engineer|an AI feature plan with deployment and quality checks
engineering-api-platform-engineer|an API contract with versioning and integration checks
engineering-ats-validator-architect|a resume parsing review with layout and extraction checks|find-a-job
engineering-autonomous-optimization-architect|a model routing plan with cost limits and trial checks|set-up-ai
engineering-backend-architect|a backend design with data, API and scaling choices
engineering-china-network-engineer|a network change plan for Chinese equipment with rollback checks
engineering-cms-developer|a WordPress or Drupal implementation plan with code checks|build-websites
engineering-code-reviewer|a code review with specific defects and proposed fixes|test-and-fix-code
engineering-codebase-onboarding-engineer|a codebase map with file references and learning steps|document-work
engineering-data-engineer|a data pipeline design with quality and recovery checks
engineering-data-visualization-engineer|a chart plan that matches the data and comparison|track-numbers
engineering-database-optimizer|a query and schema review with measurable tuning proposals
engineering-database-reliability-engineer|a database recovery plan with restore and failover tests|ship-and-host
engineering-desktop-app-engineer|a desktop app plan with packaging and update checks
engineering-developer-tooling-engineer|a developer tool plan with clear commands and failure handling
engineering-devops-automator|a deployment pipeline proposal with rollback and monitoring checks|ship-and-host
engineering-drupal-performance|a Drupal speed review with profiling evidence and fixes|speed-up-store
engineering-drupal-shopping-cart|a Drupal Commerce plan with order and payment checks|set-up-store
engineering-electrical-engineer|an electrical design review with units, standards and open risks
engineering-email-intelligence-engineer|an email parsing plan with structured fields and validation|connect-tools
engineering-embedded-firmware-engineer|a firmware design with hardware limits and reliability checks
engineering-feishu-integration-developer|a Feishu integration plan for bots, approvals and data|connect-tools
engineering-filament-optimization-specialist|a Filament admin review with clearer forms and navigation
engineering-finops-engineer|a cloud cost review with savings proposals and reliability checks|ship-and-host
engineering-frontend-developer|a responsive web interface plan with code and usability checks|build-websites
engineering-gaussdb-expert|a GaussDB query and schema review with tuning checks
engineering-git-workflow-master|a Git workflow plan with branch and review rules||Git workflow agent
engineering-i18n-engineer|a translation readiness review with locale and layout checks
engineering-identity-access-engineer|an authentication design with access rules and session checks|secure-code
engineering-incident-response-commander|an incident response plan with evidence, owners and recovery checks|ship-and-host
engineering-iot-fleet-engineer|an IoT fleet plan with rollout and recovery checks
engineering-it-service-manager|an IT service plan with incident and change procedures|organise-work
engineering-knowledge-graph-engineer|a knowledge graph design with entities, relations and query checks
engineering-llm-post-training-engineer|a model training plan with controlled evaluations and acceptance checks
engineering-minimal-change-engineer|a focused code fix with a small diff and verification|test-and-fix-code
engineering-mobile-app-builder|a mobile app implementation plan with device and usability checks
engineering-mobile-release-engineer|a mobile release plan with signing, rollout and recovery checks|ship-and-host
engineering-multi-agent-systems-architect|an agent system design with trust boundaries and failure handling|set-up-ai
engineering-network-engineer|a network diagnosis with path evidence and proposed changes
engineering-orgscript-engineer|an OrgScript model with grammar and meaning checks
engineering-payments-billing-engineer|a billing integration plan with webhook and reconciliation checks
engineering-pdf-engine-architect|a PDF layout design with page geometry and rendering checks|work-with-files
engineering-platform-engineer|a developer platform plan with service templates and operating rules
engineering-privacy-engineer|a privacy design with data flow and deletion checks|secure-code
engineering-prompt-engineer|a prompt draft with task constraints and evaluation cases|make-skills
engineering-rag-pipeline-engineer|a retrieval pipeline plan with source and answer quality checks
engineering-rapid-prototyper|a small prototype plan with clear scope and acceptance checks
engineering-realtime-collaboration-engineer|a collaboration design with synchronization and conflict checks
engineering-rust-refactoring-specialist|a Rust refactor proposal with migration and behavior checks|test-and-fix-code
engineering-search-relevance-engineer|a search ranking proposal with queries and relevance evaluations
engineering-section-508-specialist|an accessibility review with barriers, evidence and remediation checks|test-and-fix-code
engineering-senior-developer|a full stack implementation plan with code and performance checks
engineering-servicenow-developer-mentor|a ServiceNow diagnosis with log evidence and proposed fixes|test-and-fix-code
engineering-software-architect|a software design with tradeoffs, boundaries and decision records
engineering-solidity-smart-contract-engineer|a Solidity contract plan with gas and security checks
engineering-sre|a reliability plan with service goals, alerts and recovery checks|ship-and-host
engineering-technical-writer|technical documentation drafts with examples and accuracy checks|document-work
engineering-universal-document-compiler|a document generation plan with data and layout checks|work-with-files
engineering-uswds-developer|a USWDS website plan with components and accessibility checks|build-websites
engineering-video-streaming-engineer|a video streaming design with encoding and playback checks
engineering-voice-ai-integration-engineer|a speech pipeline plan with transcription and speaker checks|work-with-audio
engineering-webassembly-engineer|a WebAssembly integration plan with performance and boundary checks
engineering-wechat-mini-program-developer|a WeChat Mini Program plan with platform integration checks
engineering-wordpress-performance|a WordPress speed review with profiling evidence and proposed fixes|speed-up-store
engineering-wordpress-shopping-cart|a WooCommerce implementation plan with checkout and payment checks|set-up-store
finance-bookkeeper-controller|a bookkeeping and month close review with reconciliation checks
finance-financial-analyst|a financial model review with calculations and decision tradeoffs
finance-fpa-analyst|a budget and forecast plan with variance explanations
finance-investment-researcher|an investment research brief with evidence and downside risks
finance-tax-strategist|a tax planning brief with jurisdiction questions and review points
blender-addon-engineer|a Blender add-on plan with artist workflow and compatibility checks
economy-designer|a game economy model with currency flows and balance checks
game-audio-engineer|a game audio plan with sound events and integration checks|work-with-audio
game-designer|a gameplay loop proposal with player goals and playtest questions|build-product
godot-gameplay-scripter|a Godot gameplay implementation plan with scene and script checks
godot-multiplayer-engineer|a Godot networking design with synchronization and authority checks
godot-shader-developer|a Godot shader plan with rendering and performance checks
level-designer|a game level brief with pacing and navigation checks|design-work
narrative-designer|a game narrative plan with story and player choice paths|write-and-tell-stories
roblox-avatar-creator|a Roblox avatar plan with rigging and submission checks
roblox-experience-designer|a Roblox experience plan with progression and playtest questions|build-product
roblox-systems-scripter|a Roblox systems plan with Luau and server authority checks
technical-artist|an art pipeline plan with asset and rendering checks|design-work
unity-architect|a Unity architecture proposal with data and component boundaries
unity-editor-tool-developer|a Unity editor tool plan with workflow and usability checks
unity-multiplayer-engineer|a Unity multiplayer design with replication and prediction checks
unity-shader-graph-artist|a Unity shader design with render and performance checks|design-work
unreal-multiplayer-architect|an Unreal multiplayer design with server authority and replication checks
unreal-systems-engineer|an Unreal gameplay systems plan with implementation checks
unreal-technical-artist|an Unreal material and effects plan with performance checks|design-work
unreal-world-builder|an Unreal world plan with streaming and environment checks|design-work
gis-3d-scene-developer|a 3D map scene plan with terrain and rendering checks
gis-analyst|a spatial analysis brief with source data and map checks
gis-bim-specialist|a BIM and GIS integration plan with coordinate checks|connect-tools
gis-cartography-designer|a map design with symbols, labels and readability checks|design-work
gis-drone-reality-mapping|a drone mapping plan with capture and accuracy checks
gis-geoai-ml-engineer|a geospatial model plan with training data and validation checks|build-software
gis-geoprocessing-specialist|a geoprocessing workflow with data transformations and validation checks
gis-qa-engineer|a GIS test plan with spatial accuracy and data checks|test-and-fix-code
gis-solution-engineer|a GIS solution proposal with requirements and implementation choices
gis-spatial-data-engineer|a spatial data pipeline plan with storage and quality checks|build-software
gis-spatial-data-scientist|a spatial study plan with methods and uncertainty checks
gis-technical-consultant|a GIS implementation brief with risks and handoff steps
gis-web-gis-developer|a web mapping app plan with interaction and performance checks|build-websites
healthcare-clinical-evidence-agent|a clinical evidence brief with source quality and uncertainty|research-topics
healthcare-innovation-strategist|a healthcare innovation proposal with evidence gaps and feasibility checks|plan-strategy
healthcare-sovereign-health-systems-agent|a health systems strategy brief with governance and delivery checks|plan-strategy
marketing-aeo-foundations|a website structure plan for answer engines and source citations|get-found-in-search
marketing-agentic-search-optimizer|a search visibility review for AI discovery and action paths|get-found-in-search
marketing-ai-citation-strategist|an AI citation plan with source gaps and visibility checks|get-found-in-search
marketing-app-store-optimizer|an app store listing review with keyword and conversion proposals|get-found-in-search
marketing-baidu-seo-specialist|a Baidu search plan with site and content checks|get-found-in-search
marketing-bilibili-content-strategist|a Bilibili content plan with audience and format choices
marketing-book-co-author|a book outline and drafting plan with chapter goals|write-and-tell-stories
marketing-carousel-growth-engine|a carousel content plan with hooks and slide sequence||Carousel content agent
marketing-china-ecommerce-operator|a China ecommerce operating plan with platform and fulfilment checks|run-your-store
marketing-china-market-localization-strategist|a China market entry brief with localization and channel choices|plan-strategy
marketing-content-creator|content drafts with audience goals and channel choices
marketing-cross-border-ecommerce|a cross border ecommerce plan with market and compliance checks|run-your-store
marketing-developer-community-builder|a developer community plan with participation and trust measures
marketing-douyin-strategist|a Douyin content plan with video and commerce choices
marketing-email-strategist|an email plan with segments, deliverability and measurement checks|write-emails
marketing-global-podcast-strategist|a podcast expansion plan with language and market choices|work-with-audio
marketing-growth-hacker|a growth experiment plan with hypotheses and measurement checks||Growth experiment agent
marketing-instagram-curator|an Instagram content plan with visual themes and posting choices
marketing-kuaishou-strategist|a Kuaishou content plan with community and commerce choices
marketing-linkedin-content-creator|LinkedIn post drafts with audience and topic choices
marketing-livestream-commerce-coach|a live selling plan with run order and host practice|sell-and-negotiate
marketing-multi-platform-publisher|channel specific content drafts and a publishing proposal
marketing-podcast-strategist|a podcast plan with episode, guest and distribution choices|work-with-audio
marketing-pr-communications-manager|a communications plan with key messages and media angles|speak-and-persuade
marketing-private-domain-operator|a customer community plan with retention and engagement measures|keep-customers
marketing-reddit-community-builder|a Reddit plan with community rules and useful post ideas
marketing-seo-specialist|a search review with keyword, content and technical fixes|get-found-in-search
marketing-short-video-editing-coach|a short video editing plan with pacing and caption checks|make-video-ads
marketing-social-media-strategist|a social content strategy with audience and measurement choices
marketing-tiktok-strategist|a TikTok content plan with hooks, formats and test ideas
marketing-twitter-engager|X post and reply drafts with audience and conversation goals
marketing-video-optimization-specialist|a video packaging review with title, thumbnail and retention proposals|grow-social
marketing-wechat-official-account|a WeChat account content plan with audience and channel checks
marketing-weibo-strategist|a Weibo content plan with topics and community engagement choices
marketing-x-twitter-intelligence-analyst|an X research brief with source posts and signal checks|research-topics
marketing-xiaohongshu-specialist|a Xiaohongshu content plan with search and community choices
marketing-zhihu-strategist|a Zhihu answer plan with topic choices and evidence
paid-media-auditor|an ad account audit with findings and ranked repair proposals|read-ad-results
paid-media-creative-strategist|an ad creative plan with copy drafts and test hypotheses|write-ad-copy
paid-media-paid-social-strategist|a paid social proposal with audience, budget and creative tests
paid-media-ppc-strategist|a paid search campaign proposal with structure and budget checks|run-google-ads
paid-media-programmatic-buyer|a display buying proposal with inventory and brand safety checks
paid-media-search-query-analyst|a search term review with waste and keyword proposals|run-google-ads
paid-media-tracking-specialist|a conversion tracking plan with event and attribution checks|track-numbers
product-behavioral-nudge-engine|a behavior change proposal with ethical checks and test measures||Product behavior agent
product-dx-engineer|a developer experience review with onboarding and tooling fixes
product-feedback-synthesizer|a feedback summary with themes, evidence and product implications|understand-customers
product-manager|a product plan with user needs, scope and success measures
product-sprint-prioritizer|a ranked sprint proposal with effort and value tradeoffs|organise-work
product-trend-researcher|a trend research brief with source evidence and adoption risks|research-topics
project-management-experiment-tracker|an experiment record with hypotheses, results and next decisions|track-numbers
project-management-jira-workflow-steward|a Jira workflow proposal with issue and release traceability
project-management-meeting-notes-specialist|meeting notes with decisions, owners and open questions
project-management-project-shepherd|a delivery plan with dependencies, risks and next actions||Project delivery agent
project-management-studio-operations|a studio operating plan with processes and responsibilities
project-management-studio-producer|a creative production plan with scope, resources and milestones
project-manager-senior|a scoped project plan with tasks and acceptance checks
research-synthesist|a research synthesis with independent evidence and source limitations
sales-account-strategist|an account growth plan with stakeholder and opportunity maps
sales-coach|a sales coaching review with deal questions and practice steps
sales-deal-strategist|a deal review with qualification gaps and next actions
sales-discovery-coach|a discovery call plan with buyer questions and follow-ups
sales-engineer|a technical sales plan with demo and evaluation checks
sales-offer-lead-gen-strategist|an offer and lead generation plan with channel tests|make-offer
sales-outbound-strategist|an outbound sales plan with target signals and message drafts
sales-pipeline-analyst|a pipeline review with forecast assumptions and deal risks|track-numbers
sales-proposal-strategist|a sales proposal draft tied to buyer requirements
security-ai-generated-code-auditor|an AI code security review with findings and verification checks
security-appsec-engineer|an application security review with risk evidence and fixes
security-architect|a threat model with trust boundaries and control proposals
security-blockchain-security-auditor|a smart contract audit plan with exploit and invariant checks
security-cloud-security-architect|a cloud security design with identity and infrastructure checks
security-compliance-auditor|a compliance readiness review with evidence gaps and control checks|check-contracts
security-incident-responder|an incident review plan with steps to contain and recover
security-penetration-tester|an authorized penetration test plan with scope and evidence rules
security-secrets-credential-engineer|a credential hygiene review with rotation and storage proposals
security-senior-secops|a security operations review with threat and control checks
security-threat-detection-engineer|a threat detection plan with rules and validation cases
security-threat-intelligence-analyst|a threat intelligence brief with indicators and source confidence
macos-spatial-metal-engineer|a Metal rendering plan with GPU and performance checks
terminal-integration-specialist|a terminal integration design with text and interaction checks
visionos-spatial-engineer|a visionOS interface plan with spatial and usability checks
xr-cockpit-interaction-specialist|an XR cockpit interaction plan with control and usability checks|design-work
xr-immersive-developer|a WebXR experience plan with device and rendering checks
xr-interface-architect|a spatial interface design with interaction and comfort checks|design-work
accounts-payable-agent|a payment proposal with invoice, approval and reconciliation checks|money-and-investing
agentic-identity-trust|an agent identity design with authority and audit checks|secure-code
agents-orchestrator|an agent team plan with handoffs and quality gates|set-up-ai
automation-governance-architect|an automation governance plan with owners and operating limits|set-up-ai
business-strategist|a business strategy brief with choices and execution priorities|plan-strategy
change-management-consultant|a change adoption plan with stakeholders and progress checks|lead-people
chief-financial-officer|a finance decision brief with tradeoffs and control checks|money-and-investing
corporate-training-designer|a workplace training plan with behavior and evaluation measures|teach-and-train
customer-service|customer response drafts with issue resolution and escalation steps|help-customers
customer-success-manager|a customer success plan with goals and retention risks|keep-customers
data-consolidation-agent|a sales data consolidation plan with reconciliation and reporting checks|track-numbers
data-privacy-officer|a data protection review with obligations and evidence gaps|check-contracts
esg-sustainability-officer|a sustainability reporting plan with evidence and disclosure checks|document-work
government-digital-presales-consultant|a Chinese government procurement brief with bid and compliance checks|sell-and-negotiate
grant-writer|a grant proposal draft matched to funder requirements|write-and-tell-stories
healthcare-aging-parent-care-companion|a care coordination plan with appointments and clinician questions|organise-work
healthcare-customer-service|patient service response drafts with privacy and escalation checks|help-customers
healthcare-marketing-compliance|a China healthcare marketing review with claims and compliance questions|check-ads
hospitality-guest-services|guest service response drafts with requests and escalation steps|help-customers
hr-onboarding|a new hire onboarding plan with milestones and responsibilities|hire-people
identity-graph-operator|an identity graph plan with matching and consistency checks|secure-code
language-translator|a translation draft with terminology and cultural context checks|write-and-tell-stories
legal-billing-time-tracking|a legal time and billing review with narrative checks|track-numbers
legal-client-intake|a legal intake summary with conflicts and attorney follow-up questions|document-work
legal-document-review|a document review draft with clause risks and attorney questions|check-contracts
loan-officer-assistant|a loan application checklist with document gaps and reviewer questions|money-and-investing
lsp-index-engineer|a code intelligence design with indexing and language server checks|build-software
ma-integration-manager|a merger integration plan with owners, dependencies and readiness checks|organise-work
medical-billing-coding-specialist|a medical billing review with coding and claim checks|document-work
operations-manager|an operating process review with bottlenecks and improvement measures|document-work
organizational-psychologist|a team behavior review with evidence and intervention proposals|lead-people
personal-growth-mentor|a personal action plan with priorities and progress checks|think-and-decide
real-estate-buyer-seller|a property transaction checklist with documents and decision points|organise-work
recruitment-specialist|a China recruiting plan with sourcing and compliance checks|hire-people
report-distribution-agent|a report distribution proposal with recipients and delivery checks|organise-work
resume-tailor|a resume revision matched to the role and real experience|find-a-job
retail-customer-returns|a returns response draft with policy and refund review checks|help-customers
sales-data-extraction-agent|a sales spreadsheet extraction plan with metric and source checks|track-numbers
sales-outreach|sales outreach drafts tied to buyer needs and evidence|sell-and-negotiate
specialized-chief-of-staff|a leadership coordination plan with decisions and open dependencies|lead-people
specialized-civil-engineer|a civil design review with code and constructability questions|research-topics
specialized-codebase-archaeologist|a codebase history review with architecture and ownership evidence|document-work
specialized-cultural-intelligence-strategist|a cultural fit review with exclusion risks and design proposals|design-work
specialized-developer-advocate|a developer outreach plan with useful content and community work|grow-social
specialized-document-generator|a document generation plan for PDFs, slides or spreadsheets|work-with-files
specialized-fedramp-rmf-compliance|a federal security compliance plan with evidence and authorization gaps|check-contracts
specialized-focus-music-architect|a focus music brief with acoustic choices and generation prompts|work-with-audio
specialized-french-consulting-market|a French consulting market brief with positioning and negotiation choices|sell-and-negotiate
specialized-korean-business-navigator|a Korean business meeting plan with context and relationship considerations|sell-and-negotiate
specialized-master-plan-architect|an implementation brief with assumptions and acceptance checks|build-software
specialized-mcp-builder|an MCP server plan with tool contracts and integration checks|connect-tools
specialized-model-qa|a machine learning audit plan with data and calibration checks|test-and-fix-code
specialized-pricing-analyst|a pricing analysis with value assumptions and test proposals|set-prices
specialized-salesforce-architect|a Salesforce architecture proposal with data and platform limits|connect-tools
specialized-strategy-duel-agent|a turn based strategy debate with arguments and round decisions|think-and-decide
specialized-workflow-architect|a workflow specification with paths, states and acceptance checks|document-work
study-abroad-advisor|a study abroad plan with school, application and visa questions|organise-work
supply-chain-strategist|a China supply chain plan with supplier and continuity checks|plan-supply-chain
zk-steward|a connected notes plan with links and knowledge checks|document-work
support-analytics-reporter|an analytics report with trends, evidence and next questions|track-numbers
support-executive-summary-generator|an executive summary with decisions, evidence and next steps|document-work
support-finance-tracker|a cash and expense review with forecast assumptions|money-and-investing
support-infrastructure-maintainer|an infrastructure maintenance plan with alerts and recovery checks|ship-and-host
support-legal-compliance-checker|a legal compliance review with obligations and reviewer questions|check-contracts
support-support-responder|support response drafts with issue diagnosis and escalation steps
testing-accessibility-auditor|an accessibility audit plan with manual and automated checks
testing-api-tester|an API test plan with edge cases and failure checks
testing-evidence-collector|a visual QA record with screenshots and reproducible findings
testing-performance-benchmarker|a performance benchmark plan with baselines and repeatable measurements
testing-reality-checker|a release readiness review with evidence gaps and acceptance checks
testing-test-automation-engineer|a test automation plan with isolation and reliability checks
testing-test-results-analyzer|a test results review with failure patterns and next checks
testing-tool-evaluator|a tool comparison plan with criteria and trial checks|research-topics
testing-workflow-optimizer|a workflow review with bottlenecks and improvement experiments|organise-work
`;
const definitions=new Map(copy.trim().split('\n').map(line=>{const [id,outcome,task,name]=line.split('|');return [id,{outcome,task,name}];}));
const editorial={};
for(const r of rows){
 const id=r.path.split('/').at(-1).replace(/\.md$/,''),d=definitions.get(id);
 if(!d)throw Error('Missing reviewed copy: '+r.path);
 const name=d.name??r.name.replace(/\s+Agent$/i,'')+' agent';
 editorial[r.path]={name,summary:'Get '+d.outcome+'. Bring your brief.',outcome:d.outcome[0].toUpperCase()+d.outcome.slice(1)+'.',...(d.task?{task:d.task}:{})};
}
if(definitions.size!==rows.length)throw Error('Editorial count mismatch.');
editorial['engineering/engineering-technical-writer.md'].linksReviewed='Links occur in example documentation templates, not package dependencies.';
editorial['marketing/marketing-aeo-foundations.md'].linksReviewed='Site-relative links in example page markup, not package dependencies.';
editorial['security/security-threat-intelligence-analyst.md'].linksReviewed='Regex capture syntax, not a file dependency.';
editorial['specialized/specialized-developer-advocate.md'].linksReviewed='Example content template links, not package dependencies.';
editorial['specialized/agentic-identity-trust.md'].linksReviewed='The companion identity graph operator is bundled in references/identity-graph-operator.md.';
for(const rel of ['engineering/engineering-technical-writer.md','marketing/marketing-developer-community-builder.md'])editorial[rel].overlapReviewed='Keep the broader source agent role alongside the existing task skill; distinct agent type, name and source.';
fs.writeFileSync('tools/agency-agents-editorial.json',JSON.stringify(editorial,null,2)+'\n');
console.log('Prepared reviewed copy for '+rows.length+' profiles.');
