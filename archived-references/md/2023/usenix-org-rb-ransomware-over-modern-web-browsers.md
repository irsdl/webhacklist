---
type: Article
title: "RøB: Ransomware over Modern Web Browsers"
resource: "https://www.usenix.org/conference/usenixsecurity23/presentation/oz"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:22:54+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity23/presentation/oz"
    title: "RøB: Ransomware over Modern Web Browsers"
    author: Harun Oz, Ahmet Aris, Abbas Acar, Güliz Seray Tuncay, Leonardo Babun, Selcuk Uluagac
also_at:
  - "https://www.usenix.org/system/files/usenixsecurity23-oz.pdf"
  - "https://www.usenix.org/system/files/sec23_slides_oz.pdf"
authors:
  - Harun Oz
  - Ahmet Aris
  - Abbas Acar
  - Güliz Seray Tuncay
  - Leonardo Babun
  - Selcuk Uluagac
canonical_url: ""
cited_by:
  - "2023.md:86"
commit: ""
content_sha256: e7c2fa1647e105e3bc773349a18fc0d462804cb1b3bc9eda59ea93e135faba5b
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity23/presentation/oz"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: b29dfc785ba06ad5293e72c36a8c9ab5ab9aac73aa40d73ab9f82a38a92b7447
retrieved_from: "https://www.usenix.org/system/files/usenixsecurity23-oz.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:22:54+00:00"
slug: usenix-org-rb-ransomware-over-modern-web-browsers
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# RøB: Ransomware over Modern Web Browsers

**RøB: Ransomware over Modern Web Browsers** - Harun Oz, Ahmet Aris, Abbas Acar, Güliz Seray Tuncay, Leonardo Babun, Selcuk Uluagac, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity23/presentation/oz>
- Also published at: <https://www.usenix.org/system/files/usenixsecurity23-oz.pdf>
- Also published at: <https://www.usenix.org/system/files/sec23_slides_oz.pdf>
- Preserved from: https://www.usenix.org/system/files/usenixsecurity23-oz.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# RøB: Ransomware over Modern Web Browsers

--- page 1 ---

RøB: Ransomware over Modern Web BrowsersHarun Oz, Ahmet Aris, and Abbas Acar, Cyber-Physical Systems Security Lab, 
Florida International University; Güliz Seray Tuncay, Google; Leonardo Babun and
 
Selcuk Uluagac, Cyber-Physical Systems Security Lab, Florida International Universityhttps://www.usenix.org/conference/usenixsecurity23/presentation/oz

--- page 2 ---

This paper is included in the Proceedings of the 
32nd USENIX Security Symposium.August 9–11, 2023 • Anaheim, CA, USA978-1-939133-37-3Open access to the Proceedings of the 
32nd USENIX Security Symposium 
is sponsored by USENIX.

--- page 3 ---

RøB: Ransomware over Modern Web Browsers
Harun Oz
1
, Ahmet Aris
1
, Abbas Acar
1
, Güliz Seray Tuncay
2
, Leonardo Babun
1
, and Selcuk Uluagac
1
1
Cyber-Physical Systems Security Lab, Florida International University, Miami, Florida, USA
2
Google, Mountain View, CA, USA
{
hoz001, aaris, aacar001, lbabu002, suluagac}@u.edu, gulizseray@google.com
AbstractFile System Access (FSA) API enables web applications tointeract with les on the users' local devices. Even though itcan be used to develop rich web applications, it greatly ex-tends the attack surface, which can be abused by adversariesto cause signicant harm. In this paper, for the rst time in theliterature, we extensively study this new attack vector that canbe used to develop a powerful new ransomware strain overa browser. Using the FSA API and WebAssembly technol-ogy, we demonstrate this novel browser-based ransomwarecalledRØBas a malicious web application that encrypts theuser's les from the browser. We useRØBto perform impactanalysis with different OSs, local directories, and antivirus so-lutions as well as to develop mitigation techniques against it.Our evaluations show thatRØBcan encrypt the victim's localles including cloud-integrated directories, external storagedevices, and network-shared folders regardless of the accesslimitations imposed by the API. Moreover, we evaluate andshow how the existing defense solutions fall short againstR
Ø
B in terms of their feasibility. We propose three potentialdefense solutions to mitigate this new attack vector. Thesesolutions operate at different levels (i.e., browser-level, le-system-level, and user-level) and are orthogonal to each other.Our work strives to raise awareness of the dangers ofRØB-like browser-based ransomware strains and shows that theemerging API documentation (i.e., the popular FSA) can beequivocal in terms of reecting the extent of the threat.
1 IntroductionThe developers of web browsers spend signicant effort onenhancing browsers by continuously adding new technologies.Web application developers take advantage of these technolo-gies by offering new functionalities that previously could beperformed only by native applications. One such technologyis the File System Access (FSA) API1, which has been devel-1Please see for a live demo of the FSA API:https://googlechromela
bs.github.io/text-editor/
.oped by the Web Platform Incubator Community Group [59].It enables web applications to interact with the users' localle systems [60]. Although not a web standard at the mo-ment, the FSA API is embedded in and is fully supportedby the most popular browsers like Chrome and Edge and ispartially supported by Opera and Safari [4], which, combined,share the 91.29% of the desktop browser market as of May2023 [7]. The FSA API has been steadily gaining popularityand is already being used by some popular web applicationssuch as the online development platform Microsoft VisualStudio Code (i.e., vscode.dev [11]) and social media platformSnapchat [9].Even though the FSA API can be used to develop pow-erful web applications, it can also be abused by adversariesto develop a novel ransomware strain as a web applicationthat encrypts the user's les from the browser. Such an attackwould effortlessly be performed by an adversary who designsa seemingly benign web application and uses malicious tactics(i.e., phishing, malvertisement) to trick the user to grant accessto their sensitive portions of the local le system. Despite thebriey mentioned risks of ransomware in the FSA API doc-umentation [61], the deployed countermeasure in its currentform (i.e., hard-coded blocking system-sensitive directories)is not effective to protect sensitive user les on non-systemdirectories, subdirectories of the systems-sensitive directories,or any other directories such as cloud-integrated directories,external directories or network-shared folders. More impor-tantly, no prior works investigated the detailed impact analysisof this new threat vector.In this work, we implemented a novel browser-based ran-somware, namelyRØB- Ransomware over Browser, thatperforms its malicious actions via the emerging web tech-nologies, the FSA API and WebAssembly (Wasm). Althoughthe security model of the FSA API suggests restricting ac-cess to some of the system directories (e.g., le system root,user's home, operating system), our experiments reveal thatRØBcan still encrypt les in user directories, data partitions,external storage devices (e.g., ash drives), shared networkvolumes, and cloud-integrated directories, making the sug-

--- page 4 ---

USENIX Association
32nd USENIX Security Symposium 7073

--- page 5 ---

gested defense mechanism by the FSA API developers futile.Antivirus (AV) software often detects ransomware by mon-itoring sensitive folders and identifying suspicious behaviorson the victim's computer. We performed an extensive analy-sis with commercial antivirus (AV) solutions such as AVG,Kaspersky, Avast, Malware Bytes, and TrendMicro. We foundRØBcan evade all these AVs. In addition to AVs, many highlyaccurate ransomware defense studies exist in the literaturesuch as detection systems that employ static analysis or dy-namic analysis features [52]. We examine their effectivenessagainstRØB-like ransomware; however, they, unfortunately,fail to detectRØBdue to the distinct features such as notrequiring any installation, running within the browser, andusing Wasm-based encryption libraries. Hence, there is a needfor a new solution that can effectively tackle browser-basedransomware attacks.We propose three potential defense solutions at differentlevels (i.e., browser-level, le-system-level, and user-level).Our rst solution, namelymalicious modication identica-tion, monitors the FSA API to detect malicious modicationsofRØB-like attacks before they overwrite the victim's localles. Our second approach, namelylocal activity monitoring,monitors the browser's local activity (e.g., read and write func-tion/API calls, le system activities) to detect the potentialpatterns of ransomware. Our third solution aims to increasethe (in)security awareness of users via anew UI designforthe FSA's permission dialog boxes. Unlike the existing dialogboxes of FSA API, the new dialog boxes we present informusers about the risks and implications of allowing web appli-cations that utilize FSA API to interact with local les. Thesethree proposed approaches are crucial to providing solutionsto mitigate this new attack vector at different levels; however,neither of them is a panacea on its own due to the distinctfeatures of this new attack vector. More research effort isneeded to enable web applications to interact with local lesin a secure manner.
Contributions:The contributions of this work are as follows:•For the rst time, we thoroughly analyzed a novel attackvector for ransomware that has not been explored before.Particularly, we show how the FSA API can be exploitedto launch ransomware attacks over modern browsers.
•We conducted a comprehensive impact analysis on threedifferent OSs, 29 distinct directories together with theirsubdirectories, ve cloud providers, and ve antivirussolutions. Our results demonstrate the limitations of tra-ditional antivirus solutions and the ineffectiveness of theaccess limitation currently deployed in the FSA API.
•We evaluated the effectiveness of state-of-the-art existingransomware detection solutions and found that they, un-fortunately, fall short in detectingRØB-like ransomwaredue to its distinct features (e.g., no payload, no cryptolibrary access).
•We proposed three potential defense solutions to miti-gate the risks posed by browser-based ransomware: 1)Malicious Modication Identication, 2) Local ActivityMonitoring, and 3) New UI Design. We implementedand evaluated the effectiveness of the rst two solutionsas well as provided new modied UIs to address theissues in the old UIs. To support open source and fur-ther research, we released the source code of the defensesolutions
2
.
Responsible Disclosure.The ransomware risk through theFSA API had been very briey mentioned in the documenta-tion [61]. However, we argue that the documentation, in itscurrent form, signicantly downplays the extent of the ran-somware threat and gives misleading explanations regardingthe efcacy of the countermeasures provided by the API. Toshare our ndings, improve the security documentation, andcontribute to the production of a working countermeasureagainst this threat, we contacted the FSA developers, whichis Google, through several channels. We submitted a securitybug to Chromium outlining the above points in detail. Wealso had a video meeting and email exchanges with the devel-opers of the FSA API who gave us positive feedback stronglysupporting our work and expressed interest in collaborationto implement the practical defenses we outlined in our pa-per. They have also agreed to make changes in the securitydocumentation to better explain the extent of the ransomwarethreat based on the ndings of our work. In addition, we alsoresponsibly disclosed the issue to cloud providers (e.g., Ap-ple, Box) whose products we identied as being at risk andAV vendors. Apple reviewed the bug report and did not takeresponsibility as their product was indirectly impacted by thisissue. We have yet to receive any responses from the other par-ties at the time of this writing. Further details of the disclosureprocess are given in Section A in Appendix.
Ethics.Due to ethical considerations, we did not make theRØB(i.e., ransomware) implementation publicly available.And, we performed all the analysis on local servers; so nohuman subjects have been involved in this research.
Organization.Section 2 gives the background information.Section 3 presents the threat model. Section 4 introducesthe system model and impact analysis ofRØB. Section 5investigates the effectiveness of existing ransomware defensesolutions againstRØB. Section 6 articulates three defenseapproaches we proposed. Section 7 gives the related workand Section 8 concludes the paper.
2 Background
2.1 The File System Access API
Overview.The Web Platform Incubator CommunityGroup [59] created the File System Access (FSA) API to2https://github.com/cslu/RoB_Ransomware_over_Modern_Web_Browsers

