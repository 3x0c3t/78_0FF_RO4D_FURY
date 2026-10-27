#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAPS = ROOT / "maps"
OUTPUT = MAPS / "index.json"

LABELS = {
    "map": "Désert (classique)",
    "desert": "Désert",
    "forest": "Forêt",
    "suburb": "Banlieue",
    "mountain": "Montagne",
    "test/20261025_1": "TEST 1",
    "test/20261025_2": "TEST 2",
}

maps = []

for path in sorted(MAPS.rglob("*.json")):
    if path == OUTPUT:
        continue

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        vertices = data.get("vertices")

        if not isinstance(vertices, list) or len(vertices) != 1323:
            continue

        relative = path.relative_to(MAPS).with_suffix("").as_posix()
        label = LABELS.get(relative, path.stem.replace("_", " ").replace("-", " "))

        maps.append({
            "value": relative,
            "label": label,
        })

    except (OSError, json.JSONDecodeError, AttributeError):
        continue

maps.sort(key=lambda item: (
    item["value"] != "map",
    item["label"].casefold(),
    item["value"],
))

OUTPUT.write_text(
    json.dumps(maps, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)

print(f"{len(maps)} carte(s) valide(s) détectée(s) :")
for item in maps:
    print(f"  {item['label']} -> {item['value']}.json")

print(f"\nManifeste créé : {OUTPUT.relative_to(ROOT)}")
