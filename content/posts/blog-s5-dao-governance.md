---
title: DAO Governance and DeFi: What Token Voting Controls
seo_title: DAO Governance: How Token Voting Works in Practice
description: Learn how DAO governance works, how delegation and quorum shape voting power, and what token holders control in protocols such as Uniswap.
slug: /fintech/dao-governance/
type: blog
schema: BlogPosting
draft: false
tracker_id: Blog:S5
primary_keyword: DAO governance
secondary_keywords: DAO governance model; token voting; governance token; Uniswap governance
cluster: Fintech
approved_internal_links: /fintech/
research_record: content/research/blog-s5.json
image: /assets/images/posts/dao-governance/governance-proposal-vote-1600.jpg
image_alt: A laptop and phone showing a sample governance proposal and vote screen, with printed proposal documents
link_placement_site: Use The Bitcoin
charts_pending: 1
ai_exceptions: 
ai_exception_reason: 
author: Darlene Aberin
published: 2026-10-04
modified: 2026-10-04
---

# DAO Governance and DeFi: What Token Voting Controls

A DAO can call itself decentralized and still have most practical voting power concentrated in a small number of delegates. A governance token can give holders voting rights while very few holders use them. A proposal can pass a formal quorum while the process leading to the vote remains heavily shaped by large stakeholders, delegates, proposal authors, forums, and voting interfaces.

That is why DAO governance should be evaluated as a system rather than a slogan. The basic idea is familiar: token holders or delegated representatives vote on proposals that affect a protocol, treasury, grants, fees, upgrades, or other shared resources. The details determine how meaningful that participation is.

