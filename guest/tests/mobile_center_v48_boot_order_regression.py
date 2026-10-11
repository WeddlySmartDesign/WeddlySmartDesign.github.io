#!/usr/bin/env python3
"""Offline regression: prevent V4.7's premature about:blank load in Android."""
import importlib.util
from pathlib import Path
repo=Path(__file__).resolve().parents[2]
src=repo/'guest/tools/build_mobile_center_v48_from_v47.py'
spec=importlib.util.spec_from_file_location("guest_v48_builder",src)
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
old,new=m.FRAGMENT_OLD,m.FRAGMENT_NEW
assert "host.replaceChildren(iframe);" in old
assert old.index("host.replaceChildren(iframe);") < old.index("iframe.srcdoc=text();"), "V4.7 race reproduction"
assert new.index("iframe.srcdoc=text();") < new.index("host.replaceChildren(iframe);"), "srcdoc must be ready before DOM insertion"
assert "doc.getElementById('invitation')" in new, "ignore initial blank iframe load"
assert "},{once:true})" not in new, "must not consume only load on blank"
assert "k!==generation" in new and "structuredClone(config)" in new
assert "BOTANICA_APPLY_CONFIG" in new
assert "adapter_not_found_after_master_loaded" in new
assert "45000" in new
assert m.PIN=="3ce9f5fa97a623c0b358336d11bbcd58db586a4e60c34e93b24abcc44e1c0484"
assert m.replace_one(old,old,new,'test')==new
try:m.replace_one(old+old,old,new,'test')
except ValueError: pass
else:raise AssertionError("ambiguous edit must be rejected")
assert "'none':'block'" in src.read_text(), "hide duplicate center back overlay"
assert "padding:30px 14px 8px" in src.read_text(), "Android top bar padding"
print("PASS V4.8 Android iframe boot-order source regression: V4.7 race reproduced, srcdoc-before-append fixed, blank-load rejected, master/config preserved")
