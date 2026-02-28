import { AudioView, Cynaps, Sidebar } from "@cynaps/frontend-test/helpers/CF";
import * as audioFixtures from "../../data/audio/audio_paragraphs";
import { FF_LSDV_E_278 } from "../../../../src/utils/feature-flags";

describe("Audio: Paragraphs Sync", () => {
  beforeEach(() => {
    Cynaps.addFeatureFlagsOnPageLoad({
      [FF_LSDV_E_278]: true,
    });
  });

  it("Correctly loads with Paragraph segments as Audio segments", () => {
    Cynaps.params().config(audioFixtures.config).data(audioFixtures.data).withResult(audioFixtures.result).init();

    Cynaps.waitForObjectsReady();

    Sidebar.hasRegions(4);

    AudioView.isReady();
    AudioView.toMatchImageSnapshot(AudioView.drawingArea, { threshold: 0.4 });
  });

  it("Highlights the correct Audio segment whenever it is played or seeked", () => {
    Cynaps.params().config(audioFixtures.config).data(audioFixtures.data).withResult(audioFixtures.result).init();

    Cynaps.waitForObjectsReady();

    Sidebar.hasRegions(4);

    AudioView.isReady();

    AudioView.seekCurrentTimebox(14);
    AudioView.toMatchImageSnapshot(AudioView.drawingArea, { name: "HighlightOnFirstSeek", threshold: 0.4 });
    AudioView.play(undefined, 6);
    AudioView.toMatchImageSnapshot(AudioView.drawingArea, { name: "HighlightAfterFinishedPlayback", threshold: 0.4 });
  });
});