--- page 6 ---

7074 32nd USENIX Security Symposium
USENIX Association

--- page 7 ---

enable the development of powerful web applications thatinteract with les that are located in users' local le sys-tems [60]. For instance, developers can build online documenteditors, business tools, and integrated development environ-ments (IDE) that can directly interact with a user's local lesystem from the browser without any installation. Althoughnot a web standard now, the FSA API is embedded in andfully supported by the most popular browsers like Chromeand Edge and is partially supported by Opera and Safari as ofnow [8]. Moreover, it is available for all browser engine teamssuch as Gecko of Mozilla to implement this new feature.
Internals.The FSA API has a single-entry point, namedchooseFileSystemEntries(). This entry point opens apicker dialog allowing a user to select multiple les ordirectories. After the selection, the browser asks for theuser's permission to read the contents of the les ordirectories via opening a read permission dialog. De-pending on whether the user selects a le or a direc-tory, the API returns either aFileSystemFileHandleorFileSystemDirectoryHandle. These handles providemethods to interact with the les or directories. When aweb application calls thecreateWritable()method onaFileSystemFileHandleto modify a le, the browserprompts the write permission dialog for the user. Subsequentcalls tocreateWritable()for the same le within the samesession do not prompt the user for permissions again. Simi-larly, if the user grants both read and write permissions for adirectory, the returnedFileSystemDirectoryHandlegivesaccess to all les and subdirectories within it. Analogous tothe le handle, any modications on the les in the samedirectory within the same session do not require repeatedpermission prompts.
Security Model.The security model of the FSA API con-siders a few attacks including the possibility of attacks thatencrypt les (i.e., ransomware), malware storing, and execu-tion [24]. There are two main strategies adopted by the APIto tackle these attacks. First, it utilizes a permission modelwhich requires web applications to obtain access from usersvia permission dialogues. This permission model is simple;there is one permission dialog for read access and anotherone for write access. However, the effectiveness of this modelis limited as adversaries can hide their real intents and usesocial engineering to get a user's explicit permission [6,28].Second, the FSA API utilizes an access limitation strategyby blocking web applications' access to the critical parts ofthe le system such as the root directory as well as the user'shome, operating system (OS), and browser prole directories.However, this strategy also falls short in preventing the at-tack we present in this work as the sub-directories of theserestricted directories and any directory that are not explicitlyblocked by this approach (e.g., cloud directory) can still be en-crypted. We analyze the effectiveness of this approach furtherin Section 4.3.
Other Browsers' Positions and Concerns.Browsers suchas Mozilla and Brave [19,48] did not integrate this API intotheir browsers due to some concerns. Particularly, Mozillatagged this API as harmful [48] because they do not think"...meaningful end-user consent is possible to obtain..." [48]and Brave considers this API as "non-standard privacy-risking" [19]. Additionally, Safari's WebKit recently partiallyimplemented the FSA API in its engine [4]. However, theyrestricted the capabilities of FSA API by allowing only ac-cess to the Origin Private File System, which is mapped to adatabase outside of the user's OS. Our ndings in this paperalign with the concerns of other major browsers.
3 Threat ModelIn our threat model, we consider a scenario where an attackercreates a malicious web application or hijacks an existing one,gaining access to the user's local le system via the FSA API.The attacker then uses phishing and malvertisement to lurevictims to the web application and trick them into grantingread and write access via seemingly benign web applications.Then, the adversary can use any encryption algorithm on thevictims' les and overwrite the local les. For the encryp-tion, the adversary can use an encryption library of Wasmor JavaScript or can implement the encryption algorithms bythemselves. Lastly, the adversary can use various extortionmethods (e.g., Bitcoin) that have been used by the classicalransomware families to obtain payment. It is worth notingthat in this threat model, the FSA API works as intended, butonly is abused by the attacker to get access to the user's localles and overwrite them.
Attack Practicality.As described above, the user needs tonavigate to the malicious site and grant read/write access forbrowser-based ransomware to be effective. This threat modelcan be considered practical for several reasons. First, social-engineering techniques like phishing is still one of the topcybercrime used by the attacks in the wild [28] affecting majorenterprises and end-users [57]. Second, the threat model of auser accessing a malicious URL [23] and a tricked user grant-ing permission [12] have been used by other state-of-the-artstudies in the literature. With the advancements in browsersand the trend of moving applications to the web, attackersmay come up with more compelling strategies to success-fully lure users into using their ransomware. Additionally, theaverage layman user can nd the browser more trustworthyand grant read/write requests on le systems more inconsider-ately than downloading, installing, and executing unknownsoftware [58]. More importantly, the current UI lacks anyindicator to warn users of potential ransomware attacks, in-creasing the likelihood of users falling for this type of attack.Last but not least, while traditional ransomware must bypassmany built-in checkpoints (e.g., email attachment scanners,download scanners, local antivirus programs) throughout theattack,RØB-like ransomware can reach the victim directlywithout bypassing these steps, which would also increase the

--- page 8 ---

USENIX Association
32nd USENIX Security Symposium 7075

--- page 9 ---

Figure 1: System model of R
Ø
B ransomware.
practicality of the threat model used in this paper.
4 R
Ø
B - Ransomware over BrowserIn this section, we give the details regarding the design, im-plementation, and impact evaluation of our proof-of-conceptransomware implementation R
Ø
B.
4.1 System Model
Overview.Figure 1 shows the system model of theRØBthatincludes ve modules:Backend,Web User Interface (UI),FileSystem Access
,
Encryption
and,
Extortion
.
Backend Module.This module receives HTTP requests fromclients (victims), it creates a public-private key pair and aunique ID for each victim. Keys and victim IDs are storedin its database. Afterward, it sends an HTTP response to thevictim, which includes the other components ofRØB, clientID, and the generated encryption keys for the client. The keysstored by the Backend module for each client are shared withthe ones who make payments for the recovery of their les.
Web User Interface Module.This module includes the con-tents regarding the look of the website that aims to trick vic-tims to enableRØBto access their local le system. Theattacker can design the Web UI component differently de-pending on the malicious scenario. For example, this modulecan be designed by the adversary as a media (e.g., picture,video) editor.
File System Access Module.This module contains the nec-essary logic to interact with the victim's les from the webapplication using the FSA API.RØBworks in a read-encrypt-overwrite loop for every le in the selected directory of theuser.
Encryption Module.This module includes the func-tions/modules to encrypt the victim's les.RØBperformshybrid encryption on the victim les to make recovery at-tempts impossible for users. In our implementation, this mod-ule rst generates a symmetric key and encrypts the victim'sles with AES-256. After the encryption of all of the les, itencrypts the AES key with RSA-2048 using the public keythat is generated by the Backend module.
Extortion Module.This module redirects the user to the ran-som note link that informs the victim about the ransomwareattack and gives details regarding the ransom payment method.RØBcan employ Bitcoin as the payment method. In our im-plementation, this module redirects the victim to another webpage that displays the victim ID assigned by the Backendmodule for the victim as well as the ransomware note and theassociated payment details.Algorithm 1:
Algorithm of R
Ø
B.1
dirHandle = window.showDirectoryPicker();
2
for
entry
2
dirHandle.values()
do3
le = entry.getFile();
4
encryptedContent = encrypt(le);
5
writable = le.createWritable();
6
writable.write(encryptedContent);
7
writable.close();
8
end4.2 Implementation of R
Ø
B
File System Access Module Implementation.This moduleuses the FSA API to access and modify the victim's les asoutlined in Algorithm 1. In Line 1,showDirectoryPicker()function is invoked which opens a directory select di-alogue for the user. When the user selects a direc-tory and grants the read permission, the API returns aFileSystemDirectoryHandlethat contains the methodsneeded to interact with the les of the user. The state-ments in Lines 2-8 iterate through les in the directory se-lected by the user.getFile()method called in Line 3 re-turns aFileSystemEntryobject of a le and forwards it toencrypt(), which returns the encrypted le contents. After,createWritable()in Line 5 obtains a writable stream to ale and asks for the user's permission to modify the le. Oncethe user has granted write permission, thewrite()methodoverwrites the le. Subsequent calls tocreateWritable()on the same le handle within the same session do not requireadditional user permission. Therefore,RØBcan continue per-forming its malicious actions without prompting the users aslong as the session continues.
Encryption Module Implementation.This module rstgenerates a symmetric key and encrypts the victim's leswith the AES-256 algorithm. It uses AES-GCM mode asit provides balanced performance and condentiality. Afterthe encryption of all of the les, it encrypts the AES keywith RSA-2048 using the public key that is generated by theBackend module when the victim initially made a requestto the malicious web application. To prevent key exposure,the module overwrites the portion of the memory where thekey is stored with random values by leveraging an additionalfunction namedclear_memory. We implemented the Encryp-tion module using the Enigma library which utilizes a Wasm-compiled version of OpenSSL to increase the performance [2].We performed an investigation on the encryption speed ofRØBwith varying le sizes. Our results show that the encryp-tion speed ofRØBis 0.62 MB/s for a 1MB le, 3.85 MB/s for

--- page 10 ---

7076 32nd USENIX Security Symposium
USENIX Association

--- page 11 ---

