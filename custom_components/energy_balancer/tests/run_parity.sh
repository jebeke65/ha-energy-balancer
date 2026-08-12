#!/bin/sh
# Run the ported algorithm test suite as a parity proof.
#
# The tests are written for a FLAT layout (core.py + battery_algorithm.py + the
# test modules as siblings, no package). The integration ships them inside a
# package dir, whose __init__.py imports homeassistant/voluptuous — so pytest
# cannot collect them in place without importing the package. We therefore run
# them from a flat dir of SYMLINKS to the shipped files (zero drift).
#
# Usage:  PYTEST=/path/to/venv/bin/python tests/run_parity.sh
set -e

PKG="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

ln -s "$PKG/core.py"              "$TMP/core.py"
ln -s "$PKG/battery_algorithm.py" "$TMP/battery_algorithm.py"
for f in "$PKG"/tests/test_*.py; do
    ln -s "$f" "$TMP/$(basename "$f")"
done

PYTEST="${PYTEST:-python3}"
cd "$TMP"
exec "$PYTEST" -m pytest . -q -p no:cacheprovider
