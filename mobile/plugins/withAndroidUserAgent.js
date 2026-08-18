const { withMainApplication } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

const USER_AGENT = 'VeryStays/1.0 (https://www.verystays.com)';

function applyMerge(src, options) {
  const result = mergeContents({ src, comment: '//', ...options });
  if (!result.didMerge && !src.includes(`@generated begin ${options.tag}`)) {
    throw new Error(`withAndroidUserAgent: failed to merge ${options.tag}`);
  }
  return result.contents;
}

/**
 * Wikimedia Commons (and some CDNs) reject Android's default okhttp User-Agent.
 * Set a descriptive UA on the shared OkHttp client used by Image + fetch.
 */
function withAndroidUserAgent(config) {
  return withMainApplication(config, (cfg) => {
    const language = cfg.modResults.language;
    let contents = cfg.modResults.contents;

    if (language === 'kt') {
      contents = applyMerge(contents, {
        tag: 'verystays-okhttp-ua-import',
        anchor: /import com\.facebook\.react\.ReactApplication/,
        offset: 1,
        newSrc:
          'import com.facebook.react.modules.network.OkHttpClientFactory\n' +
          'import com.facebook.react.modules.network.OkHttpClientProvider',
      });
      contents = applyMerge(contents, {
        tag: 'verystays-okhttp-ua-init',
        anchor: /super\.onCreate\(\)/,
        offset: 1,
        newSrc: `    OkHttpClientProvider.setOkHttpClientFactory(object : OkHttpClientFactory {
      override fun createNewNetworkModuleClient(): okhttp3.OkHttpClient {
        return OkHttpClientProvider.createClientBuilder()
          .addInterceptor { chain ->
            chain.proceed(
              chain.request().newBuilder()
                .removeHeader("User-Agent")
                .addHeader("User-Agent", "${USER_AGENT}")
                .build()
            )
          }
          .build()
      }
    })`,
      });
    } else {
      contents = applyMerge(contents, {
        tag: 'verystays-okhttp-ua-import',
        anchor: /import com\.facebook\.react\.ReactApplication;/,
        offset: 1,
        newSrc:
          'import com.facebook.react.modules.network.OkHttpClientFactory;\n' +
          'import com.facebook.react.modules.network.OkHttpClientProvider;\n' +
          'import okhttp3.OkHttpClient;',
      });
      contents = applyMerge(contents, {
        tag: 'verystays-okhttp-ua-init',
        anchor: /super\.onCreate\(\);/,
        offset: 1,
        newSrc: `    OkHttpClientProvider.setOkHttpClientFactory(() -> OkHttpClientProvider.createClientBuilder()
        .addInterceptor(chain -> chain.proceed(
            chain.request().newBuilder()
                .removeHeader("User-Agent")
                .addHeader("User-Agent", "${USER_AGENT}")
                .build()
        ))
        .build());`,
      });
    }

    cfg.modResults.contents = contents;
    return cfg;
  });
}

module.exports = withAndroidUserAgent;
