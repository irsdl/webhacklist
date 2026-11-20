#!/usr/bin/env python3
"""Validate public build inputs and both hosting targets in offline Docker."""
from pathlib import Path
import argparse
import base64
import gzip
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools/references"))
from refslib import toolbox

IMAGE = "webseclist-browser-tests:source-workers-4"
WORKER = r'''
import base64, gzip, json, pathlib, shutil, subprocess, sys
root = pathlib.Path('/tmp/work')
shutil.copytree('/inputs', root)
refresh = '--refresh' in sys.argv
for name in ('original-listings',):
    (root / name).symlink_to('/public/' + name, target_is_directory=True)
archive = root / 'archived-references'
archive.mkdir()
for source in pathlib.Path('/public/archived-references').iterdir():
    if source.name == 'source-groups.json':
        shutil.copyfile(source, archive / source.name)
    else:
        (archive / source.name).symlink_to(source, target_is_directory=source.is_dir())
def run(*args):
    subprocess.run(args, cwd=root, check=True, timeout=300)
if refresh:
    run('python3', 'tools/references/related_sources.py', 'build')
for source in sorted((root / 'website').iterdir()):
    if source.suffix in ('.js', '.mjs'):
        run('node', '--check', str(source))
run('node', '--test', '--test-reporter=tap', 'website/archive-invariants-test.mjs')
run('node', '--test', 'website/publisher-first-test.mjs')
run('node', 'website/list-membership-test.mjs')
identities = (root / 'website/story-identities.json').read_bytes()
run('node', 'website/build-data.mjs')
if not refresh and (root / 'website/story-identities.json').read_bytes() != identities:
    raise RuntimeError('Story identities are stale; regenerate and commit website/story-identities.json')
run('node', 'website/build-data.mjs', '--check')
run('node', 'website/progressive-budget-test.mjs')
run('node', 'website/companion-build-test.mjs')
run('node', 'website/readme-counts-test.mjs')
run('node', 'website/pages-test.mjs')
import importlib.util
spec = importlib.util.spec_from_file_location('refresh_checks', root / '.claude/skills/webseclist-refresh-website/scripts/refresh_web_apps.py')
checks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checks)
print('Registry checks:', checks.validate_registry())
print('Progressive checks:', checks.validate_progressive_data())
run('node', 'website/smoke-test.mjs')
for target, output in (('cloudflare', 'dist'), ('github', '_site')):
    run('node', 'website/build-site.mjs', '--target', target, '--output', output)
    if not (root / output / 'index.html').is_file():
        raise RuntimeError('Missing staged index for ' + target)
    if target == 'cloudflare' and not (root / output / 'saved-state.js').is_file():
        raise RuntimeError('Missing saved-state backup asset for ' + target)
    if target == 'github' and (root / output / 'saved-state.js').exists():
        raise RuntimeError('Backup UI must stay on the app origin, not the isolated reader origin')
    if target == 'cloudflare' and not (root / output / 'shortlist.js').is_file():
        raise RuntimeError('Missing shortlist bibliography asset')
    if target == 'github' and (root / output / 'shortlist.js').exists():
        raise RuntimeError('Shortlist UI must stay on the app origin')
    for seasonal in ('halloween-config.js', 'halloween.js', 'halloween.css', 'halloween-world.js', 'halloween-world.css', 'halloween-lab.js', 'halloween-lab.css'):
        asset = root / output / seasonal
        if not asset.is_file() or asset.read_bytes() != (root / 'website' / seasonal).read_bytes():
            raise RuntimeError('Missing or changed seasonal asset for ' + target + ': ' + seasonal)
    for relative, source in (('licence.txt', root / 'LICENSE'),
                             ('reuse.html', root / 'website/reuse.html'),
                             ('reuse.css', root / 'website/reuse.css')):
        asset = root / output / relative
        if target == 'cloudflare' and (not asset.is_file() or asset.read_bytes() != source.read_bytes()):
            raise RuntimeError('Missing or changed reuse terms: ' + relative)
        if target == 'github' and asset.exists():
            raise RuntimeError('Reuse guidance must stay on the app origin: ' + relative)
    if target == 'cloudflare':
        headers = (root / output / '_headers').read_text()
        if '/licence.txt\n  Cache-Control: public, max-age=0, must-revalidate\n  Content-Type: text/plain; charset=utf-8' not in headers:
            raise RuntimeError('MIT licence must serve as plain text with revalidation')
    for icon in ('install-192.png', 'install-512.png', 'install-maskable-512.png', 'apple-touch-icon.png'):
        asset = root / output / icon
        if target == 'cloudflare' and (not asset.is_file() or asset.read_bytes() != (root / 'website' / icon).read_bytes()):
            raise RuntimeError('Missing or changed install icon: ' + icon)
        if target == 'github' and asset.exists():
            raise RuntimeError('Install icons must stay on the app origin: ' + icon)
    if target == 'github' and sum(p.stat().st_size for p in (root / output).rglob('*') if p.is_file()) >= 1_000_000_000:
        raise RuntimeError('GitHub Pages artifact exceeds 1 GB')
    shutil.rmtree(root / output)
print('Offline build validation: both hosting targets passed')
if refresh:
    files = ['archived-references/source-groups.json', 'website/story-identities.json']
    files += [str(file.relative_to(root)) for file in sorted((root / 'website/data').rglob('*.json'))]
    payload = json.dumps({file:(root/file).read_text() for file in files}, ensure_ascii=False).encode()
    if len(payload) > 24 * 1024 * 1024:
        raise RuntimeError('Generated publication exceeds the 24 MiB output budget')
    print('WEBSEC_GENERATED_V1:' + base64.b64encode(gzip.compress(payload, mtime=0)).decode())
'''


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh', action='store_true', help='publish validated generated data through the bounded controller stream')
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    toolbox.ensure_image()
    if subprocess.run(["docker", "image", "inspect", IMAGE], capture_output=True).returncode:
        subprocess.run(["docker", "build", "-t", IMAGE, "-"],
                       input=(ROOT / "website/Dockerfile.tests").read_bytes(), check=True, timeout=900)
    with tempfile.TemporaryDirectory(prefix="websec_build_validation_") as folder:
        stage = Path(folder)
        os.chmod(stage, 0o755)
        shutil.copytree(ROOT / "website", stage / "website",
                        ignore=shutil.ignore_patterns("data", "node_modules", ".tmp", ".env*", "__pycache__"))
        shutil.copyfile(ROOT / ".gitignore", stage / ".gitignore")
        shutil.copyfile(ROOT / "LICENSE", stage / "LICENSE")
        shutil.copytree(ROOT / ".github/ISSUE_TEMPLATE", stage / ".github/ISSUE_TEMPLATE")
        shutil.copyfile(ROOT / ".github/PULL_REQUEST_TEMPLATE.md", stage / ".github/PULL_REQUEST_TEMPLATE.md")
        checker = Path('.claude/skills/webseclist-refresh-website/scripts/refresh_web_apps.py')
        (stage / checker.parent).mkdir(parents=True)
        shutil.copyfile(ROOT / checker, stage / checker)
        tracked = subprocess.check_output(['git', 'ls-files'], cwd=ROOT, text=True).splitlines()
        year_files = [file for file in tracked if re.fullmatch(r'\d{4}(?:-\d{2}|-ai)?\.md', file)]
        touched = {file:subprocess.check_output(['git', 'log', '-1', '--format=%cs', '--', file], cwd=ROOT, text=True).strip() for file in year_files}
        (stage / '.build-metadata.json').write_text(json.dumps({'tracked':tracked, 'touched':touched}), encoding='utf-8')
        shutil.copytree(ROOT / "tools/references", stage / "tools/references",
                        ignore=shutil.ignore_patterns('__pycache__', '.env*', 'cache'))
        shutil.copyfile(ROOT / "tools/sources.json", stage / "tools/sources.json")
        for source in ROOT.glob("*.md"):
            if re.fullmatch(r"\d{4}(?:-\d{2}|-ai)?\.md", source.name) or source.name in ("README.md", "CONTRIBUTING.md"):
                shutil.copyfile(source, stage / source.name)
        command = ["docker", "run", *toolbox.run_args()]
        command[command.index("--network") + 1] = "none"
        command[command.index("--memory") + 1] = "4g"
        command[command.index("--tmpfs") + 1] = "/tmp:rw,noexec,nosuid,size=3g"
        command += ["-v", str(stage) + ":/inputs:ro"]
        for name in ("archived-references", "original-listings"):
            command += ["-v", str(ROOT / name) + ":/public/" + name + ":ro"]
        command += [IMAGE, "python3", "-I", "-B", "-c", WORKER]
        if args.refresh:
            command.append('--refresh')
        result = toolbox._run_container(command, timeout=900, output_limit=32 * 1024 * 1024)
        output = result.stdout.decode("utf-8", "strict")
        markers = [line for line in output.splitlines() if line.startswith('WEBSEC_GENERATED_V1:')]
        sys.stdout.write('\n'.join(line for line in output.splitlines() if not line.startswith('WEBSEC_GENERATED_V1:')) + '\n')
        sys.stderr.write(result.stderr.decode("utf-8", "replace"))
        if result.returncode == 0 and args.refresh:
            if len(markers) != 1:
                raise RuntimeError('Missing generated publication envelope')
            compressed = base64.b64decode(markers[0].split(':', 1)[1], validate=True)
            import io
            with gzip.GzipFile(fileobj=io.BytesIO(compressed)) as stream:
                raw = stream.read(24 * 1024 * 1024 + 1)
            if len(raw) > 24 * 1024 * 1024:
                raise RuntimeError('Generated publication exceeds budget')
            files = json.loads(raw)
            registry = json.loads((ROOT / 'website/archive-years.json').read_text(encoding='utf-8'))
            allowed = {'archived-references/source-groups.json', 'website/story-identities.json',
                       'website/data/catalogue.json', 'website/data/diagrams.json'}
            allowed.update(f'website/data/{kind}/{record["id"]}.json'
                           for record in registry['years'] for kind in ('collections', 'sources'))
            if not isinstance(files, dict) or set(files) != allowed:
                raise RuntimeError('Unexpected generated publication paths')
            for relative, body in files.items():
                if not isinstance(body, str) or len(body.encode('utf-8')) > 12 * 1024 * 1024:
                    raise RuntimeError('Invalid generated file')
                json.loads(body)
                if not (ROOT / relative).resolve().is_relative_to(ROOT.resolve()):
                    raise RuntimeError('Generated path escapes repository')
            # Publish the catalogue last, after all shards and their versions.
            for relative in sorted(files, key=lambda name: name == 'website/data/catalogue.json'):
                target = ROOT / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                temporary = target.with_name(target.name + '.refresh-tmp')
                temporary.write_text(files[relative], encoding='utf-8', newline='\n')
                os.replace(temporary, target)
            print('Published isolated generated data; website/data remains ignored.')
        return result.returncode


if __name__ == "__main__":
    sys.exit(main())
