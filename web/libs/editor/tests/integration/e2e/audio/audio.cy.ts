import { AudioView, Cynaps } from "@cynaps/frontend-test/helpers/CF";

describe("Audio", () => {
  it("Renders audio with merged channels by default", () => {
    Cynaps.params()
      .config(
        `
      <View>
        <Audio name="audio" value="$audio" />
      </View>
      `,
      )
      .data({
        audio: "/public/files/barradeen-emotional.mp3",
      })
      .withResult([])
      .init();

    Cynaps.waitForObjectsReady();

    AudioView.isReady();
    AudioView.toMatchImageSnapshot(AudioView.drawingArea, { threshold: 0.4 });
  });

  it("Renders separate audio channels with splitchannels=true", () => {
    Cynaps.params()
      .config(
        `
      <View>
        <Audio name="audio" value="$audio" splitchannels="true" />
      </View>
      `,
      )
      .data({
        audio: "/public/files/barradeen-emotional.mp3",
      })
      .withResult([])
      .init();

    Cynaps.waitForObjectsReady();

    AudioView.isReady();
    AudioView.toMatchImageSnapshot(AudioView.drawingArea, { threshold: 0.4 });
  });
});