a 10MB le, and 33.2 MB/s for a 100MB le with Chrome 89installed on a computer with 2,7 GHz Dual-Core Intel Core i5processor and 8 GB of RAM. Although the loading process ofthe Wasm binaries to the browser presents a small overhead,the results show that the encryption speed ofRØBscales withthe size of the data.
4.3 Attack Surface InvestigationIn this subsection, we perform experiments to study the im-pact of R
Ø
B on victim les and directories.
Evaluation Setup.We performed our rst analysis on a com-puter (Test-PC:1) running Windows 10 Pro with a 2,6 GHzIntel Core i7 processor and 16 GB of available RAM. We alsoemployed computers powered by Linux (Test-PC:2- Ubuntu20.04 LTS with a 2,6 GHz Intel Core i7 processor and 16GBof RAM), and macOS (Test-PC:3- macOS Big Sur 11.0.1with a 2,7 GHz Dual-Core Intel Core i5 processor and 8 GB ofRAM) for our evaluations. This enabled us to understand thetype of directories affected in multiple platforms used by a di-verse set of users. Moreover, the analysis with network-sharedfolders required two Windows computers to share a folderover the network. Therefore, in addition to theTest-PC:1,we employed a second Windows-based computer (Test-PC:4)with the same specs of
Test-PC:1
.
Types of Directories Affected.In this analysis, we investi-gate and identify the affected directories in various operatingsystems (e.g., Windows, Linux, and macOS) thatRØBcanencrypt. We analyze the access limitation of the FSA API on aset of directories such as local directories, cloud-integrated di-rectories, external storage devices, and network shared foldersand determine ifRØBcan access and encrypt full directorycontents or only contents of subdirectories.
Local Directories.To determine the directories that are af-fected byRØB, we created test folders that include 50 leswith different le types (docx, xlsx, pdf, txt, jpeg)on test computersTest-PC:1, Test-PC:2,andTest-PC:3. Sub-sequently, we placed the test directories in different parts ofthe le systems (in total 21 different directories on 3 OSs) ofthe test computers. On each test computer, we ranRØBasa web application using a Node.js server, browsed theRØBweb application, and tried to select the directory under testthat has our folder with the les.As explained earlier, the security model of the FSA APIprevents the web application from accessing specic directo-ries. We tested those directories (i.e., the root directory of thele system, user's home, OS, and browser prole directories)onTest-PC:1and veried that the FSA API does not allow auser to select those directories. This implies that the securitymodel of the FSA API preventsRØBfrom accessing thesedirectories. Nevertheless, we continued our tests by placingour test directories in other parts of the local le system tochoose such directories viaRØB. We realized thatRØBcanaccess and encrypt the full contents (including subdirectories)Table 1: List of local directories in different operating sys-tems thatRØBaffects. FDA: Full Directory Access. SDA:Subdirectory Access.Ëindicates thatRØBhas FDA/SDAand encrypts les in that directory.éindicates that accessis denied by the API andRØBcannot encrypt les in thatdirectory.
WindowsLinuxmacOSDirectory
FDA SDAFDA SDAFDA SDA
Documents
é Ëé Ëé Ë
Desktop
é Ëé Ëé Ë
Pictures
Ë ËË ËË Ë
Videos
Ë ËË ËË Ë
Music
Ë ËË ËË Ë
Downloads
é Ëé Ëé Ë
Data Partition
é ËË ËË Ëof the Windows directories of Pictures, Videos, and Music.In addition, we found out that although the security model ofthe FSA API does not allow a user to choose the Documents,Desktop, Downloads, and the data partition directories (e.g.,D:/), there is no access limitation dictated by the API on theirsubdirectories.To summarize, our evaluation showed thatRØBcan ar-bitrarily encrypt the full contents of Pictures, Videos, andMusic, and the subdirectories of Documents, Desktop, Down-loads, and data partition directories on a Windows computer.Considering the other test computers (i.e.,Test-PC:2andTest-PC:3running Linux and macOS respectively), our evaluationshowed that the FSA API has very similar access limitationsfor web applications (hence forRØB) on computers poweredby these operating systems. Table 1 provides a summary ofour ndings. OnceRØBcan have full directory access or sub-directory access, it encrypts all of the les inside. Althoughwe see similar full and subdirectory access patterns ofRØBfor most of the local directories of Windows, Linux, and ma-cOS, we see an interesting pattern for data partitions. Whilethe FSA API preventsRØBfrom fully accessing the datapartition and allows only subdirectories to be accessed forWindows, it allows full access to data partition and subdirec-tories in both Linux and macOS platforms.
Cloud-Integrated Directories.To analyze the effects ofRØBon the les that are stored in cloud-integrated directories, werst created dummy accounts on popular cloud platforms suchas Google Drive, DropBox, Box, iCloud, and Microsoft OneDrive. These platforms have desktop applications that allowusers to work on the les locally and sync them to the cloudusing le system integration. We downloaded their desktopapplications toTest-PC:1to enable that feature and createtheir integrated directories. Subsequently, we placed 50 leswith different le types in each cloud-integrated directoriesonTest-PC:1and chose these directories as the target whilerunning R
Ø
B.Our experiments show that whenRØBaccessed these di-rectories, it successfully encrypted the les in those cloud-integrated directories. After that, the sync engine of the cloud

--- page 12 ---

USENIX Association
32nd USENIX Security Symposium 7077

--- page 13 ---

provider reected the modications to the cloud storage andthe changes made to the les in the cloud became persistent.We summarized our ndings in Table 2.We note that even though these platforms have their built-inransomware detection mechanisms, none of the cloud plat-forms were able to detectRØBduring or after the attack. Onthe other hand, as a ransomware protection method, somecloud platforms use versioning techniques [10]. If the lesthat are stored in the cloud are attacked by ransomware, thecloud user can retrieve the earlier (unencrypted, original) ver-sion of the les. However, this feature is not standard amongall of the cloud providers and every cloud vendor has itsown versioning scheme. While cloud providers such as Drop-box keep track of versions of les for basic, plus, and familyusers for 30 days and professional and business users for 180days [3], OneDrive of Microsoft keeps 25 versions of thestored les [50]. Differently, Google Drive can keep versionsof les for 30 days or the rst 100 versions of them [10].Box has different solutions with various versioning features.Specically, while Box Individual keeps only one version of ale, Personal Pro and Business Starter solutions keep 10 and25 le versions, respectively. On the other hand, iCloud doesnot utilize the versioning feature. We further investigated theversioning scheme of the cloud providers and realized thatDropbox, Google Drive, and Microsoft OneDrive can storemore than 100 versions of the les andRØBcannot have apermanent effect on the les stored by them. In addition, BoxIndividual and Apple iCloud do not have a versioning schemeand we veried that the les encrypted byRØBcannot berecovered by such solutions.We conclude that if victims are using iCloud or Box Individ-ual,RØBcan cause them to lose their signicant les unlessa ransom is paid.RØB-like ransomware attacks can createsignicant damage to iCloud users. In addition, although theversioning strategy employed by Dropbox, Google Drive, andOne Drive seems to be resilient againstRØB, it should notbe considered as a silver bullet. This is due to the fact thatthe backup les in the version history do not always reectthe most recent state of a le. IfRØBis launched before abackup is done, then critical changes on user les can still belost.
External Storage Devices.To test the impact ofRØBonexternal disks, we placed a test directory that included 50les with different le types in a test external disk (e.g., West-ern Digital 4TB) and a test ash drive (e.g., Toshiba 16GB)connected toTest-PC:1. After, we ranRØBand chose thedirectory in each external storage device as the target.Our experiments showed thatRØBis able to encrypt allof the les located in the selected directories in each exter-nal storage device. As external storage devices are used byordinary users and enterprise users to backup important data,RØBcan have detrimental effects on the les stored in suchdevices. Unfortunately, such devices are outside the scope ofthe security model of the FSA API which leaves them proneTable 2: Cloud providers, their versioning schemes, and theimpact ofRØBwhereËsignies that les are not recoverableafter the encryption ofRØBandésignies that les arerecoverable after the encryption ofRØBdue to versioningfeature of the cloud provider. However, ifRØBis launchedbefore a backup is done, then critical changes on user les canstill be lost for cloud providers with versioning (i.e., GoogleDrive, Dropbox, and Microsoft OneDrive).
Cloud ProviderVersioning
Scheme
Affected
by
R
Ø
B?Google Drive30 days or 100 ver-sions
é
Microsoft OneDrive25 versions
é
Dropbox30 days (personal),
180 days (business)
é
Apple iCloudNo versioning
Ë
Box IndividualNo versioning
Ë
to R
Ø
B-like ransomware attacks.
Network Shared Folders.To test the effect ofRØBon net-work shared folders, we created a test directory that included50 les with different le types in our test computerTest-PC:1and we shared it over the network withTest-PC:4. After that,we runRØBonTest-PC:4and selected the test directory thatis shared over the network as a target.We observed thatRØBis able to encrypt the les thatreside in the shared folder which shows that runningRØBin one computer can affect the folders/les that are sharedby multiple computers over the network. Shared folders arefrequently used by both individuals and enterprises and ifsensitive/important les are stored in the shared folder, theeffects of R
Ø
B on these folders can be very serious.
4.4 Desktop vs. Browser-based RansomwareIn this section, we discuss the fundamental differences be-tween browser-based ransomware and desktop ransomware.Initial User Access.Desktop ransomware typically spreadsvia phishing, advertisements, or emails, which are used totrigger downloading the malicious payload. In comparison,browser-based ransomware, such asRØB, is a malicious webapplication that needs to attract its victims to its domain insome way. Similar methods such as phishing, malvertise-ments, or emails (as a link but not as an attachment) canbe used by RoB to distribute the link and to gain initial useraccess. To attract more users, it can also be designed as abenign-looking web application (e.g., a free media editor).
Infection and Execution.For desktop ransomware to be ef-fective, the user (victim) must download (i.e., infect) andexecute the binary on its system. Unlike desktop ransomware,RØBis leless, i.e., no download or execution is required.However, after luring victims to its domain, browser-basedransomware still needs to trick its victims into granting readand write access. In this manner, browser-based ransomware

--- page 14 ---

7078 32nd USENIX Security Symposium
USENIX Association

--- page 15 ---

has the advantage of executing its actions via browsers, whichare used by millions of users and perceived as trustworthywhile desktop ransomware requires users to download andexecute unknown binaries.
Encryption.RØBuses Wasm to encrypt the victim les. Asit employs all of the encryption logic in the Wasm, unlikedesktop ransomware, it does not utilize the platform's encryp-tion libraries or OS system calls. Hence, it can hide its leencryption process from the defense solutions that monitorthe system calls made to the platform's encryption APIs.
Extortion.Desktop ransomware delivers ransom payment in-formation to the victim via leaving a ransom note on the desk-top, changing the desktop background, or using lock screens.However,RØBcannot employ those techniques and has tond other ways. Particularly,RØBcan: A) redirect the victimto the extortion page upon nishing encryption, B) add ran-som note les to the parent folders of the encrypted les, C)change the names of encrypted les and add ransom note tole names by adhering to maximum path length constraints ofplatforms. If Option A is employed, then the ransom note maynever reach the victim if the victim closes the page beforethe encryption is completed. Options B and C are better ones,ensuring that the ransom note will be reachable to the victimeven if the page is closed. However, those options may giveclues to defense solutions in detectingRØBas discussed inSection 6.
5 Effectiveness of Current DefensesIn this section, we investigate the effectiveness of existingransomware defense solutions against R
Ø
B.
5.1 Antivirus SolutionsIn this section, we tested the effectiveness of the full ver-sions of ve different antivirus solutions, namely MalwareBytes, AVG Antivirus, Kaspersky, Trend Micro, and AvastagainstRØB. We chose these antivirus solutions because theyexplicitly promise ransomware defense via malicious behav-ior monitoring for users. To perform our experiments, wedownloaded and installed each antivirus solution to our testcomputerTest-PC:1, put test directories with 10, 50, and 100les with various le types, and checked if they can detectR
Ø
B when it is instructed to run on the test folder.
Malware Bytes.Malware Bytes Premium [43] promisesto protect users' documents and nancial les against ran-somware. We installed Malware Bytes Premium and selectedthe test directory when runningRØB. We veried that Mal-ware Bytes Premium could not detectRØB. Moreover, wealso tried the browser extension of Malware Bytes, namelyBrowser Guard [42] which blocks malicious web pages andweb applications that include ransomware. We performed an-other test while Malware Bytes's Browser Guard extension isactivated and it could not detect R
Ø
B.
AVG Antivirus.We installed the full version of the AVGInternet Security [16], which promises ransomware protec-tion. AVG Internet Security monitors sensitive folders such asDocuments, Pictures, etc., and allows a user to add a folder tothe sensitive folders list for monitoring. We added the path ofthe test directory to the sensitive folders list. Following that,we ranRØBand chose the test directory as the target. AVGInternet Security was not able to detect R
Ø
B.
Kaspersky.We installed the full version of KasperskyTotal Security [5]. Kaspersky Total Security has an anti-ransomware tool that monitors the personal computer forransomware-like behavior in real time. Nevertheless, we ranRØBand could successfully encrypt the les within the testfolder. Kaspersky Total Security was not able to detectRØBin any of the test cases.
Trend Micro.We installed the full version of Trend MicroAntivirus+ Security [56], which promises to utilize preventvarious threats such as ransomware and online attacks viaits Advanced AI Learning utility. We performed three testswith 10, 50, and 100 les in the test folder. We conrmed thatTrend Micro Antivirus+ Security was not able to detectRØBin any of our test experiments.
Avast.We installed the full version of Avast One Essen-tial [15], which promises to provide ransomware protectionvia monitoring important folders. We added the path of thefolder among the important les/folders to be monitored. Weveried that Avast One Essential was not able to detectRØBin any of our test cases.
5.2 State-of-the-art Ransomware DefenseThe ransomware defense approaches for PCs can be groupedinto three categories: 1) Static analysis-based detection meth-ods, 2) Dynamic analysis-based detection methods, and 3)Key extraction-based recovery solutions.
Static Analysis-based Solutions.Many researchers pro-posed static analysis-based solutions [45, 64] that utilizestructural features such as strings and opcodes to detect ran-somware. Although those solutions can detect well-knownransomware strains, they are vulnerable to common evasion at-tempts such as obfuscation [17,53]. In the concept of browser-based ransomware attacks, the adversaries are free to use anytool available and employ obfuscation techniques to evade alltypes of static analysis-based tools. Therefore, such solutionsare not suitable for browser-based ransomware attacks.
Dynamic Analysis-based Solutions.The dynamic analysis-based solutions use behavioral features such as network ac-tivity, API/system calls, I/O access patterns, and le systemactivity to detect ransomware [52]. First,RØBdoes not needfrequent C&C server communication. In fact, only one HTTPrequest made to the Backend module ofRØBis sufcient forit to be sent in an HTTP response packet and perform its ma-licious actions. In addition,RØB's communication is basedon HTTP over TCP which is used by almost every benignwebsite and web application. Therefore, the solutions that usenetwork trafc features [21,22,47] would struggle to detectRØB. Second, unlike conventional ransomware,RØBcan per-

