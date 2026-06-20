# Update Client Intake Workflow

Refactor the existing **Client Intake** page to better match a real attorney workflow.

The attorney should not configure required documents immediately on page load. Instead, the page should separate:

* Intake Request Management
* Attorney Manual Uploads
* Intake Progress Tracking

---

# Overall Structure

Keep the existing Case Overview section.

```
Estate of Miller vs Logistics Co.

Plaintiff
Evelyn Miller

Jurisdiction
Cook County, IL

Case ID
PI-2024-001

Summary
Delayed stroke response and negligent medication management at memory care facility.
```

Immediately below this overview, keep the secondary navigation:

```
[ Intake Request ]    [ Documents ]
```

Default active tab:
**Intake Request**

---

# Intake Request Tab

## Initial State (No Intake Created Yet)

Do NOT show:

* Required Documents
* Additional Instructions

Those belong inside the intake form builder.

Instead show two primary actions.

---

### Create Intake Form

Description:

Create a secure intake form that the plaintiff can use to upload documents.

CTA:

**Create Intake Form →**

---

### Upload Existing Files

Description:

Upload documents already received outside LECO.

Examples:

* Email attachments
* Physical paperwork
* Police reports
* Hospital records

CTA:

**Upload Files →**

---

# Create Intake Form

When the attorney clicks **Create Intake Form**, open a modal.

---

## Recipient Email

Pre-fill the plaintiff email collected during Case Creation.

Example:

Recipient Email

[[evelyn.miller@gmail.com](mailto:evelyn.miller@gmail.com)]

The attorney should be able to edit this before sending.

This supports situations where the original email was incorrect.

---

## Required Documents

Allow the attorney to choose what should be requested.

Default selected:

✓ Medical Records

✓ Police Report

✓ Insurance Documents

✓ Wage Loss Records

Optional:

□ Property Damage Photos

□ Employment Records

---

## Additional Instructions

Multi-line text area.

Placeholder:

"Provide any additional information or supporting documents that may help evaluate your claim."

---

## Modal Actions

Provide TWO CTAs.

### Create Form

Creates the intake form and generates a secure shareable link.

Does NOT send any email.

Use case:

The attorney wants to manually send the link via WhatsApp, SMS, or another communication channel.

---

### Send Request

Creates the intake form and immediately emails the plaintiff.

---

# Intake Request Tab After Form Creation

Replace the initial action screen with a request summary card.

---

## Intake Request Card

✓ Intake Form Created

Recipient:
[evelyn.miller@gmail.com](mailto:evelyn.miller@gmail.com)

Status:
Created
(or Sent if already emailed)

Created:
Jun 8, 2026

Requested Documents:
4

Secure Intake Link:

https://leco.ai/intake/ABX29...

[ Copy Link ]

Action:

[ Modify Request ]

---

## Attorney Upload Section

This should appear as a completely separate section BELOW the request card.

Do NOT place Upload Files inside the request card.

Purpose:

Allow attorneys to continuously upload files they already possess.

Examples:

* Client emails additional records
* Police report arrives later
* Attorney scans physical paperwork

Card:

### Upload Existing Files

Add documents already received outside the LECO intake process.

CTA:

**Upload Files →**

---

# Modify Request

The attorney should be able to reopen the intake configuration.

They can:

* Add new required documents
* Remove optional documents
* Update additional instructions
* Update recipient email

---

# Documents Tab

This tab becomes the source of truth for intake progress.

---

## Intake Status

✓ Intake Request Sent

Completion:
65%

---

## Requested Documents

✓ Medical Records

✓ Insurance Documents

○ Police Report

○ Wage Loss Records

---

## Documents Received

Table:

| Document | Source | Status |

MRI Report.pdf | Plaintiff | Processed

ER Bills.pdf | Plaintiff | Processed

Insurance Policy.pdf | Attorney | Processing

---

## Missing Documents

Display only outstanding items.

Missing Documents

• Police Report

• Wage Loss Records

Add a primary action inside this section:

**Follow Up**

---

# Follow Up Flow

When the attorney clicks **Follow Up**, open a modal.

Do NOT automatically send.

---

## Follow-up Modal

Recipient:
[evelyn.miller@gmail.com](mailto:evelyn.miller@gmail.com)

Missing Documents:

✓ Police Report

✓ Wage Loss Records

---

Message:

Hello Evelyn,

We're still waiting for the following documents to continue processing your case:

• Police Report

• Wage Loss Records

Please upload them using your secure intake link.

Thank you.

---

The message should be pre-generated but fully editable.

Actions:

[ Cancel ]

[ Send Follow-up ]

---

# Follow-up Behavior

The system must support multiple follow-up requests.

Example:

Initial request:

* Medical Records
* Police Report

Later:

Attorney realizes Wage Loss Records are also required.

The attorney clicks:

Modify Request

Adds:

✓ Wage Loss Records

Clicks:

Send Follow-up Request

The plaintiff receives only the updated request.

Do NOT create a second intake.

Do NOT duplicate workflows.

The intake form should be treated as a persistent asset that can evolve throughout the intake lifecycle.

---

# Bottom CTA

Continue to Classification →

Disable until all required documents are either:

* received, or
* explicitly marked as optional.

---

# UX Principles

* Attorney first chooses how to begin collection.
* Required documents should only appear while creating or modifying the intake form.
* Upload Existing Files should remain permanently available as a separate section.
* Intake forms should support manual sharing via Copy Link.
* Support iterative document requests and follow-ups.
* Support hybrid workflows where both plaintiff and attorney contribute documents.
* The page should feel like a professional legal operations workspace, not a simple upload screen.
