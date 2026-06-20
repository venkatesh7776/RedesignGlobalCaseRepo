UPDATE LECO FROM A STATIC PROTOTYPE INTO A FULLY CONNECTED FRONTEND EXPERIENCE

The current LECO Intake Pipeline consists of five static stages:

* Collection
* Classification
* Analysis
* Valuation
* Case Ready

Transform LECO into a fully interactive frontend experience without implementing any backend functionality.

Do not use databases, APIs, OCR services, AI services, Supabase, authentication systems, or server-side logic.

The goal is to create a realistic, end-to-end attorney experience powered entirely by frontend state, predefined rules, and contextual empty states.

This prototype should be suitable for attorney demos, usability testing, investor presentations, and workflow validation.

---

OVERALL PRINCIPLE

Each case should maintain a centralized frontend case state.

Every attorney action updates this state.

All downstream stages should automatically react to those updates.

The user should feel that LECO is actively processing the case.

---

PIPELINE FLOW

Create Case
↓

Collection
↓

Classification
↓

Analysis
↓

Valuation
↓

Case Ready
↓

Open Case Workspace

---

CASE STATE

Use a centralized frontend case object.

Track information such as:

* Case created
* Retainer status
* Intake created
* Intake sent
* Intake link generated
* Intake delivery method
* Uploaded documents
* Document source
* Classification categories
* Analysis findings
* Missing evidence
* Valuation generated
* Generated deliverables
* Checklist completion
* Attorney notes

All UI should react to this frontend state.

---

STAGE 01 — COLLECTION

Collection is the source of truth.

Actions supported:

* Create Case
* Send Retainer
* Mark Retainer Signed
* Create Intake Form
* Send Intake Request
* Follow-up Intake Requests
* Plaintiff uploads documents
* Attorney uploads documents

Documents can originate from:

Plaintiff
Attorney

When documents are received:

* Collection updates automatically.
* Documents appear immediately.
* Classification unlocks.

If no documents exist:

Classification remains locked.

---

COLLECTION EMPTY STATES

No Intake Created

"No intake request has been created for this case yet."

Create an intake request or upload documents manually to begin case processing.

CTAs:

Create Intake Form

Upload Existing Files

---

Intake Sent But No Documents Received

"Waiting for documents."

The intake request has been sent, but no documents have been received yet.

CTAs:

View Intake Request

Send Follow-Up Request

---

No Documents Uploaded

"No documents available."

Upload files manually or wait for the plaintiff to submit documents.

CTA:

Upload Files

---

STAGE 02 — CLASSIFICATION

Classification should no longer display static information.

Instead, generate categories based on uploaded documents.

Example:

MRI_Report.pdf
ER_Bills.pdf
Police_Report.pdf

Automatically become:

Medical Records
• MRI_Report.pdf
• ER_Bills.pdf

Police Reports
• Police_Report.pdf

Each category:

* Can expand/collapse.
* Displays raw document names.
* Supports Preview.

Preview Mode:

* Opens document viewer.
* Displays AI assistant beside the document.
* Allows attorneys to ask questions regarding the opened document.

Any newly uploaded document should immediately update Classification.

---

CLASSIFICATION EMPTY STATES

No Documents To Classify

"No documents available for classification."

LECO will organize evidence automatically once documents are received.

CTA:

Back to Collection

---

Empty Category

"No documents have been assigned to this category."

Additional evidence may populate this section later.

---

No Preview Available

"Document preview unavailable."

This file has not been processed for viewing yet.

---

STAGE 03 — ANALYSIS

Analysis findings depend entirely on Classification.

Generate findings using predefined rules.

Example:

If Police Reports exist:

Display:

TRAFFIC CODE VIOLATION

Red-Light Intersection Encroachment

Responding patrol officer report confirms the commercial vehicle entered the intersection against a red light.

Source Documents:

Police_Report.pdf

Witness_Statement.pdf

View Sources

---

If MRI or imaging exists:

Display:

CLINICAL DISABILITY ONSET

Cervical Cord Compression

MRI findings confirm C5-C6 and C6-C7 disc herniations causing neurological compression.

Source Documents:

MRI_Report.pdf

ER_Admission.pdf

View Sources

---

If both exist:

Display both findings.

If insufficient evidence exists:

Display empty state.

---

ANALYSIS LAYOUT

Keep exactly these sections:

Discovered Liability & Injury Signals

↓

Evidentiary Ingestion & Document Verification Audit

↓

Inquest Custody Gap & Pipeline Analysis

↓

Proceed To Valuation

Do not add additional analysis modules.

