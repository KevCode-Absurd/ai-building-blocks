# Copy release record

Record: run ID; scope/product/variant; baseline version; source/evidence IDs; exact approved change; effective time and timezone; affected surfaces; unchanged locks; output version; content or file fingerprint when actually computed; claim decisions; text review; rendered review; destination verification; approval scope/version; publisher and rollback reference.

Use text labels if hashing tools are unavailable. A manually assigned version is not a cryptographic hash. Mark inaccessible content as NOT_INSPECTED, not unchanged. Status values must distinguish planned, drafted, text-checked, rendered, inspected, authorized-for-specific-action and actually-published. A future effective date is not permission to activate early.

On resume compare the supplied baseline and approval version with the current record. If they differ, rebase and recheck affected rows. Never overwrite an unseen concurrent edit. Keep superseded outputs for comparison rather than silently replacing the record.
