"""LMS 정적 셸 캐시 계약.

web/ 는 번들러 없이 그대로 서빙되므로 파일명에 콘텐츠 해시가 없다. 그 상태에서
브라우저가 ES module 을 파일별로 다른 시점에 캐시하면, 새로 받은 events.js 가
낡은 player.js 를 import 하는 조합이 생긴다. 그때 브라우저는

    SyntaxError: The requested module './player.js'
                 does not provide an export named 'openAssignedLesson'

로 모듈 그래프 링크를 실패시키고, lms.js 본문(boot())이 아예 실행되지 않아
#classroom 이 초기 로딩 표시에서 멈춘다(무한 로딩).

여기서 고정하는 두 가지 불변식이 그 조합을 원천 차단한다.
"""
import re
from pathlib import Path

import pytest

try:
    from fastapi.testclient import TestClient
    import server
except Exception as exc:  # pragma: no cover - dependency-less test environments
    pytest.skip(f"server import 불가(의존성 미설치): {exc}", allow_module_level=True)

_WEB = Path(__file__).resolve().parents[1] / "web"
_LMS_JS_DIR = _WEB / "lms" / "js"

_IMPORT = re.compile(
    r"""import\s+(?:(?P<names>\{[^}]*\})\s*from\s*)?["'](?P<spec>\.{1,2}/[^"']+)["']"""
)
_EXPORT_DECL = re.compile(
    r"^export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z0-9_$]+)",
    re.MULTILINE,
)
_EXPORT_LIST = re.compile(r"^export\s*\{([^}]*)\}", re.MULTILINE)


def _module_files():
    return [_WEB / "lms.js"] + sorted(_LMS_JS_DIR.glob("*.js"))


def _exported_names(path: Path) -> set[str]:
    src = path.read_text(encoding="utf-8")
    names = set(_EXPORT_DECL.findall(src))
    for group in _EXPORT_LIST.findall(src):
        for part in group.split(","):
            token = part.strip().split(" as ")[-1].strip()
            if token:
                names.add(token)
    return names


@pytest.fixture
def client():
    return TestClient(server.app)


def test_lms_modules_import_without_per_file_cache_busting():
    """모듈 간 import 는 쿼리 없는 상대 경로여야 한다.

    일부 파일에만 ?v= 를 붙이면 버전 갱신이 파일 단위로 어긋난다. 캐시 무효화는
    lms.html 의 진입점 한 곳(lms.js/lms.css)에서만 한다.
    """
    offenders = []
    for path in _module_files():
        for match in _IMPORT.finditer(path.read_text(encoding="utf-8")):
            spec = match.group("spec")
            if "?" in spec:
                offenders.append(f"{path.name} -> {spec}")
    assert offenders == [], (
        "모듈 import 에 쿼리 문자열이 있으면 모듈 그래프가 버전별로 쪼개진다: "
        + ", ".join(offenders)
    )


def test_lms_module_graph_links():
    """named import 가 전부 실제 export 로 이어져야 한다."""
    problems = []
    for path in _module_files():
        for match in _IMPORT.finditer(path.read_text(encoding="utf-8")):
            target = (path.parent / match.group("spec").split("?")[0]).resolve()
            if not target.is_file():
                problems.append(f"{path.name}: 대상 없음 {match.group('spec')}")
                continue
            if not match.group("names"):
                continue
            available = _exported_names(target)
            for raw in match.group("names").strip("{}").split(","):
                name = raw.strip().split(" as ")[0].strip()
                if name and name not in available:
                    problems.append(f"{path.name}: {target.name} 에 {name} export 없음")
    assert problems == [], "; ".join(problems)


def test_lms_shell_pins_entry_point_asset_versions():
    """진입점 자산은 캐시 무효화 쿼리를 갖고, 둘의 버전은 같아야 한다."""
    html = (_WEB / "lms.html").read_text(encoding="utf-8")
    css = re.search(r'href="/static/lms\.css\?v=([^"]+)"', html)
    js = re.search(r'src="/static/lms\.js\?v=([^"]+)"', html)
    assert css and js, "lms.html 진입점 자산에 ?v= 캐시 무효화가 없다"
    assert css.group(1) == js.group(1), (
        f"진입점 자산 버전 불일치: css={css.group(1)} js={js.group(1)}"
    )


@pytest.mark.parametrize(
    "path",
    ["/static/lms.js", "/static/lms/js/player.js", "/static/lms/js/events.js", "/static/lms.css"],
)
def test_static_assets_must_revalidate(client, path):
    """해시 없는 자산은 heuristic freshness 로 굳지 않도록 항상 재검증한다."""
    response = client.get(path)
    assert response.status_code == 200
    assert response.headers.get("cache-control") == "no-cache"
    assert response.headers.get("etag"), "재검증하려면 ETag 가 필요하다"


def test_static_revalidation_returns_304(client):
    """no-cache 는 캐시 금지가 아니다. 변경이 없으면 304 로 싸게 끝나야 한다."""
    first = client.get("/static/lms/js/player.js")
    etag = first.headers["etag"]
    second = client.get("/static/lms/js/player.js", headers={"If-None-Match": etag})
    assert second.status_code == 304


def test_lms_shell_is_not_cached(client):
    """셸 HTML 이 캐시되면 낡은 ?v= 를 계속 물고 온다."""
    response = client.get("/lms")
    assert response.status_code == 200
    assert response.headers.get("cache-control") == "no-cache"