Do not introduce confidence scores.

Do not introduce new AI insight cards.

---

ANALYSIS EMPTY STATES

Insufficient Evidence

"Not enough evidence to generate intelligence findings."

LECO requires supporting documentation before identifying liability signals.

CTAs:

Review Missing Evidence

Request Additional Documents

---

No Missing Evidence

"No evidence gaps detected."

All required supporting documentation appears available.

---

No Follow-Up Required

"There are currently no outstanding document requests."

---

FOLLOW-UP REQUEST MODAL

When attorney clicks:

Send Missing Document Request

Open review modal.

Display:

Missing Documents

Attorney can uncheck items.

---

Delivery Method

Email

Phone

Auto-populated from case data.

Attorney selects one.

---

Message Preview

Editable.

Auto-generated.

Lists missing documents.

---

Secure Upload Link

Existing intake link.

Copy Link option.

---

Actions

Cancel

Send Request

---

EDGE CASES

No contact information.

No intake form exists.

Disable sending.

---

STAGE 04 — VALUATION

Valuation depends entirely on Analysis.

If Analysis is incomplete:

Valuation remains locked.

If Analysis generates findings:

Generate valuation outputs.

Keep exactly these sections:

Damage Computation & Settlement Corridor

↓

Interactive Multiplier Strategy

↓

Proceed To Case Ready

Do not add new valuation modules.

Do not remove existing functionality.

---

VALUATION LAYOUT

Two-column summary.

LEFT

Economic Damages

Multiplier Adjustment

Total Recommended Value

RIGHT

Settlement Range

Proceed To Case Ready

Interactive Multiplier Strategy spans full width below.

---

VALUATION EMPTY STATES

Analysis Not Complete

"Valuation is unavailable until analysis has been completed."

CTA:

Return to Analysis

---

Insufficient Information

"There is not enough information to estimate settlement value."

CTA:

Request Missing Documents

---

No Multiplier Available

"Multiplier adjustments will appear once valuation assumptions have been generated."

Disable multiplier controls.

---

STAGE 05 — CASE READY

Case Ready reflects completion of the entire pipeline.

Checklist completion should be automatic.

Generated deliverables should unlock progressively.

Open Case Workspace should only become available once all prerequisites are satisfied.

---

CASE READY LAYOUT

Case Ready Header

↓

Case Intelligence Snapshot

↓

Case Readiness Checklist + Generated Deliverables

↓

Attorney Notes

↓

Ready To Proceed

---

CASE INTELLIGENCE SNAPSHOT

Keep exactly these cards:

Confidence Score

Estimated Range

Missing Documents

Critical Risks

Improve layout only.

Do not remove them.

---

CASE READINESS CHECKLIST

Keep:

Medical records collected

Documents classified

Missing records audited

Key entities extracted

Medical chronology generated

Valuation completed

Case workspace generated

Only expand the first checklist item by default.

Completion updates automatically.

---

GENERATED DELIVERABLES

Keep exactly:

Medical Chronology

Evidence Structure

Case Summary

Valuation Analysis

Knowledge Graph

Jurisdiction Profile

Use a 2×3 grid.

Open actions should unlock automatically once prerequisites are met.

---

ATTORNEY NOTES

Keep existing functionality.

Allow:

Private Notes

Category Tag

Priority Level

Chronological Notes Feed

Save Private Note

Maintain Strict Work Product Privilege.

---

READY TO PROCEED

Keep existing functionality.

Display:

View Intake Report

Open Case Workspace

Open Case Workspace remains disabled until all prerequisites are complete.

---

CASE READY EMPTY STATES

Case Not Ready

"This case is still being prepared."

Display incomplete checklist items.

Disable Open Case Workspace.

---

No Deliverables Generated

"Generated deliverables will appear once processing is complete."

---

No Attorney Notes

"No private notes saved."

CTA:

Write First Note

---

No Intake Report Available

"The intake report has not been generated yet."

Disable View Intake Report.

---

DESIGN PRINCIPLES

* Do not implement backend functionality.
* Do not use APIs.
* Do not use databases.
* Do not implement OCR.
* Do not implement real AI.
* Use predefined outputs and frontend rules.
* Make every stage respond dynamically.
* Support meaningful empty states.
* Never show blank screens.
* Always explain why data is unavailable.
* Provide next-step CTAs whenever possible.
* Preserve attorney confidence throughout the experience.

The final result should feel like a fully functioning LECO product where attorneys can experience an end-to-end workflow—from case creation to Case Ready—even though everything is powered entirely by frontend interactions and predefined state transitions.
