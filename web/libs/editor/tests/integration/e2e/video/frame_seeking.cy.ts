import { Cynaps, VideoView } from "@cynaps/frontend-test/helpers/CF/index";
import { simpleVideoConfig } from "../../data/video_segmentation/regions";
import { FF_VIDEO_FRAME_SEEK_PRECISION } from "libs/editor/src/utils/feature-flags";

const simpleVideoData = { video: "/public/files/fps_24_frames_24_video.webm" };

describe("Video Frame Seeking", () => {
  beforeEach(() => {
    Cynaps.addFeatureFlagsOnPageLoad({
      [FF_VIDEO_FRAME_SEEK_PRECISION]: true,
    });
  });

  it("Should be able to seek to a specific frame and see the correct frame without duplicating or skipping frames", () => {
    Cynaps.params().config(simpleVideoConfig).data(simpleVideoData).withResult([]).init();

    Cynaps.waitForObjectsReady();

    VideoView.captureVideoCanvas("video_canvas");

    VideoView.clickAtFrame(2);

    VideoView.videoCanvasShouldChange("video_canvas", 0);

    VideoView.captureVideoCanvas("video_canvas");

    VideoView.clickAtFrame(3);

    VideoView.videoCanvasShouldChange("video_canvas", 0);

    VideoView.captureVideoCanvas("video_canvas");

    VideoView.clickAtFrame(4);

    VideoView.videoCanvasShouldChange("video_canvas", 0);
  });
});

