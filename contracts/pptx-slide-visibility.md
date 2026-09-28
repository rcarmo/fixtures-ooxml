# Slide visibility inputs

The [slide-visibility workflows](../workflows/pptx/slide-visibility.feature) distinguish a retained package observation from an application-confirmed PowerPoint positive. They do not infer producer identity from application metadata.

The committed `hidden-slides-e01ded1106a2.pptx` archive has four slides; `ppt/slides/slide3.xml` carries namespaced `p:show="0"`, while the other slides lack that attribute. The separately committed `hidden-slides-fa245a3df00f.pptx` archive has four unmarked slides and serves as a visible control. A package-level test must keep each slide's relationship and part identity, check the whole input was not mutated and report exactly which slide is hidden. A matching visible-operation result alone is weaker.

PowerPoint has not independently confirmed the retained S file's hidden state. The Office-positive scenario remains planned until an untouched four-slide PowerPoint export with only slide 3 hidden is acquired, reopened in PowerPoint, and registered with original bytes, version and platform. See the [acquisition list](../docs/fixture-acquisition.md). No current `multiple-masters` fixture has two slide masters, so it cannot support a two-slide-master positive.

Go's historical `hidden_slides.pptx` round-trip creates a new hidden slide and checks only that *some* slide is hidden after reopen; it cannot prove the pre-existing slide 3 identity. The Python hide/list tests check success or response shape, without matching the exact input slides. The [Go mapping](../ledgers/consumers/pptx-slide-visibility.json) and [Python mapping](../ledgers/consumers/python-pptx-slide-visibility.json) record those separate gaps. Registration does not give any runtime execution credit.
