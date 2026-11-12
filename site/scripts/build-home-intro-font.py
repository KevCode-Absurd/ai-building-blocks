from pathlib import Path
from hashlib import sha256
import io
import json
import re
import html
import fontTools
import brotli
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen

source = Path('site/public/fonts/space-grotesk.woff2')
output = Path('site/public/fonts/ai-blocks-intro-sans.woff2')
original = TTFont(source, recalcTimestamp=False)
stamp = original['head'].modified
original = instantiateVariableFont(original, {'wght': 400}, inplace=True)
# Compare against the saved (integer-rounded) instance, which is what a browser draws at weight 400.
_buffer = io.BytesIO(); original.save(_buffer); _buffer.seek(0); original = TTFont(_buffer, recalcTimestamp=False)
font = TTFont(source, recalcTimestamp=False)
font = instantiateVariableFont(font, {'wght': 400}, inplace=True)
options = subset.Options()
options.name_IDs = ['*']
options.name_languages = ['*']
options.name_legacy = True
options.glyph_names = True
options.layout_features = ['*']
options.recalc_timestamp = False
subsetter = subset.Subsetter(options=options)
intro_source = Path('tools/lib/home-initial-shell.mjs').read_text()
intro_matches = re.findall(r'<p class="lede typed" data-done="true">([^<]+)</p>', intro_source)
assert len(intro_matches) == 1
intro = html.unescape(intro_matches[0])
codes = sorted(set(map(ord, intro)))
subsetter.populate(unicodes=codes)
subsetter.subset(font)
for record in font['name'].names:
    if record.nameID in (1, 4, 16):
        record.string = 'AI Blocks Intro Sans'.encode(record.getEncoding())
    elif record.nameID == 6:
        record.string = 'AIBlocksIntroSans-Regular'.encode(record.getEncoding())
    elif record.nameID == 3:
        record.string = ('AI Blocks Intro Sans: ' + sha256(source.read_bytes()).hexdigest()[:16]).encode(record.getEncoding())
font['name'].setName(Path('site/public/fonts/LICENSE-space-grotesk.txt').read_text(), 13, 3, 1, 0x409)
font['head'].modified = stamp
font.flavor = 'woff2'
font.save(output)
actual = TTFont(output, recalcTimestamp=False)
assert set(codes).issubset(actual.getBestCmap())
for table, fields in [('head', ['unitsPerEm']), ('hhea', ['ascent', 'descent', 'lineGap']), ('OS/2', ['sTypoAscender', 'sTypoDescender', 'sTypoLineGap'])]:
    for field in fields:
        assert getattr(original[table], field) == getattr(actual[table], field), field
before, after = original.getGlyphSet(), actual.getGlyphSet()
for code in codes:
    a, b = original.getBestCmap()[code], actual.getBestCmap()[code]
    assert original['hmtx'][a] == actual['hmtx'][b], code
    ap, bp = DecomposingRecordingPen(before), DecomposingRecordingPen(after)
    before[a].draw(ap)
    after[b].draw(bp)
    assert ap.value == bp.value, code
receipt = {'source': source.as_posix(), 'source_sha256': sha256(source.read_bytes()).hexdigest(), 'output': output.as_posix(), 'bytes': output.stat().st_size, 'sha256': sha256(output.read_bytes()).hexdigest(), 'weight': 400, 'text': intro, 'codepoints': codes, 'glyphs_and_metrics_identical': True, 'original_font_retained': True, 'license': 'SIL Open Font License 1.1: original notice retained and full licence embedded in name table 13', 'tools': {'fonttools': fontTools.__version__, 'brotli': brotli.__version__}}
Path('site/scripts/font-assets/ai-blocks-intro-sans.json').write_text(json.dumps(receipt, indent=2) + '\n', newline='\n')
print(json.dumps(receipt))