--- page 16 ---

USENIX Association
32nd USENIX Security Symposium 7079

--- page 17 ---

form malicious actions without being installed on the system.Therefore, it can evade the registry-based solutions [35,37].Due to the high computation cost of the malware analysisenvironments [51], the ransomware analysis environmentssuch as [25,38] (albeit was very useful) has become impracti-cal againstRØB-like attacks as it is not practical to analyzeevery website before the visit of a user in such analysis envi-ronments. Additionally, ransomware defense solutions suchas [25,39,54] utilize the features retrieved from the le systemactivities such as folder listing, les written, read, renamed,and deleted. These defense solutions have been designedby monitoring the le system activities performed by theprocess of the ransomware executable. Nevertheless, the lesystem activities ofRØBare different from the traditionalransomware defense solution (see Section 6 for a detailed ex-planation). So, these solutions will not be effective to detectRØB. Furthermore, defense solutions such as [39,54] includethe browser as a benign web application, so that they willintroduce a false positive in detectingRØBwith their currentimplementation.Moreover,RØBuses browsers to perform its maliciousactions. Running on the browser without being installed on asystem can create additional challenges for API/system callmonitoring solutions [13,40,44,65]. ConsideringRØB, suchsolutions face two difculties: 1) InRØB, the adversary is freeto embed his own encryption code to the Encryption modulewhich will not use the crypto APIs of the OS. 2)RØBrunsin the browser (a benign program) and monitoring the sys-tem calls made by the browser will introduce an overhead, aseach website visit creates many browser processes and userscan have multiple tabs open. Therefore, monitoring API/sys-tem calls of browser processes would incur high overhead.Additionally, monitoring the system calls can considerablyslow down the process [63] which can impact the browsingexperience. For these reasons, API/system calls monitoringsolutions will not be practical and effective in detectingRØB.Key Extraction-based Solutions.Some ransomware de-fense systems use memory forensic techniques to retrievethe keys of the attacker to recover the les. The study in [40]presents a ransomware recovery mechanism that stores en-cryption keys by hooking the crypto functions of the OS.Similarly, the study in [46] combines process monitoring, andle change monitoring to detect ransomware and hook cryptoAPI functions to retrieve the key. While these approaches areeffective on ransomware families that use Crypto APIs of theOS, they will be ineffective againstRØB-like attacks since itdoes not use crypto APIs of the OS. Differently, in [33], theauthors aimed to restore the les encrypted by ransomware uti-lizing behavioral features such as encryption time and backupdamaging behavior. The considered ransomware needs priv-ileges to perform its malicious actions; however,RØBdoesnot need any privileges to perform the attack.To test the feasibility of key extraction fromRØB, we cre-ated a Node.js script utilizing puppeteer [1] to periodically
Figure 2: Behavior of R
Ø
B using the FSA API.capture heap snapshots of the web application. We performedtwo experiments. First, we ranRØBon a test directory and re-trieved two heap snapshots: one during the attack and anotherafterward. Second, we adjusted our script to continuouslycapture heap snapshots ofRØBevery 5 seconds, retrieving atotal of 4 different snapshot les. We inspected all output lesto search for our predened key. While we did not encounterthe key in the les from our rst experiment, we detected thekey in a single le from our second experiment. The focusof these experiments was the potential extraction of a rawkey during a browser-based ransomware attack. Nevertheless,if the intermediate key representations (e.g., AES T-tables)are detected in the snapshot, it would also be sufcient to en-able the recovery of the key as well. Our experiments revealthat extracting the key during a browser-based ransomwareattack is feasible, but it is not practical. Firstly, taking heapsnapshots (each snapshot is'4.8MB) of every website theuser is visiting and storing them for further analysis requires ahuge memory and may potentially affect the user experience.Additionally,RØBcan solely utilize the RSA public key en-cryption to encrypt each le, potentially evading this type ofdefense solution.
6 Potential Defense SolutionsIn this study, we propose three different defense solutionsthat are based on the above-mentioned approaches to mitigatethis new attack vector at different levels and we implement aproof-of-concept design for each proposed defense solution.In the next subsection, we rst explain the details of theseapproaches and present proof of concept implementations.
6.1 Approach 1:Malicious Modication Iden-
tication via API HookingIn this approach, we aim to nd indicators that would ef-fectivelyidentify malicious modication, hence signal thepresence of R
Ø
B-like attacks.
Stopping the attack.We show the le system activities ofRØBin Figure 2. In a read-encrypt-write loop, it reads theles in the accessed directory one by one
1. After that, itcreates a swap le for each le in the directory and writesthe modications back to the related swap le. We found thatthe FSA API names the swap les by appending the.crswapextension to the original les
2. We realized that creatingswap les with.crswapextension for every modied le

--- page 18 ---

7080 32nd USENIX Security Symposium
USENIX Association

--- page 19 ---

was not documented by the API and it is oneuniqueandobscurebehavior of the API while working on the local lesystem. Lastly, as represented in
3, it swaps the contentof the original le with the swap le and the change madeby the web application becomes permanent. Note that themodications made by R
Ø
B are not permanent until step
3
.Therefore, intercepting the activity of a web application inthis step preventsRØBfrom making permanent changes tothe original les and stops the attack.
Implementation.Based on our analysis, we found that hook-ing the specic functions of the FSA can stop the activ-ity of theRØBbefore it makes a permanent change to theuser les. For this, we implemented a hooking script inJavaScript. While the user is using the browser, the hook-ing script continuously runs in the background and simul-taneously checks if critical functions of the FSA API arecalled by a web application. When the FSA API functionssuch asShowDirectoryPicker, andwriteare called by aweb application, the hooks of these functions are activatedand the activity of the web application is monitored andstopped by this module before permanent malicious changesare made on the user les. Specically, hooking into theShowDirectoryPickerfunction allows us to get the direc-tory path that a web application is accessing via FSA API.Our implementation considers two patterns of ransomware:1) read-encrypt-overwrite, and 2) read-encrypt-delete-write.Considering the rst pattern, hooking into thewritefunctionstops the web application that is overwriting a le in thelocal le system, thus allowing to check the created swap le.In terms of the second pattern, hooking intoremoveEntryfunction of the API allows us to prevent a web applicationfrom deleting a le. Since some ransomware families do notwork in a read-encrypt-overwrite pattern and instead deletethe original le and write the encrypted version of the originalle in a new le. For this type of ransomware, the hookingmodule detects a delete activity, pauses the deletion event, andcontinues to monitor if the web application attempts to createa new le. In this special case, thewritefunction hooking isactivated and enables us to check the created swap le.
Identifying Malicious Modication.To detect aRØB-likeransomware attack, the intent of the modication made by aweb application to a user's les must be identied. To achievethat, we identify two indicators,entropy change and le sizechange. Both the original version and modied version of thele can be obtained at the same time by pausing the activityof the web application in step
3
as depicted in Figure 2.
Entropy Change.Since les with high entropy can indicatethe le is encrypted, many ransomware defense solutions usedentropy to identify encrypted les [52]. Particularly, such stud-ies mark a le as encrypted if the entropy of the le is abovea threshold. Different from those ransomware solutions in theliterature, we take advantage of having both versions of thele and use the entropy change after modication as a featureinstead of threshold comparison. Compared to any benign lemodications, encryption operation triggers a bigger entropychange on les. We tested and veried this hypothesis byperforming in total 500K benign and 500K malicious (encryp-tion) modication operations on 5000 les with various letypes (txt, jpeg, docx, pdf, xlsxin a dataset of lesobtained from [31]. We provided more detailed explanationof dataset collection in Section C in Appendix.Our analysis with 1 million modied les shows that be-nign modications result in very small changes in entropy.For instance, the entropy oftxt, xlsx, jpeg, docxlesincreases by0
:
05on average after benign modications. How-ever, malicious modications (encryption) on les can resultin large changes in entropy. For example, after encryption, theentropy of les increase by3
:
5fortxt,0
:
10forxlsx,0
:
60forjpeg,0
:
60fordocx, and0
:
10forpdfles on average. Forthis reason, we utilize entropy change as a feature to detectR
Ø
B-like attacks in this solution.
File Size Change.We also observed that the le size changebetween the original le and its modied version is anotherindicator to detect the malicious/benign intent of the modi-cation. Since the encryption operation does not expand thedata included in the le, the size of the le remains relativelysimilar after the encryption. On the other hand, benign modi-cations change the size of the le relatively more than theencryption operation.Our analysis with 1 million modied les shows that be-nign modications on les result in signicant changes insize. For instance, the size oftxt,xlsx,jpeg, anddocxlesincreases by 15% ('
300
Kb) on average after benign modi-cations. However, malicious modications (encryption) onles can result in smaller changes in size compared to be-nign modications. Particularly, our analysis shows that sizeof le size changes 0.002% fortxt, 0.06% forxlsx, 0.14%forjpeg, 0.012% fordocx, and 0.006% forpdfles on av-erage after the encryption. These results show that the lesize chance is another effective feature to identify maliciousmodications.
Classier Evaluation.To test the effectiveness of this ap-proach, we created a machine learning classier that takes theentropy change and the le size change of the les as featuresand identies the malicious modications.We implementedthe classier using Python's scikit-learn library. We trainedthe classier with a dataset that includes the features of origi-nal les and their articially modied versions and encryptedfor various le types. To prevent overtting, we utilized a 10-fold cross-validation. We measured the performance metricsfor various classiers that were previously used in the vari-ous malware detection systems [52] such as Random Forest(RF), K-nearest Neighbor (KNN), Decision Tree (DT), andXGBoost. Table 3 presents the results for the evaluation ofthe efcacy of our rst approach in identifying encryption onthe user les. We observed that the RF classier outperformsother classiers in the context of identifying encryptedtxtanddocxles by introducing only one false positive (FP)

--- page 20 ---

USENIX Association
32nd USENIX Security Symposium 7081

--- page 21 ---

Table 3: Performance evaluation of different ML algorithms. Model
Acc. Recall Prec. F1 TP TN FN FPRF
TXT 0.99 0.99 0.99 0.99 99997 99999 3 1
PDF 0.99 0.99 0.99 0.99 100000 99981 0 19
JPEG 0.99 0.99 0.99 0.99 99996 99996 4 4
DOCX 0.99 0.99 0.99 0.99 99997 99999 3 1
XLSX 0.99 0.99 0.99 0.99 99938 99710 62 290KNN
TXT 0.99 1 0.99 0.99 100000 99982 0 18
PDF 0.99 0.99 0.99 0.99 99988 99990 12 10
JPEG 0.99 0.99 0.99 0.99 99995 99989 11 5
DOCX 0.99 1 0.99 0.99 100000 99982 0 18
XLSX 0.99 0.99 0.99 0.99 99692 99888 308 112DT
TXT 0.99 0.99 0.99 0.99 99998 99995 2 5
PDF 0.98 0.99 0.99 0.99 99951 99981 49 19
JPEG 0.98 0.99 0.99 0.99 99992 99992 8 8
DOCX 0.99 0.99 1 0.99 99996 100000 4 0
XLSX 0.99 0.99 0.99 0.99 99700 99942 300 58XGB
TXT 0.98 0.99 0.99 0.99 99997 99991 3 9
PDF 0.99 1 0.99 0.99 100000 99983 0 17
JPEG 0.99 0.99 0.99 0.99 99995 99991 5 9
DOCX 0.99 0.99 0.99 0.99 99998 99995 2 5
XLSX 0.99 0.99 0.99 0.99 99710 99935 290 65 case. In the case ofjpegles, the DT classier presents thebest performance by presenting 99.5% accuracy without in-troducing any FP. Finally, KNN achieves the best accuracyperformance on
xlsx
les introducing only two FP cases.
Evaluation Against Adaptive Attackers.In this approach,we showed that entropy and le size changes are simple, yeteffective features in encryption detection. However, To ana-lyze the impact of these evasion techniques on the differentle types, we created a new dataset, which includes 500 dis-tinct les (100 per le format) using these evasion techniques.We then retrained our classier with this new dataset, by con-sidering each evasion technique. A detailed description of thedataset generation procedure and classier selection is givenin Section D in Appendix.Our results showed that entropy is closely proportional tothe encryption ratio in the partial encryption technique. Interms of detection, our classier introduced 8 FN cases intotal for 500 les with 25% partial encryption. Furthermore,injecting low-entropy data led to a signicant size increaseand decrease in entropy in all le types. We observed thatinjecting low-entropy data padding introduced 8 FN casesin total. Finally, encoding over encryption techniques hada deterministic impact on the entropy by setting a xed en-tropy value across all le types. Specically, Base64, Base32,and hexadecimal encoding set the entropy to 5.99, 5.0, and3.99 respectively, and increased le sizes by 33%, 60%, and100%. Hexadecimal encoding was most effective against ourclassier, introducing 12 FN cases in total. Our experimentsrevealed that while these techniques alter both le size andentropy in ways that can make detection more challenging,they fall short of fully mimicking the characteristics of benignle modications to completely evade our classier. With thisinsight, we utilized a custom evasion technique that combinesboth data padding and partial encryption to perfectly mimicbenign modications made by the user. As the entropy andsize changes in the resulting les closely resemble those in themodied les, this combined technique successfully evadedour classier, introducing 454 FN cases in total.
Usability & Discussion:Hooking the web applications thatuse the FSA API prevents permanent malicious modica-tions before they overwrite the user les. Our current im-plementation shows entropy change and le size change areeffective in identifying malicious modications but introducefalse negative and false positive cases in case of evasion at-tempts. Although these attempts are theoretically possible,they come with a cost and increase the complexity of theattack. Regarding the usability of our rst approach, false pos-itive cases might be introduced by benign web applicationsperforming heavy compression/encryption as part of legiti-mate operations. To mitigate this, an alerting module can beimplemented to warn the user about potential malicious lechanges performed by the browser. This alerting module canlaunch a third dialog box that explicitly mentions detected po-tential malicious actions (similar to AVs detecting maliciousles) and the risks of permanent data loss. This new dialogbox would prompt the users to verify the accessed websiteand offer the option to proceed or cancel the modication.Although this might introduce an additional inconveniencedue to the frequent permission dialog prompt, it would helpreduce false positives. Finally, the extortion method of theRØBcan also be considered to increase the effectiveness ofour second approach. For example, the created les by webapplications and their names can be monitored for the creationof ransom notes.
6.2 Approach 2:Local Activity MonitoringOur second approach to preventRØB-like attacks employslocal activity monitoring of web applications that use the FSAAPI. Such an approach can be implemented to monitor thefollowing local activities: 1) the FSA API function calls, 2)browser process system calls, and 3) le system activities.
Data Collection.For the benign dataset, we created test fold-ers and accessed them via benign web applications. We per-formed benign operations such as editing the les, remov-ing/adding the content from the le. For malicious dataset, weimplementedRØBwith different congurations. To start with,we created two non-adaptive congurations. The rst one en-crypts a single le (i.e.,RØBEncOne) while the second oneencrypts 100 les in a single directory (i.e.,RØBEncHundred).We also created six more adaptive attacker congurations,which will be explained later in this section. To implementthis approach, we rst created a script in Node.js that hooksevery available function of the FSA API and logs the calledfunctions. We used those FSA API function calls as the rstfeature. Second, while interacting with the le system, we

