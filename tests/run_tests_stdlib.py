"""Run the existing EB test modules without pytest.

The shipped suite is written pytest-style (module-level `def test_*()` with bare
asserts) but there is no pytest in this container. These tests need no fixtures
and no parametrisation, so plain collection-and-call is enough.

Mirrors run_parity.sh: build a flat directory of symlinks (core.py and friends
as siblings of the test modules) so the package __init__ — which imports
homeassistant — is never touched.

Usage:  python3 tests/run_tests_stdlib.py [module ...]
"""

from __future__ import annotations

import importlib.util
import os
import shutil
import sys
import tempfile
import traceback

TESTS = os.path.dirname(os.path.abspath(__file__))
# tests/ lives inside the integration (installed copy) or at the repository root.
PKG = next(
    (p for p in (os.path.dirname(TESTS),
                 os.path.join(os.path.dirname(TESTS), "custom_components", "energy_balancer"))
     if os.path.exists(os.path.join(p, "core.py"))),
    os.path.dirname(TESTS))

# Modules that are helpers, not suites.
SKIP = {"check_live", "run_tests_stdlib", "oracle_car_brain", "test_car_parity"}


def _flat_dir() -> str:
    tmp = tempfile.mkdtemp(prefix="eb_flat_")
    for name in os.listdir(PKG):
        if name.endswith(".py") and name != "__init__.py":
            os.symlink(os.path.join(PKG, name), os.path.join(tmp, name))
    for name in os.listdir(TESTS):
        if name.endswith(".py") or name.endswith(".json"):
            os.symlink(os.path.join(TESTS, name), os.path.join(tmp, name))
    return tmp


def _load(path: str, name: str):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def main(argv: list[str]) -> int:
    tmp = _flat_dir()
    sys.path.insert(0, tmp)
    os.chdir(tmp)

    wanted = set(argv) or None
    passed = failed = 0
    failures = []

    names = sorted(n[:-3] for n in os.listdir(tmp)
                   if n.startswith("test_") and n.endswith(".py"))
    for mod_name in names:
        if mod_name in SKIP:
            continue
        if wanted and mod_name not in wanted:
            continue
        try:
            module = _load(os.path.join(tmp, mod_name + ".py"), mod_name)
        except Exception:
            failed += 1
            failures.append((mod_name, "<import>", traceback.format_exc()))
            continue

        for fn_name in sorted(dir(module)):
            if not fn_name.startswith("test_"):
                continue
            fn = getattr(module, fn_name)
            if not callable(fn):
                continue
            try:
                fn()
                passed += 1
            except Exception:
                failed += 1
                failures.append((mod_name, fn_name, traceback.format_exc()))

    for mod_name, fn_name, tb in failures:
        print(f"\nFAIL {mod_name}.{fn_name}\n{tb}")

    print(f"\n{passed} passed, {failed} failed")
    shutil.rmtree(tmp, ignore_errors=True)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
