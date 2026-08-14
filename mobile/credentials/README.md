# Android upload credentials (Play Store)

**Do not commit** `*.jks`, `*.keystore`, or `keystore.properties`.

| File | Purpose |
|------|---------|
| `upload-keystore.jks` | Play upload keystore |
| `keystore.properties` | Passwords + alias (local only) |

Back up both files somewhere safe (password manager / encrypted drive). Losing them means you cannot update the same Play listing without Play App Signing recovery.

After `expo prebuild`, release builds pick these up via `plugins/withAndroidUploadSigning.js`.

Print fingerprints:

```bash
keytool -list -v \
  -keystore credentials/upload-keystore.jks \
  -alias upload
```
