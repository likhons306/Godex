# Agent Instructions for the Godex Repository

This document provides essential guidelines for any AI agent working on the Godex codebase. Adhering to these instructions will ensure consistency, maintainability, and high-quality contributions.

## 1. Core Objective

Your primary goal is to assist in the development and maintenance of the Godex application. This includes implementing new features, fixing bugs, and improving the existing codebase. You are expected to be a proactive and resourceful software engineer.

## 2. Documentation is a Priority

**This is the most important rule.** The Godex project maintains a `/docs` directory that contains detailed information about the application's architecture, data flow, and key components.

**Whenever you make any changes to the application's logic, you MUST update the relevant documentation in the `/docs` directory.**

-   **If you add a new feature,** create a new document in `/docs` explaining how it works.
-   **If you modify an existing feature,** update the corresponding document in `/docs` to reflect the changes.
-   **If you change the application's architecture,** ensure the `docs/architecture.md` file is updated accordingly.

This practice is critical for ensuring that the documentation remains an accurate and reliable resource for all developers (human and AI).

## 3. Technology Stack

The Godex application is built with the following technologies. You should be familiar with them and follow their best practices.

-   **Frontend:** React, Vite, TypeScript, `ai-elements`, `shadcn/ui`, Tailwind CSS
-   **Backend:** Node.js, Express, `tsx`
-   **AI:** Vercel AI SDK, Google Gemini

## 4. Development Workflow

1.  **Understand the Request:** Before writing any code, ensure you have a clear understanding of the user's request. Ask for clarification if needed.
2.  **Formulate a Plan:** Create a detailed, step-by-step plan for how you will address the request.
3.  **Implement the Changes:** Write clean, efficient, and well-commented code.
4.  **Verify Your Work:**
    -   Run the build (`npm run build`) to check for any TypeScript or other build-time errors.
    -   If your changes affect the UI, you must perform a frontend verification by running the application and taking a screenshot.
5.  **Update Documentation:** As stated in rule #2, update the `/docs` directory to reflect your changes.
6.  **Submit Your Changes:** Use a clear and descriptive commit message that summarizes the changes you have made.

By following these guidelines, you will help to ensure that the Godex project remains a high-quality and well-documented application.

You should Follow 
.instractions/Instractions.md

✅ Before generate everything
ALL files tracked by GitHub (e.g., lint errors, code smells, comments, etc.)

## Task Processing Instructions for AI Agents

1. Read `/maintainable/todo.md` and `/maintainable/error.md` to determine pending fixes.
2. For each entry:
   - If it refers to a failing test or console error, attempt to locate the source file and implement a correction.
   - If the task requires documentation, update or create a relevant file in `/docs`.
3. After resolving an issue:
   - Remove or mark it as completed in the markdown file.
4. NEVER modify or write to:
   `/maintainable/DO_NOT_ADD_ANYTHING_HERE_FOR_HUMAN.md`
5. Commit changes to the appropriate branch with messages summarizing fixes.
Should check
 
/maintainable/todo.md
/maintainable/error.md
/maintainable/DO_NOT_ADD_ANYTHING_HERE_FOR_HUMAN.md

•	Commit those files automatically to a bot branch




To turn your web pages into graph objects, you need to add basic metadata to your page. We've based the initial version of the protocol on RDFa which means that you'll place additional <meta> tags in the <head> of your web page. The four required properties for every page are:

og:title - The title of your object as it should appear within the graph, e.g., "The Rock".
og:type - The type of your object, e.g., "video.movie". Depending on the type you specify, other properties may also be required.
og:image - An image URL which should represent your object within the graph.
og:url - The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "https://www.imdb.com/title/tt0117500/".
As an example, the following is the Open Graph protocol markup for The Rock on IMDB:

