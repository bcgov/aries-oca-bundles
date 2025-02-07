# Creating in an OCA Bundle Pull Request

## Introduction

This document explains how to turn your completed Overlays Capture Architecture (OCA) Bundle materials (Excel file, images, identifiers, etc.) into a Pull Request (PR) for the Aries OCA Bundles repository.

### Who Should Use This Guide?

- Non-Developers: Should **NOT** use this guide. Rather, such users should use the document [here](./OCABundleCreation.md) to gather the required files (Excel, branding, images, etc.) and create a GitHub Issue requesting an OCA Bundle be created.
- The maintainers of the [Aries OCA Bundles] repository, and other developers comfortable with Git, Rust, `jq`, and `bash` can follow the instructions below to create an OCA Bundle PR.

Given that intended audience, the instructions in this document are relatively terse, assuming readers won't need each step detailed.

Below is an overview of the process:

- Gather Input Data
- Create or Update Folder Structure
- Set Up the README.md
- Add Watermarks (Optional)
- Generate the OCA JSON
- Open the Pull Request

For questions or assistance, raise an [issue on GitHub](https://github.com/bcgov/aries-oca-bundles/issues) and we'll try to help.

## Getting Started

Do the steps you normally do when preparing to create a PR into a GitHub repo. Note that the [Aries OCA Bundles] repository has a DevContainer configuration that you may want to use.

[Aries OCA Bundles]: https://github.com/bcgov/aries-oca-bundles

The steps might include:

- Forking the [Aries OCA Bundles] repository.
- Create a local clone.
- Create a dev branch on the local clone to prepare the PR.

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

Once you have forked the [Aries OCA Bundles] repository, create
the folder for your new OCA Bundle within the `OCABundles` folder. Your
folder can be placed arbitrarily deep, with some rules for the first
few levels.

`schema` is the (current) name for where credential OCA Bundles are to be
placed. That name may soon change (`credential` is a better name...), and in the
future, a parallel folder might be added for presentation request OCA Bundles.

Below `schema` is a list of top level credential issuers (e.g., BC Gov), and
within each, the sub-issuers (to any depth). As you add your OCA Bundle, feel
free to add as many layers of (sub-)issuers as appropriate. For example, you might include:

- the issuing sub-organization,
- the type of credential,
- different versions (e.g., 1.0, 1.1, 2.0, etc.) of the type of credential,
- development, staging, and production versions of the credential.

We'll soon be eliminating the need for different dev, staging and production versions of an OCA Bundle -- unless you really want them to be different.

For each layer, you **MUST** add a `README.md` file in which the top level
markdown header (first line, `# `) **MUST** be the name of the (sub-)issuer. The `README.md` file
may optionally contain additional information about the (sub-)issuer. The
requirement for the `README.md` and the markdown header is that when generating
the GitHub Pages registry site, the required markdown header is extracted used
for the site navigation.

This hierarchy can be seen in the "OCA Bundles" tab of this registry.

At the appropriate level, create the folder for the OCA Bundle. At this time,
there **MUST** be a folder for each different `watermark` setting. As such, you
**MAY** have to create multiple OCA Folders, each with (initially) the same
data. We expect to fix this very soon!

Once you have created the OCA Bundle folders, populate each with the following data:

- The Excel file. There **MUST** be exactly one Excel file per Bundle, and it **SHOULD** be named `OCA.xlsx`.
- The `branding.json` file.
- The images, if any associated with the `branding.json` file.
- The sample credential data file, if any.

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
  [http://test.bcovrin.vonx.io:3707](http://test.bcovrin.vonx.io:3707) or
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

A bash script `genBundle.sh` can be found in the `scripts` folder of the [Aries
OCA Bundles] GitHub repository that generates the OCA Bundle JSON file. To use
it, you will need to install a few prerequisites--`jq` and the OCA Excel Parser
(a Rust binary).

### Prerequisites

Developers will likely have the `jq` (JSON Query) command line utility already installed. If not, follow the
[JQ installation instructions]. Once installed, make sure `jq` is on your path.

[JQ installation instructions]: https://stedolan.github.io/jq/download/
[Rust Installation Instructions]: https://www.rust-lang.org/tools/install

Installing the OCA Excel Parser is a little (OK, a lot) more involved, as you need Rust (and more) installed on your machine. Here are the steps:

- Clone a local copy of the OCA Excel Parser repository.
- If you don't have Rust installed on your machine, following the [Rust Installation Instructions], including installing all necessary dependencies.
- Follow the instructions in the repository README.md to build the parser. Currently it is just to execute `cargo build`.
- Copy the resulting executable to a directory on your PATH, e.g., `cp target/debug/parser ~/bin/`

### Running the Generator Script

Assuming you are in an OCABundles folder you can run the script with a relative path, such as:

`../../../scripts/genBundle.sh`

We recommend you create a symbolic link to that script in a directory on your PATH to make it easier to use.

The script checks to see that the pre-requisites (`jq` and `parser`) are
available and executable, erroring off it not, and, if run without arguments, prints a usage message.
Currently the `-x <excel file>` is required, and you can supply zero or more
JSON files to be added to the OCA Bundle produced from processing the Excel
file. The typical command line is:

`genBundle.sh -x OCA.xlsx branding.json`

If all goes well, an `OCABundle.json` file will be created.

Repeat the generation process for each OCA Bundle you are creating (e.g., per unique watermark value).

## Creating the PR

Once you have successfully generated the OCA Bundle JSON files, you are ready to submit the PR.

- Review the files you will be adding to the repository -- make sure there is nothing beyond the OCA Folders and contents you intend to add.
- Add the files to your local clone and commit them with an appropriate comment.
- Push the development branch and create the PR.

The PR **MUST** be reviewed by an OCA Maintainer, and **SHOULD** be approved by whomever requested the PR in the first place.

Assuming all goes well, your PR will be approved and merged.  Updates to the OCA Bundle(s) would follow a similar path, save the creation of the OCA Folders.
