const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidKeyboard(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const mainActivity = manifest.manifest.application[0].activity.find(
      (a) => a.$['android:name'] === '.MainActivity'
    );
    if (mainActivity) {
      mainActivity.$['android:windowSoftInputMode'] = 'adjustResize';
    }
    return config;
  });
};