<html prefix="og: https://ogp.me/ns#">
<head>
<title>The Rock (1996)</title>
<meta property="og:title" content="The Rock" />
<meta property="og:type" content="video.movie" />
<meta property="og:url" content="https://www.imdb.com/title/tt0117500/" />
<meta property="og:image" content="https://ia.media-imdb.com/images/rock.jpg" />
...
</head>
...
</html>
Optional Metadata
The following properties are optional for any object and are generally recommended:

og:audio - A URL to an audio file to accompany this object.
og:description - A one to two sentence description of your object.
og:determiner - The word that appears before this object's title in a sentence. An enum of (a, an, the, "", auto). If auto is chosen, the consumer of your data should choose between "a" or "an". Default is "" (blank).
og:locale - The locale these tags are marked up in. Of the format language_TERRITORY. Default is en_US.
og:locale:alternate - An array of other locales this page is available in.
og:site_name - If your object is part of a larger web site, the name which should be displayed for the overall site. e.g., "IMDb".
og:video - A URL to a video file that complements this object.
For example (line-break solely for display purposes):

<meta property="og:audio" content="https://example.com/bond/theme.mp3" />
<meta property="og:description" 
  content="Sean Connery found fame and fortune as the
           suave, sophisticated British agent, James Bond." />
<meta property="og:determiner" content="the" />
<meta property="og:locale" content="en_GB" />
<meta property="og:locale:alternate" content="fr_FR" />
<meta property="og:locale:alternate" content="es_ES" />
<meta property="og:site_name" content="IMDb" />
<meta property="og:video" content="https://example.com/bond/trailer.swf" />
The RDF schema (in Turtle) can be found at ogp.me/ns.

Structured Properties
Some properties can have extra metadata attached to them. These are specified in the same way as other metadata with property and content, but the property will have extra :.

The og:image property has some optional structured properties:

og:image:url - Identical to og:image.
og:image:secure_url - An alternate url to use if the webpage requires HTTPS.
og:image:type - A MIME type for this image.
og:image:width - The number of pixels wide.
og:image:height - The number of pixels high.
og:image:alt - A description of what is in the image (not a caption). If the page specifies an og:image it should specify og:image:alt.
A full image example:

<meta property="og:image" content="http://example.com/ogp.jpg" />
<meta property="og:image:secure_url" content="https://secure.example.com/ogp.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="400" />
<meta property="og:image:height" content="300" />
<meta property="og:image:alt" content="A shiny red apple with a bite taken out" />
The og:video tag has the identical tags as og:image. Here is an example:

