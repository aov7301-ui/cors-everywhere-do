# cors-everywhere-do

Deploy [cors-anywhere](https://github.com/Rob--W/cors-anywhere) ke **DigitalOcean App Platform** — relay untuk **Amazon Prime CDN** (`aiv-cdn.net`).

## Format URL

```
https://APP-ANDA.ondigitalocean.app/https://domain.com/path/file.mpd
https://APP-ANDA.ondigitalocean.app/https://domain.com/path/file.m3u8
```

Health check:

```
https://APP-ANDA.ondigitalocean.app/health
```

## Deploy cepat (App Platform + GitHub)

### 1. Push repo ini ke GitHub

```bash
cd cors-anywhere-do
git init
git add .
git commit -m "Initial cors-anywhere DO deploy"
git remote add origin https://github.com/USERNAME/cors-everywhere-do.git
git push -u origin main
```

### 2. DigitalOcean

1. Daftar [DigitalOcean](https://www.digitalocean.com/) (sering ada kredit promo $200/60 hari)
2. **Apps** → **Create App** → **GitHub** → pilih repo `cors-everywhere-do`
3. DO mendeteksi `Dockerfile` otomatis
4. **Region**: Singapore (`sgp`) — dekat Asia
5. Plan: **Basic** ~$5/bulan (`basic-xxs`)
6. **Create Resources** → tunggu deploy
7. Catat URL: `https://cors-everywhere-xxxxx.ondigitalocean.app`

### 3. Tes

```bash
curl -s "https://APP-ANDA.ondigitalocean.app/health"
curl -s "https://APP-ANDA.ondigitalocean.app/https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" | head -3
```

Harus muncul `#EXTM3U`.

### 4. Hubungkan ke VPS tvkita.my.id

Di aaPanel Node Project → Environment:

```
UPSTREAM_RELAY=https://APP-ANDA.ondigitalocean.app
```

Atau di `server.js` parent project (default sudah ke instance lama).

Restart Node di VPS.

Tes Amazon (ganti URL MPD yang masih valid):

```
https://tvkita.my.id/cors/play.mpd?url=https%3A%2F%2Fotte.live.fly.ww.aiv-cdn.net%2F...%2Fcenc.mpd
```

Response header harus ada: `x-upstream-relay: https://APP-ANDA.ondigitalocean.app`

---

## Deploy dengan doctl (tanpa UI)

```bash
# Install doctl, login: doctl auth init
# Edit .do/app.yaml — ganti YOUR_GITHUB_USER/cors-everywhere-do

doctl apps create --spec .do/app.yaml
```

---

## Deploy manual Docker (Droplet)

```bash
docker build -t cors-everywhere .
docker run -d -p 8080:8080 --name cors cors-everywhere
```

Pasang Nginx + SSL di depan port 8080 jika pakai domain sendiri.

---

## Biaya (perkiraan)

| Opsi | Harga |
|------|-------|
| App Platform Basic (`basic-xxs`) | ~**$5 USD/bulan** |
| Droplet 512 MB | ~**$4 USD/bulan** |
| Bandwidth | 1 TB included (Droplet) |

---

## Pakai di player / app

**Langsung (format cors-anywhere):**

```javascript
const proxy = "https://APP-ANDA.ondigitalocean.app/";
const url = proxy + "https://otte.live.fly.ww.aiv-cdn.net/.../cenc.mpd";
```

## Catatan

- URL MPD Amazon **expired** cepat — ambil fresh dari Prime Video
- Amazon pakai **Widevine DRM** — butuh license di player
- Instance ini **khusus relay** — tidak rewrite manifest seperti `server.js` di VPS
