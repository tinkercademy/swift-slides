#!/usr/bin/env python3
"""Check that the lesson download extracts directly to a Swift Playgrounds app.

Run from any directory. An optional archive path checks a downloaded copy instead.
"""

from pathlib import Path, PurePosixPath
import re
import sys
from urllib.request import urlopen
from io import BytesIO
from zipfile import ZIP_DEFLATED, ZIP_STORED, ZipFile


root = Path(__file__).resolve().parents[1]
deck = root / "public/markdown/track_b/01a-stacks-and-shapes.md"
link = re.search(r"\[Download Completed Project\]\(([^)]+)\)", deck.read_text())
assert link, "Lesson must include the completed-project download"
url = link.group(1)
if len(sys.argv) > 1:
    data = Path(sys.argv[1]).read_bytes()
elif url.startswith("https://"):
    with urlopen(url) as response:
        data = response.read()
else:
    assert url.startswith("/"), "Expected a public asset URL"
    data = (root / "public" / url.lstrip("/")).read_bytes()

with ZipFile(BytesIO(data)) as archive:
    assert archive.testzip() is None, "Archive CRC check failed"
    entries = archive.infolist()
    names = {entry.filename for entry in entries}
    assert names, "Archive is empty"
    roots = {PurePosixPath(name).parts[0] for name in names}
    assert len(roots) == 1 and next(iter(roots)).endswith(".swiftpm"), (
        f"Expected one directly extractable .swiftpm package, got {sorted(roots)}"
    )
    package = next(iter(roots))
    for filename in ("Package.swift", "MyApp.swift", "ContentView.swift"):
        assert f"{package}/{filename}" in names, f"Missing {filename}"
    for entry in entries:
        path = PurePosixPath(entry.filename)
        assert not path.is_absolute() and ".." not in path.parts, "Unsafe archive path"
        assert not entry.flag_bits & 1, "Encrypted archives are not supported"
        assert entry.compress_type in (ZIP_STORED, ZIP_DEFLATED), "Unsupported compression"
        assert not entry.filename.lower().endswith(".zip"), "Unexpected nested ZIP"

print(f"PASS: {url} extracts directly to {package} with valid CRCs and standard ZIP compression")