--- page 22 ---

7082 32nd USENIX Security Symposium
USENIX Association

--- page 23 ---

(a) The FSA API Function Calls (2-gram)
(b) System Calls (4-gram)
(c) File System Activities (1-gram)Figure 3: The heatmap plots for the similarity matrices of the features used in the local activity monitoring. The darker markingmeans the pair is more differentiable.retrieved thePIDwithlsofand monitored the system callsmade by the process bystrace. We used the system calls asthe second feature type. Finally, we collected the le systemactivities via instrumenting
inotifywait
.
FSA API Function Calls.The FSA API implements sev-eral functions (getFile,write) that can be used by webapplications to interact with the local les of users. We hy-pothesize that the sequence of function calls ofRØB-likeransomware attacks and benign web applications display dis-tinguishable patterns, which can be used to detect the attacks.API call monitoring has been successfully used by many mal-ware detection studies [26]. For example, Windows API callsequences are considered one of the representative character-istics in behavior-based malware detection [27]. Our methoddiffers from those studies because the FSA API function callsare specic toRØB-like ransomware; thereby never have beenanalyzed.Our initial analysis on the dataset showed thatgetFile()
!
Write()
!
Write.close()patterns occur for both be-nign web applications andRØBdue to the natural usage ofthe FSA API. However, we observed that while this patternrepeats once for every le in the test folder forRØB, the pat-tern is repeated multiple times for the benign web applicationas the user performs multiple changes on the les. This isexpected as ransomware is incentivized to encrypt as manyles as possible while users of benign web applications areexpected to work and modify a single le multiple times.
System Calls.AlthoughRØBuses Wasm for encryption anddoes not employ the crypto APIs of the platform, it wouldstill be possible to monitor the other system calls made bythat browser process while interacting with the le system.We hypothesize that the system calls made by web applica-tions through the browser can be used to differentiate benignand maliciousRØB-like web applications. The system callmonitoring has been successfully utilized by numerous differ-ent types of malware detection methods in the literature [26].Our study differs from those studies as we only monitor thebrowser's system calls.We rst manually inspected the system calls made byRØBand vscode as an example. We observed that vscode uses asignicantly higher number of write-related system calls thanRØB. We found that whileRØB's system calls are uniformlydistributed, vscode's system calls are randomly distributed foreach le in terms of the le size change. That is, every timea location in memory is accessed by a benign application,varying sizes of changes are performed while the maliciousapplications apply almost the same amount of change everytime a location in memory is accessed.
File System Activities.File system activities are utilized byransomware detection mechanisms in the literature [52]. How-ever, none of these approaches focus on the le system ofactivity of the browser. To minimize the overhead, this ap-proach can benet from API hooking and identication ofthe portion of the le system accessed by the web application.Hence, only the corresponding portion of the le system thatthe web application accesses can be monitored for low-levelle system activities. We rst analyzed the le system ac-tivities ofRØBand vscode manually. Our analysis showedthat patterns of le system activities are generated only oncefor each le on the test folder forRØB, whereas we see theoccurrence of the pattern multiple times for individual lesfor vscode. This observation can be used to detectRØB-likeransomware attacks.
Evaluation Against Adaptive Attackers.To evaluate Ap-proach 2 against adaptive attackers, we created six differentversions ofRØB: 1)RØBReordered: changes the order of theFSA API calls randomly, 2)RØBWithBenign: adds benignmodications (e.g. writing) between the encryption opera-tions, 3)RØBWithBenAPI: makes benign API calls (e.g.,battery status), 4)RØBWithEncWait: waits a random amountof time during the encryption process, 5)RØBWithFSAWait:adds random time intervals between the FSA API calls, and 6)RØBWithBothWait: adds random time intervals both duringencryption and between the FSA calls.
N-gram Analysis.In this part, we analyze nine benign andeight (two non-adaptive and six) malicious web applicationsusing n-gram analysis. We calculated the features using the10% quantile ranges and used Euclidean for the distance cal-

--- page 24 ---

USENIX Association
32nd USENIX Security Symposium 7083

--- page 25 ---

