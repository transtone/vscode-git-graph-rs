# Third-party notices

This file records the third-party software that is distributed with Git Graph
RS (the VSIX package and the native `git-graph.node` addon binaries), and
where its license can be found. It complements the file-level attribution
comments kept at each point of use in the source code.

## Native engine (Rust)

The native addon statically links the Rust crates resolved by `Cargo.lock`
(~190 unique crates). Every direct dependency is dual-licensed MIT OR
Apache-2.0, and so is the overwhelming majority of the transitive graph; any
exception is listed by the tooling command below before any release.

| Dependency | Role | License |
|---|---|---|
| `gix` (and its `gix-*` sub-crates) | Git implementation: object database, refs, index, status, diff, revision walking | MIT OR Apache-2.0 |
| `napi`, `napi-derive` | Node-API bindings and macros | MIT |
| `serde`, `serde_json` | JSON serialisation across the Node-API boundary | MIT OR Apache-2.0 |
| `regex` | `searchHistory` pattern matching | MIT OR Apache-2.0 |
| `thiserror` | Engine error types | MIT OR Apache-2.0 |

The license texts are provided alongside this file:

- `LICENSE-MIT` — the MIT license text
- `LICENSE-APACHE` — the Apache License 2.0 text

Per the MIT license, the copyright and permission notices of the respective
crates are retained. Per the Apache-2.0 license, NOTICE files (none of the
crates in the graph ship one) and attribution requirements apply; the
Apache-2.0 text in `LICENSE-APACHE` is included to satisfy section 4(d) for
binary redistribution of the addon.

To regenerate the complete per-crate license inventory, run:

```sh
cargo install cargo-about
cargo about generate about.hbs > licenses/THIRD-PARTY-RUST.html
```

The authoritative version list of every crate that is compiled into the addon
is `Cargo.lock` at the commit the binaries were built from.

## Extension host and webview (TypeScript)

| Component | Where | License | Notice file |
|---|---|---|---|
| Git Graph (mhutchie) — the webview and extension host layer this project ports and extends | `src/`, `web/` | Modified MIT (see the restriction in the file) | `LICENSE_GIT_GRAPH` |
| Visual Studio Code Git Extension — Askpass implementation, Find Git Executable methods | `src/askpass/*`, `src/utils.ts` (`findGit*`) | MIT | `LICENSE_MICROSOFT` |
| Inter Variable — UI font | `resources/fonts/inter-*.woff2` | SIL OFL 1.1 | `../resources/fonts/Inter-OFL.txt` |
| Geist Mono — monospace font | `resources/fonts/GeistMono-*.woff2` | SIL OFL 1.1 | `../resources/fonts/GeistMono-OFL.txt` |
| Lucide — approved UI icons | `web/utils.ts`, `src/utils/icons.ts`, mobile CSS masks | ISC / MIT (see notice) | `LICENSE_LUCIDE` |
| Octicons — retained package SVG icon | `web/utils.ts` (`SVG_ICONS.package`) | MIT | `LICENSE_OCTICONS` |

The `git-graph-rs-*` resources in `resources/` are original to this project
and covered by the root `LICENSE`.
