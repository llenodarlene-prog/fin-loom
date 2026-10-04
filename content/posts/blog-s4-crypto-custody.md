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

Crypto custody sounds like a simple question: who holds the asset?

Technically, the more useful question is who controls the cryptographic keys, what procedures protect that control, and what legal or operational relationship exists between the owner and the entity safeguarding access.

That distinction is becoming more important as crypto moves deeper into regulated finance.

In May 2025, the [Office of the Comptroller of the Currency clarified](https://www.occ.treas.gov/news-issuances/news-releases/2025/nr-occ-2025-42.html) that U.S. national banks and federal savings associations may provide crypto-asset custody and execution services, including through appropriately managed sub-custodians. On October 1, 2026, the [U.S. Securities and Exchange Commission proposed new rules and amendments](https://www.sec.gov/newsroom/press-releases/2026-100-sec-proposal-would-address-how-investment-advisers-funds-can-custody-crypto-assets-under-federal) addressing how registered investment advisers and regulated funds may custody crypto assets. The proposal would, subject to conditions, allow certain self-custody arrangements and use of state trust companies.

Those developments do not make custody risk disappear. They show that crypto custody is being pulled into the same broader questions that apply to traditional asset safeguarding: segregation, control, recordkeeping, oversight, conflicts, recovery, and third-party risk.

For individuals, the custody decision may be a hardware wallet versus an exchange. For institutions, it can involve multiple signers, policy engines, state or federal regulatory status, insurance, sub-custody, governance, and integration with trading and accounting systems.

## Key Takeaways

The main points are summarized below.

- **Custody Is About Control:** The central question is who can authorize movement of the crypto asset and under what controls.
- **Self-Custody Removes One Counterparty but Adds Operational Risk:** Losing keys, mishandling backups, or approving malicious transactions can cause irreversible loss.
- **Exchange Custody Is Convenient but Concentrates Trust:** Users depend on the platform’s solvency, security, legal structure, and withdrawal controls.
- **Institutional Custody Is a Control System:** It can include segregation, multi-party authorization, cold storage, policy rules, audits, recovery processes, and regulated entities.
- **Legal Custody and Technical Key Control Are Related but Not Identical:** An institution can have a legal custody obligation while using third-party technology or sub-custodians.
- **Regulation Is Changing:** U.S. rules and agency positions continue to evolve, so current requirements should be checked before implementation.
- **The Best Setup Depends on the User:** A retail holder, hedge fund, registered adviser, bank, and corporate treasury may need very different arrangements.

## What Crypto Custody Means

A blockchain records control through cryptographic keys rather than by storing a coin in a physical vault.

The private key, or the signing system derived from it, is what allows transactions to be authorized.

That creates a core custody principle:

**Control of signing authority is control of the asset.**

A custodian therefore needs to protect more than a password. It may need to protect: private keys, seed phrases, signing devices, access credentials, recovery material, transaction policies, administrator rights, and systems used to construct transactions.

Crypto custody is best understood as the collection of controls used to safeguard those capabilities.

## Self-Custody

In self-custody, the user retains direct control over the private keys or signing process.

Common forms include hardware wallets, software wallets, multisignature wallets, air-gapped signing devices, and institutional self-custody systems.

Self-custody is attractive because the user does not need a third-party custodian to authorize withdrawals.

That reduces one type of counterparty risk.

It adds a different risk: the user becomes responsible for key security, backups, succession, transaction verification, and recovery.

### Advantages of Self-Custody

Direct control of assets, reduced dependence on a centralized exchange, ability to interact directly with blockchain applications, flexible transaction timing, and no custodian withdrawal approval.

### Risks of Self-Custody

Lost keys, stolen seed phrases, device compromise, phishing, wallet drainers, incorrect addresses, failed succession planning, poor backup practices, and concentration of knowledge in one person.

Self-custody transfers responsibility rather than eliminating it.

## Exchange Custody

Many users hold crypto on centralized exchanges.

This is operationally simple. The platform manages wallets and keys while the user accesses an account through credentials and authentication controls.

The user therefore has an account claim against the platform’s system rather than direct day-to-day control of blockchain keys.

Important questions include are customer assets segregated; how are keys stored; what percentage is held online; what withdrawal controls exist; which legal entity holds the assets; are assets lent, pledged, or otherwise used; what happens in insolvency; which jurisdiction governs the relationship; are there independent audits or attestations; and what insurance exists, and what does it cover.

An exchange can be both a trading venue and a custodian, which concentrates functions that traditional markets often separate.

## Institutional Crypto Custody

Institutional custody is not simply a larger hardware wallet.

It is usually a governance system.

A professional custody arrangement may include regulated custodial entities, segregated accounts, cold storage, hardware security modules, multi-party computation, multisignature approval, role-based access, transaction allowlists, withdrawal limits, audit logs, disaster recovery, compliance screening, and independent oversight.

The aim is to prevent a single compromised device, employee, or credential from moving assets.

That is why institutional [digital asset custody](/crypto/) sits at the intersection of cybersecurity, financial controls, regulation, trading infrastructure, and operational risk rather than being only a wallet choice.

## Multisignature and Multi-Party Computation Are Not the Same

Crypto custody discussions often group multisig and multi-party computation, or MPC, together because both can reduce single-key risk.

They work differently.

### Multisignature

A multisig wallet requires multiple private keys to authorize a transaction under rules such as two-of-three signatures.

The blockchain can often see the multisig structure.

### Multi-Party Computation

MPC uses cryptographic techniques that allow multiple parties or systems to participate in producing a valid signature without assembling a complete private key in one place.

Implementation details vary.

Neither architecture is automatically safer. Security depends on the design, endpoint controls, governance, recovery process, and who can change policy.

## Hot, Warm, and Cold Storage

Custodians often describe storage by connectivity.

### Hot Storage

Keys or signing systems are online and can support rapid transactions.

This improves availability and increases exposure to online attack.

### Cold Storage

Signing material is kept offline or in highly isolated environments.

This can reduce online attack surface but makes withdrawals slower and creates physical, procedural, and recovery challenges.

### Warm Storage

Warm storage sits between the two, using stronger isolation than hot wallets while preserving more operational availability than deep cold storage.

Institutions often split assets across tiers rather than choosing one model for everything.

## Key Segregation and Asset Segregation

These terms sound similar but describe different issues.

**Key segregation** means signing authority is separated across people, devices, locations, or systems.

**Asset segregation** generally refers to keeping customer assets distinct from a custodian’s proprietary assets or from other legal claims, depending on the structure and law.

A custodian can have sophisticated key security while still creating legal or balance-sheet risks if the ownership structure is unclear.

Conversely, an arrangement can have strong legal segregation but weak operational key security.

Serious custody due diligence needs both.

## Custody Regulation Is Moving

The United States has seen major changes in crypto custody policy.

In May 2025, the OCC’s Interpretive Letter 1184 confirmed that national banks and federal savings associations may provide and outsource crypto custody and execution services, subject to appropriate third-party risk management and safe-and-sound practices.

The OCC described crypto custody as a modern form of traditional bank custody.

Then, on October 1, 2026, the SEC proposed a tailored custody framework for registered investment advisers and regulated funds. According to the SEC, the proposal would permit self-custody in certain circumstances and allow state trust companies to serve as custodians under conditions.

At the time of writing, this is a proposal, not a final rule.

That distinction is essential. Compliance teams should work from current law and finalized requirements, not headlines about proposed changes.

## What the SEC Proposal Signals

The proposal is important even before finalization because it identifies the policy problems regulators are trying to solve.

Those include limited availability of suitable custodians for some crypto assets, how self-custody should work when no permitted custodian is available, how state trust companies fit into custody, recordkeeping, disclosure, audits, and broker-dealer custodial services for regulated funds.

SEC Commissioner Mark Uyeda emphasized that traditional principles such as asset segregation and controls still apply even though the mechanics differ for assets recorded on distributed ledgers.

That framing is useful beyond U.S. regulation.

Technology changes custody mechanics. It does not eliminate the need for controls.

## Sub-Custody Adds Another Layer of Risk

A firm may advertise custody under its own brand while relying on one or more third parties.

The OCC has explicitly discussed banks’ ability to use sub-custodians for permissible crypto custody activities, subject to third-party risk management.

For a customer, that means due diligence should map the custody chain:

**Client → Primary Custodian → Technology Provider or Sub-Custodian → Blockchain**

Questions include who has signing authority, who controls policy changes, where are keys generated, where are backups stored, what happens if the sub-custodian fails, who is legally responsible for loss, can the primary custodian move assets without the sub-custodian, can the sub-custodian move assets without the primary custodian, and which party performs transaction screening.

A brand name alone does not explain the control structure.

## Insurance Should Be Read, Not Assumed

“Insured custody” can sound reassuring.

The useful questions are insured against what, for how much, subject to which exclusions, held by which entity, shared across how many customers, and triggered under what circumstances.

Insurance may cover specific forms of theft or employee misconduct while excluding user error, smart-contract losses, market losses, or events outside defined custody systems.

A policy limit may also be much smaller than total assets under custody.

Insurance is one risk control, not a substitute for custody architecture.

## Proof of Reserves Is Not Full Custody Due Diligence

After failures among crypto firms, proof-of-reserves systems became more common.

Reserve evidence can help show that certain on-chain assets exist.

It does not automatically prove: liabilities, legal ownership, absence of encumbrances, internal controls, solvency, governance, or the right of customers to recover assets in insolvency.

A balance sheet has two sides.

Custody analysis should avoid treating an asset snapshot as a complete financial audit.

## Operational Controls Matter as Much as Cryptography

Many custody failures begin with people and process rather than broken encryption.

Useful controls can include separation of duties, transaction limits, multiple approvals, time delays, whitelisted addresses, hardware-backed authentication, staff background checks, mandatory vacations, change-management controls, incident response, secure recovery drills, and independent audits.

A sophisticated key technology can still be undermined by weak administrator access.

## Recovery Is Part of Security

A custody system that cannot recover from device loss, staff departure, disaster, or death is not resilient.

Recovery planning should answer: what happens if one signer disappears, what happens if a facility becomes inaccessible, can keys be reconstructed, who authorizes emergency recovery, how is recovery tested, can an attacker trigger the recovery process, and what happens during inheritance or corporate succession.

Backups should be protected against both loss and theft.

Those goals can conflict. A backup that is easy to access may be easy to steal. A backup that is extremely difficult to access may fail when needed.

## Build a Custody Risk Matrix Before Comparing Providers

Custody comparisons become more useful when the risks are separated instead of collapsed into one “security” score.

A provider can be strong in one area and weak in another. For example, deep cold-storage procedures may reduce online key exposure while creating longer withdrawal times and more complex recovery. A highly automated MPC system may improve transaction availability while increasing reliance on software policy controls and administrative security.

A simple matrix helps keep these tradeoffs visible:

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

Custodians may offer staking services.

That creates another set of risks: validator performance, slashing, lockup or unbonding periods, delegation structure, reward calculation, tax treatment, smart-contract exposure, and who controls governance rights.

Customers should understand whether the assets remain in the same custody arrangement while staked and which party makes protocol-level decisions.

## Custody and Trading Should Be Separated Conceptually

Even when one company offers both services, custody and execution solve different problems.

Custody asks: how are assets safeguarded?

Execution asks: how are trades placed and settled?

Combining them may reduce operational friction but can increase concentration.

Institutions should map: where assets sit before a trade, whether they must be prefunded to an exchange, how quickly they return to custody, whether off-exchange settlement is available, and which party bears risk during settlement.

The goal is to minimize unnecessary exposure outside the intended custody framework.

## A Crypto Custody Due-Diligence Checklist

Before choosing a custodian, document answers to these questions.

### Legal and Regulatory

What entity is the custodian; what licenses, charters, or registrations apply; which jurisdiction governs customer assets; how are assets treated in insolvency; and are assets legally segregated.

### Technical Security

How are keys generated; is storage hot, warm, or cold; is multisig or MPC used; are hardware security modules involved; how are backups protected; and how are transaction policies enforced.

### Operational Controls

Who can approve withdrawals, is separation of duties required, are addresses allowlisted, are large withdrawals delayed, are audit logs immutable, and how are administrators authenticated.

### Third Parties

Are sub-custodians used, which technology providers are critical, who is responsible for their failure, and how are vendors monitored.

### Financial Protection

Is insurance available, what does it cover, what is the policy limit, are customer assets lent or pledged, and are reserve and liability reports available.

### Recovery and Continuity

How are disaster scenarios handled, are recovery procedures tested, what happens if a signer leaves, and how is succession handled.

A custody provider should be able to explain these controls without relying only on phrases such as “institutional grade.”

## Frequently Asked Questions

These questions cover the points readers most often need to verify before acting on the information above.

### What Is Crypto Custody?

Crypto custody is the system used to safeguard the private keys or signing authority that controls digital assets, along with the legal and operational controls around that responsibility.

### Is Self-Custody Safer Than an Exchange?

It removes dependence on an exchange but makes the user responsible for key security, backups, transaction verification, and recovery. Safety depends on execution.

### Can Banks Custody Crypto?

In the United States, the OCC has clarified that national banks and federal savings associations may provide crypto custody services subject to applicable law and safe-and-sound practices.

### What Is Institutional Crypto Custody?

Institutional custody typically combines secure key technology with governance, segregation, compliance, transaction controls, recovery processes, audits, and regulated entities.

### What Is a Crypto Sub-Custodian?

A sub-custodian is a third party used by the primary custodian to perform some custody functions. The customer should understand how responsibilities and signing authority are divided.

### Is the SEC’s 2026 Crypto Custody Proposal Final?

No. The SEC announced proposed rules and amendments on October 1, 2026, which are also tracked through the agency’s [Crypto@SEC materials](https://www.sec.gov/featured-topics/crypto-task-force/cryptosec). Proposed rules can change before adoption.

## Resources

The following sources provide the primary or specialist evidence used to verify the claims and frameworks above.

- [U.S. SEC, SEC Proposal Would Address How Investment Advisers and Funds Can Custody Crypto Assets Under the Federal Securities Laws, October 1, 2026](https://www.sec.gov/newsroom/press-releases/2026-100-sec-proposal-would-address-how-investment-advisers-funds-can-custody-crypto-assets-under-federal)
- [U.S. SEC, Chairman Paul Atkins statement on the October 1, 2026 custody proposal](https://www.sec.gov/newsroom/speeches-statements/atkins-crypto-custody-100126-statement-proposal-address-custody-crypto-assets-under-investment-advisers-act-investment-company)
- [OCC Interpretive Letter 1184, May 7, 2025](https://www.occ.treas.gov/topics/charters-and-licensing/interpretations-and-actions/2025/int1184.pdf)
- [OCC News Release on crypto-asset custody and execution services, May 7, 2025](https://www.occ.treas.gov/news-issuances/news-releases/2025/nr-occ-2025-42.html)
- [SEC Crypto@SEC policy tracker](https://www.sec.gov/featured-topics/crypto-task-force/cryptosec)
