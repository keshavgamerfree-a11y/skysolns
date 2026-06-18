/* global Buffer, process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Zero-dependency multipart parser for local developer file uploads
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';
      const boundaryMatch = contentType.match(/boundary=(.+)$/);
      if (!boundaryMatch) {
        return reject(new Error('No boundary found in Content-Type header'));
      }
      // The boundary in the content-type does not include the leading '--'
      const boundary = '--' + boundaryMatch[1];
      const boundaryBuf = Buffer.from(boundary);
      
      const parts = [];
      let index = buffer.indexOf(boundaryBuf);
      while (index !== -1) {
        const nextIndex = buffer.indexOf(boundaryBuf, index + boundaryBuf.length);
        if (nextIndex === -1) break;
        
        // Extract content between boundary markers, trimming the trailing \r\n
        const partBuffer = buffer.slice(index + boundaryBuf.length + 2, nextIndex - 2);
        parts.push(partBuffer);
        index = nextIndex;
      }
      
      const files = {};
      const fields = {};
      
      for (const part of parts) {
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1) continue;
        
        const headersStr = part.slice(0, headerEnd).toString();
        const body = part.slice(headerEnd + 4);
        
        const nameMatch = headersStr.match(/name="([^"]+)"/);
        const filenameMatch = headersStr.match(/filename="([^"]+)"/);
        const contentTypeMatch = headersStr.match(/Content-Type:\s*([^\r\n]+)/i);
        
        if (filenameMatch && nameMatch) {
          files[nameMatch[1]] = {
            filename: filenameMatch[1],
            data: body,
            contentType: contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream'
          };
        } else if (nameMatch) {
          fields[nameMatch[1]] = body.toString().trim();
        }
      }
      
      resolve({ fields, files });
    });
    req.on('error', err => reject(err));
  });
}

// Helper to parse JSON body
function parseJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cms-api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Verify authentication token for modifying endpoints
          const checkAuth = (headers) => {
            const authHeader = headers['authorization'] || '';
            return authHeader === 'Bearer fake-jwt-token-skylife-123';
          };

          const uploadDir = path.join(process.cwd(), 'public', 'uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          if (req.url === '/api/login' && req.method === 'POST') {
            try {
              const body = await parseJson(req);
              if (body.username === 'admin' && body.password === 'adminpassword123') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token: 'fake-jwt-token-skylife-123' }));
              } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid username or password' }));
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.url === '/api/content' && req.method === 'POST') {
            if (!checkAuth(req.headers)) {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Unauthorized' }));
              return;
            }
            try {
              const content = await parseJson(req);
              fs.writeFileSync(
                path.join(process.cwd(), 'public', 'content.json'),
                JSON.stringify(content, null, 2),
                'utf-8'
              );
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.url === '/api/upload' && req.method === 'POST') {
            if (!checkAuth(req.headers)) {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Unauthorized' }));
              return;
            }
            try {
              const { files } = await parseMultipart(req);
              const fileKey = Object.keys(files)[0];
              if (!fileKey) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No file uploaded' }));
                return;
              }

              const uploadedFile = files[fileKey];
              const fileExt = path.extname(uploadedFile.filename).toLowerCase();
              const baseName = path.basename(uploadedFile.filename, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
              const newFilename = `${baseName}_${Date.now()}${fileExt}`;
              const targetPath = path.join(uploadDir, newFilename);

              fs.writeFileSync(targetPath, uploadedFile.data);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                success: true, 
                url: `/uploads/${newFilename}`,
                filename: newFilename
              }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.url.startsWith('/api/media') && req.method === 'GET') {
            try {
              const files = fs.readdirSync(uploadDir);
              const mediaList = files.map(filename => {
                const filePath = path.join(uploadDir, filename);
                const stats = fs.statSync(filePath);
                return {
                  name: filename,
                  url: `/uploads/${filename}`,
                  size: stats.size,
                  createdAt: stats.mtime
                };
              });
              // Sort by newest first
              mediaList.sort((a, b) => b.createdAt - a.createdAt);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(mediaList));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.url.startsWith('/api/media') && req.method === 'DELETE') {
            if (!checkAuth(req.headers)) {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Unauthorized' }));
              return;
            }
            try {
              const urlParsed = new URL(req.url, `http://${req.headers.host}`);
              const filename = urlParsed.searchParams.get('name');
              if (!filename) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Filename is required' }));
                return;
              }

              const targetPath = path.join(uploadDir, filename);
              // Ensure path is inside uploadDir (security check)
              if (!targetPath.startsWith(uploadDir)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid path' }));
                return;
              }

              if (fs.existsSync(targetPath)) {
                fs.unlinkSync(targetPath);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'File not found' }));
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          // ─── PRODUCT IMPORT FROM URL ───────────────────────────────────────
          if (req.url === '/api/import-product' && req.method === 'POST') {
            if (!checkAuth(req.headers)) {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Unauthorized' }));
              return;
            }
            try {
              const body = await parseJson(req);
              const targetUrl = body.url;
              if (!targetUrl || !targetUrl.startsWith('http')) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'A valid URL is required' }));
                return;
              }

              // Fetch the page server-side (bypasses browser CORS)
              const pageRes = await fetch(targetUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                  'Accept-Language': 'en-US,en;q=0.9',
                  'Cache-Control': 'no-cache',
                },
                redirect: 'follow',
                signal: AbortSignal.timeout(15000),
              });

              if (!pageRes.ok) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Could not fetch URL: HTTP ${pageRes.status}` }));
                return;
              }

              const html = await pageRes.text();
              const origin = new URL(targetUrl).origin;

              // ── Helpers ──────────────────────────────────────────────────
              const getMeta = (property) => {
                const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'))
                         || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`, 'i'));
                return m ? m[1].trim() : '';
              };

              const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

              const decodeHtml = (s) => s
                .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
                .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)));

              // ── 1. JSON-LD Structured Data ────────────────────────────────
              let jsonLd = null;
              const jsonLdMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
              for (const m of jsonLdMatches) {
                try {
                  const parsed = JSON.parse(m[1]);
                  const item = Array.isArray(parsed) ? parsed[0] : parsed;
                  if (item['@type'] && (item['@type'].toLowerCase().includes('product') || item.name)) {
                    jsonLd = item;
                    break;
                  }
                } catch (_) { /* ignore parse errors */ }
              }

              // ── 2. OpenGraph / Twitter meta ───────────────────────────────
              const ogTitle       = getMeta('og:title') || getMeta('twitter:title');
              const ogDesc        = getMeta('og:description') || getMeta('twitter:description');
              const ogImage       = getMeta('og:image') || getMeta('twitter:image');
              const ogSiteName    = getMeta('og:site_name');

              // ── 3. Page <title> ───────────────────────────────────────────
              const titleTagMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
              const titleTag      = titleTagMatch ? decodeHtml(stripTags(titleTagMatch[1])) : '';

              // ── 4. H1 ─────────────────────────────────────────────────────
              const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
              const h1Text  = h1Match ? decodeHtml(stripTags(h1Match[1])) : '';

              // ── 5. Build title priority chain ─────────────────────────────
              let title = (jsonLd?.name || ogTitle || h1Text || titleTag || '').trim();
              // Strip site name suffix if present (e.g. "Product | Zaiput")
              if (ogSiteName && title.includes(ogSiteName)) {
                title = title.replace(new RegExp(`[\\s\\|\\-–—]+${ogSiteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i'), '').trim();
              }

              // ── 6. Collect all images ─────────────────────────────────────
              const images = new Set();
              if (ogImage) {
                const imgUrl = ogImage.startsWith('http') ? ogImage : origin + ogImage;
                images.add(imgUrl);
              }
              if (jsonLd?.image) {
                const ji = typeof jsonLd.image === 'string' ? [jsonLd.image]
                         : Array.isArray(jsonLd.image) ? jsonLd.image
                         : jsonLd.image.url ? [jsonLd.image.url] : [];
                ji.forEach(u => { if (u) images.add(u.startsWith('http') ? u : origin + u); });
              }
              // Heuristic: grab product/hero images from img src in article/main/section
              const imgTagMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*/gi)];
              for (const m of imgTagMatches) {
                const src = m[1];
                if (!src || src.startsWith('data:') || src.includes('logo') || src.includes('icon') || src.includes('avatar') || src.includes('flag')) continue;
                const ext = src.split('?')[0].toLowerCase();
                if (!ext.endsWith('.jpg') && !ext.endsWith('.jpeg') && !ext.endsWith('.png') && !ext.endsWith('.webp')) continue;
                const fullUrl = src.startsWith('http') ? src : src.startsWith('//') ? 'https:' + src : origin + src;
                images.add(fullUrl);
                if (images.size >= 10) break;
              }

              // ── 7. Collect videos ─────────────────────────────────────────
              const videos = [];
              // YouTube/Vimeo iframes
              const iframeSrcs = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
              for (const src of iframeSrcs) {
                if (src.includes('youtube') || src.includes('vimeo') || src.includes('wistia')) {
                  videos.push(src.startsWith('http') ? src : 'https:' + src);
                }
              }
              // Direct video tags
              const videoSrcMatches = [...html.matchAll(/<(?:video|source)[^>]+src=["']([^"']+\.(?:mp4|webm|ogg))["']/gi)];
              for (const m of videoSrcMatches) {
                const src = m[1].startsWith('http') ? m[1] : origin + m[1];
                videos.push(src);
              }

              // ── 8. Extract PDF / brochure links ──────────────────────────
              const pdfLinks = [];
              const pdfMatches = [...html.matchAll(/href=["']([^"']+\.pdf[^"']*)["']/gi)];
              for (const m of pdfMatches) {
                const href = m[1].startsWith('http') ? m[1] : origin + m[1];
                if (!pdfLinks.includes(href)) pdfLinks.push(href);
              }

              // ── 9. Heuristic content sections extraction ──────────────────
              // Strip scripts/styles for text parsing
              const bodyText = html
                .replace(/<script[\s\S]*?<\/script>/gi, '')
                .replace(/<style[\s\S]*?<\/style>/gi, '')
                .replace(/<nav[\s\S]*?<\/nav>/gi, '')
                .replace(/<footer[\s\S]*?<\/footer>/gi, '')
                .replace(/<header[\s\S]*?<\/header>/gi, '');

              // Extract list items that look like features / specs
              const allListItems = [...bodyText.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
                .map(m => decodeHtml(stripTags(m[1])).trim())
                .filter(t => t.length > 8 && t.length < 300 && !t.toLowerCase().startsWith('home') && !t.toLowerCase().includes('cookie'));

              // Group lists near headings
              const sectionPattern = /<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>([\s\S]*?)(?=<h[2-4]|$)/gi;
              const sections = {};
              for (const m of bodyText.matchAll(sectionPattern)) {
                const heading = decodeHtml(stripTags(m[1])).trim().toLowerCase();
                const content = decodeHtml(stripTags(m[2])).trim();
                if (content.length > 10) sections[heading] = content;
              }

              // Description: JSON-LD > OG desc > "description" section > long p
              let description = '';
              if (jsonLd?.description) {
                description = decodeHtml(jsonLd.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim();
              } else if (ogDesc) {
                description = decodeHtml(ogDesc);
              }
              // Supplement description with matching sections
              const descKeys = ['overview', 'description', 'about', 'summary', 'introduction'];
              for (const k of descKeys) {
                const match = Object.keys(sections).find(s => s.includes(k));
                if (match && sections[match].length > 50) {
                  if (!description) description = sections[match];
                  break;
                }
              }

              // Features
              let features = '';
              const featKeys = ['feature', 'benefit', 'advantage', 'highlight', 'key feature'];
              for (const k of featKeys) {
                const match = Object.keys(sections).find(s => s.includes(k));
                if (match) { features = sections[match]; break; }
              }
              // Fallback: first cluster of bullet points
              if (!features && allListItems.length > 0) {
                features = allListItems.slice(0, 8).map(i => `• ${i}`).join('\n');
              }

              // Applications
              let applications = '';
              const appKeys = ['application', 'use case', 'industry', 'market'];
              for (const k of appKeys) {
                const match = Object.keys(sections).find(s => s.includes(k));
                if (match) { applications = sections[match]; break; }
              }

              // Specifications
              let specifications = '';
              const specKeys = ['specification', 'technical', 'spec', 'dimension', 'parameter', 'performance'];
              for (const k of specKeys) {
                const match = Object.keys(sections).find(s => s.includes(k));
                if (match) { specifications = sections[match]; break; }
              }

              // FAQ
              let faq = '';
              const faqKeys = ['faq', 'frequently asked', 'question'];
              for (const k of faqKeys) {
                const match = Object.keys(sections).find(s => s.includes(k));
                if (match) { faq = sections[match]; break; }
              }

              // ── 10. Assemble result ───────────────────────────────────────
              const result = {
                title:          title,
                description:    description,
                features:       features,
                applications:   applications,
                specifications: specifications,
                faq:            faq,
                images:         [...images],
                videos:         videos.slice(0, 5),
                pdfLinks:       pdfLinks.slice(0, 3),
                sourceUrl:      targetUrl,
              };

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: `Import failed: ${err.message}` }));
            }
            return;
          }
          // ───────────────────────────────────────────────────────────────────

          next();
        });
      }
    }
  ],
})

