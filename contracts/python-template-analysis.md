# Word template analysis

The [analysis feature](../workflows/docx/template-analysis.feature) separates
response-shape, response-status and metadata-response API profiles. It requires a
successful dictionary response for the SOW input and only a dictionary for the
plain, placeholder and blue-guidance inputs. An error dictionary satisfies those
three shape-only cases; no classification result is required. The direct analyzer reads
an existing DOCX and can return content categories, table handling, formatting
patterns and recommendations. The unified `office_template(operation="analyze")`
path delegates to the Word analyzer and may add SOW `template_metadata`. With a
dedicated empty cache and an unchanged template, metadata cache reasons progress
from `stored` to `hit`; the table purpose is `staffing`.

Two native tests use the same blue-guidance input and share one scenario. Their
assertions require only a dictionary response. Headings, placeholders, blue runs
and table cells are inputs; the tests do not verify their classification, font
values, input-byte preservation or Office rendering.

The SOW success condition is stronger than its native Python test: that test
accepts either an absent `error` member **or** a dictionary, including an error
dictionary. The [consumer mapping](../ledgers/consumers/python-template-analysis.json)
pins the Python source and lists the missing assertions. These shared scenarios
have no Python binding or execution credit. A stronger common analysis contract
must specify useful output values for the supplied document and retain source
bytes, with tests that reject plausible-looking but incorrect metadata. Those
requirements cannot be inferred from the current shape checks.
