import bleach

ALLOWED_TAGS = [
    "p",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "h1",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "br",
    "a",
]
ALLOWED_ATTRS = {
    "a": ["href", "title", "target"],
}


def sanitize_html(raw_html: str) -> str:
    return bleach.clean(raw_html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)
