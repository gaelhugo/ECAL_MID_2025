export default class AudioLib {
  constructor() {
    this.audioContext = new AudioContext();
    this.buffers = {};
    this.currentVariations = {}; // Track current variation index for each sound
    this.loadSounds();
  }

  async loadSounds() {
    const sounds = {
      // Work It
      workIt1: "audio/WorkIt1.mp3",
      workIt2: "audio/WorkIt2.mp3",

      // Make It
      makeIt1: "audio/MakeIt1.mp3",
      makeIt2: "audio/MakeIt2.mp3",

      // Do It
      doIt1: "audio/DoIt1.mp3",
      doIt2: "audio/DoIt2.mp3",

      // Makes Us
      makesUs1: "audio/MakesUs1.mp3",
      makesUs2: "audio/MakesUs2.mp3",

      // Harder
      harder1: "audio/Harder1.mp3",
      harder2: "audio/Harder2.mp3",

      // Better
      better1: "audio/Better1.mp3",
      better2: "audio/Better2.mp3",

      // Faster
      faster1: "audio/Faster1.mp3",
      faster2: "audio/Faster2.mp3",

      // Stronger
      stronger1: "audio/Stronger1.mp3",
      stronger2: "audio/Stronger2.mp3",

      // More Than
      moreThan1: "audio/MoreThan1.mp3",
      moreThan2: "audio/MoreThan2.mp3",
      moreThan3: "audio/MoreThan3.mp3",

      // Hour
      hour1: "audio/Hour1.mp3",
      hour2: "audio/Hour2.mp3",
      hour3: "audio/Hour3.mp3",

      // Our
      our1: "audio/Our1_1.mp3",
      our2: "audio/Our2_1.mp3",
      our3: "audio/Our3_1.mp3",

      // Never
      never1: "audio/Never1.mp3",
      never2: "audio/Never2.mp3",
      never3: "audio/Never3.mp3",

      // Ever
      ever1: "audio/Ever1.mp3",
      ever2: "audio/Ever2.mp3",
      ever3: "audio/Ever3.mp3",

      // After
      after1: "audio/After1.mp3",
      after2: "audio/After2.mp3",
      after3: "audio/After3.mp3",

      // Work Is
      workIs1: "audio/WorkIs1.mp3",
      workIs2: "audio/WorkIs2.mp3",
      workIs3: "audio/WorkIs3.mp3",

      // Over
      over1: "audio/Over1.mp3",
      over2: "audio/Over2.mp3",
      over3: "audio/Over3.mp3",
    };

    for (const [name, url] of Object.entries(sounds)) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.buffers[name] = await this.audioContext.decodeAudioData(
          arrayBuffer
        );
      } catch (error) {
        console.error(`Failed to load sound ${name}:`, error);
      }
    }
  }

  playSound(name) {
    if (!this.buffers[name]) {
      console.warn(`Sound "${name}" not loaded`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers[name];
    source.connect(this.audioContext.destination);
    source.start();
  }

  // Modified to play variations in sequence instead of randomly
  playSoundVariation(baseName) {
    const variations = Object.keys(this.buffers).filter((name) =>
      name.startsWith(baseName)
    );

    if (variations.length > 0) {
      // Initialize counter if it doesn't exist
      if (!(baseName in this.currentVariations)) {
        this.currentVariations[baseName] = 0;
      }

      // Get next variation in sequence
      const variation = variations[this.currentVariations[baseName]];

      // Update counter for next time, loop back to 0 if at end
      this.currentVariations[baseName] =
        (this.currentVariations[baseName] + 1) % variations.length;

      this.playSound(variation);
    }
  }
}