culation. We presented our results as heatmaps in Figure 3.We found that web applications generate 33 FSA API functioncalls on average while they generate 15k system calls and 8kle system activities on average. We experimentally adjustedthe value ofnfor each feature. We observed the best resultsfor 2-gram in FSA API function calls, 4-gram for system calls,and 1-gram for le system activities.Overall results show that while ransomware samples areclearly differentiable using the FSA API function calls and lesystem activities, they are less differentiable with the systemcalls. For example, a threshold-based detection system basedon system calls would likely miss the ransomware sample en-crypting 100 les in a directory (i.e.,RØBEncHundred). Thereason for this is that the impact of encrypting different lescannot be observed in the system calls; therefore, encryptingmultiple les is creating a benign-looking behavior, whichis similar to a user modifying a le multiple times. Whilethe FSA API function calls and le system activities fea-tures contain the modied le, which makes the multiple lesencrypting ransomware even easier to detect. On the otherhand, our results show that re-ordering the API calls, addingbenign API calls, or random waiting strategies do not haveany impact on FSA API function calls and le system activi-ties since other benign API calls and timestamps of the APIcalls are not considered during the feature extraction. We alsoobserved that out of all adaptive strategies, the strategies in-volving additional waiting time affect the system calls featuresignicantly, resulting in many false positives. Consequently,a threshold-based detection system using system calls couldfail to detect ransomware samples such asRØBWithEncWait,RØBWithFSAWait, andRØBWithBothWait. Similarly, sucha detection system would also misclassify some benign webapplications like photopea, text-editor, or excalidraw.
Usability & Discussion.In this approach, we showed thefeasibility of local activity monitoring to detectRØB-like ran-somware. While monitoring the local activity of the web ap-plications benets from hooking to minimize the overhead, aswe observed in our evaluation against multiple types of adap-tive attackers, adversaries can cause false results by changingthe implementation ofRØBto call the other functions ofthe API, make redundant system calls, or make a few smallchanges on the les before encryption. On the other hand,benign applications such as cloud storage services (GoogleDrive, Dropbox, OneDrive), online code editors (GitHub, VSCode), data processing tools (e.g., machine learning appli-cations), and batch le conversion tools may perform massmodication on multiple les, similar to the patterns ofRØB.In such cases, browser vendors might consider integratingsecurity alerts after a certain amount of modication withclear information about the nature of the threat. So, userscan make informed decisions. This security alert may includeinformation about the application requesting access, the typesand quantity of modications being made by the web appli-cations. Additionally, browsers might dene a threshold forthe number of allowed modications before additional userintervention is required. This threshold could be determinedbased on typical usage patterns to minimize false positives.
6.3 Approach 3:New UI DesignIn this approach, instead of detecting the malicious activityofRØB, we aim to raise the security awareness of the usersand better inform them about the risks of allowing web appli-cations to interact with local les.
Current Permission Boxes.The current dialog boxes imple-mented in Chromium are shown in Figure 4 and 5. In thepermission dialog box demonstrated in Figure 4, the web ap-plication asks for a permission to read the contents of all ofthe les inside the directory selected by the user. In the per-mission dialog box presented in Figure 5, the web applicationasks for a permission to be able to (over)write all of the lesinside the directory picked by the user.
Issues.We found the following issues in the current permis-sion dialog boxes. First, they do not clearly state the risksof approving the permissions. For example, the current readaccess permission box does not have any indicator for the po-tential information disclosure of user-sensitive les. Similarly,the current write access permission box does not have warnfor the risks of permanent data loss. Second, despite theirdifferent capabilities read and write permission dialog boxeslook very similar. The users may mistakenly click one anotherand give access to a web application. Third, the changes madeby the web application are not explicitly given in the writedialog box to help the user while accepting the permanentchanges. Fourth, since it is not stated in the current permissiondialog boxes, the user may not be aware of the fact that theweb application will able to access the subdirectories insidethe selected directory too.
Design Decisions.Designing user interfaces for permissionsto ease security decisions is crucial. We dene our designdecisions by applying guidelines from the state-of-the-artstudies [12,20,29,49]. We note the following:
The proposed interface must explicitly show the risks.In [20], it has been shown that the users are likely to grantdangerously excessive permissions when previous instancesof them have not contained reason for concern. For this, theuser interface can include words like "sensitive informationdisclosure", "permanent loss". To further mitigate the ran-somware threat in the write permission box, the keyword canalso be like "encryption" or "ransomware".
The proposed user interface must be designed with col-ors stated in the previous studies [49] that would effectivelycapture the attention of the user. The warning icons havebeen shown to be effective in the context of connection secu-rity [30] to attract the user's attention.
Permission dialog boxes must not be identical so that theuser would know the difference for each box.
The proposed new user interface must show all of the ac-cessed/changed les for a meaningful user decision [48].

--- page 26 ---

7084 32nd USENIX Security Symposium
USENIX Association

--- page 27 ---

Figure 4: Read access permission box (old and new).
Figure 5: Write access permission box (old and new).
The proposed new user interface must include a link thatredirects the user to a web page for more information aboutthe API and its risks.
Improvements Over Old UI.With these design decisions,we proposed two new UIs as shown in Figure 4 and Figure 5for the read and write access, respectively. In the new UIs, weadded the warning icon, the keyword "subdirectory" in theexplanation, and a hyperlink to get more information aboutthis API and its risks. Also, in the write box, we added thekeywords such as "permanent loss" and an option allowingusers to see which les were modied by the web application.Usability & Discussion:The key benet of the new UI de-sign approach is its seamless integration with the existingpermission dialog boxes, without incurring any additionaloverhead. The new UI clearly outlines the capabilities ofweb applications and any potential malicious intent they maypossess. Furthermore, to enhance both the effectiveness andusability of this approach, the new UI could incorporate ani-mations and avatars to boost user engagement and understand-ing [36], incorporate multilingual support, and integrate withaccessibility technologies [18]. The new UI design can beintegrated into the API's source code, this approach directlyimpacts every web application utilizing the FSA API, i.e., noinstallation required. Although redesigning user interfacescan help in protecting users from various attacks, an attackercan still gain the user's trust via malicious tactics [34,41].
7 Related Work
Ransomware Defense.The ransomware defense approachescan be grouped into three categories: static analysis-based,dynamic analysis-based, and key extraction-based. Staticanalysis-based solutions [64] use structural features such asstrings and opcodes to detect ransomware. Dynamic analysis-based solutions use behavioral features such as network andregistry activity, API/system call usage [13, 40, 65], I/O ac-cess patterns, and le system activity [52], network traf-c features [14, 21, 22, 47], registry changes [35, 37]. Theworks [33,46] used memory forensics and behavioral analysisto extract keys and recover the les.
Web API Security.Several works in the literature have ana-lyzed the security and privacy of emerging web APIs. In [32],the authors identied a vulnerability in the Geolocation API,analyzed its impact, and discussed potential countermeasures.In [55], the authors explored a new attack vector through thescreen-sharing API and discussed the effectiveness of theexisting web defense systems. In [62], Weeks discussed thepossible adverse effects of exploiting the FSA API, whichincludes data exltration and the potential code execution.
8 ConclusionIn this work, we designed and implemented the rst browser-based ransomware -RØBand showed the inefcacy of theunderlying FSA API documentation. Our extensive evalua-tions with 3 different OSs, 29 distinct directories and 5 cloudproviders showed thatRØBis capable of encrypting numer-ous types of les in various local directories, cloud-integrateddirectories, external storage devices, and network-shared fold-ers. As existing ransomware detection systems including com-mercial antivirus solutions face several issues againstRØBdue to its distinct features, there was a need to propose a newdefense solution againstRØB-style attacks. Therefore, weproposed three different defense approaches to mitigate thisnew attack vector at different levels.
AcknowledgementsWe thank the anonymous reviewers and our shepherd fortheir helpful feedback and time. We also express our sinceregratitude to the developers of the FSA API at Google for theirsupport and cooperation. Moreover, this work was partiallysupported by the US National Science Foundation (Awards:1663051, 2039606, 2219920), Cyber Florida, Google ASPIREProgram, and Microsoft. The views expressed are those of theauthors only, not of the funding agencies.

--- page 28 ---

USENIX Association
32nd USENIX Security Symposium 7085

--- page 29 ---

References
[1] “Puppeteer,” https://pptr.dev/, 2023.
[2] “Enigma,” https://github.com/cubbit/enigma, 2019.
[3]“Version history overview,” https://help.dropbox.com/files-folders/restore-delete/version-history-overview,2020.
[4]“The le system access api with origin private le sys-tem,” https://webkit.org/blog/12257/the-le-system-access-api-with-origin-private-le-system/, 2022.
[5]“Kaspersky total security,” https://usa.kaspersky.com/total-security, 2022.
[6]“Protecting against consent phishing,” https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/protect-against-consent-phishing, 2022.
[7]“Browser market share worldwide,” https://gs.statcounter.com/browser-market-share, 2023.
[8]“Can i use le system access api?” https://caniuse.com/native-filesystem-api, 2023.
[9]“Project fugu api showcase,” https://developer.chrome.com/blog/fugu-showcase/?api=file-system-access, 2023.[10]“View activity & le versions,” https://support.google.com/drive/answer/2409045, 2023.
[11] “Visual studio code,” https://vscode.dev/, 2023.
[12]D. Akhawe and A. P. Felt, “Alice in warningland: ALarge-Scale eld study of browser security warningeffectiveness,” in22nd USENIX Security Symposium,2013.
[13]B. Al-rimy, M. Maarof, Y. Prasetyo, M. M. S. Z. Syed,Shaid, and A. F. M. Arifn, “Zero-day aware decisionfusion-based model for crypto-ransomware early detec-tion,”International Journal of Integrated Engineering,2018.
[14]O. M. K. Alhawi, J. Baldwin, and A. Dehghantanha,“Leveraging machine learning techniques for windowsransomware network trafc detection,” inCyber ThreatIntelligence
, 2018.
[15]Avast, “Avast one essential protection for your life today,”https://www.avast.com/en-us/avast-one#pc, 2022.
[16]AVG, “Get free antivirus that's trusted by experts,” https://www.avg.com/en-us/homepage#pc, 2022.
[17]S. Bhansali, A. Aris, A. Acar, H. Oz, and A. S. Uluagac,“A rst look at code obfuscation for webassembly,” inProceedings of the 15th ACM Conference on Securityand Privacy in Wireless and Mobile Networks
, 2022.
[18]J. P. Bigham, I. Lin, and S. Savage, “The effects of "notknowing what you don't know" on web accessibilityfor blind web users,” inProceedings of the 19th Inter-national Conference on Computers and Accessibility,2017.
[19]Brave, “Remove support for native le system api,” https://github.com/brave/brave-browser/issues/11407#issuecomment-851742821, 2019.
[20]C. Bravo-Lillo, S. Komanduri, L. F. Cranor, R. W.Reeder, M. Sleeper, J. Downs, and S. Schechter, “Your at-tention please: Designing security-decision uis to makegenuine risks harder to ignore,” inProceedings of theNinth Symposium on Usable Privacy and Security, 2013.[21]K. Cabaj, M. Gregorczyk, and W. Mazurczyk,“Software-dened networking-based crypto ransomwaredetection using http trafc characteristics,”Computersand Electrical Engineering
, 2018.
[22]K. Cabaj and W. Mazurczyk, “Using software-denednetworking for ransomware mitigation: The case of cryp-towall,”
IEEE Network
, 2016.
[23]Y. Chen, Y. Gao, N. Ceccio, R. Chatterjee, K. Fawaz,and E. Fernandes, “Experimental security analysis ofthe app model in business collaboration platforms,” in31st USENIX Security Symposium
, 2022.
[24]Chromium, “File system access web api - chromiumsecurity model - google docs,” https://docs.google.com/document/d/1NJFd-EWdUlQ7wVzjqcgXewqC5nzv_qII4OvlDtK6SE8/edit, 2023.
[25]A. Continella, A. Guagnelli, G. Zingaro, G. Pasquale,A. Barenghi, S. Zanero, and F. Maggi, “Shieldfs: A self-healing, ransomware-aware lesystem,” inProceedingsof the 32nd Annual Conference on Computer SecurityApplications
, 2016.
[26]M. Egele, T. Scholte, E. Kirda, and C. Kruegel, “A sur-vey on automated dynamic malware-analysis techniquesand tools,”
ACM Comput. Surv.
, 2008.
[27]A. A. E. Elhadi, M. A. Maarof, and B. I. Barry, “Improv-ing the detection of malware behaviour using simplieddata dependent api call graph,”International Journal ofSecurity and Its Applications
, 2013.
[28]FBI, “Spoong and phishing,” https://www.fbi.gov/scams-and-safety/common-scams-and-crimes/spoofing-and-phishing, 2023.
[29]A. P. Felt, S. Egelman, D. A. Matthew Finifter, andD. Wagner, “How to ask for permission,” in7th USENIXWorkshop on Hot Topics in Security
, 2012.

