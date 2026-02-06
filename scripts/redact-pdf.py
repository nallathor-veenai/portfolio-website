#!/usr/bin/env python3
"""
Redact sensitive contact information (email, phone) from the resume PDF.

Usage:
    python scripts/redact-pdf.py [--input public/JV-Resume.pdf] [--output public/JV-Resume.pdf]

By default, redacts in-place on public/JV-Resume.pdf.
"""

import argparse
import re
import sys
import os

try:
    import pymupdf
except ImportError:
    print("Error: pymupdf is required. Install with: pip install pymupdf")
    sys.exit(1)


# Patterns to redact
REDACT_PATTERNS = [
    # Email addresses
    re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'),
    # Phone numbers (various formats)
    re.compile(r'\+?1?\s*[-.]?\s*\(?\d{3}\)?\s*[-.]?\s*\d{3}\s*[-.]?\s*\d{4}'),
]


def redact_pdf(input_path: str, output_path: str) -> dict:
    """
    Redact email and phone number from a PDF file.
    Returns a dict with counts of redactions made.
    """
    if not os.path.exists(input_path):
        print(f"Error: Input file not found: {input_path}")
        sys.exit(1)

    doc = pymupdf.open(input_path)
    stats = {"emails": 0, "phones": 0, "pages_modified": 0}

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_modified = False

        for i, pattern in enumerate(REDACT_PATTERNS):
            matches = page.search_for(pattern.pattern, quads=False)

            # Also search the actual text content for regex matches
            text = page.get_text()
            for match in pattern.finditer(text):
                matched_text = match.group()
                areas = page.search_for(matched_text)

                for area in areas:
                    # Add redaction annotation (white rectangle to blend with background)
                    annot = page.add_redact_annot(area, fill=(1, 1, 1))
                    page_modified = True

                    if i == 0:
                        stats["emails"] += 1
                    else:
                        stats["phones"] += 1

        if page_modified:
            # Apply all redactions on this page
            page.apply_redactions()
            stats["pages_modified"] += 1

    # Save the redacted PDF (use temp file for in-place replacement)
    if os.path.abspath(input_path) == os.path.abspath(output_path):
        tmp_path = output_path + ".tmp"
        doc.save(tmp_path, garbage=4, deflate=True)
        doc.close()
        os.replace(tmp_path, output_path)
    else:
        doc.save(output_path, garbage=4, deflate=True)
        doc.close()

    return stats


def main():
    parser = argparse.ArgumentParser(description="Redact email and phone from resume PDF")
    parser.add_argument(
        "--input", "-i",
        default="public/JV-Resume.pdf",
        help="Input PDF path (default: public/JV-Resume.pdf)"
    )
    parser.add_argument(
        "--output", "-o",
        default=None,
        help="Output PDF path (default: same as input, i.e. in-place)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be redacted without modifying the file"
    )

    args = parser.parse_args()
    output_path = args.output or args.input

    if args.dry_run:
        doc = pymupdf.open(args.input)
        print(f"Scanning {args.input}...")
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            for i, pattern in enumerate(REDACT_PATTERNS):
                for match in pattern.finditer(text):
                    kind = "EMAIL" if i == 0 else "PHONE"
                    print(f"  Page {page_num + 1}: [{kind}] {match.group()}")
        doc.close()
        return

    print(f"Redacting sensitive info from: {args.input}")
    stats = redact_pdf(args.input, output_path)

    print(f"Done! Redacted {stats['emails']} email(s) and {stats['phones']} phone number(s) across {stats['pages_modified']} page(s).")
    print(f"Output saved to: {output_path}")


if __name__ == "__main__":
    main()
