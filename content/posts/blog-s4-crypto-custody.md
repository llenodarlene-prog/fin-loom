---
title: Crypto Custody Explained: Self-Custody, Exchanges, and Institutional Custodians
seo_title: Crypto Custody: Self-Custody, Banks, and Institutions
description: Learn how crypto custody works, who controls private keys, how institutional custody differs from self-custody, and which risks matter.
slug: /crypto/crypto-custody/
type: blog
schema: BlogPosting
draft: false
tracker_id: Blog:S4
primary_keyword: crypto custody
secondary_keywords: institutional crypto custody; crypto custody services; self custody crypto; bank crypto custody
cluster: Crypto & Digital Assets
approved_internal_links: /crypto/
research_record: content/research/blog-s4.json
image: /assets/images/posts/crypto-custody/hardware-wallet-and-seed-backup-1600.jpg
image_alt: A hardware wallet and a handwritten seed backup card beside a laptop showing a sample account overview
link_placement_site: Use The Bitcoin
charts_pending: 0
ai_exceptions: 
ai_exception_reason: 
author: Darlene Aberin
published: 2026-10-04
modified: 2026-10-04
---

# Crypto Custody Explained: Self-Custody, Exchanges, and Institutional Custodians

Crypto custody sounds like a simple question: who holds the asset? Technically, the better question is who controls the cryptographic keys. Just as important are the procedures that protect that control and the legal relationship between the owner and the entity safeguarding access. That distinction is becoming more important as crypto moves deeper into regulated finance.

