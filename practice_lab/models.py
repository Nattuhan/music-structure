from typing import Literal

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    url: str
    force: bool = False
    startSec: float | None = Field(default=None, ge=0)
    endSec: float | None = Field(default=None, ge=0)


class DesktopCloudConfigRequest(BaseModel):
    enabled: bool = False
    bucket: str = ""
    accountId: str = ""
    endpointUrl: str = ""
    publicBaseUrl: str = ""
    prefix: str = "sessions"
    accessKeyId: str = ""
    secretAccessKey: str = ""


class ApplyBpmCorrectionRequest(BaseModel):
    factor: float


class RenameSessionRequest(BaseModel):
    title: str


class LibraryMetadataRequest(BaseModel):
    tags: list[str] | None = Field(default=None, max_length=20)
    opened: bool = False


class SectionEditEntry(BaseModel):
    label: str = Field(min_length=1, max_length=80)
    startBar: int = Field(ge=1)
    endBar: int = Field(ge=1)


class SaveSectionsRequest(BaseModel):
    sections: list[SectionEditEntry] = Field(min_length=1, max_length=200)


class StorageCleanupRequest(BaseModel):
    categories: list[Literal["work", "logs", "model-cache"]] = Field(min_length=1, max_length=3)


class DeleteSessionsRequest(BaseModel):
    ids: list[str] = Field(min_length=1, max_length=500)


class StemExportRequest(BaseModel):
    stemVolumes: dict[str, float]
    startSec: float | None = Field(default=None, ge=0)
    endSec: float | None = Field(default=None, ge=0)
    clickTimes: list[float] = Field(default_factory=list)
    clickVolume: float = Field(default=0, ge=0, le=100)
    clickSound: Literal["classic", "wood", "hihat"] = "classic"
    outputFilename: str = "stem-mix.mp3"


class SidebarFolder(BaseModel):
    id: str
    name: str
    collapsed: bool = False
    sessionIds: list[str] = Field(default_factory=list)


class ScoreRegion(BaseModel):
    x: int
    y: int
    width: int
    height: int


class ScoreExtractRequest(BaseModel):
    url: str | None = None
    title: str | None = Field(default=None, max_length=200)
    regionPreset: str = "bottom"
    regionPercent: float = 30
    startSec: float | None = Field(default=None, ge=0)
    endSec: float | None = Field(default=None, ge=0)
    trimStartFrames: int = 0
    trimEndFrames: int = 0
    layout: str = "a3_2up"
    processingMode: str = "auto"
    scoreContent: str = "tab"
    verticalScrollMode: str = "auto"
    horizontalScrollMode: str = "auto"
    measuresPerRow: int = Field(default=4, ge=1, le=8)
    showMeasureNumbers: bool = False
    showMusicalAnalysis: bool = True
    showChordSymbols: bool | None = None
    showKeyEstimate: bool | None = None
    showBpm: bool | None = None
    region: ScoreRegion | None = None


class ScoreVideoInfo(BaseModel):
    width: int
    height: int
    durationSec: float


class ScorePreviewRequest(BaseModel):
    url: str
    regionPreset: str = "bottom"
    regionPercent: float = 30
    startSec: float | None = Field(default=None, ge=0)
    endSec: float | None = Field(default=None, ge=0)


class ScorePreviewResponse(BaseModel):
    videoId: str
    video: ScoreVideoInfo
    region: ScoreRegion
    previewFrameUrl: str


class ScoreExtractResponse(BaseModel):
    videoId: str
    title: str | None = None
    keptFrames: int
    skippedFrames: int
    region: ScoreRegion
    outputs: list[str]
    zipUrl: str | None = None


class SessionAssets(BaseModel):
    result: str
    audio: str
    video: str | None = None
    stems: dict[str, str] | None = None


class SectionEntry(BaseModel):
    label: str
    start_bar: int
    end_bar: int
    bar_count: int
    start_time: float
    end_time: float
    start_time_str: str


class AnalyzeResponse(BaseModel):
    id: str
    title: str
    sourceType: str | None = None
    originalFilename: str | None = None
    sourceVideoId: str | None = None
    analysisStartSec: float | None = None
    analysisEndSec: float | None = None
    assets: SessionAssets | None = None
    bpm: float
    total_bars: int
    duration: float
    sections: list[SectionEntry]
    beats: list[float] = []
    downbeats: list[float] = []
    tags: list[str] = []
    lastOpenedAt: str | None = None
    automaticSections: list[SectionEntry] | None = None
    sectionsEditedAt: str | None = None
    cached: bool = False


class JobStatusResponse(BaseModel):
    id: str
    stage: str
    message: str
    done: bool = False
    error: str | None = None
    canceled: bool = False
    cancel_requested: bool = False
    started_at: float | None = None
    updated_at: float | None = None
    finished_at: float | None = None
    duration_seconds: float | None = None
    result: dict | None = None
    description: str | None = None
    kind: str | None = None
    display_title: str | None = None
    interrupted: bool = False
    resumable: bool = False
    source_job_id: str | None = None
    archived: bool = False


class JobSubmissionResponse(BaseModel):
    jobId: str
    stage: str
    message: str