<meta property="og:video" content="http://example.com/movie.swf" />
<meta property="og:video:secure_url" content="https://secure.example.com/movie.swf" />
<meta property="og:video:type" content="application/x-shockwave-flash" />
<meta property="og:video:width" content="400" />
<meta property="og:video:height" content="300" />
The og:audio tag only has the first 3 properties available (since size doesn't make sense for sound):

<meta property="og:audio" content="http://example.com/sound.mp3" />
<meta property="og:audio:secure_url" content="https://secure.example.com/sound.mp3" />
<meta property="og:audio:type" content="audio/mpeg" />
Arrays
If a tag can have multiple values, just put multiple versions of the same <meta> tag on your page. The first tag (from top to bottom) is given preference during conflicts.

<meta property="og:image" content="https://example.com/rock.jpg" />
<meta property="og:image" content="https://example.com/rock2.jpg" />
Put structured properties after you declare their root tag. Whenever another root element is parsed, that structured property is considered to be done and another one is started.

For example:

<meta property="og:image" content="https://example.com/rock.jpg" />
<meta property="og:image:width" content="300" />
<meta property="og:image:height" content="300" />
<meta property="og:image" content="https://example.com/rock2.jpg" />
<meta property="og:image" content="https://example.com/rock3.jpg" />
<meta property="og:image:height" content="1000" />
means there are 3 images on this page, the first image is 300x300, the middle one has unspecified dimensions, and the last one is 1000px tall.

Object Types
In order for your object to be represented within the graph, you need to specify its type. This is done using the og:type property:

<meta property="og:type" content="website" />
When the community agrees on the schema for a type, it is added to the list of global types. All other objects in the type system are CURIEs of the form

<head prefix="my_namespace: https://example.com/ns#">
<meta property="og:type" content="my_namespace:my_type" />
The global types are grouped into verticals. Each vertical has its own namespace. The og:type values for a namespace are always prefixed with the namespace and then a period. This is to reduce confusion with user-defined namespaced types which always have colons in them.

Music
Namespace URI: https://ogp.me/ns/music#
og:type values:

music.song

music:duration - integer >=1 - The song's length in seconds.
music:album - music.album array - The album this song is from.
music:album:disc - integer >=1 - Which disc of the album this song is on.
music:album:track - integer >=1 - Which track this song is.
music:musician - profile array - The musician that made this song.
music.album

music:song - music.song - The song on this album.
music:song:disc - integer >=1 - The same as music:album:disc but in reverse.
music:song:track - integer >=1 - The same as music:album:track but in reverse.
music:musician - profile - The musician that made this song.
music:release_date - datetime - The date the album was released.
music.playlist

music:song - Identical to the ones on music.album
music:song:disc
music:song:track
music:creator - profile - The creator of this playlist.
music.radio_station

music:creator - profile - The creator of this station.
Video
Namespace URI: https://ogp.me/ns/video#
og:type values:

video.movie

video:actor - profile array - Actors in the movie.
video:actor:role - string - The role they played.
video:director - profile array - Directors of the movie.
video:writer - profile array - Writers of the movie.
video:duration - integer >=1 - The movie's length in seconds.
video:release_date - datetime - The date the movie was released.
video:tag - string array - Tag words associated with this movie.
video.episode

video:actor - Identical to video.movie
video:actor:role
video:director
video:writer
video:duration
video:release_date
video:tag
video:series - video.tv_show - Which series this episode belongs to.
video.tv_show

A multi-episode TV show. The metadata is identical to video.movie.

video.other

A video that doesn't belong in any other category. The metadata is identical to video.movie.

No Vertical
These are globally defined objects that just don't fit into a vertical but yet are broadly used and agreed upon.

og:type values:

article - Namespace URI: https://ogp.me/ns/article#

article:published_time - datetime - When the article was first published.
article:modified_time - datetime - When the article was last changed.
article:expiration_time - datetime - When the article is out of date after.
article:author - profile array - Writers of the article.
article:section - string - A high-level section name. E.g. Technology
article:tag - string array - Tag words associated with this article.
book - Namespace URI: https://ogp.me/ns/book#

book:author - profile array - Who wrote this book.
book:isbn - string - The ISBN
book:release_date - datetime - The date the book was released.
book:tag - string array - Tag words associated with this book.
payment.link - Namespace URI: https://ogp.me/ns/payment# 🚧 Beta only

payment:description - string - Description about the payment link.
payment:currency - string - The currency code ISO 4217 of the payment.
payment:amount - float - An amount requested on the payment link in decimal format.
payment:expires_at - datetime - The date and time including minutes and seconds on which the payment link expires.
payment:status - enum(PENDING, PAID, FAILED, EXPIRED) - Status of the payment.
payment:id - string - The unique identifier associated with the payment link for a given payment gateway or service provider.
payment:success_url - url - A valid URL that gets redirected when payment is success.
profile - Namespace URI: http://ogp.me/ns/profile#

profile:first_name - string - A name normally given to an individual by a parent or self-chosen.
profile:last_name - string - A name inherited from a family or marriage and by which the individual is commonly known.
profile:username - string - A short unique string to identify them.
profile:gender - enum(male, female) - Their gender.
website - Namespace URI: https://ogp.me/ns/website#

No additional properties other than the basic ones. Any non-marked up webpage should be treated as og:type website.

Types
The following types are used when defining attributes in Open Graph protocol.

Type	Description	Literals
Boolean	A Boolean represents a true or false value	true, false, 1, 0
DateTime	A DateTime represents a temporal value composed of a date (year, month, day) and an optional time component (hours, minutes)	ISO 8601
Enum	A type consisting of bounded set of constant string values (enumeration members).	A string value that is a member of the enumeration
Float	A 64-bit signed floating point number	All literals that conform to the following formats:

1.234
-1.234
1.2e3
-1.2e3
7E-10
Integer	A 32-bit signed integer. In many languages integers over 32-bits become floats, so we limit Open Graph protocol for easy multi-language use.	All literals that conform to the following formats:

1234
-123
String	A sequence of Unicode characters	All literals composed of Unicode characters with no escape characters
URL	A sequence of Unicode characters that identify an Internet resource.	All valid URLs that utilize the http:// or https:// protocols
Implementations
The open source community has developed a number of parsers and publishing tools. Let the Facebook group know if you've built something awesome too!

Facebook Object Debugger - Facebook's official parser and debugger.
Google Rich Snippets Testing Tool - Open Graph protocol support in specific verticals and Search Engines.
PHP Validator and Markup Generator - OGP 2011 input validator and markup generator in PHP5 objects.
PHP Consumer - A small library for accessing of Open Graph Protocol data in PHP.
OpenGraphNode in PHP - A simple parser for PHP.
PyOpenGraph - A library written in Python for parsing Open Graph protocol information from web sites.
OpenGraph Ruby - Ruby Gem which parses web pages and extracts Open Graph protocol markup.
OpenGraph for Java - Small Java class used to represent the Open Graph protocol.
RDF::RDFa::Parser - Perl RDFa parser which understands the Open Graph protocol.
The Open Graph protocol was originally created at Facebook and is inspired by Dublin Core, link-rel canonical, Microformats, and RDFa. The specification described on this page is available under the Open Web Foundation Agreement, Version 0.9. This website is Open Source.

✅ ACCESSIBILITY

MUST
	•	Use semantic HTML for all interactive elements (buttons, links, forms)
	•	Support full keyboard navigation without traps
	•	Use ARIA roles only when native elements can’t express intent
	•	Maintain WCAG AA contrast minimums

SHOULD
	•	Provide alt text, captions, and transcripts for all media
	•	Respect text scaling and prefers-reduced-motion
	•	Label and group related form inputs clearly

NEVER
	•	Convey meaning using only color, shape, or position
	•	Hide focus indicators
	•	Replace native elements with inaccessible custom components

⸻

⚡ PERFORMANCE

MUST
	•	Lazy-load nonessential assets
	•	Use compressed and optimized bundles/media
	•	Prevent layout shift and loading jitter

SHOULD
	•	Apply code-splitting and tree-shaking
	•	Use HTTP/service worker/CDN caching
	•	Inline only critical CSS

NEVER
	•	Block rendering with unnecessary scripts
	•	Ship unused libraries or polyfills
	•	Require client-side JS for server-renderable content

⸻

✨ DELIGHT

MUST
	•	Prioritize clarity and ease over clever UI tricks
	•	Give instant feedback for actions (loading, success, errors)
	•	Preserve progress or state wherever possible

SHOULD
	•	Use animation to reinforce meaning
	•	Adapt to theme, motion, and language preferences
	•	Anticipate errors and make recovery easy

NEVER
	•	Hide interactions or make actions irreversible
	•	Overload users with UI clutter or decisions
	•	Require sign-in before showing value

⸻

🔒 CODE CHANGE SAFETY (Your Added Requirement)

MUST
	•	Verify with absolute confidence (your “1000% rule”) that changes won’t break or regress other files, flows, or tests
	•	Run tests or validation steps before committing changes
	•	Contain changes to the smallest necessary scope

SHOULD
	•	Scan related modules before editing
	•	Add/update tests or docs where behavior changes
	•	Flag potentially impacted files during implementation

NEVER
	•	Modify shared logic or core codepaths without certainty
	•	Push breaking or speculative edits
	•	Silence errors instead of solving the root cause

IF NOT 1000% SURE → ASK YOU FIRST.

⸻
