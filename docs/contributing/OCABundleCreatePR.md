# Creating an OCA Bundle Pull Request

## Introduction

This document explains how to turn your completed Overlays Capture Architecture (OCA) Bundle materials (Excel file, images, identifiers, etc.) into a Pull Request (PR) for the Aries OCA Bundles repository.

### Who Should Use This Guide?

- **Non-Developers** should **NOT** use this guide. Use the [OCA Bundle Creation](./OCABundleCreation.md) document to gather files and create a GitHub Issue instead.
- **Developers and maintainers** comfortable with Git and `bash` can follow this guide to create an OCA Bundle PR.

For questions or assistance, raise an [issue on GitHub](https://github.com/bcgov/aries-oca-bundles/issues) and we'll try to help.

### Quick-Reference Checklist

Use this as a summary. Details for each step are in the sections below.

1. [ ] Fork/clone the repo and create a dev branch
2. [ ] Set up prerequisites (`parser` and `jq`) — **use the DevContainer** for the easiest path
3. [ ] Gather input data (Excel, branding, images, identifiers)
4. [ ] Create the OCA Bundle folder under `OCABundles/schema/`
5. [ ] Populate the folder: `OCA.xlsx`, `branding.json`, images, optional `testdata.csv`
6. [ ] Create the `README.md` for the bundle (strict format — see below)
7. [ ] Adjust image paths in `branding.json`
8. [ ] Add watermarks to Excel if needed
9. [ ] Generate the bundle: `genBundle.sh -x OCA.xlsx branding.json`
10. [ ] Update the index files: run `scripts/gen_ocabundlesjson.sh` from the repo root
11. [ ] Commit, push, and open the PR

## Getting Started

### Option A: DevContainer (Recommended)

The repository includes a DevContainer that comes with all prerequisites pre-installed (`parser`, `jq`, Rust, etc.). This is the fastest way to get started:

1. Fork the [Aries OCA Bundles] repository and clone it locally.
2. Open the clone in VS Code and reopen in the DevContainer when prompted (or use the Command Palette: **Dev Containers: Reopen in Container**).
3. Create a dev branch for your PR.

That's it — skip to [Input Data](#input-data).

[Aries OCA Bundles]: https://github.com/bcgov/aries-oca-bundles

### Option B: Manual Setup

If you prefer not to use the DevContainer, you will need two tools on your PATH:

1. **`jq`** — Install via [jq installation instructions]. Likely already on your machine.
2. **`parser`** (OCA Excel Parser) — Requires Rust:
    - Install Rust via the [Rust Installation Instructions] if needed.
    - Clone and build the parser: `git clone https://github.com/bcgov/oca-parser-xls.git && cd oca-parser-xls && cargo build`
    - Copy the binary to your PATH: `cp target/debug/parser ~/bin/`

[JQ installation instructions]: https://stedolan.github.io/jq/download/
[Rust Installation Instructions]: https://www.rust-lang.org/tools/install

Then fork the [Aries OCA Bundles] repository, clone it, and create a dev branch.

## Input Data

To start the process, we'll assume you have all the data collected using the [OCA Bundle Creation] process. Notably:

[OCA Bundle Creation]: ./OCABundleCreation.md

- The OCA Excel file completed for the Issuer and credential in question.
- The completed `branding.json` file, with an associated images.
- A list of people (names, emails) that are authorized to update the OCA Bundle.
- A list of the identifiers (usually `credDefId`s, but possibly `schemaId`s), their location (e.g. `CANdy Dev`, etc.).
- As needed for each identifier, the watermark text (ideally, in the multiple languages defined in the Excel file) to display when viewing credentials associated with those identifiers.
- The desired location (path to folder) of the OCA Bundle.

If you want, you **MAY** include a file `testdata.csv` that is a comma separated values file containing credential test data that may be used by tools like OCA Explorer. It's a big help to have such a file. The file:

- Must have a list of the credential attributes on the first line of the file.
- Have at least one line of sample data.

## Create The Folder For Your OCA Bundle

Create a folder for your new OCA Bundle under `OCABundles/schema/`. The structure is:

```
OCABundles/schema/<issuer>/<sub-issuer>/.../<credential-type>/
```

For example: `OCABundles/schema/bcgov-digital-trust/LTSA/property-owner-v1/DevTest/`

You can nest as deep as needed (sub-organization, credential type, version, environment, etc.).

**Rules:**

- Every folder level **MUST** contain a `README.md` whose first line (`# `) is the name of the (sub-)issuer. This is used to generate site navigation.
- There **MUST** be a separate folder for each different `watermark` setting.

Populate each OCA Bundle folder with:

- `OCA.xlsx` — exactly one Excel file per bundle.
- `branding.json`
- Image files referenced by `branding.json`, if any.
- `testdata.csv` (optional but recommended) — credential sample data for tools like OCA Explorer.

## Create the README.md File for the OCA Bundle

A README.md file for **each** OCA Bundle folder **MUST** be present and **MUST** include
the information shown and described below. The hard and fast formatting
requirements are in place because the file is processed by a script that
generates two lists of all of the identifiers (`schemaId`s and `credDefId`s) and
the OCA Bundles to which they are associated with. The lists are in the files
[ocabundles.json] and [ocabundleslist.json] in the root of the (GitHub Pages)
registry website and (for now) the root folder of the [Aries OCA Bundles] GitHub
repository. These are the files loaded by wallets and the OCA Explorer tool so
that they know what OCA Bundles are available.

[ocabundles.json]: /ocabundles.json
[ocabundleslist.json]: /ocabundleslist.json

```text
# <TITLE>

<DESCRIPTION>

- Publishing Organization: <ORGANIZATION>
- Primary Contact Email Address: <CONTACT EMAIL ADDRESS>

## Identifiers

| Identifier                                 | Location  | URL         |
| ------------------------------------------ | --------- | ----------- |
| <SCHEMA ID or CRED DEF ID>                 | <LEDGER>  | <URL>       |

## Authorization

The following are the GitHub IDs of those authorized to make substantive updates to the OCA Bundle.

| OCA Bundle Contributors | GitHub ID   | Email Address            |
| ----------------------- | ----------- | ------------------------ |
| <NAME>                  | <GITHUB ID> | <EMAIL ADDRESS>          |

```

Everything not in `<>`s must be exactly as specified above (with one
exception--see below). Everything in `<>`s **MUST** be populated as described
below.

The two markdown tables **MAY** have multiple lines. Multiple lines in the
`Identifiers` table indicates that the same OCA Bundle is used for each of the
objects identified in the first column. Multiple lines in the `Authorization`
table is recommended so that multiple members of the submitters team may update
the OCA Bundle.

- `<TITLE>` **MUST** be the name of the credential type. No other line in the
  file can have a single `#` prefix.
- `<DESCRIPTION>` is extracted for display by tools for processing this
repository (such as the [OCA Explorer]) and should describe the type of
credential to which the OCA Bundle applies.
- `<ORGANIZATION>` is extracted for display by tools for processing this
repository (such as the [OCA Explorer]) and is the name of the organization
that submitted the OCA Bundle.
- `<CONTACT EMAIL ADDRESS>` is an email address for the primary contact
for the OCA Bundle. The address may for a person, or better, a group
contact withing the `<ORGANIZATION>`.
- `<SCHEMA ID or CRED DEF ID>` are identifiers for objects to which the
OCA Bundles applies. There can be multiple lines in the table, each with
a different identifier. Each **MUST** use exactly the same OCA Bundle, including
the watermark (present or not),
- `<LEDGER>` is optional. It identifies the ledger on which the object
identified by the object resides. It should be in the form
`<network>[:<instance>]` as defined in the [did-indy specification for
`namespace`](https://hyperledger.github.io/indy-did-method/#indy-did-method-identifiers)
-- e.g., `candy:dev` or `sovrin`. The value is useful when the `<SCHEMA ID or
CRED DEF ID>` is unqualified (such as with legacy Indy identifiers) such that
the precise location of the object is not known.
- `<URL>` is optional and is a plain (non-Markdown) link to a ledger browser
  instance of the object, such as to a transaction on
  [https://indyscan.io](https://indyscan.io),
  [https://indyscan.bcovrin.vonx.io/](https://indyscan.bcovrin.vonx.io/) or
  [https://candyscan.idlab.org/](https://candyscan.idlab.org/)
- `<NAME>` is the name of a person authorized to update the OCA Bundle and
related data. There may be multiple rows in the markdown table to name multiple
people.
- `<GITHUB ID>` is the GitHub ID of the named person.
- `<EMAIL ADDRESS>` is the email address of the named person

[OCA Explorer]: https://bcgov.github.io/aries-oca-explorer/

The `<CONTACT EMAIL ADDRESS>` and the Authorization table are to ensure that
once the OCA Bundle is submitted, there are contacts available to answer
questions about, and to submit updates to, the OCA Bundle.

The contents of the `Authorization` section (following the `## Authorization` line) may be replaced
with the following to avoid repeating the same contents in every OCA Bundle `README.md` file:

`The Authorization table for this OCA Bundle is in [this file](<path-to-another-OCABundle-folder/README.md).`

## Adjusting the `branding.json` File

The `branding.json` file(s) may need some adjustments in the paths to the images that are included in the OCA Bundles folder. We hope to automate this step soon, but for now it is a manual step.

If the `branding.json` files contain the URL for the image that is in the OCA Bundle folder, edit the URL to be the correct path to that image in the current folder. Specifically, set the image path value to the following, a three part string defined below.

`https://raw.githubusercontent.com/bcgov/aries-oca-bundles/main/<path-to-OCA-Folder>/<image-file-name>`

- The first part (up to `main/`) is the standard GitHub hard coded path to a `raw` file on the `main` branch of the repository.
- The second is the path to the folder in the repository, starting with `OCABundles` and ending with this OCA Folder name (e.g., `OCABundles/schema/bcgov-digital-trust/LCRB/selling-it-right`).
- The third part is the image file name (e.g., `bc-logo.jpg`)

## Adding the Watermarks

While we plan to soon move the injection of the `watermark` value into the generation process, it is currently a manual step requiring the editing of the Excel file. For each OCA Bundle where a watermark is required:

- Edit the Excel file
- On each language tab (e.g. `en` and `fr`), add the value `watermark` in the first empty row in Column A, and put the language-specific watermark file in the same row, Column B.
  - If there is no watermark associated with an identifier, do not edit the Excel file. The default is no watermark.
- Save the Excel file.

## Generating the OCA Bundle JSON File from Source

From your OCA Bundle folder, run `genBundle.sh` with a relative path to the `scripts` folder:

```bash
# Example from an OCA Bundle folder several levels deep:
../../../../../../scripts/genBundle.sh -x OCA.xlsx branding.json
```

The `-x <excel file>` argument is required. Additional arguments are JSON overlay files (e.g., `branding.json`) to merge into the bundle. If all goes well, an `OCABundle.json` file will be created in the current directory.

Repeat for each OCA Bundle you are creating (e.g., per unique watermark value).

## Update the Index Files

After generating the `OCABundle.json` file(s), you **MUST** update the repository index files (`ocabundles.json` and `ocabundleslist.json`) so wallets and tools can discover the new bundle. From the **repository root**, run:

```bash
scripts/gen_ocabundlesjson.sh
```

This script recursively scans the `OCABundles` folder and regenerates both index files.

## Creating the PR

1. Review the files — make sure only the intended OCA Bundle files and updated index files are included.
2. Commit with a descriptive message, push your branch, and open a PR.

The PR **MUST** be reviewed by an OCA Maintainer and **SHOULD** be approved by the original requester. Once merged, the OCA Bundle becomes available to wallets. Future updates follow the same process.