--- page 30 ---

7086 32nd USENIX Security Symposium
USENIX Association

--- page 31 ---

[30]A. P. Felt, R. W. Reeder, A. Ainslie, H. Harris,M. Walker, C. Thompson, M. E. Acer, E. Morant, andS. Consolvo, “Rethinking connection security indica-tors,” inTwelfth Symposium on Usable Privacy andSecurity
, 2016.
[31]S. Garnkel, P. Farrell, V. Roussev, and G. Dinolt,“Bringing science to digital forensics with standardizedforensic corpora,”
digital investigation
, 2009.
[32]X. Han, J. Xiong, W. Shen, Z. Lu, and Y. Liu, “Loca-tion heartbleeding: The rise of wi- spoong attack viageolocation api,” inACM SIGSAC Conference on Com-puter and Communications Security
, 2022.
[33]J. Huang, J. Xu, X. Xing, P. Liu, and M. K. Qureshi,“Flashguard: Leveraging intrinsic ash properties to de-fend against encryption ransomware,” inACM SIGSACConference on Computer and Communications Security.Association for Computing Machinery, 2017.
[34]L.-S. Huang, A. Moshchuk, H. J. Wang, S. Schecter,and C. Jackson, “Clickjacking: Attacks and defenses,”in
21st USENIX Security Symposium
, 2012.
[35]J. Hwang, J. Kim, S. Lee, and K. Kim, “Two-stage ran-somware detection using dynamic analysis and machinelearning techniques,”Wireless Personal Communica-tions
, 2020.
[36]Y. Javed and M. Shehab, “Investigating the animationof application permission dialogs: A case study of face-book,” inData Privacy Management and Security As-surance, G. Livraga, V. Torra, A. Aldini, F. Martinelli,and N. Suri, Eds., 2016.
[37]B. Jethva, I. Traoré, A. Ghaleb, K. Ganame, andS. Ahmed, “Multilayer ransomware detection usinggrouped registry key operations, le entropy and lesignature monitoring,”Journal of Computer Security,2019.
[38]A. Kharaz, S. Arshad, C. Mulliner, W. Robertson, andE. Kirda, “UNVEIL: A large-scale, automated approachto detecting ransomware,” in25th USENIX SecuritySymposium
, 2016.
[39]A. Kharraz and E. Kirda, “Redemption: Real-time pro-tection against ransomware at end-hosts,” inResearchin Attacks, Intrusions, and Defenses. Springer Interna-tional Publishing, 2017.
[40]E. Kolodenker, W. Koch, G. Stringhini, and M. Egele,“Paybreak: Defense against cryptographic ransomware,”inProceedings of the 2017 ACM on Asia Conference onComputer and Communications Security
, 2017.
[41]N. Kshetri, “The economics of click fraud,”IEEE Secu-rity Privacy
, 2010.
[42]Malwarebytes, “Malwarebytes browser guard,” https://www.malwarebytes.com/browserguard, 2023.
[43]——, “Malwarebytes premium for windows,” https://www.malwarebytes.com/premium, 2023.
[44]F. Martinelli, F. Mercaldo, C. Michailidou, and A. Sara-cino, “Phylogenetic analysis for ransomware detectionand classication into families,” in
ICETE
, 2018.
[45]M. Medhat, S. Gaber, and N. Abdelbaki, “A new static-based framework for ransomware detection,”2018 IEEE16th Intl Conf. Congress
, 2018.
[46]S. Mehnaz, A. Mudgerikar, and E. Bertino, “Rwguard:A real-time detection system against cryptographic ran-somware,” inResearch in Attacks, Intrusions, and De-fenses
, 2018.
[47]J. Modi, I. Traore, A. Ghaleb, K. Ganame, and S. Ahmed,“Detecting ransomware in encrypted web trafc,” inFoundations and Practice of Security
, 2020.
[48]Mozilla, “Mozilla specication positions,” https://mozilla.github.io/standards-positions/#file-system-access,2022.
[49]J. Muñoz-Arteaga, R. M. González, M. V. Martin, J. Van-derdonckt, and F. Álvarez Rodríguez, “A methodologyfor designing information security feedback based onuser interface patterns,”Advances in Engineering Soft-ware
, 2009.
[50]OneDrive, “Restore a previous version of a le storedin onedrive,” https://support.microsoft.com/en-us/ofce/restore-a-previous-version-of-a-le-stored-in-onedrive-159cad6d-d76e-4981-88ef-de6e96c93893, 2021.
[51]O. Or-Meir, N. Nissim, Y. Elovici, and L. Rokach, “Dy-namic malware analysis in the modern era—a state ofthe art survey,”
ACM Comput. Surv.
, 2019.
[52]H. Oz, A. Aris, A. Levi, and A. S. Uluagac, “A surveyon ransomware: Evolution, taxonomy, and defense solu-tions,”
ACM Comput. Surv.
, 2022.
[53]H. Oz, F. Naseem, A. Aris, A. Acar, G. S. Tuncay, andA. S. Uluagac, “Poster: Feasibility of malware visual-ization techniques against adversarial machine learningattacks,” in43rd IEEE Symposium on Security and Pri-vacy (S&P)
, 2022.
[54]N. Scaife, H. Carter, P. Traynor, and K. R. B. Butler,“Cryptolock (and drop it): Stopping ransomware attackson user data,” inIEEE 36th International Conferenceon Distributed Computing Systems)
, 2016.

--- page 32 ---

USENIX Association
32nd USENIX Security Symposium 7087

--- page 33 ---

[55]Y. Tian, Y. C. Liu, A. Bhosale, L. S. Huang, P. Tague,and C. Jackson, “All your screens are belong to us: At-tacks exploiting the html5 screen sharing api,” in
IEEE
Symposium on Security and Privacy
, 2014.
[56]Trendmicro, “Antivirus+ security,” https://www.trendmicro.com/en_me/forHome/products/antivirus-plus.html, 2022.
[57]A. van der Heijden and L. Allodi, “Cognitive triaging ofphishing attacks,” in28th USENIX Security Symposium,2019.
[58]E. von Zezschwitz, S. Chen, and E. Stark, “"it buildstrust with the customers" - exploring user perceptions ofthe padlock icon in browser ui,” ser. IEEE Security andPrivacy Workshops. IEEE Computer Society, 2022.
[59]W3C, “File system access,” https://github.com/WICG/le-system-access, 2023.
[60]——, “File system access,” https://wicg.github.io/file-system-access/, 2023.
[61]——, “File system access,” https://wicg.github.io/file-system-access/#security-ransomware, 2023.
[62]M. Weeks, “Internal affairs: Hacking le system accessfrom the web,” https://i.blackhat.com/USA21/Wednesday-Handouts/us-21-Internal-Affairs-Hacking-File-System-Access-From-The-Web.pdf, 2021.
[63]L. Zeng, Y. Xiao, and H. Chen, “Linux auditing: Over-head and adaptation,” inIEEE International Conferenceon Communications (ICC)
, 2015.
[64]B. Zhang, W. Xiao, X. Xiao, A. K. Sangaiah, W. Zhang,and J. Zhang, “Ransomware classication using patch-based cnn and self-attention network on embedded n-grams of opcodes,”Future Generation Computer Sys-tems
, 2020.
[65]J. Zhou, M. Hirose, Y. Kakizaki, and A. Inomata, “Eval-uation to classify ransomware variants based on correla-tions between apis,” in6th International Conference onInformation Systems Security and Privacy
, 2020.
Appendix
A Responsible Disclosure Communication
Process DetailsIn this section, we provide the details of our communicationand disclosure process with the respective developers andeditors of the FSA API, which is Google.
Email Contact:On February 17, 2022 we sent an email toone of the main developers of the FSA API about our nd-ings. They acknowledged our ndings and redirected us tothe editor of the FSA documentation for possible documenta-tion [61] improvements as they agreed it was a weak expla-nation. Although we had several exchanges with them, they,unfortunately, did not swiftly act on it to provide any improve-ments (although we offered our help). Note that at that point,we have been already conducting an extensive analysis onthis problem (i.e., different OSes, anti-virus products, cloudproviders, etc.).
Security Bug Report and Opening GitHub Issue:After-wards, we submitted a security bug report to Chromium onNovember 7, 2022, which is not a public process, and ex-plained our ndings and possible documentation improve-ments. They recommended us to open a public GitHub issuein order to be able to swiftly update the documentation basedon our ndings. However, due to the anonymity requirementsof the conference and to prevent the further publicization ofthe issue at that moment, we have not opened an issue onGitHub then.
Video Conference with the FSA API Developers/Editors:Then, we contacted and met with the FSA API developer-s/editors via video conference on November 10, 2022. In themeeting, we further explained the impacts of the ransomwarethrough the FSA API, possible documentation improvements,and our defense solutions to the developers. They acknowl-edged that the ransomware risks in the documentation weredownplayed and agreed to update the documentation basedon our ndings. In the meeting, we also mentioned the po-tential publication of the paper to the developers and editorsof the API. In turn, they asked us to provide them with oursuggestions on how to improve the documentation and wehave been working with them on this front to better reectthe ransomware risks in the documentation.
B Further UI ImprovementsFurther UI improvements are also possible. We found thatsome cloud platforms (e.g., OneDrive) have similar permis-sion boxes for le-sharing, which include other details thatcan be adapted by the FSA API. First, there is an icon of theaccessed website to prevent spoong attacks. Second, thereis an explanation that the website is not endorsed by the API.Moreover, there is a link to report suspicious websites, whichcould help the developer in building a blocklist to help usersin the long term. Finally, there is a link to the website's pri-vacy statement to learn more about how the data will be usedby the website. We have not integrated these into our designsin Figure 4 and 5 to maintain the simplicity of our design.
C Approach 1 - Dataset CreationTo calculate the size and entropy change between an origi-nal le and its modied versions, we need a comprehensivedataset that covers different types of les with various ver-sions where users performed a diverse set of modications.

--- page 34 ---

7088 32nd USENIX Security Symposium
USENIX Association

--- page 35 ---

