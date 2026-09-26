# Word template analysis

The [Word template feature](../workflows/docx/python-template-analysis.feature)
requires a successful dictionary response for the SOW input and tests the
response shape for plain and placeholder documents. The direct analyzer reads
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
have no Python binding or execution credit.
