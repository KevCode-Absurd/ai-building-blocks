# Selection and release records

Reference row: id, local source, format, job, product fit, rights/use note, selected, selectedBy(user/assistant), userDirection, adaptationRisk. Stable IDs and sorting must not change when a checkbox toggles. If local storage fails, retain state in memory and offer JSON export/import. Reopening a review restores user edits; a new proposal set must not erase them.

Ad row: adId, referenceId, chosenDirection, originalClaim, approvedReplacement, evidenceId, productVariant, anchorPhotos, editableFile, ratio, outputFile, version, generatedOrReal, QAstatus, reason, supersedes. Status is planned/made/uninspected/rejected/readyForReview/approved. A review request for changes is not approval.

Library ingestion: dedupe by source ID, normalized URL and available content hash. A read-only export is enough. When authorized connector reads incur per-ad cost, state the scope/credit cap, page newest-first and stop when a complete page adds no new records. Do not sweep unrelated boards. Imported packs append new IDs and preserve user annotations/brand work. Preview any update conflicts; do not overwrite user edits.