Table 4: The list of web applications used for the local activitymonitoring experiments. Web ApplicationTypeLinkRobEncOnemaliciousN/ARobEncHundredmaliciousN/ARoBReorderedmaliciousN/ARoBwithBenignmaliciousN/ARoBwithBenAPImaliciousN/ARoBwithEncWaitmaliciousN/ARoBwithFSAWaitmaliciousN/ARoBBothWaitmaliciousN/Abanglebenignhttps://bangle.io/drawiobenignhttps://app.diagrams.net/excalidrawbenignhttps://excalidraw.com/GitHubbenignhttps://github.dev/github/devglitchbenignhttps://googlechromelabs.github.io/browser-fs-access/demo/photopeabenignhttps://www.photopea.com/svgcobenignhttps://svgco.de/text-editorbenignhttps://googlechromelabs.github.io/text-editor/vscodebenignhttps://vscode.dev/ We searched for such databases in various resources includingIEEE DataPort, Google Dataset Search, and Kaggle. However,we could not nd a suitable dataset for our needs. Hence, wedecided to create our own dataset that includes different letypes with various realistically-generated versions.We selected ve le types, namelypdf, docx, xlsx,
txt, jpeg, that may contain sensitive data of users and enter-prises. The Digital Corpora consists of almost 1 million realles from government websites and is distributed freely [31].Using the Digital Corpora, we collected 1000 les from eachle type. The average le size of each type of a le is 0.67MBforpdf, 0.24MB fordocx, 0.29MB forxlsx, 0.58MB fortxt
, and 0.15MB for
jpeg
formats.To mimic user behavior on the les, we considered addingand removing contents from the les to generate differentversions. While doing that, we paid attention to preservingthe le formats. To have a comprehensive dataset, we created100 different versions of each le. The rst 50 versions arecontent removed versions of les are created to mimic dele-tion operations made by users. On the other hand, the othersecond 50 versions are content-added versions of the les arecreated to reect data appending operation made by the user.We developed Python scripts that perform these procedureson the les. The low-level details of how we created 100 dif-ferent versions of each le with respect to each le type aresummarized as follows:
Modication of
txt
lesFor the content removal operationfrom a text le, we dene a range between 1 andn, wherenisthe number of words in the text le. Afterward, we generate arandom numberrin the range of[
1
;
n
]using Python's built-inrandom function that generates random numbers with respectto Uniform Random Distribution. Then, starting from the endof the text le, we removerwords from the original versionof the text le and created the new version of the le. Forthe content insertion operation, we generate another randomnumberrin the same way and we randomly chooserwordsfrom the word database that includes the contents of all thetext les in our dataset and append these randomly chosenwords to the end of the text le.
Modication of
docx
lesFor the content removal opera-tion from adocxle, we used a similar methodology withtextles. Specically, we rst generate a random numberrbetween1andnwhere n is the number of words in thedocxle. Then, starting from the end of thedocxle, we removerwords from thedocxle to create the content removedversion. In the context of creating content-added versions ofthedocxle, we utilized ourdocxcontent database. Suchthat, we retrieverwords randomly from thedocxcontentdatabase and also randomly choose ajpegle from ourjpeg
le database and append them to the
docx
le.
Modication of
pdf
lesFor the content removal operationfrom apdfle, we rst generate a random numberrthat is inthe range of[
1
;
n
]wherenrepresents the number of pages ofthepdfle. Afterward, we remove the content that resides ontherth page of thepdfle to generate the content-removedversion of the le.To generate the content-added version ofthe le, we randomly choose apdfle from our dataset andadd its content on the
r
th page to the end of the
pdf
le.
Modication of
jpeg
lesWe perform the content-removaloperation onjpegle by cropping the le randomly. Toachieve this, we dene two random variables, namelyr
1thatis between1andn, andr
2that is between1andm, wherenrepresents the width andmrepresents the height of thejpegle. By using these randomly generated width and heightvalues, we crop thejpegle starting from the left top cor-ner ((0,0) coordinates). After this operation, thejpegle iscropped to become anr
1
xr
2image. We create the other 50 dif-ferent versions of ajpegle by merging it with anotherjpegle randomly selected from our database, which includes alljpeg
les in our dataset.
Modication of
xlsx
lesTo perform the removal operationon anxlsxle, we rst calculate the number of rows in axlsxle. Then, we dene a range between1andn, wherenis the number of rows in thexlsxle. Afterward, we create arandom numberrin this range and removerrows from theend of thexlsxle. To perform adding operation, we add arandom number (r) of rows to the end of thexlsxle that isretrieved from
xlsx
le database.
Reecting Malicious Changes.To reect malicious changes(i.e, encryption withRØB) on the les, we encrypted eachle including modied versions in our dataset withRØBthatuses the AES-256 encryption algorithm.
D Approach 1 - Evaluation Against Adaptive
AttackersTo evaluate our rst approach against more adaptive attackers,we randomly selected 500 les (100 per le type) from ouroriginal benign dataset. We created corresponding 500 mali-cious les for each evasion technique. We repeated this pro-cess for different techniques. Then, we evaluated the impactof the technique and its success rate in evading our classier.

--- page 36 ---

USENIX Association
32nd USENIX Security Symposium 7089

--- page 37 ---

Table 5: Evaluation against more adapt attackers. Technique
Acc. Recall Prec. F1 TP TN FN FPPartial Encryption
TXT 1.0 1.0 1.0 1.0 100 0 0 0
PDF 0.98 0.98 1.0 0.98 98 0 2 0
JPEG 0.99 0.99 1.0 0.96 99 0 1 0
DOCX 0.98 0.98 1.0 0.98 98 0 2 0
XLSX 0.97 0.97 1.0 0.98 97 0 3 0Low-entropy
Data Padding
TXT 1.0 1.0 1.0 1.0 100 0 0 0
PDF 0.97 0.97 1.0 0.98 97 0 3 0
JPEG 0.99 0.99 1.0 0.96 99 0 1 0
DOCX 0.99 0.99 1.0 0.96 99 0 1 0
XLSX 0.97 0.97 1.0 0.98 97 0 3 0Post-encryption
Encoding (Base64)
TXT 1.0 1.0 1.0 1.0 100 0 0 0
PDF 0.99 0.99 1.0 0.99 99 0 1 0
JPEG 0.99 0.99 1.0 0.96 99 0 1 0
DOCX 0.99 0.99 1.0 0.99 99 0 1 0
XLSX 0.96 0.96 1.0 0.97 96 0 4 0Post-encryption
Encoding (Base32)
TXT 1.0 1.0 1.0 1.0 100 0 0 0
PDF 1.0 1.0 1.0 1.0 100 0 0 0
JPEG 1.0 1.0 1.0 1.0 100 0 0 0
DOCX 1.0 1.0 1.0 1.0 100 0 0 0
XLSX 0.99 0.99 1.0 0.99 99 0 1 0Post-encryption
Encoding (Hexadecimal)
TXT 1.0 1.0 1.0 1.0 100 0 0 0
PDF 0.94 0.94 1.0 0.96 94 0 6 0
JPEG 0.95 0.95 1.0 0.97 95 0 5 0
DOCX 1.0 1.0 1.0 1.0 100 0 0 0
XLSX 0.99 0.99 1.0 0.99 99 0 1 0Custom
Evasion
TXT 0.1 0.1 1.0 0.18 10 0 90 0
PDF 0.12 0.12 1.0 0.21 12 0 88 0
JPEG 0.06 0.06 1.0 0.11 6 0 94 0
DOCX 0.09 0.09 1.0 0.16 9 0 91 0
XLSX 0.09 0.09 1.0 0.16 9 0 91 0 During the classier evaluation, we used 10-fold to ensure aclean split between training and test data. The average size ofeach le type in our new dataset is 0.72MB forpdf, 0.23MBforxlsx, 0.33MB fordocx, 0.12MB forjpegand 0.40MBfortxtles. Also, the average entropy values of each typein our dataset are 7.54 forpdf, 7.68 forxlsx, 7.37 fordocx,7.80 forjpegand 4.32 fortxtles. To mimic the adap-tive attacker behavior on the les, we used partial encryption,low-entropy data padding (e.g., injecting low-entropy data),encoding post-encryption, and custom evasion. We algorith-mically chose the best-performing classier in an automatedfashion. Specically, the KNN classier yielded the best re-sults forxlsxles, the Decision Tree classier forpdf,jpeg,andtxtles, and the XGBoost classier fordocxles. Wepresented the results of our experiments in Table 5. The de-tails of our dataset creation procedure for evasion techniquesare as follows:
Partial-Encryption:To mimic partial-encryption behavioron the les, we encrypted 25% of the le content using theAES-256 algorithm.
Low-entropy data padding:To mimic the low-entropy datapadding behavior on the les, we initially encrypted the lesusing the AES-256 algorithm. Subsequently, we injected arandom amount of low-entropy data consisting of null charac-ters (e.g.,\x00, with a randomly dened length varying from10,000 to 20,000) to the le content.
Encoding Post-Encryption:To perform the encoding post-encryption technique, we initially encrypted each le typeusing the AES-256 algorithm. Then, we applied various en-coding techniques to the les, including Base64, Base32, andhexadecimal encoding.
Custom Evasion:In this scenario, we combined both datapadding and partial encryption techniques to mimic the benignmodication of the user. To achieve that, we continuouslyencrypt the 25% of the le and injected a amount of data untilit achieves the
10%of the average entropy and size of thebenignly modied le.

--- page 38 ---

7090 32nd USENIX Security Symposium
USENIX Association

--- page 39 ---

!"#$%&#"$'&"($)&*"%+!!!"#$%&'(#")*&!"##$%&$'%#&$()$*"&!$+"#&,$"-$+,-#).*-/01%&#.-("#$/).$0#),&$'##$('%,$+)1$(2",$,"(&3$2%1)#(3,#!!"#$%!"#$%&#"$'&"($)&*"%+4'1-"-56$!!!"#$%&'(#")*&!"##$%&$'%#&$()$1&'7$'##$+"#&,$"-$+,-#).*-/01%&#'-7$"(,$,.%7"1&0()1"&,$.-("#$/).$0#),&$'##$('%,$+)1$(2",$,"(&3!!!"#$%&'(#")*&8"52($'((&89($()$,(&'#$/).1$4#14,.,5#6,17*-&%.,*13:&($8)1&$"-+)18'(")-)-$(2&$9),,"%#&$1",;,3$<)&,$(2",$!&%,"(&$#));$,.,9"0").,=$>&9)1($"($2&1&!"#$%&'()$%&2%1)#(3,#!!"#$%

--- page 40 ---

!"#$%&'()$%&!"#$%&'"()$*%+,%#*+(,-.+/0123(-!!!"#$%&'(#")*&!"##$%&$'%#&$()$&*"($+,-#).*-/01%&#+,("#$-)+$.#)/&$'##$('%/$0)1$(2"/$/"(&3$2%1)#(3%4#5)6%17#8!"#$%&'"()$*%+,%#*+(,-.+/0123(-4'1,",56!!!"#$%&'(#")*&!"##$%&$'%#&$()$&*"($+,-#).*-/01%&#',*$"(/$/+%*"1&.()1"&/$+,("#$-)+$.#)/&$'##$('%/$0)1$(2"/$/"(&3$72&$.2',5&/$8'*&$%-$!!!"#$%&'(#")*&.',$.'+/&$'#-&%1#1.5(*885)0$-)+1$#).'#$*'('3$!""#$%"#&'()*$"+#,&-"./09:*"(&*$;</&1/;=#".&;>#)+*;*"1&.()1-?,'8&;(&/(@3(A(9:*"(&*$;</&1/;=#".&;>#)+*;*"1&.()1-?,'8&;(&/(B3(A(9:*"(&*$;</&1/;=#".&;>#)+*;*"1&.()1-?,'8&;/+%?*"1&.()1-;(&/(C3(A(D&($8)1&$",0)18'("),),$(2&$E)//"%#&$1"/F/3$G)&/$(2"/$!&%/"(&$#))F$/+/E".")+/H$I&E)1("(2&1&2%1)#(3%4#5)6%17#8
