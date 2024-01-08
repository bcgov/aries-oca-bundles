# Using OCA Bundles

The information published on this website is for both human consumption and machine readable processing by Aries Agents. This
page describes how Aries Agents can use the JSON index files and OCA Bundles published in this registry.

## Aries Agent Processing

The following are the steps for processing an OCA Bundle by an Aries Holder or Verifier.

An Aries holder (wallet) or verifier agent **MUST** be pre-configured with the
following URL (referenced as `<URL>` in the guidance that follows) for accessing
the raw JSON files published as part of this registry:

- `https://bcgov.github.io/aries-oca-bundles/`

Here is how the resources published on this site are to be used by an Aries Agent:

- On startup, and periodically thereafter, load the [ocabundles.json] JSON index file found at `<URL>/ocabundles.json`.
  - See the guidance below on caching the resources (index file and OCA Bundles) published on this site.
- On receipt of an AnonCreds Credential Definition (via either an [Issue Credential] or [Present Proof] protocol):
  - Extract the `credDefId` and `schemaId` from the Credential Definition.
  - Scan for the `credDefId` and `schemaId` in the index of OCA Bundles in the loaded [ocabundles.json] data structure.
  - If found, extract the corresponding `path` item value from the [ocabundles.json] data structure entry.
    - If entries for both identifiers are found, use the `credDefId` entry.
  - Load and use the OCA Bundle for the credential at `<URL>/<path>`.
- If not found, proceed without an OCA Bundle for the credential.

The use of the OCA Bundle (or proceeding without an OCA Bundle) is defined in the [OCA for Aries RFC], and the [OCA for Aries Style Guide RFC].

## Caching the Index and OCA Bundles

The Aries wallet/agent may cache the loaded [ocabundles.json] JSON file and OCA Bundles. The following guidance should be followed:

- The [ocabundles.json] JSON file should have a relatively short "[time to
  live](https://en.wikipedia.org/wiki/Time_to_live)" (TTL) in the cache so that
  updates to the published data are regularly received. The TTL should be no
  more than 24 hours. Further, if the loading of an OCA Bundle based on a path
  in the [ocabundles.json] data structure fails, the [ocabundles.json] should be
  re-retrieved and the operation tried again.
  - Updates to the [ocabundles.json] content might include:
    - New paths for individual or all OCA Bundle files.
    - Added OCA Bundles.
    - Updated OCA Bundles.
- The `sha256` value provided in the [ocabundles.json] data structure is a hash over the OCA Bundle itself. It should be used to know when to invalidate the caching of an OCA Bundle, and a new version received.
  - Cache with the OCA Bundle, the `sha256` value.
  - When an OCA Bundle is needed, check if the `sha256` value from the [ocabundles.json] data structure matches the cached value.
    - If the values match, the cached OCA Bundle is up to date.
    - If the values differ, delete the cached OCA Bundle and retrieve the latest OCA Bundle from the published site.

Although the wallet/agent need not ever calculate the `sha256` value to verify
it, for reference, it is calculated using the Unix `shasum` utility using the
command line options: `shasum -a256 -U <path_to_OCABundle>`. The `sha256` values
are re-calculated as part of the [ocabundles.json] generation process executed
every time the registry is updated via a merged pull request to the
[Aries OCA Bundles] GitHub repository, the source of this registry.

[Aries OCA Bundles]: https://bcgov.github.io/aries-oca-bundles/
[ocabundles.json]: ../ocabundles.json