Uniswap provides a useful example because its [governance process is publicly documented](https://developers.uniswap.org/docs/ecosystem/governance/governance-process). As of 2026, its process includes an RFC stage, an off-chain Temperature Check, and a final on-chain vote. The current documented thresholds include 10 million UNI voting “for” to advance a Temperature Check, 1 million UNI delegated to submit an on-chain proposal, and 40 million UNI voting in favor for an on-chain proposal to pass.

Those rules are measurable. They still do not answer every governance question.

Who owns or receives delegated UNI? How often do holders vote? How much influence do the largest delegates have?

What information do voters see before casting a ballot? Who writes executable proposal code?

How easily can governance rules themselves change? Those questions reveal whether DAO governance is broadly participatory, delegated, concentrated, or largely procedural.

## Key Takeaways

The main points are summarized below.

- **DAO Governance Is More Than Token Ownership:** Voting power, delegation, proposal thresholds, quorum, execution, and treasury control all matter.
- **Delegation Can Improve Participation and Concentrate Influence at the Same Time:** Smaller holders can assign votes to active delegates, but large delegates may become governance centers.
- **Quorum Is a Floor, Not a Decentralization Score:** A proposal can meet quorum even if voting power is concentrated.
- **Off-Chain Discussion Shapes On-Chain Outcomes:** Forums, RFCs, delegate discussions, and interfaces influence which proposals reach binding votes.
- **Governance Tokens Differ:** Some control treasury spending and protocol parameters; others have narrower roles.
- **Voting Behavior Can Be Biased by Process Design:** Recent research suggests proposal framing, author signals, ordering, and delegation can affect voting outcomes.
- **Measure Governance with Several Indicators:** Participation, delegate concentration, proposal success, voter diversity, execution time, and treasury authority provide a more useful picture.

## What DAO Governance Is

DAO governance is a decision-making framework used by decentralized or blockchain-based communities to coordinate changes without relying entirely on a traditional corporate hierarchy. A DAO may govern: protocol upgrades, treasury spending, grants, fee settings, incentive programs, smart-contract parameters, asset listings, risk limits, token emissions, delegate programs, or governance procedures themselves.

The scope varies. A token holder should therefore ask a basic question before caring about voter turnout:

**What can governance change?**

A voting system that controls a large treasury and core protocol parameters has different economic importance from one that mainly approves community grants.

## Governance Tokens Do Not All Work the Same Way

The phrase “governance token” can hide major differences. Possible models include one-token-one-vote, delegated token voting, vote escrow, time-weighted voting, NFT-based membership, reputation systems, multisignature committees with token oversight, and hybrid legal/entity structures. Token voting is common because it gives the protocol a measurable way to assign governance weight.

It also raises a structural issue: wealth concentration can become political concentration. If one address controls ten times more voting tokens than another, it may have ten times the formal voting power unless the system modifies that relationship.

## Delegation Separates Ownership From Active Voting

Delegation allows a token holder to keep ownership while assigning voting power to another address. Uniswap’s governance glossary explains that UNI holders can delegate to themselves or to another address. Delegation does not transfer the underlying tokens and can be changed.

This solves a practical problem. Many token holders do not have the time or expertise to evaluate every proposal.

Delegation allows specialized participants to become governance representatives. It also creates a second-order question: how concentrated is delegated power? A DAO with millions of token holders can still have most active voting power controlled by a relatively small delegate set.

## Uniswap’s Three-Phase Governance Process

Uniswap’s current documentation describes three stages.

| Phase | Main Function | Current Documented Requirement |
|---|---|---|
| RFC | Public discussion and refinement | Minimum 7 days |
| Temperature Check | Off-chain sentiment test | 5 days; 10M UNI “for” to advance |
| On-Chain Vote | Binding executable vote | 1M UNI delegated to submit; 40M UNI “for” to pass |

The on-chain phase also includes a voting delay and timelock around execution. This structure creates several filters before a change becomes binding.

### Phase 1: Request for Comment

The RFC stage begins in the governance forum. A proposer explains the idea, receives criticism, answers questions, and can revise the proposal.

This step matters because governance quality depends on the information available before voting. A technically valid vote cannot correct an unclear proposal if participants do not understand the effects.

### Phase 2: Temperature Check

The Temperature Check uses off-chain voting to test whether the idea has enough support to justify a final proposal. Uniswap’s 2026 process requires 10 million UNI voting in favor to advance.

Off-chain voting is cheaper than requiring every preliminary decision to be an on-chain transaction. The tradeoff is that off-chain sentiment and on-chain execution are separate systems.

### Phase 3: On-Chain Vote

The final stage is binding. Uniswap requires 1 million UNI delegated to the proposer and 40 million UNI voting in favor, with “for” votes exceeding “against” votes.

If the vote passes, executable actions can move through the timelock and be carried out. The presence of executable code makes the proposal more than an opinion poll.

The three UNI thresholds apply to different governance stages. They are displayed together to show scale, not because they measure the same governance function.

## Quorum Prevents Tiny Groups From Passing Decisions, but It Has Limits

Quorum establishes a minimum participation threshold. Without one, a proposal could theoretically pass with very little voting power if most holders ignored it.

Uniswap’s current on-chain process uses 40 million UNI voting in favor as a threshold. Quorum does not tell you: how many individual voters participated, whether one delegate supplied most of the votes, how much supply was eligible to vote, whether the same delegates dominate repeatedly, or whether proposal authors influenced voter framing. A useful governance analysis therefore separates quorum from decentralization.

## Voting Power Concentration Is a Core Metric

Consider two proposals that both receive 50 million votes. Proposal A: 20 million from the largest delegate, 15 million from the second, and 15 million from hundreds of others. Proposal B: 5 million from the largest delegate, 4 million from the second, and 41 million distributed across many delegates.

Both pass the same quorum. Even so, their governance concentration is very different.

Metrics that can help include share of voting power held by top 1, 5, 10, or 20 delegates; herfindahl-style concentration measures; number of active delegates; number of unique voters; median voting power; participation rate; and percentage of votes cast through delegation. No single metric captures governance quality, but concentration is too important to ignore.

## Participation Rate Needs a Clear Denominator

“Turnout was 10%” sounds simple until you ask 10% of what. Possible denominators include total token supply, circulating supply, delegated supply, voting-eligible supply, active delegated supply, or addresses that previously voted.

The denominator can change the interpretation dramatically. DAO research should always state what participation means.

## Delegation Can Increase Participation and Create Conformity

Delegation is often described as a cure for voter apathy. Recent research suggests the effect can be more complicated.

A [forthcoming study in Communications of the Association for Information Systems](https://aisel.aisnet.org/cais/vol59/iss1/58/) examined delegated voting power in a leading DAO and found that voters with greater delegated power were more likely to support the current leading outcome. The author interprets the result as evidence that delegation can create accountability pressures that may also encourage conformity.

A [2026 paper examining DAO proposal-choice behavior](https://arxiv.org/abs/2607.09435) found systematic associations between voting-power share and author-selected choices, approval-oriented options, and choice ordering. The authors were careful to describe these as associations rather than proven causal distortions.

The broader lesson is important: governance interfaces and social signals are part of governance design. Token math alone does not determine outcomes.

## Proposal Authors Have Agenda-Setting Power

A DAO may allow anyone to discuss ideas while requiring substantial delegated voting power to submit a binding proposal. That difference creates agenda-setting power.

Questions to measure include who creates proposals, how many unique proposers exist, how many proposals come from repeat participants, how many informal ideas reach a vote, how many proposals fail before on-chain submission, do large delegates co-author proposals, and who writes executable code. A decentralized voting process can still have a concentrated proposal pipeline.

## Forums Are Part of Governance

The on-chain vote is visible and measurable. Forum discussion is harder to quantify but often shapes the result.

During an RFC, participants can introduce objections, request simulations, negotiate budgets, narrow scope, add safeguards, remove controversial provisions, and build delegate support. By the time a proposal reaches an on-chain vote, much of the political work may already be complete. Researchers who analyze only final votes can therefore miss the decision-making process.

## Governance Controls Have Economic Value Only If the Governed Assets Matter

A governance token becomes economically meaningful when governance controls important resources or decisions. Uniswap’s documentation says governance can, among other things, spend treasury funds, set or activate protocol fees, and authorize additional UNI issuance within defined limits.

Those are economically meaningful controls. When evaluating a DeFi governance token, map its authority:

| Governance Area | Example Question |
|---|---|
| Treasury | Can voters spend protocol assets? |
| Fees | Can voters change fee collection or distribution? |
| Upgrades | Can governance change core contracts? |
| Emissions | Can voters increase token incentives? |
| Risk | Can governance change collateral or lending parameters? |
| Grants | Can governance fund third parties? |
| Legal structure | Can governance appoint representatives or service providers? |

This is where [decentralized finance](/fintech/) becomes more than a technology label. Governance is one of the mechanisms through which financial protocols decide who can change rules, direct capital, and control shared infrastructure.

## Treasury Governance Deserves Its Own Analysis

A DAO treasury can hold stablecoins, governance tokens, protocol assets, or investments. Governance determines: who proposes spending, who approves spending, whether budgets are recurring, how grants are monitored, whether recipients report outcomes, how assets are diversified, and whether the treasury can fund service providers.

A large treasury can make governance participation economically significant even if the protocol itself changes rarely. Treasury analysis should include both balance and process.

## Governance Attacks Are Not Always Technical Exploits

Some governance failures involve smart contracts, while others exploit incentives or voting structure. Possible risks include borrowed voting power, vote buying, delegate capture, collusion, low-turnout attacks, malicious proposals, compromised delegate wallets, rushed votes, poor calldata review, and social engineering.

Timelocks and proposal simulations can reduce some risks by creating time to inspect what a passed proposal will do. Uniswap’s current governance process references Seatbelt simulations for proposal calldata, reflecting the importance of checking executable effects before submission and execution.

## Legal Structure Can Sit Beside On-Chain Governance

DAO governance is increasingly interacting with legal entities. Uniswap’s governance documentation says that a Wyoming-registered Decentralized Unincorporated Nonprofit Association, called DUNI, was adopted to support off-chain activities while preserving the governance process. The documented examples include entering contracts, retaining service providers, and addressing regulatory or tax responsibilities.

This illustrates a broader trend. A DAO can use on-chain voting for collective decisions while relying on legal entities for actions that smart contracts cannot perform easily. Decentralization therefore does not necessarily mean the absence of legal structure.

## Governance Progress Should Be Measured Over Time

A single snapshot can make a DAO appear healthier or weaker than it really is. Governance should also be tracked as a time series. Useful quarterly or annual measures include number of RFCs opened, number of Temperature Checks, number of on-chain proposals, percentage of proposals that advance between stages, unique voters, active delegates, voting power held by the top 10 delegates, treasury spending approved, median time from RFC to execution, and the percentage of passed proposals that were executed.

This creates a governance “progress” view. For example, a DAO may increase the number of unique voters while the top delegates simultaneously accumulate a larger share of voting power.

Participation is improving, but concentration is worsening. Looking at only one metric would miss that tension.

A good governance dashboard should therefore report both participation and concentration. More votes do not necessarily mean more distributed influence.

## A DAO Governance Scorecard

A practical governance review can use several dimensions rather than one headline metric.

| Dimension | What to Measure |
|---|---|
| Authority | What governance can change |
| Participation | Unique voters and eligible voting power |
| Concentration | Share controlled by top delegates |
| Delegation | Amount and distribution of delegated power |
| Proposal access | Thresholds and proposer concentration |
| Discussion | RFC activity and amendment process |
| Execution | Timelock, simulations, safeguards |
| Treasury | Assets controlled and spending process |
| Transparency | Public votes, rationale, delegate disclosures |
| Resilience | Emergency powers and attack mitigation |

This produces a more useful answer than calling a protocol “decentralized” or “centralized.”

## How to Analyze a DAO Proposal

Before voting or interpreting an outcome, work through the proposal in order.

### Step 1: Identify the Decision

Begin by stating, in one sentence, what changes if the proposal passes. Many proposals bundle several actions, so separate the headline from the details.

If you cannot summarize the change plainly, the proposal is either poorly written or more complicated than it looks. In both cases, that is worth knowing before you form a view.

### Step 2: Identify the Economic Exposure

Next, work out what is at stake. List the assets, fees, users, contracts, or treasury balances the proposal touches.

A change to a fee setting and a transfer from the treasury are very different in scale. Sizing the exposure tells you how much scrutiny the proposal deserves and who stands to gain or lose.

### Step 3: Identify the Authority

Then check whether governance has the power to do what the proposal asks. Some parameters are controlled by token votes, while others sit with a multisig, a foundation, or immutable code.

A vote on something governance cannot execute is only a signal. Knowing where authority lies shows whether the outcome is binding or advisory.

### Step 4: Read the Discussion

Proposals usually pass through a forum or Request for Comment stage before any vote. Read it, because the strongest objections tend to appear there first.

Pay attention to whether the author answered the objections or simply moved ahead. Unresolved technical or economic concerns are a better warning sign than the vote tally.

### Step 5: Inspect Voting Power

Look at which delegates hold enough votes to decide the outcome. In many DAOs, a small group of addresses can reach the passing threshold between them.

This does not prove anything improper. However, it changes how you read the result, since broad support and the support of a few large delegates are not the same thing.

### Step 6: Check the Threshold

Confirm the quorum and proposal thresholds that apply to this type of vote. Different decisions can carry different requirements within the same DAO.

Compare the threshold with typical turnout. A proposal that barely clears quorum has a weaker mandate than one that passes with wide participation, even though both are valid.

### Step 7: Review Executable Code

If the proposal includes on-chain actions, the code is what will run, whatever the description says. Check for a published simulation, an audit, or a technical review by people independent of the author.

Research on DAO governance has examined cases where descriptions and code diverge. For a voter, the practical lesson is to trust the verified payload over the summary.

### Step 8: Monitor Execution

A passed proposal is not always executed at once. Timelocks delay execution on purpose, and some decisions need further operational steps from a team or foundation.

Follow the proposal until the change is live, and confirm that what was executed matches what was approved. Governance ends at execution, not at the vote.

## Frequently Asked Questions

### What Is DAO Governance?

DAO governance is the system a decentralized protocol or organization uses to make decisions about its code, treasury, and rules, usually through token voting and delegated voting power.

### What Is a Governance Token?

A governance token gives holders defined rights in protocol decisions. Those rights vary by project and may cover fees, upgrades, treasury spending, or grants.

### What Is Delegation in DAO Governance?

Delegation lets a token holder assign voting power to another address without transferring the tokens themselves. The holder keeps ownership and can change or withdraw the delegation later.

### Does Quorum Mean a DAO Is Decentralized?

No. Quorum is only a participation threshold. Voting power can still be concentrated among a small number of delegates even when a proposal clears quorum comfortably.

### How Does Uniswap Governance Work?

Uniswap documents three stages: a Request for Comment, a five-day Temperature Check needing 10 million UNI in favor, and an on-chain vote needing 40 million UNI in favor.

### Can DAO Governance Be Manipulated?

Yes. The risks include vote concentration, delegate capture, low turnout, malicious proposals, compromised wallets, and framing effects in how the choices on a ballot are presented.

## Resources

The following sources provide the primary or specialist evidence used to verify the claims and frameworks above.

- [Uniswap Developers, Governance Process, updated 2026](https://developers.uniswap.org/docs/ecosystem/governance/governance-process)
- [Uniswap Developers, Governance Glossary](https://developers.uniswap.org/docs/ecosystem/governance/glossary)
- [Uniswap Developers, Guide to Voting](https://developers.uniswap.org/docs/ecosystem/governance/guide-to-voting)
- [Uniswap Developers, Governance Overview](https://developers.uniswap.org/docs/ecosystem/governance/overview)
- [Ali Ahmed, Vote Delegation and Conformity in DAO Governance, Communications of the Association for Information Systems, in press](https://aisel.aisnet.org/cais/vol59/iss1/58/)
- [Stefano Balietti, Pietro Saggese, Markus Strohmaier, Voting Biases in Decentralized Autonomous Organization (DAO) Governance, 2026](https://arxiv.org/abs/2607.09435)