In May 2025, the [Office of the Comptroller of the Currency clarified](https://www.occ.treas.gov/news-issuances/news-releases/2025/nr-occ-2025-42.html) that U.S. national banks and federal savings associations may provide crypto-asset custody and execution services, including through appropriately managed sub-custodians. On October 1, 2026, the [U.S. Securities and Exchange Commission proposed new rules and amendments](https://www.sec.gov/newsroom/press-releases/2026-100-sec-proposal-would-address-how-investment-advisers-funds-can-custody-crypto-assets-under-federal) addressing how registered investment advisers and regulated funds may custody crypto assets. The proposal would, subject to conditions, allow certain self-custody arrangements and use of state trust companies.

Those developments do not make custody risk disappear. They show that crypto custody is being pulled into the questions that apply to any safeguarded asset, such as who controls it, how it is recorded, and what happens when something fails.

For individuals, the custody decision may be a hardware wallet versus an exchange. For institutions, it is a far larger undertaking that brings in multiple signers, regulatory status, insurance, and governance.

## Key Takeaways

- **Custody is about control:** The central question is who can authorize movement of the crypto asset and under what controls.
- **Self-custody removes one counterparty but adds operational risk:** Losing keys, mishandling backups, or approving malicious transactions can cause irreversible loss.
- **Exchange custody is convenient but concentrates trust:** Users depend on the platform’s solvency, security, legal structure, and withdrawal controls.
- **Institutional custody is a control system:** It can include segregation, multi-party authorization, cold storage, policy rules, audits, recovery processes, and regulated entities.
- **Legal custody and technical key control are related but not identical:** An institution can have a legal custody obligation while using third-party technology or sub-custodians.
- **Regulation is changing:** U.S. rules and agency positions continue to evolve, so current requirements should be checked before implementation.
- **The best setup depends on the user:** A retail holder, hedge fund, registered adviser, bank, and corporate treasury may need very different arrangements.

## What Crypto Custody Means

A blockchain records control through cryptographic keys rather than by storing a coin in a physical vault. The private key, or the signing system derived from it, is what allows transactions to be authorized. That creates a core custody principle:

**Control of signing authority is control of the asset.**

A custodian therefore needs to protect more than a password. It may need to protect the following:

- Private keys
- Seed phrases
- Signing devices
- Access credentials
- Recovery material
- Transaction policies
- Administrator rights
- Systems used to construct transactions

Crypto custody is best understood as the collection of controls used to safeguard those capabilities.

## Self-Custody

In self-custody, the user retains direct control over the private keys or signing process. Common forms include hardware wallets, software wallets, multisignature wallets, air-gapped signing devices, and institutional self-custody systems. Self-custody is attractive because the user does not need a third-party custodian to authorize withdrawals.

That reduces one type of counterparty risk. It adds a different risk: the user becomes responsible for key security, backups, succession, transaction verification, and recovery.

### Advantages of Self-Custody

Self-custody gives you direct control of the assets. You do not depend on a centralized exchange staying solvent, and no custodian has to approve a withdrawal.

It also lets you interact with blockchain applications directly and move funds at any hour. For holders who value independence from intermediaries, these are the main reasons to accept the extra responsibility.

### Risks of Self-Custody

The same control creates the main risks. Keys can be lost, seed phrases stolen, and devices compromised, while phishing sites and wallet drainers target exactly this kind of user.

Human factors count as much as technical ones. Poor backups, a mistyped address, or knowledge held by one person with no succession plan can all cause permanent loss. Self-custody transfers responsibility; it does not remove it.

## Exchange Custody

Many users hold crypto on centralized exchanges. This is operationally simple.

The platform manages wallets and keys while the user accesses an account through credentials and authentication controls. The user therefore has an account claim against the platform’s system rather than direct day-to-day control of blockchain keys. Important questions include:

- Are customer assets segregated?
- How are keys stored, and what percentage is held online?
- What withdrawal controls exist?
- Which legal entity holds the assets, and which jurisdiction governs the relationship?
- Are assets lent, pledged, or otherwise used?
- What happens in insolvency?
- Are there independent audits or attestations?
- What insurance exists, and what does it cover?

An exchange can be both a trading venue and a custodian, which concentrates functions that traditional markets often separate.

## Institutional Crypto Custody

Institutional custody is not simply a larger hardware wallet. It is usually a governance system. A professional custody arrangement may include:

- Regulated custodial entities
- Segregated accounts
- Cold storage
- Hardware security modules
- Multi-party computation
- Multisignature approval
- Role-based access
- Transaction allowlists
- Withdrawal limits
- Audit logs
- Disaster recovery
- Compliance screening
- Independent oversight

The aim is to prevent a single compromised device, employee, or credential from moving assets. That is why institutional [digital asset custody](/crypto/) sits at the intersection of cybersecurity, financial controls, regulation, trading infrastructure, and operational risk rather than being only a wallet choice.

## Multisignature and Multi-Party Computation Are Not the Same

Crypto custody discussions often group multisig and multi-party computation, or MPC, together because both can reduce single-key risk. They work differently.

### Multisignature

A multisig wallet requires several private keys to authorize a transaction, under a rule such as two of three signatures. No single key can move the funds, which protects against one lost or stolen key.

The blockchain can often see the multisig structure, so the arrangement is transparent and verifiable. In exchange, setup and recovery are more involved than with a single-key wallet.

### Multi-Party Computation

MPC uses cryptographic techniques that allow multiple parties or systems to participate in producing a valid signature without assembling a complete private key in one place. Implementation details vary, and neither architecture is automatically safer. Security depends on the design, endpoint controls, governance, recovery process, and who can change policy.

## Hot, Warm, and Cold Storage

Custodians often describe storage by connectivity. The more connected the keys are, the faster assets can move and the more exposed they become.

### Hot Storage

In hot storage, keys or signing systems stay online so that transactions can be approved quickly. This suits assets that need to move often, such as trading balances.

The trade-off is exposure. Anything connected to the internet can be attacked remotely, which is why hot wallets usually hold only a small share of total assets.

### Cold Storage

In cold storage, signing material is kept offline or in highly isolated environments. This sharply reduces the online attack surface, so it suits long-term holdings.

However, withdrawals become slower, and new problems appear. Physical security, careful procedures, and tested recovery all count for more when access is deliberately difficult.

### Warm Storage

Warm storage sits between the two. It uses stronger isolation than a hot wallet while keeping more day-to-day availability than deep cold storage.

For that reason, institutions often split assets across tiers instead of choosing one model for everything. The split reflects how quickly each portion needs to move.

## Key Segregation and Asset Segregation

These terms sound similar but describe different issues. **Key segregation** means signing authority is separated across people, devices, locations, or systems. **Asset segregation** generally refers to keeping customer assets distinct from a custodian’s proprietary assets or from other legal claims, depending on the structure and law.

A custodian can have sophisticated key security while still creating legal or balance-sheet risks if the ownership structure is unclear. Conversely, an arrangement can have strong legal segregation but weak operational key security. Serious custody due diligence needs both.

## Custody Regulation Is Moving

The United States has seen major changes in crypto custody policy. In May 2025, the OCC’s Interpretive Letter 1184 confirmed that national banks and federal savings associations may provide and outsource crypto custody and execution services, subject to appropriate third-party risk management and safe-and-sound practices. The OCC described crypto custody as a modern form of traditional bank custody.

Then, on October 1, 2026, the SEC proposed a tailored custody framework for registered investment advisers and regulated funds. According to the SEC, the proposal would permit self-custody in certain circumstances and allow state trust companies to serve as custodians under conditions. At the time of writing, this is a proposal, not a final rule.

That distinction is essential. Compliance teams should work from current law and finalized requirements, not headlines about proposed changes.

## What the SEC Proposal Signals

The proposal is important even before finalization because it identifies the policy problems regulators are trying to solve. Those include limited availability of suitable custodians for some crypto assets, how self-custody should work when no permitted custodian is available, how state trust companies fit into custody, recordkeeping, disclosure, audits, and broker-dealer custodial services for regulated funds. SEC Commissioner Mark Uyeda emphasized that traditional principles such as asset segregation and controls still apply even though the mechanics differ for assets recorded on distributed ledgers.

That framing is useful beyond U.S. regulation. Technology changes custody mechanics, but it does not eliminate the need for controls.

## Sub-Custody Adds Another Layer of Risk

A firm may advertise custody under its own brand while relying on one or more third parties. The OCC has explicitly discussed banks’ ability to use sub-custodians for permissible crypto custody activities, subject to third-party risk management. For a customer, that means due diligence should map the custody chain:

**Client → Primary Custodian → Technology Provider or Sub-Custodian → Blockchain**

Questions to ask include:

- Who has signing authority, and who controls policy changes?
- Where are keys generated, and where are backups stored?
- What happens if the sub-custodian fails?
- Who is legally responsible for a loss?
- Can either party move assets without the other?
- Which party performs transaction screening?

A brand name alone does not explain the control structure.

## Insurance Should Be Read, Not Assumed

“Insured custody” can sound reassuring. The questions to ask are:

- Insured against what, and for how much?
- Subject to which exclusions?
- Held by which entity?
- Shared across how many customers?
- Triggered under what circumstances?

Insurance may cover specific forms of theft or employee misconduct while excluding user error, smart-contract losses, market losses, or events outside defined custody systems. A policy limit may also be much smaller than total assets under custody. Insurance is one risk control, not a substitute for custody architecture.

## Proof of Reserves Is Not Full Custody Due Diligence

After failures among crypto firms, proof-of-reserves systems became more common. Reserve evidence can help show that certain on-chain assets exist. It does not automatically prove:

- Liabilities
- Legal ownership
- Absence of encumbrances
- Internal controls
- Solvency
- Governance
- The right of customers to recover assets in insolvency

A balance sheet has two sides. Custody analysis should avoid treating an asset snapshot as a complete financial audit.

## Operational Controls Count as Much as Cryptography

Many custody failures begin with people and process rather than broken encryption. Controls can include:

- Separation of duties
- Transaction limits
- Multiple approvals
- Time delays
- Whitelisted addresses
- Hardware-backed authentication
- Staff background checks
- Mandatory vacations
- Change-management controls
- Incident response
- Secure recovery drills
- Independent audits

A sophisticated key technology can still be undermined by weak administrator access.

## Recovery Is Part of Security

A custody system that cannot recover from device loss, staff departure, disaster, or death is not resilient. Recovery planning should answer:

- What happens if one signer disappears?
- What happens if a facility becomes inaccessible?
- Can keys be reconstructed, and who authorizes emergency recovery?
- How is recovery tested?
- Can an attacker trigger the recovery process?
- What happens during inheritance or corporate succession?

Backups should be protected against both loss and theft. Those goals can conflict.

A backup that is easy to access may be easy to steal. A backup that is extremely difficult to access may fail when needed.

## Build a Custody Risk Matrix Before Comparing Providers

Custody comparisons become more informative when the risks are separated instead of collapsed into one “security” score. A provider can be strong in one area and weak in another.

For example, deep cold-storage procedures may reduce online key exposure while creating longer withdrawal times and more complex recovery. A highly automated MPC system may improve transaction availability while increasing reliance on software policy controls and administrative security. A simple matrix helps keep these tradeoffs visible:

| Risk Category | Self-Custody | Exchange Custody | Institutional Custodian |
|---|---|---|---|
| Key-loss risk | High responsibility on owner | Managed by platform | Managed through institutional controls |
| Counterparty risk | Low direct custodian risk | Higher platform dependence | Depends on custodian structure |
| Operational complexity | High for inexperienced users | Low for user | High, but professionally managed |
| Withdrawal flexibility | Direct, subject to network | Subject to platform rules | Subject to policy and workflow |
| Governance controls | User-defined | Platform-defined | Often multi-role and policy-based |
| Regulatory oversight | Depends on user/jurisdiction | Depends on platform | Often a central part of provider selection |
| Recovery | User-designed | Account recovery process | Formal business-continuity process |

The table is intentionally qualitative. A specific exchange can have stronger controls than a poorly designed self-custody setup, and an institutional custodian can still fail. The purpose is to identify which risks move from the user to the provider and which risks remain.

## Custody and Staking Create Additional Questions

Custodians may offer staking services. That creates another set of risks:

- Validator performance
- Slashing
- Lockup or unbonding periods
- Delegation structure
- Reward calculation
- Tax treatment
- Smart-contract exposure
- Who controls governance rights

Customers should understand whether the assets remain in the same custody arrangement while staked and which party makes protocol-level decisions.

## Custody and Trading Should Be Separated Conceptually

Even when one company offers both services, custody and execution solve different problems. Custody asks: how are assets safeguarded?

Execution asks: how are trades placed and settled? Combining them may reduce operational friction but can increase concentration.

Institutions should map: where assets sit before a trade, whether they must be prefunded to an exchange, how quickly they return to custody, whether off-exchange settlement is available, and which party bears risk during settlement. The goal is to minimize unnecessary exposure outside the intended custody framework.

## A Crypto Custody Due-Diligence Checklist

Before choosing a custodian, document answers to these questions. Written answers are easier to compare across providers, and gaps become obvious.

### Legal and Regulatory

Start with who you are dealing with and under which rules. The answers decide what happens to your assets if the provider fails.

- **Entity:** Identify the exact legal entity acting as custodian, not only the brand name.
- **Authorization:** Ask which licenses, charters, or registrations apply to that entity.
- **Jurisdiction:** Confirm which jurisdiction's law governs customer assets.
- **Insolvency:** Find out how assets are treated if the custodian becomes insolvent, and whether they are legally segregated from the firm's own property.

Clear answers here count for more than any marketing claim. If a provider cannot say which entity holds your assets and under which law, the remaining checks carry little weight.

### Technical Security

Next, ask how the keys are created and protected. A provider should be able to describe its design in plain terms.

- **Key generation:** Ask how and where keys are generated, and who is present.
- **Storage model:** Confirm whether storage is hot, warm, or cold, and in what proportions.
- **Signing design:** Find out whether multisig or MPC is used and whether hardware security modules are involved.
- **Backups and policy:** Ask how backups are protected and how transaction policies are enforced.

You do not need to audit the cryptography yourself. What you are testing is whether the provider can explain its design consistently and without evasion.

### Operational Controls

Strong technology can still be undone by weak process. These questions test the people and procedures around the keys.

- **Approvals:** Ask who can approve withdrawals and whether separation of duties is required.
- **Limits:** Check whether destination addresses are allowlisted and whether large withdrawals are delayed.
- **Records:** Confirm that audit logs cannot be altered and that administrators are strongly authenticated.

Most large losses in custody trace back to process failures, not broken cryptography. Controls that slow a withdrawal down are often the ones that stop a theft.

### Third Parties

Many custodians rely on other firms for part of the service. Ask whether sub-custodians are used and which technology providers are critical to operations.

Then ask who is responsible if one of them fails, and how those vendors are monitored. A chain of providers can be sound, but only when each link and its liability are clear to the customer.

### Financial Protection

Insurance and balance-sheet practices decide how much of a loss could be recovered. Ask whether insurance exists, what events it covers, and what the policy limit is relative to assets held.

In addition, find out whether customer assets are ever lent or pledged, and whether reserve and liability reports are available. Coverage that sounds large may be small once it is spread across every customer.

### Recovery and Continuity

Finally, ask how the provider handles a bad day. Recovery procedures should be written down and tested, not improvised, and the departure of a key signer should not put assets at risk.

A custody provider should be able to explain these controls clearly. If the answers lean on phrases such as “institutional grade” without detail, treat that as a finding in itself.

## Frequently Asked Questions

### What Is Crypto Custody?

Crypto custody is the system that safeguards the private keys or signing authority controlling digital assets, together with the legal and operational controls around that responsibility.

### Is Self-Custody Safer Than an Exchange?

It removes dependence on an exchange, but it makes you responsible for key security, backups, transaction checks, and recovery. Whether it is safer depends on how well you execute.

### Can Banks Custody Crypto?

In the United States, yes. The OCC has confirmed that national banks and federal savings associations may provide crypto custody services, subject to applicable law and safe-and-sound practices.

### What Is Institutional Crypto Custody?

Institutional custody combines secure key technology with governance, asset segregation, compliance, transaction controls, recovery processes, and audits, usually delivered through a regulated entity.

### What Is a Crypto Sub-Custodian?

A sub-custodian is a third party that the primary custodian uses for some custody functions. Customers should understand how responsibilities and signing authority are divided between them.

### Is the SEC’s 2026 Crypto Custody Proposal Final?

No. The SEC proposed the rules on October 1, 2026, and tracks them in its [Crypto@SEC materials](https://www.sec.gov/featured-topics/crypto-task-force/cryptosec). Proposed rules can change before adoption.

## Resources

The following sources provide the primary or specialist evidence used to verify the claims and frameworks above.

- [U.S. SEC, SEC Proposal Would Address How Investment Advisers and Funds Can Custody Crypto Assets Under the Federal Securities Laws, October 1, 2026](https://www.sec.gov/newsroom/press-releases/2026-100-sec-proposal-would-address-how-investment-advisers-funds-can-custody-crypto-assets-under-federal)
- [U.S. SEC, Chairman Paul Atkins statement on the October 1, 2026 custody proposal](https://www.sec.gov/newsroom/speeches-statements/atkins-crypto-custody-100126-statement-proposal-address-custody-crypto-assets-under-investment-advisers-act-investment-company)
- [OCC Interpretive Letter 1184, May 7, 2025](https://www.occ.treas.gov/topics/charters-and-licensing/interpretations-and-actions/2025/int1184.pdf)
- [OCC News Release on crypto-asset custody and execution services, May 7, 2025](https://www.occ.treas.gov/news-issuances/news-releases/2025/nr-occ-2025-42.html)
- [SEC Crypto@SEC policy tracker](https://www.sec.gov/featured-topics/crypto-task-force/cryptosec)
